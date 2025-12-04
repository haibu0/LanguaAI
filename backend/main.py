from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend (browser) to talk to this backend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for local dev, tighten later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "LanguaAI backend running!"}

@app.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    # Read the raw bytes from the uploaded file
    content = await file.read()
    size = len(content)

    print(f"Received audio file: {file.filename}")
    print(f"Content type: {file.content_type}")
    print(f"Size in bytes: {size}")

    # For now, just confirm we got it
    return {
        "message": "Audio received",
        "filename": file.filename,
        "content_type": file.content_type,
        "size_bytes": size,
    }
