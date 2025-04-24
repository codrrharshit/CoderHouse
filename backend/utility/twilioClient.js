import twilio from "twilio";
import dotenv from "dotenv"
dotenv.config();
const client = twilio(process.env.SMS_SID,process.env.SMS_AUTH_TOKEN,{
    lazyLoading:true
});


export default client;


