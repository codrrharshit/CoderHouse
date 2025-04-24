import React, { useState } from "react";
import Card from "../../../../components/shared/Card/Card";
import Button from "../../../../components/shared/Button/Button";
import TextInput from "../../../../components/shared/TextInput/TextInput";
import styles from '../StepPhoneEmail.module.css'
import apiClient from "../../../../libs";
import { SEND_OTP } from "../../../../utils/contants";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../store/Slice/authSlice";


const Phone = ({ onclick }) => {
    const [phoneNumber,setPhoneNumber]=useState('')
    const dispatch= useDispatch();
    const submit=async ()=>{
      if(!phoneNumber) return ;
        const {data}= await apiClient.post(SEND_OTP,{phone:phoneNumber});
        dispatch(setOtp({phone:data.phone,hash:data.hash}));
        console.log(data);
        onclick();
    }
  return (
      <Card title="Enter your phone Number" icon="phone">
        <TextInput value={phoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)}/>
        <div className={styles.actionbuttonwrapper} >
          <Button text="Next" onclick={submit} />
        </div>
        <p className={styles.text}>
        By entering your number, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
        </p>
      </Card>
  );
};

export default Phone;
