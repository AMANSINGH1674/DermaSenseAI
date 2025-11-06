# PanDerm Backend Setup Guide

This guide walks you through setting up the PanDerm FastAPI backend for DermaSenseAI.

## Quick Start

### 1. Install Backend Dependencies

```bash
cd panderm_backend
pip install -r requirements.txt
```

### 2. Start the Backend Server

```bash
python server.py
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
INFO:     PanDerm model loaded successfully
```

### 3. Configure Frontend

Create or update `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_EDGE_CHAT_URL=http://127.0.0.1:8000
```

### 4. Start Frontend

In a new terminal:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How It Works

### Image Upload Flow

1. **User uploads image** in dashboard chat interface
2. **Frontend calls** `medgemmaService.analyzeImage(file)`
3. **Service checks** if `VITE_EDGE_CHAT_URL` is configured
4. **If configured**, sends multipart/form-data POST to `/analyze-image`
5. **Backend**:
   - Receives image file
   - Loads PanDerm ViT-L/16 model
   - Extracts 1024-dimensional feature vector
   - Generates dermatological analysis
   - Returns JSON response
6. **Frontend displays** analysis in chat

### Fallback Behavior

If backend is not configured or fails:
- Frontend falls back to mock analysis
- User still gets educational guidance
- No errors shown to user

## API Endpoints

### Health Check

```bash
curl http://127.0.0.1:8000/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "device": "cuda"
}
```

### Analyze Image

```bash
curl -X POST http://127.0.0.1:8000/analyze-image \
  -F "file=@/path/to/image.jpg"
```

Response:
```json
{
  "analysis": "Detailed dermatological analysis...",
  "confidence": 0.85,
  "recommendations": [
    "Schedule an appointment with a dermatologist...",
    "..."
  ],
  "followUpQuestions": [
    "How long have you noticed this condition?",
    "..."
  ],
  "features_shape": [1, 1024, 768]
}
```

## Troubleshooting

### Issue: "Checkpoint not found"

**Error:**
```
FileNotFoundError: Checkpoint not found at ...
```

**Solution:**
Verify the checkpoint exists:
```bash
ls -la "/Users/amansingh/Documents/DermaSenseAI/PanDerm copy/panderm_ll_data6_checkpoint-499.pth"
```

If not found, download from [PanDerm GitHub](https://github.com/SiyuanYan1/PanDerm).

### Issue: CUDA Out of Memory

**Error:**
```
RuntimeError: CUDA out of memory
```

**Solution:**
The server automatically uses CPU if CUDA is unavailable. To force CPU:
```bash
export CUDA_VISIBLE_DEVICES=""
python server.py
```

### Issue: Port Already in Use

**Error:**
```
OSError: [Errno 48] Address already in use
```

**Solution:**
Use a different port:
```bash
# Edit server.py or run with uvicorn directly:
uvicorn panderm_backend.server:app --host 127.0.0.1 --port 8001
```

Then update `.env.local`:
```env
VITE_EDGE_CHAT_URL=http://127.0.0.1:8001
```

### Issue: CORS Errors

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
The backend is configured with CORS for localhost. If using a different origin, update `server.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://your-custom-origin:port",  # Add here
        "*"
    ],
    ...
)
```

### Issue: Slow Inference

**Performance:**
- GPU: ~500ms per image
- CPU: ~2s per image

**Solutions:**
- Use GPU if available (CUDA)
- Reduce image size (currently 224x224)
- Consider model quantization for production

## Advanced Configuration

### Custom Model Paths

```bash
export PANDERM_DIR="/custom/path/to/PanDerm"
export PANDERM_CKPT="/custom/path/to/checkpoint.pth"
python server.py
```

### Production Deployment

```bash
# Using Gunicorn + Uvicorn
pip install gunicorn
gunicorn panderm_backend.server:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY panderm_backend/requirements.txt .
RUN pip install -r requirements.txt

COPY panderm_backend/ .
COPY "PanDerm copy/panderm_ll_data6_checkpoint-499.pth" ./

ENV PANDERM_CKPT="/app/panderm_ll_data6_checkpoint-499.pth"

CMD ["python", "server.py"]
```

Build and run:
```bash
docker build -t dermasenseai-backend .
docker run -p 8000:8000 dermasenseai-backend
```

## Next Steps

### 1. Add Classification Head

To classify diseases, add a classifier trained on PanDerm features:

```python
# In server.py
classifier = load_classifier_head()
logits = classifier(features)
predictions = torch.softmax(logits, dim=1)
disease_name = DISEASE_CLASSES[predictions.argmax()]
```

### 2. Add Segmentation

To segment lesion boundaries:

```python
segmentor = load_segmentation_head()
mask = segmentor(features)
```

### 3. Add Confidence Scoring

Use feature statistics for confidence:

```python
confidence = calculate_confidence_from_features(features)
```

## References

- [PanDerm Paper](https://arxiv.org/abs/2407.02047)
- [PanDerm GitHub](https://github.com/SiyuanYan1/PanDerm)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [PyTorch Docs](https://pytorch.org/docs/)

## Support

For issues:
1. Check server logs: `python server.py` (verbose output)
2. Test endpoint: `curl http://127.0.0.1:8000/health`
3. Check frontend console: Browser DevTools → Network tab
4. Review [README.md](panderm_backend/README.md) for detailed API docs
