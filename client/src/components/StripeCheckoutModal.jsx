import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../services/api';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin, // Not used heavily if redirect='if_required' handles it
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            setMessage('Payment Successful!');
            onSuccess(paymentIntent.id);
        } else {
            setMessage('Unexpected state.');
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <PaymentElement />
            {message && <div style={{ color: message.includes('Success') ? 'green' : 'red', fontSize: '0.9rem' }}>{message}</div>}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                    disabled={isLoading || !stripe || !elements}
                    type="submit"
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    style={{
                        padding: '0.75rem',
                        background: '#e2e8f0',
                        color: '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

const StripeCheckoutModal = ({ isOpen, onClose, amount, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [orderId, setOrderId] = useState(null);

    React.useEffect(() => {
        if (isOpen) {
            // Create PaymentIntent as soon as modal opens
            api.createPaymentIntent(amount, [{ id: 'upgrade', quantity: 1 }])
                .then(data => {
                    setClientSecret(data.clientSecret);
                    setOrderId(data.orderId);
                })
                .catch(err => console.error("Failed to init Stripe", err));
        }
    }, [isOpen, amount]);

    const handleSuccess = async (paymentIntentId) => {
        // Optionally verify on backend to double check
        try {
            await api.verifyPayment({
                paymentGateway: 'stripe',
                paymentIntentId,
                orderId
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Verification failed", err);
            alert("Payment succeeded but backend verification failed.");
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ marginTop: 0 }}>Secure Payment</h2>
                <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                    Total: <strong style={{ color: '#333' }}>${amount}</strong>
                </div>

                {clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} onCancel={onClose} />
                    </Elements>
                ) : (
                    <div>Loading Stripe...</div>
                )}
            </div>
        </div>
    );
};

export default StripeCheckoutModal;
