import React from "react";
import { useState, useRef, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import io from "socket.io-client";
import "../styles/videoComponent.css";

const server_url = "http://localhost:8000";

const connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  //own's video screen , useRef to access the dom element
  let localVideoRef = useRef();

  //others video  screen true if permission is thr
  let [videoAvailable, setVideoAvailable] = useState(true);

  //for audio permissions
  let [audioAvailable, setAudioAvailable] = useState(true);

  //hide or show video
  let [video, setVideo] = useState([]);

  //mute unmute audio
  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  //for popup
  let [showModal, setModal] = useState();

  //for screen sharing
  let [screenAvailable, setScreenAvailable] = useState();

  //for messages
  let [messages, setMessages] = useState([]);

  //for messages we send
  let [message, setMessage] = useState("");

  //for new unread msgs
  let [newMessages, setNewMessages] = useState(0);

  //for guests
  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  //checking if browser is chromiumm based
  // if(isChrome === false){

  // }

  const getPermissions = async () => {
    try {
      //asking video perm
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      //asking audio perm
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      //checks if browser allows screen sharing
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      //ask user for permission
      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });

        if (userMediaStream) {
          //stroing media stream globally on window obj.
          window.localStream = userMediaStream;
          //accessing media stream to video element using localVideoRef since there can be rendering delays
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  let getuserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach(track => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addTrack(window.localStream);

      window.localStream.getTracks().forEach((track) => {
        connections[id].addTrack(track, window.localStream);
      });

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ "sdp": connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          //BlackSilence after video off
           let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
           window.localStream = blackSilence();
            window.localStream.getTracks().forEach(track => {
              connections[socketListId].addTrack(track, window.localStream);
            });
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            window.localStream.getTracks().forEach((track) => {
              connections[id].addTrack(track, window.localStream);
            });
            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });

    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getuserMediaSuccess) //TODO getuserMediaSuccess
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketIdRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          "sdp": connections[fromId].localDescription
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  //TODO
  let addMessage = () => {};

  let connectToSocketServer = () => {
    // creating socket connection to server_url
    socketRef.current = io.connect(server_url, { secure: false });

    //listening for signal event from server and handling with gotmsgfrmserver fn
    socketRef.current.on("signal", gotMessageFromServer);

    //when connection established, connect event fires
    socketRef.current.on("connect", () => {
      //custom emit to server , signalling that client wants to join call
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      //removing user that left
      socketRef.current.on("user-left", (id) => {
        setVideo((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        console.log("user-joined event:", id, clients); // <--- ADD THIS

        clients.forEach((socketListId) => {
          console.log("processing client id:", socketListId); // <--- ADD THIS

          //establishing peer to peer connection
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );

          //ice - interactive connectivity establishment , Protocol to find the best path for media data between peers.
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ "ice": event.candidate })
              );
            }
          };

          connections[socketListId].ontrack = (event) => {
            console.log("onaddstream from", socketListId, event.stream);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideo(videos => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {

              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoPlay: true,
                playsInLine: true,
              };

              setVideos(videos => {
                const updatedVideos = [...videos, newVideo];
                console.log("Updated videos state:", updatedVideos);
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            window.localStream.getTracks().forEach((track) => {
              connections[socketListId].addTrack(track, window.localStream);
            });
            //TODO blacksilence when video off
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
           window.localStream = blackSilence();
window.localStream.getTracks().forEach(track => {
  connections[socketListId].addTrack(track, window.localStream);
});
          }
        });

        //checking if our id is equal to current id
        if (id === socketIdRef.current) {
          for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            //if id not equals to current socket id
            try {
              connections[id2].addTrack(window.localStream);
            } catch (e) {}

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  //handshake part
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ "sdp": connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div>
      {askForUsername === true ? (
        <div>
          <h2>Enter into Lobby</h2>
          <TextField
            id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>

          <div>
            <video ref={localVideoRef} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <>
          <video ref={localVideoRef} autoPlay muted></video>

          {videos.map((video) => (
            <div key={video.socketId}>
              <h2>{video.socketId}</h2>
              <video
                data-socket={video.socketId}
                ref={ref => {
                  if (ref && video.stream) {
                    ref.srcObject = video.stream;
                  }
                }}
                autoPlay
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
