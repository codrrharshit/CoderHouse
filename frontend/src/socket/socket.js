import {io} from "socket.io-client";


 export const socketInit=()=>{
    const options={
        reconnection:true,
        reconnectionAttempts:Infinity,
        reconnectionDelay:1000,
        timeout:10000,
        transport:["websocket"]
    }
    return io("http://localhost:5500",options)
}