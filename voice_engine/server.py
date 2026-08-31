import os
import io
import asyncio
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
import edge_tts
from faster_whisper import WhisperModel
import tempfile
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AgriVeda Multi-Language Speech Engine")

# Allow frontend to call TTS directly if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load highly efficient STT model (runs amazingly fast on CPU/GPU)
# Using "base" for optimal speed/accuracy trade-off on local machines
print("Loading local faster-whisper STT model (base)...")
stt_model = WhisperModel("base", device="cpu", compute_type="int8")
print("Whisper STT loaded successfully.")

# Voice Map using Microsoft Edge TTS Cloud (Ultra-high quality native voices)
# This perfectly matches the requested voice IDs from the Gemma prompt
VOICE_MAP = {
    "ta-female_01": "ta-IN-PallaviNeural",
    "ta-male_01": "ta-IN-ValluvarNeural",
    "hi-female_01": "hi-IN-SwaraNeural",
    "hi-male_01": "hi-IN-MadhurNeural",
    "te-female_01": "te-IN-ShrutiNeural",
    "te-male_01": "te-IN-MohanNeural",
    "en-female_01": "en-IN-NeerjaNeural",
    "en-male_01": "en-IN-PrabhatNeural",
}

@app.post("/api/stt")
async def speech_to_text(audio: UploadFile = File(...)):
    """Convert spoken language (Tamil/Hindi/Telugu/English) to Text using local faster-whisper"""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as tmp:
            tmp.write(await audio.read())
            tmp_path = tmp.name

        # Transcribe with automatic code-switching and language detection
        segments, info = stt_model.transcribe(tmp_path, beam_size=5)
        
        transcript = " ".join([segment.text for segment in segments])
        
        os.unlink(tmp_path)

        return {
            "transcript": transcript.strip(),
            "detected_language": info.language,
            "language_probability": info.language_probability
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tts")
async def text_to_speech(
    text: str = Form(...), 
    language: str = Form("en"), 
    voice_id: str = Form("female_01")
):
    """Convert text into high-quality spoken audio using Neural TTS"""
    try:
        # Resolve requested voice using the map
        key = f"{language}-{voice_id}"
        edge_voice = VOICE_MAP.get(key, VOICE_MAP["ta-female_01"]) # Fallback to Tamil Female if unknown

        # Generate audio using Edge TTS
        communicate = edge_tts.Communicate(text, edge_voice)
        
        audio_data = b""
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_data += chunk["data"]

        return Response(content=audio_data, media_type="audio/mpeg")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
