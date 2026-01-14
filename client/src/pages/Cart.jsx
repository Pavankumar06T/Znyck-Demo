import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { createOrder, verifyPayment } from '../services/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();

    const handleCheckout = async () => {
        try {
            const items = cart.map(item => ({
                product: item._id,
                quantity: item.quantity
            }));
            const orderData = await createOrder(total, items);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'ZNYCK Commerce',
                description: 'Checkout Transaction',
                order_id: orderData.id,
                handler: async (response) => {
                    const verification = await verifyPayment(response);
                    if (verification.status === 'success') {
                        alert('Payment Successful!');
                        clearCart();
                    } else {
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4f46e5"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Checkout failed. Please ensure backend is running and Razorpay key is set.');
        }
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
                <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} className="text-gray-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/" className="px-8 py-3 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-4xl font-bold">Shopping Cart</h1>
                    <span className="text-gray-400">{cart.length} Items</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item) => (
                            <div key={item._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex gap-6 items-center">
                                <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-xl" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-black border border-gray-800 rounded-lg">
                                            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:text-indigo-400"><Minus size={14} /></button>
                                            <span className="w-8 text-center text-sm font-mono">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:text-indigo-400"><Plus size={14} /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-400 p-2">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-xl">₹{item.price * item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 h-fit sticky top-10">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                        <div className="space-y-4 mb-8 border-b border-gray-800 pb-8">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Tax (Estimate)</span>
                                <span>₹0</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white pt-4">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                        >
                            Buy All Now <ArrowRight size={18} />
                        </button>
                        <p className="text-xs text-center text-gray-600 mt-4">Secured by Razorpay</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
