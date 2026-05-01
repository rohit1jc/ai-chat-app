'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Bot, FileText, Crown, Loader2 } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export default function Chat({ user, setUser }: { user: any, setUser: any }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTypingAI, setIsTypingAI] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('chatHistory', (history: Message[]) => {
      setMessages(history);
    });

    newSocket.on('newMessage', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    newSocket.on('aiSuggestion', (data: { text: string }) => {
      setInput(data.text);
      setIsTypingAI(false);
    });

    newSocket.on('aiSummary', (data: { text: string }) => {
      alert(`Chat Summary:\n${data.text}`);
      setIsTypingAI(false);
    });

    newSocket.on('userPremiumUpgrade', (data: { userId: string }) => {
      if (data.userId === user.id) {
        setUser({ ...user, isPremium: true });
        setShowPayment(false);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [user, setUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;

    socket.emit('sendMessage', {
      userId: user.id,
      userName: user.name,
      text: input,
    });
    setInput('');
  };

  const handleAISuggestion = () => {
    if (!user.isPremium) {
      setShowPayment(true);
      return;
    }
    if (!socket) return;
    setIsTypingAI(true);
    socket.emit('requestSuggestion');
  };

  const handleAISummary = () => {
    if (!user.isPremium) {
      setShowPayment(true);
      return;
    }
    if (!socket) return;
    setIsTypingAI(true);
    socket.emit('requestSummary');
  };

  return (
    <div className="flex flex-col h-full relative">
      {showPayment && (
        <PaymentModal 
          user={user} 
          onClose={() => setShowPayment(false)} 
          onSuccess={() => {
            // Payment success is handled via socket, but fallback update here
          }}
        />
      )}
      
      {/* Action Bar */}
      <div className="p-3 bg-gray-800/30 flex gap-2 justify-end border-b border-gray-800/50">
        <button 
          onClick={handleAISummary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm font-medium transition"
        >
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Summarize</span>
          {!user.isPremium && <Crown className="w-3 h-3 text-yellow-500 ml-1" />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.userId === user.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl p-3 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-100 rounded-bl-none'}`}>
                {!isMe && <div className="text-xs text-gray-400 mb-1">{msg.userName}</div>}
                <div>{msg.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800/50 border-t border-gray-800">
        <div className="flex gap-2 mb-2">
          <button 
            onClick={handleAISuggestion}
            disabled={isTypingAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-medium transition disabled:opacity-50"
          >
            {isTypingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
            <span>Suggest Reply</span>
            {!user.isPremium && <Crown className="w-3 h-3 text-yellow-500 ml-1" />}
          </button>
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition"
          />
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-xl px-4 py-3 transition flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
