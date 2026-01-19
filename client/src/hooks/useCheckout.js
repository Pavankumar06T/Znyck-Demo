import { useState, useEffect } from 'react';
import { createDemoOrder, verifyPayment } from '../services/api';

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

    const handleCheckout = async (product, optionsOverride = {}) => {
        setLoading(true);
        const isLoaded = await loadRazorpayScript();

        if (!isLoaded) {
            alert('Failed to load Razorpay SDK. Please check your internet connection.');
            setLoading(false);
            return;
        }

        try {
            // Use the Demo Order endpoint
            const orderData = await createDemoOrder(product);

            const options = {
                key: orderData.keyId || "rzp_test_RywhhwrgCMa4su", // Use key from backend or fallback
                amount: orderData.amount,
                currency: orderData.currency,
                name: orderData.product.name,
                description: orderData.product.description || "Znyck Demo Transaction",
                order_id: orderData.orderId,
                handler: async function (response) {
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            productId: product._id, // Required for backend verification logic
                            user: { email: 'guest@zonyck.demo', name: 'Guest User' }
                        };
                        const verifyRes = await verifyPayment(verifyData);
                        if (verifyRes.success || verifyRes.transactionId) {
                            alert('Payment Successful!');
                            if (optionsOverride.onSuccess) optionsOverride.onSuccess();
                            // Optional: Redirect to transactions or stay
                            window.location.href = '/dashboard/transactions';
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Error');
                    }
                },
                prefill: {
                    name: "Guest User",
                    email: "guest@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#2563eb"
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
