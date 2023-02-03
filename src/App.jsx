import React, { useEffect, useRef, useState } from "react";

function App() {
  const [audioInputs, setAudioInputs] = useState([]);
  const [videoInputs, setVideoInputs] = useState([]);

  const [selectedAudioInput, setSelectedAudioInput] = useState("default");
  const [selectedVideoInput, setSelectedVideoInput] = useState("default");

  const videoRef = useRef(null);
  const photoRef = useRef(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedVideoInput,
          },
          audio: {
            deviceId: selectedAudioInput,
          },
        });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.log(err);
      }
    };
    getMedia();

    const getMediaDevices = async () => {
      try {
        const userDevices = await navigator.mediaDevices.enumerateDevices();
        setAudioInputs(
          userDevices.filter((devices) => devices.kind === "audioinput")
        );
        setVideoInputs(
          userDevices.filter((devices) => devices.kind === "videoinput")
        );
      } catch (err) {
        console.log(err);
      }
    };
    console.log(selectedAudioInput, selectedVideoInput);
    getMediaDevices();
  }, [selectedAudioInput, selectedVideoInput]);

  const takePicture = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext("2d");
    ctx.drawImage(video, 0, 0, width, height);
  };

  return (
    <div className="container">
      <video ref={videoRef} autoPlay />
      <div className="dropdown--container">
        <select
          onChange={(e) => setSelectedAudioInput(e.target.value)}
          value={selectedAudioInput}
        >
          <option value="default">Select Audio Input</option>
          {audioInputs.map((input) => (
            <option value={input.deviceId}>{input.label}</option>
          ))}
        </select>
        <select
          onChange={(e) => setSelectedVideoInput(e.target.value)}
          value={selectedVideoInput}
        >
          <option value="default">Select Video Input</option>
          {videoInputs.map((input) => (
            <option value={input.deviceId}>{input.label}</option>
          ))}
        </select>
      </div>
      <div>
        <button className="button--picture" onClick={takePicture}>
          Take a picture
        </button>
      </div>
      <div className="picture--container">
        <canvas ref={photoRef}></canvas>
      </div>
    </div>
  );
}

export default App;
