import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth:false,
    user:null,
    otp:{
        phone:"",
        hash:""
    }
  },
  reducers: {
    
    setAuth: (state,action)=> {
        const {user}=action.payload
        state.user=user
        if(user===null){
          state.isAuth=false;
        }
        else {
          state.isAuth=true
        }
    },
    setOtp:(state,action)=>{
        const {phone,hash}=action.payload
        state.otp.phone=phone
        state.otp.hash=hash
    }
  }
})

// Action creators are generated for each case reducer function
export const { setAuth,setOtp} = authSlice.actions

export default authSlice.reducer