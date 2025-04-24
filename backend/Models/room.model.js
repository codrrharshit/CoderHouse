import mongoose from "mongoose";

const roomSchema= new mongoose.Schema({
    topic:{
        type:String,
        required:true
    },
    type:{
        type:String,
        enum:['open','social','closed'],
        default:'open'

    },
    ownerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    speakers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:false
    }]

},{timestamps:true})

export  const Room= mongoose.model('Room',roomSchema)