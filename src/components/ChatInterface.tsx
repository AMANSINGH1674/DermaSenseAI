import React, { useState, useRef, useEffect } from 'react';
import { Send, Camera, Loader, Brain, X, Paperclip, FileWarning } from 'lucide-react';

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
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your DermaSenseAI assistant. How can I help you with your skin health today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    if (inputMessage.trim() === '') return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Simulate AI response with MEDGEMMA model integration
      // In a real implementation, this would call the actual API
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `I've analyzed your question about "${inputMessage}". Based on my dermatological knowledge, I can provide some insights. Please note that this is AI-generated advice and not a substitute for professional medical consultation.`,
          sender: 'ai',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error getting AI response:', error);
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

  const sendFileMessage = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const message: Message = {
      id: Date.now().toString(),
      content: `You've uploaded a file: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      file: {
        name: file.name,
        url: fileUrl,
        type: file.type,
      },
    };
    setMessages(prev => [...prev, message]);

    // Simulate AI response
    setIsLoading(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I've received the file "${file.name}". I will analyze it shortly.`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
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
              <p className="text-sm">{message.content}</p>
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
        accept="image/*" 
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