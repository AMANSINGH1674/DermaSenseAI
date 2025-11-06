# DermaSenseAI Local Backend (PanDerm)

This FastAPI service exposes the endpoints used by the frontend chat assistant and connects to your local PanDerm ViT-L/16 checkpoint.

## Requirements
- Python 3.10+
- A working PyTorch install (CPU is fine; GPU optional)
- Your PanDerm checkpoint:
  - Directory (default): `/Users/amansingh/Downloads/MODEL/Panderm`
  - File (default): `panderm_ll_data6_checkpoint-499.pth`

## Install
```bash
cd /Users/amansingh/Documents/DermaSenseAI/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

If `timm` fails to build on your system, comment it out in `requirements.txt`. The server will still run with basic image features.

## Run
```bash
# Optionally override model paths
export PANDERM_DIR="/Users/amansingh/Downloads/MODEL/Panderm"
export PANDERM_CKPT="/Users/amansingh/Downloads/MODEL/Panderm/panderm_ll_data6_checkpoint-499.pth"

# Start server
cd /Users/amansingh/Documents/DermaSenseAI
uvicorn backend.panderm_server:app --host 127.0.0.1 --port 8000
```

## Frontend configuration
Create or update `.env.local` in project root:
```
VITE_EDGE_CHAT_URL=http://127.0.0.1:8000
# VITE_EDGE_API_KEY=optional-if-you-secure-the-backend
```
Restart `npm run dev` if running.

## Endpoints
- POST `/chat` -> `{ content: string }`
- POST `/analyze-image` -> `MedGemmaResponse`
- POST `/analyze-pdf` -> `MedGemmaResponse`

`MedGemmaResponse` fields:
- `analysis: string`
- `confidence: number`
- `recommendations: string[]`
- `followUpQuestions: string[]`

## Notes
- The server attempts to load the PanDerm checkpoint into a ViT-L/16 backbone with `strict=False`. If shapes/keys differ, it will still serve with basic image features and educational output.
- Replace with your official PanDerm model code for best results.


