
import { Refresh } from "../Models/refresh.model.js";
import { User } from "../Models/user.model.js";
import { hashOtp } from "../utility/HashUtility.js";
import { generateOtp,sendBySms, VerifyOtp} from "../utility/OtpUtility.js";
import { generateToken, verifyRefreshToken } from "../utility/Token.js";

export const  sendOtp = async(req,res)=>{
    try {
        const {phone}=req.body;
        if(!phone){
            return  res.status(400).json({message:"Phone Number is required"});
        }
        const otp= await generateOtp();
        const ttl= 1000*60*2;
        const expiry= Date.now()+ttl;
        const data=`${phone}.${otp}.${expiry}`
        const hash= hashOtp(data);

        //await sendBySms(phone,otp)

        return res.status(200).json({success:true,otp:otp,phone:phone,hash:`${hash}.${expiry}`});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server error")
    }
}

export const verifyOtp=async(req,res)=>{
    try {
        const {otp,hash,phone}= req.body;
        if(!otp || !hash || !phone){
            return res.status(400).json({message:"All fields are required"});

        }

        const [hashedOtp,expiry]=hash.split('.');
        if(Date.now()>+expiry){
            return res.status(400).json({message:"otp expired"});
        }

        const data=`${phone}.${otp}.${expiry}`
        const isValid= VerifyOtp(data,hashedOtp);
        if(!isValid){
            return res.status(400).json({message:'Otp Invalid'});
        }

        let user;
        user= await User.findOne({phone});
        if(!user){
            // we have to create the user 
            user=await User.create({phone});
        }

       const {accessToken,refreshToken}=generateToken({_id:user._id,isActivated:false})
       // we need to store the refresh token in the database 
       await Refresh.create({token:refreshToken,userId:user._id});
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24*30,
            httpOnly:true
        })
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24*30,
            httpOnly:true
        })

        return res.json({auth:true,user});

        
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal server error")
    }
}

export const refresh= async(req,res)=>{
    try {

        const {refreshToken:refreshTokenfromCookie}=req.cookies;
        // verify the token 
        let userData=verifyRefreshToken(refreshTokenfromCookie);
        if(!userData){
            return res.status(400).json({message:"Invalid Refresh token"});
        }
        // check if the token is present in the database 
        const token= await Refresh.findOne({token:refreshTokenfromCookie,userId:userData._id})
        if(!token){
            return res.status(400).json({message:"Invalid Refresh token"});
        }
        // check user is valid or not 
        let user = await User.findOne({_id:userData._id})
        if(!user){
            return res.status(400).json({message:"user not found"});
        }
        //generate new token
        const {accessToken,refreshToken}=generateToken({_id:user._id,isActivated:user.isActivated});
        //update the refresh token in the database 
        await Refresh.updateOne({userId:user._id},{token:refreshToken})
        //set the cookies 
        res.cookie('refreshToken',refreshToken,{
            maxAge:1000*60*60*24*30,
            httpOnly:true,
        })
        res.cookie('accessToken',accessToken,{
            maxAge:1000*60*60*24*30,
            httpOnly:true,
        })
        return res.status(200).json({auth:true,user});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}

export const logout=async(req,res)=>{
    // get the refresh token from the cookie 
    try {
        const {refreshToken}= req.cookies;
    if(!refreshToken){
        return res.status(200).json({message:"Token not found"});
    }
    // delete the refersh token from the database 
    await Refresh.deleteOne({token:refreshToken});
    // clear the cookies 
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return res.status(200).json({message:"Logout successfully",user:null})
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
}