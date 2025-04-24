import { verifyToken } from "../utility/Token.js";


export const authMiddleware=(req,res,next)=>{
    try {
        const {accessToken}=req.cookies
        if (!accessToken) {
            return res.status(401).json({ message: 'Unauthorized: No access token' });
          }
        let userData= verifyToken(accessToken)
        if(!userData){
            return res.status(401).json({message:"User data is not available"})
        }
        req.user=userData
        next()
    } catch (error) {
        res.status(401).json({message:"Unauthorized"})
    }
}