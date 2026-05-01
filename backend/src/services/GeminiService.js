const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
  }

  async suggestReply(messages) {
    try {
      if (!this.model) return "AI not configured";
      
      const prompt = `Based on the following chat history, suggest a single concise and helpful reply for the next user. Only return the suggested text, nothing else.\n\nChat history:\n${messages.map(m => `${m.userName}: ${m.text}`).join('\n')}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini error (suggestReply):', error);
      return "Sorry, I couldn't generate a suggestion.";
    }
  }

  async summarizeChat(messages) {
    try {
      if (!this.model) return "AI not configured";
      
      const prompt = `Summarize the following chat conversation concisely in 2-3 sentences.\n\nChat history:\n${messages.map(m => `${m.userName}: ${m.text}`).join('\n')}`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini error (summarizeChat):', error);
      return "Sorry, I couldn't summarize the chat.";
    }
  }
}

module.exports = GeminiService;
