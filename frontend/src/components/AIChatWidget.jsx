import { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiCpu } from 'react-icons/fi';

const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your SmartStore AI Assistant. How can I help you manage your store today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = "I'm a demo AI assistant. In a full implementation, I would analyze your store's data and provide personalized insights!";
      
      const lowerInput = userMsg.text.toLowerCase();
      if (lowerInput.includes('revenue')) {
        aiResponse = "Your revenue is up 12.5% this month! You can view the full breakdown on the Revenue page.";
      } else if (lowerInput.includes('order')) {
        aiResponse = "You have 1,747 total orders. The Orders page has all the recent details.";
      } else if (lowerInput.includes('stock') || lowerInput.includes('inventory')) {
        aiResponse = "You currently have 4 items running low on stock. I recommend checking the Products page to restock soon.";
      }

      setMessages(prev => [...prev, { id: Date.now(), text: aiResponse, sender: 'ai' }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-brand-600 hover:bg-brand-500 text-white rounded-full shadow-2xl shadow-brand-500/50 transition-transform hover:scale-110 z-50 flex items-center justify-center"
        >
          <FiMessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] glass rounded-2xl shadow-2xl border border-brand-500/30 flex flex-col z-50 overflow-hidden transform transition-all">
          {/* Header */}
          <div className="p-4 bg-dark-800 border-b border-slate-700/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-500/20 rounded-lg">
                <FiCpu className="text-brand-400 w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">SmartStore AI</h3>
                <p className="text-xs text-brand-300">Online & Ready</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-900/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-600 text-white rounded-br-sm' 
                      : 'bg-dark-800 border border-slate-700 text-slate-200 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-dark-800 border border-slate-700 p-4 rounded-2xl rounded-bl-sm flex gap-1.5 w-16">
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-dark-800 border-t border-slate-700/50">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your store..."
                className="flex-1 bg-dark-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FiSend className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
