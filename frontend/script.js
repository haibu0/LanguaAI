let mediaRecorder = null;
let audioChunks = [];
let mediaStream = null; // Add this to track the stream

// Start recording from the microphone
async function startRecording() {
    try {
        // Ask for microphone access
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStream = stream; // Store the stream

        // Create MediaRecorder to capture audio from the stream
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        // Every time there's audio data, push it to our array
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        // When we stop, combine chunks into one Blob and send to backend
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            console.log("Recorded audio blob:", audioBlob);

            // Stop all tracks to release the microphone
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                mediaStream = null;
            }

            const formData = new FormData();
            formData.append("file", audioBlob, "audio.webm");

            try {
                const response = await fetch("http://localhost:8000/upload-audio", {
                    method: "POST",
                    body: formData,
                });

                const data = await response.json();
                console.log("Server response:", data);
            } catch (error) {
                console.error("Error sending audio to backend:", error);
            }
        };

        // Start recording
        mediaRecorder.start();
        console.log("Recording started...");
    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Could not access microphone. Check permissions.");
    }
}

// Stop recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        console.log("Recording stopped.");
    } else {
        console.log("No active recording to stop.");
    }
}

// Hook up buttons
document.getElementById("startBtn").addEventListener("click", startRecording);
document.getElementById("stopBtn").addEventListener("click", stopRecording);
