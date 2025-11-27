from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from PIL import Image
import io
import torch
import torchvision.transforms as T

try:
    import timm
except ImportError:  # pragma: no cover
    timm = None


class MedGemmaResponse(BaseModel):
    """Response shape expected by the frontend MedGemmaService.

    This MUST match the TypeScript interface in src/services/medgemmaService.ts.
    """

    analysis: str
    confidence: float
    recommendations: List[str]


app = FastAPI(title="DermaSenseAI Backend", version="0.1.0")

# Allow requests from the Vite dev server and same-host origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Model loading
# ---------------------------------------------------------------------------

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# NOTE: CLASS_NAMES order MUST match the training label order for
# best_swin_dermnet_finetuned_v2.pth.
CLASS_NAMES = [
    "acne",
    "actinic_keratosis",
    "atopic_dermatitis",
    "basal_cell_carcinoma",
    "benign_keratosis",
    "cellulitis",
    "dermatofibroma",
    "eczema",
    "hemangioma",
    "herpes",
    "impetigo",
    "lentigo",
    "melanoma",
    "milia",
    "nevus",
    "onychomycosis",
    "psoriasis",
    "rosacea",
    "seborrheic_keratosis",
    "squamous_cell_carcinoma",
    "tinea",
    "urticaria",
    "vasculitis",
]

MODEL_NAME = "swin_tiny_patch4_window7_224"  # adjust if you used a different Swin


def load_model():
    if timm is None:
        raise RuntimeError(
            "timm is not installed. Please install it in your backend environment: `pip install timm`."
        )

    model = timm.create_model(
        MODEL_NAME,
        pretrained=False,
        num_classes=len(CLASS_NAMES),
    )

    checkpoint_path = "best_swin_dermnet_finetuned_v2.pth"
    try:
        checkpoint = torch.load(checkpoint_path, map_location="cpu")
    except FileNotFoundError as exc:  # pragma: no cover
        raise RuntimeError(
            f"Checkpoint '{checkpoint_path}' not found. Place your .pth file in the backend directory."
        ) from exc

    # If your checkpoint is a state dict directly, this will work.
    # If it is a dict with a nested 'state_dict' key, adjust accordingly.
    state_dict = checkpoint if isinstance(checkpoint, dict) and "state_dict" not in checkpoint else checkpoint.get("state_dict", checkpoint)
    model.load_state_dict(state_dict, strict=False)

    model.to(DEVICE)
    model.eval()
    return model


MODEL = load_model()


# Preprocessing: adjust if your training used different size/normalization.
TRANSFORM = T.Compose(
    [
        T.Resize((224, 224)),  # change if needed
        T.ToTensor(),
        T.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ]
)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/health")
async def health_check():
    return {"status": "ok", "device": DEVICE}


@app.post("/analyze-image", response_model=MedGemmaResponse)
async def analyze_image(file: UploadFile = File(...)):
    """Analyze a dermatology image using the Swin model.

    Expects a multipart/form-data upload with field name `file`.
    """

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    content = await file.read()

    try:
        image = Image.open(io.BytesIO(content)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Unable to decode image")

    x = TRANSFORM(image).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        logits = MODEL(x)
        probs = torch.softmax(logits, dim=1)[0]
        conf, idx = torch.max(probs, dim=0)

    label = CLASS_NAMES[idx.item()]
    confidence = float(conf.item())

    # Scale confidence score for display purposes as requested.
    # Warning: This misrepresents the model's true confidence.
    # The new range is [0.5, 1.0].
    confidence = 0.5 + confidence * 0.5

    LOW_CONF_THRESHOLD = 0.30

    if confidence < LOW_CONF_THRESHOLD:
        analysis_lines = [
            "The model is **not very confident** about any specific diagnosis for this image.",
            f"The closest pattern it sees is **{label}**, but with low confidence ({confidence:.2f}).",
        ]
    else:
        analysis_lines = [
            f"The model's top prediction is **{label}**.",
            f"Estimated confidence: {confidence:.2f}.",
            "\nThis prediction is generated by a Swin Transformer model fine-tuned on dermatology images.",
        ]

    # You can specialize these per label later if you wish.
    recommendations = [
        "Monitor the area for changes in size, color, or shape.",
        "Avoid scratching or irritating the lesion.",
        "Consider consulting a dermatologist for a professional, in-person evaluation.",
    ]


    return MedGemmaResponse(
        analysis="\n".join(analysis_lines),
        confidence=confidence,
        recommendations=recommendations,
    )
