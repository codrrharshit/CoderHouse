import sharp from "sharp"
import path from "path"
import { fileURLToPath } from 'url';
import { User } from "../Models/user.model.js";
export const activate = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
      return res.status(400).json({ message: "all field are required" });
    }
    // image will be converted into buffer before that we have to replace the string with something else
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

    const imagePath=`${Date.now()}-${Math.round(
        Math.random()*1e9
    )}.png`
    console.log(buffer.length>0);
    try {
        await sharp(buffer).resize(150).toFile(path.resolve(__dirname,`../storage/${imagePath}`))
        console.log("✅ Image resized and saved at:", imagePath);
    } catch (error) {
        return res.status(500).json({error})
    }
    


    // update the user 
    const userId= req.user._id
    let user=await User.findOne({_id:userId})
    if(!user){
        return res.status(400).json({message:"user not found"})
    }
    user.isActivated=true
    user.name=name
    user.avatar=`/storage/${imagePath}`
    user.save()

    return res.status(200).json({user,auth:true});
  } catch (error) {
    return res.status(500).json(error)
  }
};
