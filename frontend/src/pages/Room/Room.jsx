import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../Hooks/useWebRTC";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { GET_ROOM_BY_ID, HOST } from "../../utils/contants";
import styles from "./Room.module.css";
import { useNavigate } from "react-router-dom";
import apiClient from "../../libs/index";


const Room = () => {
  const { roomId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { clients, ProvideRef, handleMute } = useWebRTC({ roomId, user });
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  const [room, setRoom] = useState(null);
  const handleLeave = () => {
    navigate("/rooms");
  };

  // get the room
  useEffect(() => {
    // call the api to get the room through the roomId
    const getRoom = async () => {
      const { data } = await apiClient.get(`${GET_ROOM_BY_ID}${roomId}`, {
        withCredentials: true,
      });
      if (data) {
        setRoom(data.room);
      }
    };
    getRoom();
  }, []);

  useEffect(() => {
    handleMute(isMuted, user._id);
  }, [isMuted]);

  const handleMuteManual = (clientId) => {
    if (clientId !== user._id) return;
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      <div className="container">
        <button onClick={handleLeave} className={styles.goBack}>
          <img src="/images/arrow.png" alt="" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientWrapper}>
        <div className={styles.header}>
          <h2 className={styles.topicName}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/hand.png" alt="" />
            </button>
            <button onClick={handleLeave} className={styles.actionBtn}>
              <img src="/images/peace.png" alt="" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientList}>
          {clients.map((client) => {
            return (
              <div className={styles.clients} key={client._id}>
                <div className={styles.userHead}>
                  <audio
                    ref={(instance) => ProvideRef(instance, client._id)}
                    autoPlay
                  ></audio>
                  <img
                    className={styles.userAvatar}
                    src={`${HOST}${client.avatar}`}
                    alt=""
                  />
                  <button
                    className={styles.micBtn}
                    onClick={() => handleMuteManual(client._id)}
                  >
                    {client.muted ? (
                      <img
                        className={styles.mic}
                        src="/images/mic-mute.png"
                        alt="mic"
                      />
                    ) : (
                      <img
                        className={styles.micImg}
                        src="/images/mic.png"
                        alt="mic"
                      />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Room;
