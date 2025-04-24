import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS, {
    expiresIn: "30s",
  });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH, {
    expiresIn: "1y",
  });

  return {accessToken,refreshToken};
};

export const verifyToken = (token)=>{
    return  jwt.verify(token,process.env.JWT_ACCESS);
}

export const verifyRefreshToken =(token)=>{
  return jwt.verify(token,process.env.JWT_REFRESH)
}
