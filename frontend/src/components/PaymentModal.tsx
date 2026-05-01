'use client';

import { useState } from 'react';
import { Crown, X, CheckCircle } from 'lucide-react';
import { io } from 'socket.io-client';

export default function PaymentModal({ user, onClose, onSuccess }: { user: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order
      const res = await fetch('http://localhost:5000/api/payment/create-order', { method: 'POST' });
      const order = await res.json();

      const options = {
        key: 'rzp_test_dummy', // Since it's demo, use dummy or env var
        amount: order.amount,
        currency: order.currency,
        name: 'AI Chat Pro',
        description: 'Unlock AI Features',
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id || order.id,
                razorpay_payment_id: response.razorpay_payment_id || 'pay_demo123',
                razorpay_signature: response.razorpay_signature || 'demo_sig',
                userId: user.id
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // Notify socket to update premium status
              const socket = io('http://localhost:5000');
              socket.emit('paymentSuccess', user.id);
              onSuccess();
            }
          } catch (e) {
            console.error('Verify error', e);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: '#3B82F6' }
      };

      // Ensure razorpay script is loaded (usually in layout, but for demo we mock if not present)
      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Mock payment flow for demo if script missing
        setTimeout(() => {
          options.handler({ razorpay_order_id: order.id, razorpay_payment_id: 'pay_mock', razorpay_signature: 'sig_mock' });
        }, 1000);
      }
    } catch (error) {
      console.error('Payment error', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Upgrade to Pro</h2>
          <p className="text-gray-400 text-sm">Unlock powerful AI features to supercharge your chat experience.</p>
        </div>

        <ul className="space-y-3 mb-8">
          <li className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-blue-500" /> AI Suggested Replies
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-300">
            <CheckCircle className="w-4 h-4 text-blue-500" /> Smart Chat Summarization
          </li>
        </ul>

        <button 
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-3 rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center"
        >
          {loading ? 'Processing...' : 'Pay ₹500 to Unlock'}
        </button>
      </div>
    </div>
  );
}
