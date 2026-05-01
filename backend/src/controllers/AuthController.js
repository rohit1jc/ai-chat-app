const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

class AuthController {
  constructor() {
    // In a real app, CLIENT_ID is read from env
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async googleLogin(req, res) {
    try {
      const { credential } = req.body;
      const ticket = await this.client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      
      // We would usually find or create the user in DB here
      const user = {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
        isPremium: false // Default to false
      };

      const token = jwt.sign(user, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1d' });

      res.status(200).json({ token, user });
    } catch (error) {
      console.error('Error in googleLogin:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
}

module.exports = AuthController;
