"use client"
import React, { useState, useRef } from 'react';

const VoiceRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioClips, setAudioClips] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleButtonClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.addEventListener('dataavailable', handleDataAvailable);
      recorder.start();
      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.removeEventListener('dataavailable', handleDataAvailable);
      mediaRecorder.stop();
      const recordedBlob = new Blob(recordedChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(recordedBlob);
      setAudioClips((prevClips) => [...prevClips, audioUrl]);
      setRecordedChunks([]);
    }
  };

  const handlePlaybackClick = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch((error) => {
      console.error('Error playing audio:', error);
    });
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <span>Recording...</span>}
      {audioClips.map((audioUrl, index) => (
        <div key={index}>
          <button onClick={() => handlePlaybackClick(audioUrl)}>Play Clip {index + 1}</button>
        </div>
      ))}
      <audio ref={audioRef} controls />
    </div>
  );
};

export default VoiceRecorder;
