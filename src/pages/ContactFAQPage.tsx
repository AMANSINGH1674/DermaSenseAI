import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

const ContactFAQPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{type: 'user' | 'bot', message: string}[]>([
    {type: 'bot', message: 'Hello! How can I help you today with DermaSenseAI?'}
  ]);
  
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: 'What is DermaSenseAI and how does it work?',
      answer: 'DermaSenseAI is an AI-powered dermatology platform that analyzes skin images along with patient context to provide preliminary assessments and risk stratification. It generates explainable visual heatmaps and confidence scores to support clinical decision-making.',
      isOpen: false
    },
    {
      question: 'Is DermaSenseAI a diagnostic tool?',
      answer: 'DermaSenseAI provides clinical decision support and preliminary assessments. It is not a substitute for professional medical diagnosis or treatment. Final diagnosis and care decisions should always be made by licensed clinicians.',
      isOpen: false
    },
    {
      question: 'How accurate is the AI?',
      answer: 'Our models achieve accuracy exceeding 98%, sensitivity over 97%, and specificity above 96% across validated datasets. Actual performance may vary by image quality, device type, and clinical context.',
      isOpen: false
    },
    {
      question: 'How is my data protected?',
      answer: 'We use AES-256 encryption for data at rest, TLS 1.3 for data in transit, and maintain encrypted, redundant backups. Access is enforced via role-based controls and all access is recorded through immutable audit trails.',
      isOpen: false
    },
    {
      question: 'Is DermaSenseAI compliant with healthcare regulations?',
      answer: 'Yes. DermaSenseAI is designed to meet HIPAA and GDPR requirements. We also maintain SOC 2 Type II and ISO 27001-aligned security controls to safeguard sensitive health information.',
      isOpen: false
    },
    {
      question: 'Can DermaSenseAI integrate with my clinical systems?',
      answer: 'Yes. We support standards-based interoperability (including FHIR) and offer APIs to integrate with EHRs and clinical photography systems. Our solutions team can assist with custom integrations.',
      isOpen: false
    }
  ]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    alert('Thank you for your message. We will get back to you soon!');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };
  
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    // Add user message to chat history
    setChatHistory([...chatHistory, {type: 'user', message: chatMessage}]);
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse = '';
      const normalized = chatMessage.trim();
      const lower = normalized.toLowerCase();
      
      // Closing intent
      const isClosing = /(^(no|nope)\b|\b(thanks|thank you|that'?s all|bye|goodbye|cheers|all good)\b)/i.test(normalized);
      if (isClosing) {
        botResponse = 'Have a good day!';
        setChatHistory(prev => [...prev, {type: 'bot', message: botResponse}]);
        return;
      }

      // Greetings
      if (/\b(hi|hello|hey|good\s?(morning|afternoon|evening))\b/i.test(normalized)) {
        botResponse = 'Hello! How can I help you today with DermaSenseAI?';
        setChatHistory(prev => [...prev, {type: 'bot', message: botResponse}]);
        return;
      }

      // Long queries: word-count or character-length threshold
      const isLong = lower.length > 160 || lower.split(/\s+/).length > 30;
      if (isLong) {
        botResponse = 'Thank you for your question. Our team will get back to you with more information. Is there anything else I can help you with?';
        setChatHistory(prev => [...prev, {type: 'bot', message: botResponse}]);
        return;
      }

      // Keyword-based quick answers
      if (lower.includes('blockchain')) {
        botResponse = 'Our blockchain approach logs diagnostic events immutably for transparency and verification while keeping sensitive data encrypted and private.';
      } else if (lower.includes('ai') || lower.includes('artificial intelligence')) {
        botResponse = 'DermaSenseAI analyzes skin images using advanced neural networks, providing confidence scores, risk stratification, and explainable visual heatmaps.';
      } else if (lower.includes('security') || lower.includes('privacy')) {
        botResponse = 'We use AES-256 encryption at rest, TLS 1.3 in transit, role-based access, and immutable audit trails to safeguard your data.';
      } else if (lower.includes('cost') || lower.includes('price') || lower.includes('pricing')) {
        botResponse = 'We offer flexible plans for clinics and organizations. Please contact our team for tailored pricing details.';
      } else {
        botResponse = 'Thank you for your question. Our team will get back to you with more information. Is there anything else I can help you with?';
      }
      
      setChatHistory(prev => [...prev, {type: 'bot', message: botResponse}]);
    }, 600);
    
    setChatMessage('');
  };
  
  const toggleFAQ = (index: number) => {
    setFaqItems(faqItems.map((item, i) => 
      i === index ? {...item, isOpen: !item.isOpen} : item
    ));
  };

  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Contact & FAQ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-secondary-700"
          >
            Have questions about DermaSenseAI? Find answers in our FAQ section or reach out to our team directly.
          </motion.p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-secondary-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
                
                <div className="mt-8 pt-8 border-t border-secondary-200">
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                        <Mail className="text-primary-500" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Email</p>
                        <p className="font-medium">contact@dermasenseai.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                        <Phone className="text-primary-500" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Phone</p>
                        <p className="font-medium">+1 (800) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center mr-4">
                        <MapPin className="text-primary-500" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-secondary-600">Address</p>
                        <p className="font-medium">123 Innovation Way, San Francisco, CA 94107</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Chat Bot */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                <div className="bg-primary-500 text-white p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <MessageCircle className="text-white" size={20} />
                    </div>
                    <div>
                      <h2 className="font-bold">DermaSenseAI Assistant</h2>
                      <p className="text-white/80 text-sm">Ask me anything about our platform</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto h-96">
                  <div className="space-y-4">
                    {chatHistory.map((chat, index) => (
                      <div 
                        key={index} 
                        className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                            chat.type === 'user' 
                              ? 'bg-primary-500 text-white rounded-br-none' 
                              : 'bg-secondary-100 text-secondary-800 rounded-bl-none'
                          }`}
                        >
                          {chat.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 border-t border-secondary-200">
                  <form onSubmit={handleChatSubmit} className="flex">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-grow px-4 py-2 rounded-l-lg border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    />
                    <button 
                      type="submit" 
                      className="bg-primary-500 text-white px-4 py-2 rounded-r-lg hover:bg-primary-600 transition-colors"
                    >
                      <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-secondary-700 max-w-3xl mx-auto">
                Find answers to common questions about DermaSenseAI's AI capabilities, data privacy, and clinical integration.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqItems.map((faq, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full text-left p-6 focus:outline-none flex justify-between items-center"
                    >
                      <h3 className="text-lg font-semibold">{faq.question}</h3>
                      {faq.isOpen ? (
                        <ChevronUp className="text-primary-500" size={20} />
                      ) : (
                        <ChevronDown className="text-primary-500" size={20} />
                      )}
                    </button>
                    
                    {faq.isOpen && (
                      <div className="px-6 pb-6">
                        <div className="pt-2 border-t border-secondary-100">
                          <p className="mt-4 text-secondary-700">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-secondary-700 mb-4">
                  Still have questions? Our team is here to help.
                </p>
                <a href="mailto:support@dermasenseai.com" className="btn-primary inline-flex items-center">
                  Contact Support
                  <Mail className="ml-2" size={18} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactFAQPage;