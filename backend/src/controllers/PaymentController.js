const RazorpayService = require('../services/RazorpayService');

class PaymentController {
  constructor() {
    this.razorpayService = new RazorpayService();
  }

  async createOrder(req, res) {
    try {
      // Amount in rupees, convert to paise
      const amount = 500; 
      const order = await this.razorpayService.createOrder(amount);
      res.status(200).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }

  async verifyPayment(req, res) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
      const isValid = this.razorpayService.verifyPayment(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );

      if (isValid) {
        // Here we'd update user in DB to premium
        // We'll trust the client side for demo, but server usually triggers socket update
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid signature' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ error: 'Payment verification failed' });
    }
  }
}

module.exports = PaymentController;
