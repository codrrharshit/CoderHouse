import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    phone:{
        type:String,
        required:true,
    },
    name:{
        type:String,
    },
    avatar:{
        type:String
    },
    isActivated:{
        type:Boolean,
        required:false,
        default:false
    }
},{timestamps:true});

export const User= mongoose.model('User',userSchema);