import datetime
import whisper
import json
filename = "example"
model = whisper.load_model("base")
result = model.transcribe(f"{filename}.mp3")
print(result)
with open("{}.txt".format(filename), "w") as f:
  f.write(result["text"])

with open("{}.json".format(filename), "w", encoding="utf-8") as f:
  json.dump(result, f, ensure_ascii=False)
withTime = {}

for segment in result["segments"]:
   withTime[str(datetime.timedelta(seconds=segment["start"])).split(".")[0]] = segment["text"]

with open("{}.json".format("withTime"), "w", encoding="utf-8") as f:
  json.dump(withTime, f, ensure_ascii=False)






