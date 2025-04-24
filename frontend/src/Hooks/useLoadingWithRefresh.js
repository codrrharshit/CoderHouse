import { useEffect, useState } from "react";
import { HOST } from "../utils/contants";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/Slice/authSlice";
import axios from "axios";

export const useLoadingWithRefresh=()=>{
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();
    useEffect(()=>{
        (async()=>{
            try {
                setLoading(true);
            const response = await axios.get(`${HOST}/api/auth/refresh`,{withCredentials:true})
            if(response.status===200){
                dispatch(setAuth(response.data))
                setLoading(false);
            }
            } catch (error) {
                setLoading(false)
            }
        })()
    },[])

    return {loading};
}