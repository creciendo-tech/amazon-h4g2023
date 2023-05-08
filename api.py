from flask import Flask, request, jsonify
import datetime
import whisper
import json
import numpy as np
from werkzeug.utils import secure_filename
import librosa 
ALLOWED_EXTENSIONS = {"mp3"}

app = Flask(__name__)
model = whisper.load_model("base")


@app.route("/home")
def home():
    return jsonify({"message": "Hello World!"})


@app.route("/verify", methods=["POST"])
def verify():
    req_data = request.get_json()
    return jsonify(req_data)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return {"message": "No file uploaded"}, 400

    file = request.files["file"]
    if file.filename == "":
        return {"message": "No file selected for uploading"}, 400

    if not allowed_file(file.filename):
        return {"message": "Invalid file type"}, 400

    filename = secure_filename(file.filename)
    audio_array, sr = librosa.load(file, sr=16000) # Convert file to np.ndarray object
    result = model.transcribe(audio_array)
    print(result)
    # Rest of the code
    with open("{}.txt".format(filename), "w") as f:
        f.write(result["text"])
    with open("{}.json".format(filename), "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False)
    withTime = {}
    for segment in result["segments"]:
        withTime[str(datetime.timedelta(seconds=segment["start"])).split(".")[0]] = segment["text"]
    with open("{}.json".format("withTime"), "w", encoding="utf-8") as f:
        json.dump(withTime, f, ensure_ascii=False)

    return {"message": "File transcribed successfully"}, 200

if __name__ == "__main__":
    app.run(debug=True)




