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
    const [stripeConfig, setStripeConfig] = useState(null);

    const handleCheckout = async (product, optionsOverride = {}, preferredProvider = null) => {
        setLoading(true);
        setStripeConfig(null); // Reset

        try {
            // Use the Demo Order endpoint with preferred provider
            const orderData = await createDemoOrder(product, preferredProvider);

            // Handle Stripe
            if (orderData.provider === 'stripe') {
                if (!orderData.stripe?.clientSecret || !orderData.key) {
                    alert('Stripe configuration missing from server response.');
                    return;
                }
                setStripeConfig({
                    key: orderData.key,
                    clientSecret: orderData.stripe.clientSecret,
                    productId: product._id // Store for verification
                });
                return; // Stop here, let the UI render the modal via stripeConfig
            }

            // Handle Razorpay
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                alert('Failed to load Razorpay SDK.');
                setLoading(false);
                return;
            }

            const options = {
                key: orderData.keyId || "rzp_test_RywhhwrgCMa4su",
                amount: orderData.amount,
                currency: orderData.currency,
                name: orderData.product.name,
                description: orderData.product.description || "Znyck Demo Transaction",
                order_id: orderData.orderId,
                handler: async function (response) {
                    // ... Verification Logic (Same as before)
                    try {
                        const verifyData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            productId: product._id,
                            user: { email: 'guest@znyck.demo', name: 'Guest User' }
                        };
                        const verifyRes = await verifyPayment(verifyData);
                        if (verifyRes.success || verifyRes.transactionId) {
                            if (optionsOverride.onSuccess) optionsOverride.onSuccess();
                            window.location.href = '/success';
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification Failed');
                    }
                },
                prefill: {
                    name: "Guest User",
                    email: "guest@example.com",
                    contact: "9999999999"
                },
                theme: { color: "#2563eb" },
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

    return { handleCheckout, loading, stripeConfig, setStripeConfig };
};
