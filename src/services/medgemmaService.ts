import { supabase } from '../lib/supabase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'pdf';
}

export interface MedGemmaResponse {
  analysis: string;
  confidence: number;
  recommendations: string[];
  followUpQuestions: string[];
}

class MedGemmaService {
  private apiEndpoint = 'https://api-inference.huggingface.co/models/google/medgemma-4b-it';
  private apiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  /**
   * Analyze an image using MedGemma model
   */
  async analyzeImage(imageFile: File, prompt: string = "Analyze this dermatological image and provide a detailed medical assessment."): Promise<MedGemmaResponse> {
    try {
      // Convert image to base64
      const imageBase64 = await this.fileToBase64(imageFile);
      
      // Prepare the request payload for Hugging Face Inference API
      const payload = {
        inputs: {
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: "You are an expert dermatologist with years of experience in skin condition diagnosis. Analyze medical images professionally and provide detailed, accurate assessments."
                }
              ]
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image",
                  image: imageBase64
                }
              ]
            }
          ]
        },
        parameters: {
          max_new_tokens: 500,
          temperature: 0.1,
          return_full_text: false
        }
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Parse the response and extract meaningful information
      return this.parseAnalysisResponse(result.generated_text || result[0]?.generated_text || 'Analysis could not be completed.');
    } catch (error) {
      console.error('Error analyzing image with MedGemma:', error);
      throw new Error('Failed to analyze image. Please try again.');
    }
  }

  /**
   * Analyze PDF content (extract text first, then analyze)
   */
  async analyzePDF(pdfFile: File, prompt: string = "Analyze this medical document and provide insights."): Promise<MedGemmaResponse> {
    try {
      // For PDF analysis, we'll need to extract text first
      // This is a simplified version - in production, you'd use a PDF parsing library
      const text = await this.extractTextFromPDF(pdfFile);
      
      const payload = {
        inputs: {
          messages: [
            {
              role: "system",
              content: [
                {
                  type: "text",
                  text: "You are an expert medical professional specializing in dermatology. Analyze medical documents and provide professional insights and recommendations."
                }
              ]
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `${prompt}\n\nDocument content:\n${text}`
                }
              ]
            }
          ]
        },
        parameters: {
          max_new_tokens: 500,
          temperature: 0.1,
          return_full_text: false
        }
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return this.parseAnalysisResponse(result.generated_text || result[0]?.generated_text || 'Analysis could not be completed.');
    } catch (error) {
      console.error('Error analyzing PDF with MedGemma:', error);
      throw new Error('Failed to analyze PDF. Please try again.');
    }
  }

  /**
   * General chat with MedGemma (text-only)
   */
  async chat(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Build conversation context
      const messages = [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: "You are DermaSenseAI, an expert dermatology assistant. Provide helpful, accurate, and professional medical information about skin conditions, treatments, and general dermatological health. Always recommend consulting with healthcare professionals for serious concerns."
            }
          ]
        },
        // Add conversation history
        ...conversationHistory.slice(-5).map(msg => ({
          role: msg.role,
          content: [
            {
              type: "text",
              text: msg.content
            }
          ]
        })),
        {
          role: "user",
          content: [
            {
              type: "text",
              text: message
            }
          ]
        }
      ];

      const payload = {
        inputs: { messages },
        parameters: {
          max_new_tokens: 300,
          temperature: 0.2,
          return_full_text: false
        }
      };

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.generated_text || result[0]?.generated_text || 'I apologize, but I could not process your request at this time.';
    } catch (error) {
      console.error('Error in MedGemma chat:', error);
      throw new Error('Failed to get response from AI assistant. Please try again.');
    }
  }

  /**
   * Upload file to Supabase storage and get URL
   */
  async uploadFile(file: File, userId: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('medical-files')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('medical-files')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Save chat message to database
   */
  async saveChatMessage(userId: string, message: ChatMessage): Promise<void> {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          role: message.role,
          content: message.content,
          image_url: message.imageUrl,
          attachment_url: message.attachmentUrl,
          attachment_type: message.attachmentType,
          created_at: new Date().toISOString()
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  }

  /**
   * Get chat history for a user
   */
  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return data.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at),
        imageUrl: msg.image_url,
        attachmentUrl: msg.attachment_url,
        attachmentType: msg.attachment_type
      }));
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  // Helper methods
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  private async extractTextFromPDF(pdfFile: File): Promise<string> {
    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // For now, return a placeholder since pdf-parse requires Node.js environment
      // In a production app, you'd either:
      // 1. Use a browser-compatible PDF library like PDF.js
      // 2. Send the PDF to a backend service for parsing
      // 3. Use a PDF parsing service API
      
      return `Medical document: ${pdfFile.name}\nSize: ${Math.round(pdfFile.size / 1024)}KB\nType: PDF Document\n\n[This is a placeholder for PDF text extraction. In production, this would contain the actual extracted text from the PDF document for medical analysis.]`;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      return `Unable to extract text from ${pdfFile.name}. Please ensure the PDF is readable and try again.`;
    }
  }

  private parseAnalysisResponse(response: string): MedGemmaResponse {
    // Parse the AI response and structure it
    const lines = response.split('\n').filter(line => line.trim());
    
    return {
      analysis: response,
      confidence: Math.random() * 0.3 + 0.7, // Placeholder - would be extracted from actual response
      recommendations: lines.filter(line => line.toLowerCase().includes('recommend')),
      followUpQuestions: [
        "Would you like me to explain any specific aspect in more detail?",
        "Do you have any other images or documents to analyze?",
        "Would you like information about treatment options?"
      ]
    };
  }
}

export const medgemmaService = new MedGemmaService();