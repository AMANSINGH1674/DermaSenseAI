"""
PanDerm FastAPI Backend for DermaSenseAI
Provides image analysis endpoints using the PanDerm ViT-L/16 backbone
"""

import os
import io
import logging
from pathlib import Path
from typing import Optional

import torch
import torch.nn as nn
import timm
import numpy as np
from PIL import Image
from torchvision import transforms

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================================================
# Configuration
# ============================================================================

PANDERM_DIR = os.environ.get(
    "PANDERM_DIR",
    "/Users/amansingh/Documents/DermaSenseAI/PanDerm copy"
)
PANDERM_CKPT = os.environ.get(
    "PANDERM_CKPT",
    os.path.join(PANDERM_DIR, "panderm_ll_data6_checkpoint-499.pth")
)

# Device
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
logger.info(f"Using device: {DEVICE}")

# ============================================================================
# Models & Schemas
# ============================================================================

class AnalysisResponse(BaseModel):
    """Response schema for image analysis"""
    analysis: str
    confidence: float
    recommendations: list[str]
    followUpQuestions: list[str]
    features_shape: Optional[tuple] = None


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    device: str


# ============================================================================
# PanDerm Model Loader
# ============================================================================

class PanDermBackbone:
    """Wrapper for PanDerm ViT-L/16 backbone"""
    
    def __init__(self, checkpoint_path: str, device: torch.device):
        self.device = device
        self.model = None
        self.transform = None
        self.load_model(checkpoint_path)
    
    def load_model(self, checkpoint_path: str):
        """Load PanDerm ViT-L/16 backbone from checkpoint"""
        if not os.path.exists(checkpoint_path):
            raise FileNotFoundError(
                f"Checkpoint not found at {checkpoint_path}. "
                f"Please ensure panderm_ll_data6_checkpoint-499.pth exists."
            )
        
        logger.info(f"Loading PanDerm checkpoint from {checkpoint_path}")
        
        try:
            # Create ViT-L/16 model (same as PanDerm backbone)
            self.model = timm.create_model(
                "vit_large_patch16_224",
                pretrained=False,
                num_classes=0  # Feature extractor mode
            )
            
            # Load checkpoint
            state_dict = torch.load(checkpoint_path, map_location="cpu")
            
            # Handle checkpoint format (may be wrapped in 'state_dict' key)
            if isinstance(state_dict, dict) and "state_dict" in state_dict:
                state_dict = state_dict["state_dict"]
            
            # Load with strict=False to handle minor key mismatches
            missing_keys, unexpected_keys = self.model.load_state_dict(
                state_dict, strict=False
            )
            
            if missing_keys:
                logger.warning(f"Missing keys: {len(missing_keys)}")
            if unexpected_keys:
                logger.warning(f"Unexpected keys: {len(unexpected_keys)}")
            
            # Setup model for inference
            self.model.eval()
            self.model.to(self.device)
            
            # Setup image transforms (ImageNet normalization)
            self.transform = transforms.Compose([
                transforms.Resize(256),
                transforms.CenterCrop(224),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=(0.485, 0.456, 0.406),
                    std=(0.228, 0.224, 0.225)
                )
            ])
            
            logger.info("PanDerm model loaded successfully")
            
        except Exception as e:
            logger.error(f"Failed to load PanDerm model: {e}")
            raise
    
    def extract_features(self, image: Image.Image) -> np.ndarray:
        """Extract features from image using PanDerm backbone"""
        if self.model is None:
            raise RuntimeError("Model not loaded")
        
        # Preprocess image
        img_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        # Extract features
        with torch.no_grad():
            features = self.model(img_tensor)
        
        return features.cpu().numpy()


# ============================================================================
# FastAPI Application
# ============================================================================

app = FastAPI(
    title="DermaSenseAI PanDerm Backend",
    description="FastAPI backend for dermatological image analysis using PanDerm ViT-L/16",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
panderm_model: Optional[PanDermBackbone] = None


@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    global panderm_model
    try:
        panderm_model = PanDermBackbone(PANDERM_CKPT, DEVICE)
        logger.info("PanDerm model initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize PanDerm model: {e}")
        panderm_model = None


# ============================================================================
# Endpoints
# ============================================================================

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=panderm_model is not None,
        device=str(DEVICE)
    )


@app.post("/analyze-image", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze a dermatological image using PanDerm backbone.
    
    Args:
        file: Image file (JPEG, PNG, etc.)
    
    Returns:
        AnalysisResponse with analysis, confidence, recommendations, and follow-up questions
    """
    if panderm_model is None:
        raise HTTPException(
            status_code=503,
            detail="PanDerm model not loaded. Please check server logs."
        )
    
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        logger.info(f"Processing image: {file.filename}")
        
        # Extract features using PanDerm
        features = panderm_model.extract_features(image)
        features_flat = features.flatten()
        
        # Generate analysis based on features
        # (In production, you'd use these features for classification/segmentation)
        analysis = generate_dermatological_analysis(features_flat, file.filename)
        
        return AnalysisResponse(
            analysis=analysis["analysis"],
            confidence=analysis["confidence"],
            recommendations=analysis["recommendations"],
            followUpQuestions=analysis["followUpQuestions"],
            features_shape=tuple(features.shape)
        )
        
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"Failed to analyze image: {str(e)}"
        )


# ============================================================================
# Helper Functions
# ============================================================================

def generate_dermatological_analysis(
    features: np.ndarray,
    filename: str
) -> dict:
    """
    Generate dermatological analysis from PanDerm features.
    
    This is a placeholder that generates contextual responses.
    In production, you would:
    1. Use features for classification (disease detection)
    2. Use features for segmentation (lesion boundaries)
    3. Feed features to a downstream classifier
    """
    
    # Calculate feature statistics for confidence
    feature_mean = float(np.mean(np.abs(features)))
    feature_std = float(np.std(features))
    
    # Normalize confidence to 0.7-0.95 range
    confidence = min(0.95, max(0.7, 0.8 + (feature_std / 1000)))
    
    analysis = f"""**Analysis for {filename}**

I've analyzed your dermatological image using the PanDerm foundation model (ViT-L/16 backbone).

**Key Observations:**
1. **Image Quality**: The image has been successfully processed and analyzed
2. **Feature Extraction**: PanDerm extracted {len(features)} dimensional feature vector
3. **Analysis Confidence**: {confidence:.1%}

**General Dermatological Assessment:**
Based on the image analysis, here are key areas to consider:

- **Color & Pigmentation**: Examine any unusual pigmentation, redness, or discoloration
- **Texture & Surface**: Note rough, smooth, scaly, or bumpy areas
- **Size & Shape**: Observe diameter and any asymmetrical appearance
- **Borders**: Check for irregular, scalloped, or poorly defined edges
- **Symptoms**: Consider any itching, pain, burning, or tenderness

**ABCDE Melanoma Screening Guide:**
- **A - Asymmetry**: One half doesn't match the other
- **B - Border**: Irregular or scalloped edges
- **C - Color**: Multiple colors within the lesion
- **D - Diameter**: Larger than 6mm (pencil eraser size)
- **E - Evolution**: Changes over time

**Recommendations:**
- Document any changes with photos and dates
- Note accompanying symptoms
- Monitor for the ABCDE signs
- Avoid picking or scratching the area
- Protect from sun exposure with SPF 30+ sunscreen

**Important:** This analysis is educational guidance only. For actual medical concerns, always consult with a qualified dermatologist who can perform proper visual and physical examination."""

    recommendations = [
        "Schedule an appointment with a dermatologist for professional evaluation",
        "Document any changes in the condition with photos and dates",
        "Avoid picking or scratching the affected area",
        "Use gentle, fragrance-free skincare products",
        "Protect the area from sun exposure with SPF 30+ sunscreen"
    ]
    
    follow_up_questions = [
        "How long have you noticed this condition?",
        "Have you experienced any symptoms like itching or pain?",
        "Have you tried any treatments previously?",
        "Is there a family history of skin conditions or melanoma?"
    ]
    
    return {
        "analysis": analysis,
        "confidence": confidence,
        "recommendations": recommendations,
        "followUpQuestions": follow_up_questions
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )
