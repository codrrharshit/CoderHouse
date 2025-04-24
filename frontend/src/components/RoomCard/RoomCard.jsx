import React from "react";
import styles from "./RoomCard.module.css";
import { HOST } from "../../utils/contants";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
    const navigate=useNavigate()
    const getroom=()=>{
        navigate(`/room/${room._id}`)
    }
    
  return (
    <div  onClick={getroom} className={styles.card}>
      <h3 className={styles.topic}>{room.topic}</h3>
      <div className={`${styles.speakers} ${room.speakers.length ===1 ? `${styles.speaker}`:''}`}>
        <div className={styles.avatar}>
          {room.speakers.map((speaker) => (
            <img className={styles.speakerAvatar} key={speaker._id} src={`${HOST}${speaker.avatar}`} alt="" />
          ))}
        </div>
        <div className={styles.names}>
          {room.speakers.map((speaker) => (
            <div key={speaker._id} className={styles.namewrapper}>
              <span >{speaker.name}</span>
              <img src="/images/chat-bubble.png" alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.people}>
        <span>{room.totalPeople}</span>
        <img src="/images/people.png" alt="" />
      </div>
    </div>
  );
};

export default RoomCard;
