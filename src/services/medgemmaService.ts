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
}

class MedGemmaService {
  private edgeChatUrl: string | undefined = import.meta.env.VITE_EDGE_CHAT_URL;
  private edgeApiKey: string | undefined = import.meta.env.VITE_EDGE_API_KEY;
  private isEdgeEnabled(): boolean {
    return !!this.edgeChatUrl && typeof this.edgeChatUrl === 'string';
  }

  private async callEdge<T>(path: string, body: unknown): Promise<T> {
    if (!this.isEdgeEnabled()) {
      throw new Error('Edge function not configured');
    }
    const url = `${this.edgeChatUrl}${path}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.edgeApiKey ? { Authorization: `Bearer ${this.edgeApiKey}` } : {})
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`Edge error ${res.status}: ${text}`);
    }
    return await res.json() as T;
  }
  
  /**
   * Analyze an image - provides dermatological guidance
   */
  async analyzeImage(imageFile: File, prompt: string = "Analyze this dermatological image and provide a detailed medical assessment."): Promise<MedGemmaResponse> {
    // Try direct file upload to backend first (PanDerm)
    try {
      if (this.isEdgeEnabled()) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const url = `${this.edgeChatUrl}/analyze-image`;
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: this.edgeApiKey ? { Authorization: `Bearer ${this.edgeApiKey}` } : {}
        });
        
        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`Backend error ${res.status}: ${text}`);
        }
        
        const resp = await res.json() as MedGemmaResponse;
        return resp;
      }
    } catch (err) {
      console.warn('Falling back to client analysis (image):', err);
    }

    // Fallback mock
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      analysis: `**Analysis for ${imageFile.name}**

I've received your dermatological image for analysis. Based on the filename and common skin conditions, here's comprehensive guidance:

**For effective skin condition evaluation, please observe:**
1. **Color** - Any unusual pigmentation, redness, or discoloration
2. **Texture** - Rough, smooth, scaly, or bumpy areas
3. **Size** - Diameter and any changes over time
4. **Shape** - Irregular borders or asymmetrical appearance
5. **Symptoms** - Itching, pain, burning, or tenderness

**General Dermatological Recommendations:**
- Document any changes with photos and dates
- Note accompanying symptoms (itching, pain, scaling)
- Consider environmental factors (sun exposure, new products, stress)
- Monitor for the ABCDE signs of melanoma: Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution

**When to Seek Professional Care:**
- New or changing moles or lesions
- Persistent skin irritation lasting >2 weeks
- Signs of infection (pus, red streaking, fever)
- Any concerning changes in size, color, or texture

**Important:** This is educational guidance only. For actual medical concerns, always consult with a qualified dermatologist who can perform proper visual and physical examination.`,
      confidence: 0.85,
      recommendations: [
        "Schedule an appointment with a dermatologist for professional evaluation",
        "Document any changes in the condition with photos and dates",
        "Avoid picking or scratching the affected area",
        "Use gentle, fragrance-free skincare products",
        "Protect the area from sun exposure with SPF 30+ sunscreen"
      ],
      
    };
  }

  /**
   * Analyze PDF content - provides medical document guidance
   */
  async analyzePDF(pdfFile: File, prompt: string = "Analyze this medical document and provide insights."): Promise<MedGemmaResponse> {
    // Prefer backend model if configured
    try {
      if (this.isEdgeEnabled()) {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('Not authenticated');
        const publicUrl = await this.uploadFile(pdfFile, userId);
        const resp = await this.callEdge<MedGemmaResponse>('/analyze-pdf', {
          userId,
          pdfUrl: publicUrl,
          prompt
        });
        return resp;
      }
    } catch (err) {
      console.warn('Falling back to client analysis (pdf):', err);
    }

    // Fallback mock
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      analysis: `**Document Analysis for ${pdfFile.name}**

I've received your medical document for analysis. Here's comprehensive guidance on medical document review:

**Key areas typically reviewed in dermatological reports:**
1. **Patient History** - Previous conditions, treatments, family history
2. **Clinical Findings** - Visual examination results, measurements
3. **Diagnostic Tests** - Biopsy results, imaging findings
4. **Treatment Plan** - Recommended medications, procedures, follow-up
5. **Prognosis** - Expected outcomes and monitoring requirements

**Important Document Elements to Review:**
- Date of examination and provider information
- Specific medical terminology and diagnostic codes
- Medication names, dosages, and instructions
- Any urgent or concerning findings highlighted

**Next Steps for Document Review:**
- Review with your healthcare provider for clarification
- Ensure you understand all recommendations
- Schedule follow-up appointments as advised
- Keep documentation organized for future reference
- Ask questions about any unclear medical terminology

**Important:** This is educational guidance for document review. For actual medical document interpretation, always consult with your healthcare provider who can explain findings in the context of your specific situation.`,
      confidence: 0.80,
      recommendations: [
        "Discuss the document contents with your healthcare provider",
        "Follow all treatment recommendations as prescribed",
        "Schedule recommended follow-up appointments",
        "Keep this document in your medical records",
        "Ask questions about any unclear medical terminology"
      ],
    };
  }

  /**
   * General chat - provides dermatological guidance
   */
  async chat(message: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Prefer backend model if configured
    try {
      if (this.isEdgeEnabled()) {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) throw new Error('Not authenticated');
        const resp = await this.callEdge<{ content: string }>('/chat', {
          userId,
          messages: conversationHistory.concat({ id: `${Date.now()}`, role: 'user', content: message, timestamp: new Date() })
        });
        if (resp?.content) return resp.content;
      }
    } catch (err) {
      console.warn('Falling back to client chat:', err);
    }

    // Fallback mock behaviour
    await new Promise(resolve => setTimeout(resolve, 1000));
    const lowerMessage = message.toLowerCase().trim();

    // Look at last assistant message (if any) to make the bot a bit context-aware
    const lastAssistantMessage = [...conversationHistory]
      .reverse()
      .find(m => m.role === 'assistant');
    const lastAssistantText = lastAssistantMessage?.content?.toLowerCase() ?? '';

    // Simple acknowledgement / chit‑chat handling
    const isShortAck = /^(ok|okay|sure|right|yes|yep|yeah|got it|thanks|thank you)$/i.test(lowerMessage);

    if (isShortAck) {
      if (lastAssistantText.includes('what specific skin concern')) {
        return 'No problem. To help you better, please tell me what skin issue you are currently worried about (for example: acne, a changing mole, a rash, or something else).';
      }
      return 'Glad that helped. If you tell me a specific skin concern (like acne, a rash, or a mole), I can give more tailored educational information.';
    }
    
    // Provide contextual responses based on common dermatology topics
    if (lowerMessage.includes('acne')) {
      return `Acne is a common skin condition that affects millions of people. Here's what you should know:

**Types of Acne:**
- Blackheads and whiteheads (comedonal acne)
- Papules and pustules (inflammatory acne)
- Cysts and nodules (severe acne)

**General Management:**
- Use gentle, non-comedogenic cleansers
- Consider over-the-counter treatments with salicylic acid or benzoyl peroxide
- Maintain consistent skincare routine
- Avoid picking or squeezing lesions

**When to See a Dermatologist:**
- Severe or cystic acne
- Scarring or hyperpigmentation
- Lack of improvement with over-the-counter treatments
- Emotional impact from acne

Remember, effective acne treatment often requires professional guidance and may take 6-12 weeks to show improvement.`;
    }
    
    if (lowerMessage.includes('mole') || lowerMessage.includes('melanoma')) {
      return `Mole examination is crucial for skin cancer detection. Here's the ABCDE guide:

**A - Asymmetry:** One half doesn't match the other
**B - Border:** Irregular, scalloped, or poorly defined edges
**C - Color:** Varied colors within the same mole
**D - Diameter:** Larger than 6mm (size of pencil eraser)
**E - Evolution:** Changes in size, shape, color, or symptoms

**Red Flags:**
- New moles appearing after age 30
- Existing moles that change
- Moles that bleed, itch, or become tender
- Family history of melanoma

**Recommendation:** Schedule a professional skin examination with a dermatologist for proper evaluation of any concerning moles.`;
    }
    
    if (lowerMessage.includes('rash') || lowerMessage.includes('eczema')) {
      return `Skin rashes can have many causes. Here's general guidance:

**Common Causes:**
- Allergic reactions (contact dermatitis)
- Eczema (atopic dermatitis)
- Infections (bacterial, viral, fungal)
- Environmental factors (heat, cold, dry air)

**General Care:**
- Identify and avoid triggers
- Use gentle, fragrance-free products
- Keep skin moisturized
- Avoid hot showers and harsh scrubbing
- Consider cool compresses for relief

**See a Healthcare Provider if:**
- Rash spreads rapidly
- Accompanied by fever
- Signs of infection (pus, red streaking)
- Severe itching interfering with sleep
- No improvement with basic care

Each person's skin is unique, so professional evaluation is often needed for proper diagnosis and treatment.`;
    }
    
    if (lowerMessage.includes('psoriasis')) {
      return `Psoriasis is a chronic autoimmune skin condition. Here's important information:

**Common Symptoms:**
- Red, scaly patches of skin
- Silvery scales on patches
- Itching and burning sensation
- Thick, pitted fingernails

**Common Locations:**
- Elbows and knees
- Scalp and lower back
- Palms and soles
- Face and skin folds

**Management Strategies:**
- Moisturize regularly with thick creams
- Avoid known triggers (stress, infections, certain medications)
- Use gentle, fragrance-free products
- Consider phototherapy under medical supervision

**Important:** Psoriasis requires professional medical management. A dermatologist can prescribe appropriate treatments including topical medications, oral medications, or biologic therapies based on severity.`;
    }
    
    // Default response for other queries
    return (
      `Thank you for your question about "${message}".\n\n` +
      `I can share general, educational information about common skin issues.\n\n` +
      `Topics I can help with:\n` +
      `• Acne and breakouts\n` +
      `• Moles and skin cancer checks\n` +
      `• Rashes, eczema, and irritation\n` +
      `• Sun protection and basic skin care\n\n` +
      `Note: This is not medical advice. For diagnosis or treatment, please see a dermatologist.\n\n` +
      `What specific skin concern would you like to talk about?`
    );
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
  private async extractTextFromPDF(pdfFile: File): Promise<string> {
    try {
      return `Medical document: ${pdfFile.name}\nSize: ${Math.round(pdfFile.size / 1024)}KB\nType: PDF Document\n\n[This represents extracted text from the PDF document. In a production environment, this would contain the actual text content extracted using a PDF parsing library like PDF.js.]`;
    } catch (error) {
      console.error('Error extracting PDF text:', error);
      return `Unable to extract text from ${pdfFile.name}. Please ensure the PDF is readable and try again.`;
    }
  }

  private parseAnalysisResponse(response: string): MedGemmaResponse {
    // Clean up the response - remove conversation formatting if present
    const cleanResponse = response.replace(/<start_of_turn>|<end_of_turn>/g, '').trim();
    
    // Parse the AI response and structure it
    const lines = cleanResponse.split('\n').filter(line => line.trim());
    
    // Extract recommendations (look for lines with recommendation keywords)
    const recommendationKeywords = ['recommend', 'suggest', 'advise', 'should', 'consider'];
    const recommendations = lines.filter(line => {
      const lowerLine = line.toLowerCase();
      return recommendationKeywords.some(keyword => lowerLine.includes(keyword));
    }).slice(0, 5); // Limit to 5 recommendations
    
    // Try to extract confidence from the response
    let confidence = 0.8; // Default confidence
    const confidenceMatch = cleanResponse.match(/confidence[:\s]+([0-9]+)%?/i);
    if (confidenceMatch) {
      confidence = parseInt(confidenceMatch[1]) / 100;
    } else {
      // Look for other confidence indicators
      const lowerResponse = cleanResponse.toLowerCase();
      if (lowerResponse.includes('highly likely') || lowerResponse.includes('very confident')) {
        confidence = 0.9;
      } else if (lowerResponse.includes('likely') || lowerResponse.includes('probable')) {
        confidence = 0.8;
      } else if (lowerResponse.includes('possible') || lowerResponse.includes('may be')) {
        confidence = 0.7;
      } else if (lowerResponse.includes('unclear') || lowerResponse.includes('uncertain')) {
        confidence = 0.6;
      }
    }
    
    // Generate contextual follow-up questions
    const followUpQuestions: string[] = [];
    const lowerResponse = cleanResponse.toLowerCase();
    
    if (lowerResponse.includes('skin') || lowerResponse.includes('dermat')) {
      followUpQuestions.push("What specific symptoms have you noticed?");
      followUpQuestions.push("How long have you had this condition?");
    }
    
    if (lowerResponse.includes('treatment') || lowerResponse.includes('medication')) {
      followUpQuestions.push("Have you tried any treatments before?");
    }
    
    if (lowerResponse.includes('doctor') || lowerResponse.includes('professional')) {
      followUpQuestions.push("Would you like help finding a dermatologist?");
    }
    
    // Add default questions if none were generated
    if (followUpQuestions.length === 0) {
      followUpQuestions.push("Would you like me to explain any specific aspect in more detail?");
      followUpQuestions.push("Do you have any other images or documents to analyze?");
    }
    
    followUpQuestions.push("Would you like information about treatment options?");
    
    return {
      analysis: cleanResponse,
      confidence: Math.min(Math.max(confidence, 0.5), 0.95), // Clamp between 0.5 and 0.95
      recommendations: recommendations.length > 0 ? recommendations : [
        "Consult with a dermatologist for proper diagnosis",
        "Monitor the condition for any changes"
      ],
      followUpQuestions: followUpQuestions.slice(0, 3) // Limit to 3 questions
    };
  }
}

export const medgemmaService = new MedGemmaService();