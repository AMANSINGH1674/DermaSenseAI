from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import io
import requests
from PIL import Image, ImageFilter
import numpy as np

try:
    import torch
    import timm
except Exception:
    torch = None
    timm = None


PANDERM_DIR = os.environ.get("PANDERM_DIR", "/Users/amansingh/Downloads/MODEL/Panderm")
PANDERM_CKPT = os.environ.get("PANDERM_CKPT", os.path.join(PANDERM_DIR, "panderm_ll_data6_checkpoint-499.pth"))

app = FastAPI(title="DermaSenseAI Local Backend (PanDerm)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    userId: str
    messages: list


class AnalyzeImageRequest(BaseModel):
    userId: str
    imageUrl: str
    prompt: str | None = None


class AnalyzePDFRequest(BaseModel):
    userId: str
    pdfUrl: str
    prompt: str | None = None


_model = None
_preprocess = None


def _load_model():
    global _model, _preprocess
    if _model is not None:
        return _model
    if torch is None or timm is None:
        return None
    # ViT-L/16 backbone similar to PanDerm; best-effort load
    model = timm.create_model("vit_large_patch16_224", pretrained=False, num_classes=0)
    if os.path.exists(PANDERM_CKPT):
        try:
            state = torch.load(PANDERM_CKPT, map_location="cpu")
            if isinstance(state, dict) and "state_dict" in state:
                state = state["state_dict"]
            missing, unexpected = model.load_state_dict(state, strict=False)
            print("[PanDerm] Loaded checkpoint with strict=False.")
            if missing:
                print(f"[PanDerm] Missing keys: {len(missing)}")
            if unexpected:
                print(f"[PanDerm] Unexpected keys: {len(unexpected)}")
        except Exception as e:
            print(f"[PanDerm] Failed to load checkpoint, proceeding without: {e}")
    model.eval()
    _model = model
    _preprocess = lambda img: _pil_to_tensor(img)
    return _model


def _pil_to_tensor(img: Image.Image):
    img = img.convert("RGB").resize((224, 224))
    arr = np.array(img).astype(np.float32) / 255.0
    arr = (arr - np.array([0.485, 0.456, 0.406])) / np.array([0.229, 0.224, 0.225])
    arr = np.transpose(arr, (2, 0, 1))
    tensor = torch.from_numpy(arr).unsqueeze(0) if torch is not None else None
    return tensor


def _basic_image_features(img: Image.Image):
    np_img = np.array(img.convert("RGB"))
    mean_color = np.mean(np_img.reshape(-1, 3), axis=0)
    # Simple edge density via PIL filter
    edges = img.convert("L").filter(ImageFilter.FIND_EDGES)
    edge_arr = np.array(edges)
    edge_density = float(np.mean(edge_arr > 20))
    return mean_color.tolist(), edge_density


@app.post("/chat")
def chat(req: ChatRequest):
    last_user_msg = ""
    for m in reversed(req.messages):
        if isinstance(m, dict) and m.get("role") == "user":
            last_user_msg = m.get("content", "")
            break
    content = (
        "Thanks for your question. I provide educational dermatology guidance. "
        "You can also upload an image for analysis."
    )
    if last_user_msg:
        lower = last_user_msg.lower()
        if any(k in lower for k in ["acne", "pimple", "breakout"]):
            content = "For acne, gentle skincare and avoiding picking are important. Consistency is key (6–12 weeks)."
        elif any(k in lower for k in ["mole", "melanoma"]):
            content = "Use the ABCDE guide for moles. Consider professional evaluation for changing or irregular lesions."
        elif any(k in lower for k in ["eczema", "rash"]):
            content = "Eczema care includes trigger avoidance and moisturization with fragrance-free products."
    return {"content": content}


@app.post("/analyze-image")
def analyze_image(req: AnalyzeImageRequest):
    _load_model()
    r = requests.get(req.imageUrl, timeout=20)
    r.raise_for_status()
    img = Image.open(io.BytesIO(r.content))

    mean_color, edge_density = _basic_image_features(img)

    embedding_info = ""
    if _model is not None and torch is not None:
        with torch.no_grad():
            inp = _preprocess(img)
            if inp is not None:
                feat = _model(inp)
                embedding_info = f"Embedding dim: {int(feat.shape[-1])}"

    analysis = (
        f"I analyzed your image. Basic features suggest avg color (RGB): "
        f"{[round(c, 3) for c in mean_color]} and edge density: {round(edge_density, 3)}.\n\n"
        "This is educational guidance only. Consider lighting, focus, and clinical context."
        + (f"\n\n{embedding_info}" if embedding_info else "")
    )

    return {
        "analysis": analysis,
        "confidence": 0.8,
        "recommendations": [
            "Capture images in consistent lighting and focus",
            "Monitor changes over time and document with dates",
            "Seek professional evaluation for concerning lesions"
        ],
        "followUpQuestions": [
            "How long has this finding been present?",
            "Any symptoms such as itching or pain?",
            "Would you like tips on self-examination?"
        ]
    }


@app.post("/analyze-pdf")
def analyze_pdf(req: AnalyzePDFRequest):
    # Minimal placeholder — just confirms reachability
    analysis = (
        "Your document has been received for educational analysis. "
        "Review patient history, clinical findings, diagnostic tests, and recommendations with your provider."
    )
    return {
        "analysis": analysis,
        "confidence": 0.75,
        "recommendations": [
            "Discuss the document with your healthcare provider",
            "Clarify any unclear terms or abbreviations",
            "Follow recommended next steps and follow-up"
        ],
        "followUpQuestions": [
            "Do you want help understanding a specific section?",
            "Are there treatment recommendations to clarify?"
        ]
    }


