const GeminiService = require('../services/GeminiService');

class ChatSocket {
  constructor(io) {
    this.io = io;
    this.messages = [];
    this.geminiService = new GeminiService();
  }

  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      // Send chat history on connect
      socket.emit('chatHistory', this.messages);

      socket.on('sendMessage', async (data) => {
        const message = {
          id: Date.now().toString(),
          userId: data.userId,
          userName: data.userName,
          text: data.text,
          timestamp: new Date()
        };
        
        this.messages.push(message);
        // Keep only last 50 messages
        if (this.messages.length > 50) this.messages.shift();
        
        this.io.emit('newMessage', message);
      });

      socket.on('requestSuggestion', async () => {
        // Only premium users can use AI features usually, but demo can be flexible
        const suggestion = await this.geminiService.suggestReply(this.messages);
        socket.emit('aiSuggestion', { text: suggestion });
      });

      socket.on('requestSummary', async () => {
        const summary = await this.geminiService.summarizeChat(this.messages);
        socket.emit('aiSummary', { text: summary });
      });

      // Simulated payment success hook
      socket.on('paymentSuccess', (userId) => {
        this.io.emit('userPremiumUpgrade', { userId });
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }
}

module.exports = ChatSocket;
