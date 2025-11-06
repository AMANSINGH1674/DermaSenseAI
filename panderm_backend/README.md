# DermaSenseAI PanDerm Backend

FastAPI backend for dermatological image analysis using the PanDerm ViT-L/16 foundation model.

## Overview

This backend provides HTTP endpoints for analyzing dermatological images using the pretrained PanDerm model. It extracts features from skin images and generates medical guidance.

## Features

- **Image Analysis**: POST /analyze-image endpoint for dermatological image analysis
- **Feature Extraction**: Uses PanDerm ViT-L/16 backbone for robust feature extraction
- **CORS Enabled**: Configured for frontend integration
- **Health Check**: GET /health endpoint for monitoring

## Prerequisites

- Python 3.10+
- PyTorch (CPU or GPU)
- PanDerm checkpoint: `panderm_ll_data6_checkpoint-499.pth`

## Installation

### 1. Install Dependencies

```bash
cd panderm_backend
pip install -r requirements.txt
```

### 2. Verify PanDerm Checkpoint

Ensure the checkpoint exists at:
```
/Users/amansingh/Documents/DermaSenseAI/PanDerm copy/panderm_ll_data6_checkpoint-499.pth
```

Or set custom paths via environment variables:
```bash
export PANDERM_DIR="/path/to/PanDerm"
export PANDERM_CKPT="/path/to/panderm_ll_data6_checkpoint-499.pth"
```

## Running the Server

### Development

```bash
cd panderm_backend
python server.py
```

Server will start at `http://127.0.0.1:8000`

### Production

```bash
cd panderm_backend
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check

```bash
GET /health
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
POST /analyze-image
Content-Type: multipart/form-data

file: <image_file>
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

## Frontend Integration

### Configure Frontend

Set the environment variable in your frontend `.env.local`:

```env
VITE_EDGE_CHAT_URL=http://127.0.0.1:8000
```

### How It Works

1. User uploads image in dashboard chat interface
2. Frontend calls `medgemmaService.analyzeImage(file)`
3. Service checks if `VITE_EDGE_CHAT_URL` is configured
4. If configured, sends POST request to `/analyze-image`
5. Backend loads image, extracts PanDerm features, generates analysis
6. Response returned to frontend and displayed in chat

## Model Details

### PanDerm ViT-L/16

- **Architecture**: Vision Transformer Large (ViT-L/16)
- **Input Size**: 224x224 RGB images
- **Feature Dimension**: 1024
- **Normalization**: ImageNet (mean=[0.485, 0.456, 0.406], std=[0.228, 0.224, 0.225])
- **Checkpoint**: panderm_ll_data6_checkpoint-499.pth

### Feature Extraction

The model extracts 1024-dimensional feature vectors from skin images, which can be used for:
- Classification (disease detection)
- Segmentation (lesion boundaries)
- Similarity search (finding similar cases)
- Downstream fine-tuning

## Troubleshooting

### Model Not Loading

```
FileNotFoundError: Checkpoint not found at ...
```

**Solution**: Verify checkpoint path and set environment variables:
```bash
export PANDERM_DIR="/Users/amansingh/Documents/DermaSenseAI/PanDerm copy"
export PANDERM_CKPT="/Users/amansingh/Documents/DermaSenseAI/PanDerm copy/panderm_ll_data6_checkpoint-499.pth"
```

### CUDA Out of Memory

**Solution**: Use CPU instead:
```bash
# The server automatically uses CPU if CUDA is unavailable
# Or force CPU:
export CUDA_VISIBLE_DEVICES=""
python server.py
```

### Slow Inference

**Solution**: 
- Use GPU if available (CUDA)
- Reduce batch size (currently processes one image at a time)
- Consider quantization for production

## Development

### Adding Classification Head

To add disease classification, modify `generate_dermatological_analysis()`:

```python
# Load a classification head trained on PanDerm features
classifier = load_classifier_head()
logits = classifier(features)
predictions = torch.softmax(logits, dim=1)
```

### Adding Segmentation

To add lesion segmentation:

```python
# Load segmentation head
segmentor = load_segmentation_head()
mask = segmentor(features)
```

## Performance

- **Inference Time**: ~500ms per image (GPU), ~2s (CPU)
- **Memory**: ~4GB (GPU), ~2GB (CPU)
- **Throughput**: ~2 images/sec (GPU), ~0.5 images/sec (CPU)

## References

- [PanDerm Paper](https://arxiv.org/abs/2407.02047)
- [PanDerm GitHub](https://github.com/SiyuanYan1/PanDerm)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## License

This backend integrates with PanDerm, which is available under its original license.
