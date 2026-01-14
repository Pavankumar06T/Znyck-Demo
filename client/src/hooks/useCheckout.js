import { useState } from 'react';
import { createOrder, verifyPayment } from '../services/api';

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const useCheckout = () => {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (items, totalAmount, optionsOverride = {}) => {
        setLoading(true);
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            alert('Failed to load Razorpay SDK. Please check your internet connection.');
            setLoading(false);
            return;
        }

        try {
            const orderData = await createOrder(totalAmount, items);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RywhhwrgCMa4su",
                amount: orderData.amount,
                currency: orderData.currency,
                name: "ZNYCK Commerce",
                description: "Checkout Transaction",
                order_id: orderData.id,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.orderId
                        };
                        const verifyRes = await verifyPayment(verifyData);
                        if (verifyRes.status === 'success') {
                            alert('Payment Successful!');
                            if (optionsOverride.onSuccess) optionsOverride.onSuccess();
                            window.location.href = '/';
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Error');
                    }
                },
                prefill: {
                    name: "User Name",
                    email: "user@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#4f46e5"
                },
                ...optionsOverride
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Payment initiation failed. See console.");
        } finally {
            setLoading(false);
        }
    };

    return { handleCheckout, loading };
};
