import { useCallback, useEffect, useRef } from "react";
import { useStateWithCallback } from "./useStateWithCallback";
import { socketInit } from "../socket/socket";
import freeice from "freeice"

export const useWebRTC = ({ roomId, user }) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localStream = useRef(null);
  const socket = useRef(null);
const clientRef = useRef([])

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const ProvideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClient = useCallback(
    (newClient, cb) => {
      const isPresent = clients.find((client) => client._id === newClient._id);
      if (!isPresent) {
        setClients((prev) => [...prev, newClient], cb);
      }
    },
    [clients, setClients]
  );

  useEffect(()=>{
    clientRef.current=clients
  },[clients])
  //capture the media
  useEffect(() => {
    const StartCapture = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,

      });
      localStream.current = stream;
    };

    StartCapture().then(() => {
      addNewClient({...user,muted:true}, () => {
        // we have to get the element
        const localELement = audioElements.current[user._id];
        if (localELement) {
          localELement.volume = 0;
          localELement.srcObject = localStream.current;
          // localELement.play();
        }

        // we need to connect to the socket
        //emit join
        socket.current.emit('join', {roomId,user});
      });
    });

    return ()=>{
        //leaving the room
        localStream.current.getTracks().forEach((track)=>{
            track.stop();
        })
        socket.current.emit('leave',{roomId})
    }
  }, []);

  useEffect(()=>{
    const handlePeer=async ({peerId,createOffer,user:remoteUser})=>{
        if(peerId in connections.current){
            return;
        }
         connections.current[peerId]= new RTCPeerConnection({
            iceServers:freeice()
        })
        // handle new ice candidate
        connections.current[peerId].onicecandidate=(event)=>{
            if(event.candidate){
                socket.current.emit('relay-ice',{
                    peerId,
                    IceCandidate:event.candidate
                })
            }
        }
        //handle track event
        connections.current[peerId].ontrack=({
            streams:[remoteStream]
        })=>{
            if(!audioElements.current[remoteUser._id]){
                addNewClient({...remoteUser,muted:true},()=>{
                    if(audioElements.current[remoteUser._id]){
                        audioElements.current[remoteUser._id].srcObject=remoteStream;
                    }else {
                        let settled= false;
                        const interval= setInterval(()=>{
                            if(audioElements.current[remoteUser._id]){
                                audioElements.current[remoteUser._id].srcObject=remoteStream;
                                settled=true;
                            }
                            if(settled){
                                clearInterval(interval);
                            }
                        },1000)
                    }
                })
            }
        }

        // add local track to remote peer
        localStream.current.getTracks().forEach((track)=>{

            connections.current[peerId].addTrack(track,localStream.current)
        })

        if(createOffer){
            const offer= await connections.current[peerId].createOffer();
            connections.current[peerId].setLocalDescription(offer);
            socket.current.emit('relay-sdp',{
                peerId,
                sessionDescription:offer
            })
        }
    }
    socket.current.on('add_peer',handlePeer)
    return ()=>{
        socket.current.off('add_peer');
    }
  },[])

  const pendingCandidates = useRef({});

useEffect(() => {
  socket.current.on('ice_candidate', async ({ peerId, IceCandidate }) => {
    const connection = connections.current[peerId];

    if (connection) {
      if (connection.remoteDescription && connection.remoteDescription.type) {
        try {
          await connection.addIceCandidate(new RTCIceCandidate(IceCandidate));
        } catch (error) {
          console.error('Error adding received ICE candidate', error);
        }
      } else {
        // Remote description not yet set, queue the ICE candidate
        if (!pendingCandidates.current[peerId]) {
          pendingCandidates.current[peerId] = [];
        }
        pendingCandidates.current[peerId].push(IceCandidate);
      }
    }
  });

  return () => {
    socket.current.off('ice_candidate');
  };
}, []);

  //handle sdp

  useEffect(() => {
    socket.current.on('session-desc', async ({ peerId, sessionDescription: remoteSessionDescription }) => {
      const connection = connections.current[peerId];
      await connection.setRemoteDescription(new RTCSessionDescription(remoteSessionDescription));
  
      if (remoteSessionDescription.type === 'offer') {
        const answer = await connection.createAnswer();
        await connection.setLocalDescription(answer);
        socket.current.emit('relay-sdp', {
          peerId,
          sessionDescription: answer
        });
      }
  
      // Add any queued ICE candidates after remote description is set
      if (pendingCandidates.current[peerId]) {
        for (const candidate of pendingCandidates.current[peerId]) {
          try {
            await connection.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (error) {
            console.error('Error adding queued ICE candidate', error);
          }
        }
        pendingCandidates.current[peerId] = [];
      }
    });
  
    return () => {
      socket.current.off('session-desc');
    };
  }, []);
  

  //handle remove peer
  useEffect(()=>{
    socket.current.on('remove_peer',({peerId,userId})=>{
        if(connections.current[peerId]){
            connections.current[peerId].close();
        }
        delete connections.current[peerId];
        delete audioElements.current[userId];
        setClients((prev)=>prev.filter((client)=>client._id!==userId))
    })
  })


  //handling the mute/unmute events
  useEffect(()=>{
    socket.current.on('mute',({userId})=>{
      setMute(true,userId)
    })

    socket.current.on('unmute',({userId})=>{
      setMute(false,userId)
    })


    const setMute=(mute,userId)=>{
        const clientIdx=clientRef.current.map((client)=>client._id).indexOf(userId);
        const allConnectedClients=JSON.parse(JSON.stringify(clientRef.current));
        if(clientIdx>-1){
          allConnectedClients[clientIdx].muted=mute;
          setClients(allConnectedClients);
        }
    }
  })
  

  const handleMute=(isMute,userId)=>{
    let settled=false;
    if(userId==user._id){
      let interval=setInterval(()=>{
        if(localStream.current){
          localStream.current.getTracks()[0].enabled=!isMute;
          if(isMute){
            socket.current.emit('mute',{roomId,userId})
          }
          else{
            socket.current.emit('unmute',{roomId,userId})
          }
          settled=true
        }

        if(settled){
          clearInterval(interval)
        }
      },200)
    }
  };




  return { clients, ProvideRef,handleMute };
};
