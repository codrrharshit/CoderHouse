import { Room } from "../Models/room.model.js";

export const createRoom= async(req,res)=>{
    try {
        const {topic,type}=req.body
        if(!topic || !type){
            return res.status(400).json({message:"All fields are required"});
        }

        // we have to create the room and store in the database
        const room = await Room.create({
            topic,
            type,
            ownerId:req.user._id,
            speakers:[req.user._id]
        })
        if(!room){
            return res.status(400).json({message:"Room not created"})
        }
        //we have to populate the room with the user data 
        const populatedRoom = await Room.findById(room._id).populate('ownerId','name avatar').populate('speakers','name avatar')
        if(!populatedRoom){
            return res.status(400).json({message:'Room not found'})
        }
        return res.status(200).json({room:populatedRoom})
        
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
}

export const getRoom = async(req,res)=>{
    try {
        // we need to call the room database and get the room data
        const rooms= await Room.find({}).populate('ownerId','name avatar').populate('speakers','name avatar')
        if(!rooms){
            return res.status(400).json({message:"No rooms found"});
        }
        return res.status(200).json({rooms})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}

export const getRoomById= async(req,res)=>{
    try {
        const {roomId}=req.params
        if(!roomId){
            return res.status(400).json({message:"Room id is required"})
        }
        // we need to call the room database and get the room data
        const room = await Room.findById(roomId).populate('ownerId','name avatar').populate('speakers','name avatar')
        if(!room){
            return res.status(400).json({message:"Room not found"});
        }
        return res.status(200).json({room})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}