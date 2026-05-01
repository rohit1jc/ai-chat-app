const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });
  }

  async createOrder(amountInPaise) {
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };
    
    // If running without actual Razorpay keys, mock the response for demo
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy') {
      return {
        id: `order_mock_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: options.receipt
      };
    }

    return await this.instance.orders.create(options);
  }

  verifyPayment(orderId, paymentId, signature) {
    // If mock keys, just return true
    if (process.env.RAZORPAY_KEY_ID === 'rzp_test_dummy' || !process.env.RAZORPAY_KEY_ID) {
      return true;
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    return generatedSignature === signature;
  }
}

module.exports = RazorpayService;
