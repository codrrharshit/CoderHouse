import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import Button from '../../../components/shared/Button/Button'
import styles from "./StepAvatar.module.css"
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setAvatar } from '../../../store/Slice/activateSlice'
import apiClient from '../../../libs'
import { ACTIVATE } from '../../../utils/contants'
import { setAuth } from '../../../store/Slice/authSlice'
import Loader from '../../../components/shared/Loader/Loader'

const StepAvatar = ({onclick}) => {
  const dispatch=useDispatch()
  const {name,avatar}= useSelector(state=>state.activate)
  const [image,setImage]=useState('/images/sample photo.png')
  const [loading,setLoading]=useState(false)

  const captureImage=(e)=>{
    const file= e.target.files[0];
    
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onloadend=()=>{
      setImage(reader.result);
      dispatch(setAvatar(reader.result))
    }
  //   const file=e.target.files[0];
  //   const imageUrl = URL.createObjectURL(file);
  // setImage(imageUrl);
  // dispatch(setAvatar(imageUrl)) 
  }

  const submit=async()=>{
    
    try {
      if(!avatar) return;
      setLoading(true)
      const {data}=await apiClient.post(ACTIVATE,{name,avatar},{withCredentials:true})
    if(data.auth)
    {
      dispatch(setAuth(data))
    }
    } catch (error) {
      console.log(error.message);
    }finally{
      setLoading(false)
    }

  }
  if(loading) return <Loader message="Activation in Progress"/>
  return (
    <Card title=  {`Okay, ${name}!`} icon="monkey">
        <p className={styles.text}>How’s this photo?
        </p>
        <div className={styles.avatarwrapper}>
            <img className={styles.avatarimage} src={image} alt="" />
        </div>
        <div>
          <input id='avatarInput' type="file" className={styles.avatarInput} onChange={captureImage} />
          <label className={styles.avatarlabel} htmlFor="avatarInput">Choose a different photo</label>
        </div>
        <div className={''} >
          <Button text="Next" onclick={submit} />
        </div>
       
      </Card>
  )
}

export default StepAvatar