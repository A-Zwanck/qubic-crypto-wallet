
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const SupportChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'support', 
      text: '¡Hola! ¿En qué podemos ayudarte hoy?', 
      time: '12:00' 
    }
  ]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, userMessage]);
    setMessage('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const supportMessage = {
        id: chatMessages.length + 2,
        sender: 'support',
        text: 'Gracias por tu mensaje. Un agente de soporte se pondrá en contacto contigo en breve.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prevMessages => [...prevMessages, supportMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 bg-qubic-blue text-white rounded-full p-3.5 shadow-lg z-50",
          "transition-all duration-300 hover:bg-qubic-blue-dark hover:scale-110 focus:outline-none"
        )}
        aria-label="Chat de soporte"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      
      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-20 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl z-50",
          "transition-all duration-300 transform",
          isChatOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none",
          "flex flex-col max-h-[500px] overflow-hidden border border-gray-100"
        )}
      >
        {/* Chat Header */}
        <div className="bg-qubic-blue text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-white/20 rounded-full p-1.5 mr-3">
              <MessageCircle size={18} />
            </div>
            <div>
              <h3 className="font-medium">Soporte 24/7</h3>
              <p className="text-xs opacity-80">Respondemos en menos de 10 minutos</p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white/80 hover:text-white transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <div className="space-y-4">
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2 shadow-sm",
                    msg.sender === 'user' 
                      ? "bg-qubic-blue text-white rounded-br-none" 
                      : "bg-white text-qubic-black rounded-bl-none"
                  )}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={cn(
                    "text-xs mt-1 block",
                    msg.sender === 'user' ? "text-white/80" : "text-qubic-gray-dark"
                  )}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-100 p-3 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-gray-50 text-qubic-black placeholder-qubic-gray-dark rounded-l-lg px-4 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-qubic-blue text-white rounded-r-lg px-4 flex items-center justify-center hover:bg-qubic-blue-dark transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
};

export default SupportChat;
