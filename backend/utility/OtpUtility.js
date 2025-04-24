import crypto from "crypto"
import client from "./twilioClient.js";
import { hashOtp } from "./HashUtility.js";

export const generateOtp=async()=>{
    const otp= crypto.randomInt(1000,9999);
    return otp;
}

export const sendBySms= async(phone,otp)=>{
    return await client.messages.create({
        to:phone,
        from:process.env.SMS_NUM,
        body:`Your Coderhouse Code is ${otp}`
    })
}

export const VerifyOtp= (data,hashedOtp)=>{
    const createdHash=hashOtp(data);
    if(createdHash==hashedOtp){
        return true;
    }

    return false;
}