import axios from "axios"
import { HOST } from "../utils/contants"

const apiClient= axios.create({
  baseURL:HOST
})


// we need to impliment the interceptors 
apiClient.interceptors.response.use(
  (config)=>{
    return config;
  },
  async (error)=>{
    const originalRequest=error.config;
    if(error.response.status===401 && error.config && !error.config._isRetry){
      error.config._isRetry=true;
      try {
        const response= await axios.get(`${HOST}/api/auth/refresh`,{withCredentials:true});

        return apiClient.request(originalRequest);
      } catch (error) {
        console.log(error.message);
      }
    }
  }
)


export default apiClient;