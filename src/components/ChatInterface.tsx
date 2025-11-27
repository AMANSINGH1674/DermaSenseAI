import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Loader, Brain, X, Paperclip, FileWarning, CheckCircle, AlertTriangle } from 'lucide-react';
import { medgemmaService, type ChatMessage as ServiceChatMessage, type MedGemmaResponse } from '../services/medgemmaService';
import { useAuthStore } from '../store/authStore';

function getHumanResponse(input: string): string | null {
  const text = input.toLowerCase().trim();

  if (/(hi|hello|hey|good morning|good evening|good afternoon)/.test(text))
    return "Hi there! 👋 How are you today?";
  if (/(how are you|how’s it going|how do you feel)/.test(text))
    return "I’m feeling great and ready to help! How about you?";
  if (/(thank you|thanks|thx|tysm)/.test(text))
    return "You’re very welcome! 💫";
  if (/(bye|goodbye|see you|take care)/.test(text))
    return "Goodbye! Wishing you a wonderful day 🌼";
  if (/(who are you|your name|are you human)/.test(text))
    return "I’m DermaSenseAI — your friendly dermatology assistant 🤖✨";
  if (/(what can you do|help|assist)/.test(text))
    return "I can chat with you naturally, explain skin-related topics, or analyze dermatology images and medical PDFs.";
  if (/(sad|angry|happy|bored|excited)/.test(text))
    return "I understand how you feel. Talking about it can help — what’s on your mind?";

  return null; // Not a simple human query — fallback to MedGemma
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  file?: {
    name: string;
    url: string;
    type: string;
  };
  analysis?: MedGemmaResponse;
  isAnalyzing?: boolean;
}

const ChatInterface: React.FC = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your DermaSenseAI assistant, here to help with dermatological guidance and education.\n\n✅ What I can help with:\n• Dermatological image analysis guidance\n• Questions about skin conditions\n• Educational content about dermatology\n• Professional medical insights\n• Document review guidance\n\n⚠️ Important: This is educational content only. Always consult healthcare professionals for medical decisions and diagnosis.\n\nHow can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ServiceChatMessage[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || !user) return;
    
    const messageText = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
  // Save user message to chat history
  const serviceChatMessage: ServiceChatMessage = {
    id: userMessage.id,
    role: 'user',
    content: messageText,
    timestamp: new Date()
  };
  await medgemmaService.saveChatMessage(user.id, serviceChatMessage);
  setChatHistory(prev => [...prev, serviceChatMessage]);
  
  // ✅ Check for simple human-like input first
  const humanResponse = getHumanResponse(messageText);
  let aiResponseText = '';

  if (humanResponse) {
    aiResponseText = humanResponse;
  } else {
    // Otherwise, use MedGemma for intelligent replies
    aiResponseText = await medgemmaService.chat(messageText, chatHistory);
  }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Save AI response to chat history
      const aiServiceChatMessage: ServiceChatMessage = {
        id: aiResponse.id,
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date()
      };
      await medgemmaService.saveChatMessage(user.id, aiServiceChatMessage);
      setChatHistory(prev => [...prev, aiServiceChatMessage]);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  useEffect(() => {
    const startCamera = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else {
          setCameraError("Camera not supported by this browser.");
          setIsCameraActive(false);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        if (err instanceof Error) {
          if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
            setCameraError("Camera access was denied. Please enable camera permissions in your browser settings.");
          } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
            setCameraError("No camera found on this device. Please connect a camera and try again.");
          } else {
            setCameraError("An unexpected error occurred while accessing the camera. Please try again.");
          }
        } else {
          setCameraError("An unknown error occurred while accessing the camera.");
        }
        setIsCameraActive(false);
      }
    };

    if (isCameraActive) {
      startCamera();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraActive]);




  const toggleCamera = () => {
    if (!isCameraActive) {
      setCameraError(null);
    }
    setIsCameraActive(!isCameraActive);
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(videoRef.current, 0, 0);
        
        // Convert canvas to data URL
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        
        // Convert data URL to File object
        const fetchRes = await fetch(imageDataUrl);
        const blob = await fetchRes.blob();
        const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });

        // Stop camera stream
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        
        // Reset camera state
        setIsCameraActive(false);
        videoRef.current.srcObject = null;
        
        // Send image to chat
        sendFileMessage(file);
      }
    }
  };

  const sendFileMessage = async (file: File) => {
    if (!user) return;
    
    const fileUrl = URL.createObjectURL(file);
    const isImage = file.type.startsWith('image/');
    const isPDF = file.type === 'application/pdf';
    
    // Create user message with file
    const message: Message = {
      id: Date.now().toString(),
      content: `I've uploaded ${isImage ? 'an image' : isPDF ? 'a PDF document' : 'a file'}: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      file: {
        name: file.name,
        url: fileUrl,
        type: file.type,
      },
    };
    setMessages(prev => [...prev, message]);
    
    // Create analyzing placeholder message
    const analyzingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: `Analyzing your ${isImage ? 'dermatological image' : isPDF ? 'medical document' : 'file'} using Google's MedGemma model...`,
      sender: 'ai',
      timestamp: new Date(),
      isAnalyzing: true,
    };
    setMessages(prev => [...prev, analyzingMessage]);
    setIsLoading(true);

    try {
      let analysis: MedGemmaResponse;
      
      if (isImage) {
        // Use MedGemma for image analysis
        analysis = await medgemmaService.analyzeImage(file);
      } else if (isPDF) {
        // Use MedGemma for PDF analysis
        analysis = await medgemmaService.analyzePDF(file);
      } else {
        throw new Error('Unsupported file type');
      }
      
      // Remove analyzing message and add analysis result
      setMessages(prev => prev.filter(msg => msg.id !== analyzingMessage.id));
      
      const analysisMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: analysis.analysis,
        sender: 'ai',
        timestamp: new Date(),
        analysis: analysis,
      };
      
      setMessages(prev => [...prev, analysisMessage]);
      
      // Save to chat history
      const serviceChatMessage: ServiceChatMessage = {
        id: message.id,
        role: 'user',
        content: `Uploaded ${file.name}`,
        timestamp: new Date(),
        attachmentUrl: fileUrl,
        attachmentType: isImage ? 'image' : 'pdf'
      };
      await medgemmaService.saveChatMessage(user.id, serviceChatMessage);
      
      const aiServiceChatMessage: ServiceChatMessage = {
        id: analysisMessage.id,
        role: 'assistant',
        content: analysis.analysis,
        timestamp: new Date()
      };
      await medgemmaService.saveChatMessage(user.id, aiServiceChatMessage);
      
    } catch (error) {
      console.error('Error analyzing file:', error);
      
      // Remove analyzing message and add error message
      setMessages(prev => prev.filter(msg => msg.id !== analyzingMessage.id));
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: `I apologize, but I encountered an error while analyzing your ${isImage ? 'image' : isPDF ? 'document' : 'file'}. Please ensure the file is a valid ${isImage ? 'dermatological image' : 'medical document'} and try again.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    sendFileMessage(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px] md:h-[600px]">
      <div className="bg-primary-50 p-3 sm:p-4 border-b border-primary-100">
        <h2 className="text-lg sm:text-xl font-bold flex items-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-100 flex items-center justify-center mr-2 sm:mr-3">
            <Brain className="text-primary-500" size={16} />
          </div>
          DermaSenseAI Chat Assistant
        </h2>
        <p className="text-xs sm:text-sm text-secondary-600 mt-1">
          Ask questions about skin conditions or upload images for analysis
        </p>
      </div>
      
      {/* Messages Display */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[90%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${message.sender === 'user' 
                ? 'bg-primary-100 text-secondary-900' 
                : 'bg-secondary-100 text-secondary-900'}`}
            >
              {message.file && (
                <div className="mb-2">
                  {message.file.type.startsWith('image/') ? (
                    <div className="relative group">
                      <img 
                        src={message.file.url} 
                        alt={message.file.name} 
                        className="rounded-lg max-h-60 w-auto border-2 border-primary-100 shadow-sm transition-all duration-200 hover:shadow-md"
                      />
                      <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-full opacity-80">
                        {message.file.name}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center bg-secondary-200 p-2 rounded-lg">
                      <Paperclip size={24} className="text-secondary-600 mr-2" />
                      <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline">
                        {message.file.name}
                      </a>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-sm whitespace-pre-line">{message.content}</div>
              
              {/* Show analysis results if available */}
              {message.analysis && (
                <div className="mt-3 border-t border-secondary-200 pt-3">
                  {/* Confidence Score */}
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-3">
                      {message.analysis.confidence > 0.8 ? (
                        <CheckCircle size={16} className="text-green-500 mr-1" />
                      ) : message.analysis.confidence > 0.6 ? (
                        <AlertTriangle size={16} className="text-yellow-500 mr-1" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-500 mr-1" />
                      )}
                      <span className="text-xs text-secondary-600">
                        Confidence: {Math.round(message.analysis.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  
                  {/* Recommendations */}
                  {message.analysis.recommendations.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-secondary-700 mb-1">Recommendations:</p>
                      <ul className="text-xs text-secondary-600 space-y-1">
                        {message.analysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1 h-1 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                </div>
              )}
              
              {/* Loading indicator for analyzing messages */}
              {message.isAnalyzing && (
                <div className="flex items-center mt-2">
                  <Loader className="animate-spin text-primary-500 mr-2" size={14} />
                  <span className="text-xs text-primary-600">Processing with MedGemma...</span>
                </div>
              )}
              
              <p className="text-xs text-secondary-500 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary-100 rounded-lg p-3 flex items-center">
              <Loader className="animate-spin text-primary-500 mr-2" size={16} />
              <span className="text-sm text-secondary-700">Analyzing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Camera View */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-black rounded-lg overflow-hidden w-[90%] max-w-2xl">
            {cameraError ? (
              <div className="p-8 text-center text-white">
                <FileWarning size={48} className="mx-auto text-red-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Camera Error</h3>
                <p className="text-red-300">{cameraError}</p>
                <button
                  onClick={toggleCamera}
                  className="mt-6 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-auto"
                />
                <div className="absolute top-2 right-2">
                  <button 
                    onClick={toggleCamera}
                    className="bg-white bg-opacity-50 text-black rounded-full p-1.5 hover:bg-opacity-75"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button 
                    onClick={captureImage}
                    className="bg-primary-500 text-white rounded-full p-4 shadow-lg animate-pulse"
                  >
                    <Camera size={28} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*,application/pdf" 
        onChange={handleFileUpload}
      />
      
      {/* Input Area */}
      <div className="p-2 sm:p-4 border-t border-secondary-100">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button 
            onClick={toggleCamera}
            className={`p-1.5 sm:p-2 rounded-full ${isCameraActive ? 'bg-red-100 text-red-500' : 'bg-secondary-100 text-secondary-700'} hover:bg-secondary-200`}
            title={isCameraActive ? 'Close Camera' : 'Open Camera'}
          >
            <Camera size={20} />
          </button>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 sm:p-2 rounded-full bg-secondary-100 text-secondary-700 hover:bg-secondary-200"
            title="Upload file"
          >
            <Paperclip size={20} />
          </button>
          
          <div className="relative flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question here..."
              className="w-full border border-secondary-200 rounded-lg py-2 sm:py-3 px-3 sm:px-4 pr-10 sm:pr-12 focus:outline-none focus:border-primary-300 resize-none text-sm sm:text-base"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === '' || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-500 hover:text-primary-600 disabled:text-secondary-300"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-secondary-500 mt-1 sm:mt-2 text-center">
          Powered by Google's MEDGEMMA model. Not a substitute for professional medical advice.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;