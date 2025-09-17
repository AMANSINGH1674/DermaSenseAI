# MedGemma AI Integration Setup Guide

This guide will help you set up the Google MedGemma AI model integration for DermaSenseAI.

## 🚀 Quick Setup

### 1. Get Hugging Face API Access

1. **Create Hugging Face Account**
   - Go to https://huggingface.co and create an account
   - Verify your email address

2. **Request MedGemma Model Access**
   - Visit https://huggingface.co/google/medgemma-4b-it
   - Click "Request access to this model"
   - Accept the Health AI Developer Foundation's terms of use
   - Wait for approval (usually immediate)

3. **Generate API Token**
   - Go to https://huggingface.co/settings/tokens
   - Click "New token"
   - Give it a name (e.g., "DermaSenseAI")
   - Select "Read" permissions
   - Copy the generated token

### 2. Configure Environment Variables

Update your `.env.local` file:

```env
# Hugging Face Configuration
VITE_HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

### 3. Set Up Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Create chat_messages table for conversation history
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant', 'system')) NOT NULL,
  content text NOT NULL,
  image_url text,
  attachment_url text,
  attachment_type text CHECK (attachment_type IN ('image', 'pdf')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own chat messages" ON public.chat_messages
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can insert own chat messages" ON public.chat_messages
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = user_id);

-- Create index for performance
CREATE INDEX chat_messages_user_id_created_at_idx 
ON public.chat_messages(user_id, created_at DESC);
```

### 4. Create Storage Bucket (Optional)

In your Supabase dashboard:

1. Go to Storage
2. Create a new bucket called `medical-files`
3. Make it public
4. Set up policies for file access

## 🧠 How It Works

### MedGemma Model Capabilities

The **google/medgemma-4b-it** model is specifically designed for medical applications:

- **Multimodal**: Processes both text and images
- **Medical Training**: Trained on dermatology images, chest X-rays, histopathology slides
- **Professional Analysis**: Provides medical-grade insights and recommendations
- **High Performance**: Optimized for clinical reasoning and medical image analysis

### Features Implemented

#### 📷 **Image Analysis**
- Upload dermatological images via camera or file upload
- AI-powered skin condition analysis
- Confidence scoring for reliability assessment
- Professional recommendations and insights

#### 📄 **PDF Document Analysis**
- Upload medical reports and documents
- Text extraction and medical content analysis
- Document summarization and key insights
- Treatment plan recommendations

#### 💬 **Intelligent Chat**
- Natural language conversations about skin health
- Context-aware responses using conversation history
- Follow-up question suggestions
- Professional medical guidance

## 🔧 Technical Architecture

### Service Layer (`medgemmaService.ts`)

```typescript
// Image Analysis
const analysis = await medgemmaService.analyzeImage(imageFile);

// PDF Analysis  
const analysis = await medgemmaService.analyzePDF(pdfFile);

// Text Chat
const response = await medgemmaService.chat(message, history);
```

### API Integration

The service uses Hugging Face's Inference API:

- **Endpoint**: `https://api-inference.huggingface.co/models/google/medgemma-4b-it`
- **Method**: POST with JSON payload
- **Authentication**: Bearer token (your HF API key)

### Data Flow

1. **User Input** → File upload or text message
2. **Preprocessing** → Image encoding or text extraction
3. **API Call** → Send to MedGemma via Hugging Face
4. **Analysis** → Receive structured medical insights
5. **Display** → Show results with confidence scores and recommendations
6. **Storage** → Save conversation history to database

## 🎯 Usage Examples

### Analyzing a Skin Condition Image

1. Click the camera button or upload file button
2. Select a dermatological image
3. Wait for MedGemma analysis
4. Review:
   - Detailed medical analysis
   - Confidence score
   - Treatment recommendations
   - Follow-up questions

### Asking Medical Questions

```
User: "What are the early signs of melanoma?"

MedGemma: "Early signs of melanoma follow the ABCDE rule:
- A: Asymmetry in shape
- B: Border irregularities  
- C: Color variations
- D: Diameter larger than 6mm
- E: Evolution or changes over time
..."
```

## 🔒 Privacy & Security

- **HIPAA Considerations**: This is a demo implementation
- **Data Encryption**: All API calls use HTTPS
- **User Data**: Conversations stored securely in Supabase
- **Access Control**: Row-level security ensures user privacy
- **Disclaimer**: Always included that AI is not a substitute for professional medical advice

## 🚨 Important Notes

### Medical Disclaimer
- This AI assistant provides educational information only
- Not intended for emergency medical situations
- Always consult healthcare professionals for medical decisions
- Results should not replace professional diagnosis

### Rate Limits
- Hugging Face Inference API has rate limits
- Free tier: ~1000 requests/month
- For production: Consider Hugging Face Pro or dedicated inference endpoints

### Model Limitations
- MedGemma is optimized for medical content but may have limitations
- Always validate critical medical information
- Best used as a supplementary tool for medical professionals

## 📊 Performance Optimization

### Recommended Settings

```typescript
// Optimized parameters for medical analysis
{
  max_new_tokens: 500,      // Detailed responses
  temperature: 0.1,         // More deterministic for medical content
  return_full_text: false   // Only new content
}
```

### Production Considerations

1. **Caching**: Cache common responses
2. **Error Handling**: Robust fallbacks for API failures  
3. **Load Balancing**: Use multiple API keys for scale
4. **Monitoring**: Track API usage and response quality

## 🛠️ Troubleshooting

### Common Issues

**401 Unauthorized Error**
- Check your Hugging Face API key
- Ensure you have access to the MedGemma model
- Verify the token has correct permissions

**Model Loading Issues**
- MedGemma might be "cold starting"
- Retry after a few minutes
- Check Hugging Face model status

**Rate Limit Exceeded**
- Implement request queuing
- Add delays between requests
- Consider upgrading HF plan

**PDF Analysis Not Working**
- Currently uses placeholder text extraction
- For production, integrate PDF.js or backend service
- Check file size limits

## 📈 Future Enhancements

- **Real PDF Parsing**: Integrate PDF.js for browser-based parsing
- **Image Preprocessing**: Add image enhancement before analysis
- **Batch Analysis**: Support multiple image analysis
- **Custom Fine-tuning**: Train on specific dermatology datasets
- **Voice Input**: Add speech-to-text for accessibility
- **Report Generation**: Create professional medical reports

## 📚 Resources

- [MedGemma Technical Report](https://arxiv.org/abs/2507.05201)
- [Hugging Face MedGemma Model](https://huggingface.co/google/medgemma-4b-it)
- [Health AI Developer Foundations](https://developers.google.com/health-ai-developer-foundations)
- [Supabase Documentation](https://supabase.com/docs)

---

Need help? Check the troubleshooting section or create an issue in the repository.