import React, { useEffect, useState } from "react";
import styles from "./Rooms.module.css";
import RoomCard from "../../components/RoomCard/RoomCard";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import apiClient from "../../libs";
import { GET_ROOM } from "../../utils/contants";
import Loader from "../../components/shared/Loader/Loader";



const Rooms = () => {
  const [modal,setModal]=useState(false)
  const [rooms,setRooms]=useState([])
  const [loading,setLoading]=useState(false)
  useEffect(()=>{
    // we need to call the api to get the rooms
    const getRooms= async()=>{
      setLoading(true)
      try {
        const {data}= await apiClient.get(GET_ROOM,{withCredentials:true})
        setRooms(data.rooms)
      } catch (error) {
        console.log(error.message);
      }finally{
        setLoading(false)
      }
    }
    getRooms()
  },[])
  return loading?<Loader message={"loading rooms...."}/> :(
    <div className="container">
      <div className={styles.roomheader}>
        <div className={styles.Left}>
          <span className={styles.heading}>All Voice Rooms</span>
          <div className={styles.searchBar}>
              <img className={styles.searchImg} src="/images/search.png" alt="" />
              <input className={styles.searchInput} type="text" />
          </div>
        </div>
        <div className={styles.Right}>
          <button onClick={()=>setModal(true)} className={styles.startRoomButton}>
            <img src="/images/Group 24.png" alt="" />
            <span className={styles.buttonSpan}>Start a Room</span>
          </button>
        </div>
      </div>


      <div className={styles.roomList}>
          {
            rooms.map((room)=> <RoomCard key={room._id} room={room}/>)
          }
      </div>

      {modal &&<AddRoomModal onclose={()=>setModal(false)}/>} 
    </div>
  );
};

export default Rooms;
