import React, { useState } from 'react'
import styles from './AddRoomModal.module.css'
import TextInput from '../shared/TextInput/TextInput'
import apiClient from '../../libs'
import { CREATE_ROOM } from '../../utils/contants'
import { useNavigate } from 'react-router-dom'
const AddRoomModal = ({onclose}) => {
    const[type,setType]=useState('open')
    const [topic,setTopic]=useState('')
    const navigate=useNavigate()

    const createRoom=async()=>{
        try {
           // call the api to create the room 
           const {data}= await apiClient.post(CREATE_ROOM,{topic,type},{withCredentials:true})
           console.log(data);
           navigate(`/room/${data.room._id}`)

        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className={styles.modalMask}>
        <div className={styles.modal}>
            <div className={styles.header}>
                <img className={styles.close} src="/images/close.png" alt="" onClick={onclose} />
                <h2>Enter the topic to be disscussed</h2>
                <TextInput fullwidth='true' value={topic} onChange={(e)=>setTopic(e.target.value)}  />

                <div className={styles.roomType}>
                    <h2>Room type</h2>
                    <div className={styles.roomTypewrapper}>
                        <div className={`${styles.typebox} ${type==='open'&& styles.active}`} onClick={()=>setType('open')}>
                            <img src="/images/Globe.png" alt="" />
                            <span>Open</span>
                        </div>
                        <div className={`${styles.typebox} ${type==='social'&& styles.active}`} onClick={()=>setType('social')}>
                            <img src="/images/Users.png" alt="" />
                            <span>Social</span>
                        </div>
                        <div className={`${styles.typebox} ${type==='closed'&& styles.active}`} onClick={()=>setType('closed')}>
                            <img src="/images/Lock (1).png" alt="" />
                            <span>Closed</span>
                        </div>
                    </div>

                </div>


            </div>

            <div className={styles.footer}>
                <h2>Start a room, open to everyone</h2>
                <button onClick={createRoom} className={styles.StartRoomButton}>
                    <img src="/images/celeb.png" alt="" />
                    <span >Let’s Go</span>
                </button>
            </div>
        </div>
    </div>
  )
}

export default AddRoomModal