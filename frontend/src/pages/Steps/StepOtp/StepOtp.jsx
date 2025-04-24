import React, { useState } from 'react'
import styles from './StepOtp.module.css'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/Button/Button'
import apiClient from '../../../libs'
import { useSelector } from 'react-redux'
import { VERIFY_OTP } from '../../../utils/contants'
import { useDispatch } from 'react-redux'
import { setAuth } from '../../../store/Slice/authSlice'

const StepOtp = ({onclick}) => {
  const [otp,setOtp]=useState('')
  const {phone,hash}=useSelector(state=>state.auth.otp)
  const dispatch=useDispatch()
  const submit= async()=>{
    if(!otp|| !phone || !hash) return;
  
    const {data}= await apiClient.post(VERIFY_OTP,{otp,phone,hash},{withCredentials:true});
    console.log(data);
    dispatch(setAuth(data))
  }

  return (
    <div className={styles.cardwrapper}>
      <Card title="Enter the code we just text you " icon='lock' >
          <TextInput value={otp} onChange={(e)=>setOtp(e.target.value)}/>
            <div className={styles.actionbuttonwrapper}>
              <Button text="Next" onclick={submit}/>
            </div>
            <p className={styles.text}>
            Didn’t receive? Tap to resend
            </p>
      </Card>

    </div>
  )
}

export default StepOtp