import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Package, Loader2 } from 'lucide-react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // New Product Form State
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        currency: 'INR',
        category: 'E-Book',
        image: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/products');
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            // Convert price to smallest unit (e.g., INR -> paise)
            const payload = {
                ...newProduct,
                price: parseFloat(newProduct.price) * 100
            };

            await api.post('/products', payload);
            setShowAddModal(false);
            setNewProduct({ name: '', description: '', price: '', currency: 'INR', category: 'E-Book', image: '' });
            fetchProducts();
        } catch (err) {
            console.error('Failed to add product', err);
            // In a real app, use a toast notification here
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Products</h1>
                    <p className="text-gray-400">Manage your digital and physical assets.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-500 transition-colors flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add Product
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
                <div className="bg-[#1c1f2e] border border-white/5 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Currency</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((p) => (
                                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <Package size={16} />
                                        </div>
                                        {p.name}
                                    </td>
                                    <td className="p-4 text-gray-400">{p.category}</td>
                                    <td className="p-4 font-mono">{(p.price / 100).toFixed(2)}</td>
                                    <td className="p-4 text-gray-500 text-sm">{p.currency}</td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">No products found. Add one to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Product Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1c1f2e] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="0.00"
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                                    <select
                                        className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                        value={newProduct.currency}
                                        onChange={e => setNewProduct({ ...newProduct, currency: e.target.value })}
                                    >
                                        <option value="INR">INR</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                <select
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                    value={newProduct.category}
                                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                >
                                    <option value="E-Book">E-Book</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Products">Products</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://"
                                    className="w-full bg-black/50 border border-gray-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                    value={newProduct.image}
                                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-500 transition-colors"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
