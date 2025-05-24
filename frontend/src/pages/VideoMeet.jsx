import React from 'react'
import {useState, useRef,useEffect} from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import "../styles/videoComponent.css";

const server_url = "http://localhost:8000";

const conncetions = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302"}
    ]
}


export default function VideoMeetComponent() {


    var socketRef = useRef();
    let socketIdRef = useRef();

    //own's video screen
    let localVideoRef = useRef();

    //others video  screen true if permission is thr 
    let[videoAvailable, setVideoAvailable]= useState(true);

    //for audio permissions
    let[audioAvailable, setAudioAvailable]= useState(true);

    //hide or show video
    let[video, setVideo] = useState();

    //mute unmute audio
    let[audio, setAudio] = useState();

    let[screen, setScreen] = useState();

    //for popup
    let [showModal, setModal]= useState();

    //for screen sharing
    let[screenAvailable,setScreenAvailable]= useState();


    //for messages
    let[messages, setMessages]= useState([]);


    //for messages we send
    let[message, setMessage]= useState("");


    //for new unread msgs
    let[newMessages, setNewMessages]= useState(0);

    //for guests
    let[askForUsername, setAskForUsername]= useState(true);

    let[username, setUsername]= useState("");

    const videoRef = useRef([]);

    let[videos, setVideos]= useState([]);

    //checking if browser is chromiumm based
    // if(isChrome === false){

    // }

    const getPermissions =  async ()=>{
        try{
            //asking video perm
            const videoPermission = await navigator.mediaDevices.getUserMedia({video: true});

            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            //asking audio perm
              const audioPermission = await navigator.mediaDevices.getUserMedia({audio: true});

            if(audioPermission){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }

            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }

            //ask user for permission
            if(videoAvailable || audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable, audio:audioAvailable});

            if(userMediaStream){
                //stroing media stream globally
                window.localStream = userMediaStream;
                //assing media stream to video element
                if(localVideoRef.current){
                    localVideoRef.current.srcObject = userMediaStream;
                }
            }
        }


        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getPermissions();
    },[]);

    let getuserMediaSuccess = (stream)=>{

    }

    let getUserMedia = ()=>{
        if((video && videoAvailable) || (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video:video, audio: audio})
            .then(getuserMediaSuccess)  //TODO getuserMediaSuccess
            .then((stream)=> {})
            .catch((e)=> console.log(e));
        }else{
            try{
                let tracks = localVideoRef.current.scrObject.getTracks();
                tracks.forEach(track=> track.stop())
            }catch(e){

            }
        }
    }
    useEffect(()=>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    }, [audio, video])


    let getMedia = ()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        // connectToSocketServer();
    }

    let connect = ()=>{
        setAskForUsername(false);
        getMedia();
    }


  return (
    <div>
        {askForUsername === true? 
        <div>
            <h2>Enter into Lobby</h2>
            <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={e=> setUsername(e.target.value)} />
                <Button variant="contained" onClick={connect}>Connect</Button>

                <div>
                    <video ref={localVideoRef} autoPlay muted></video>
                </div>

        </div> : <></>
        }
    </div>
  )
}
