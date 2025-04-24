import React from 'react'
import { Link } from 'react-router-dom'
import styles from  "./Navigation.module.css"
import apiClient from '../../../libs'
import { HOST, LOGOUT } from '../../../utils/contants'
import { useDispatch, useSelector } from 'react-redux'
import { setAuth } from '../../../store/Slice/authSlice'

function Navigation() {
    const brandStyle={
        color:'#fff',
        textDecoration:'none',
        fontWeight:'bold',
        fontSize:'22px',
        display:'flex',
        alignItems:'center',
    }

    const logoText={
        marginLeft:'10px',
    }
    const {isAuth,user}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();
    const logoutUser=async()=>{
        try {
            // call the api
            const response =await apiClient.get(LOGOUT,{withCredentials:true});
            // now we need to dispatch the action to remove the user from the store 
            console.log(response.data);
            dispatch(setAuth(response.data))
            
        } catch (error) {
            console.log(error.message);
        }
    }
  return (
   <nav className={`${styles.navbar} container`}>
    <Link style={brandStyle} to="/">
        <img  src="/images/Emoji (1).png" alt="" />
        <span style={logoText}>CoderHouse</span>
    </Link>
    {isAuth&& <div className={styles.navbarRight}>
        <span className={styles.text}>{user.name}</span>
        <img className={styles.avatar} src={user.avatar?`${HOST}${user.avatar}`:'/images/sample photo.png'}  alt="" />
        <button className={styles.buttonLog} onClick={logoutUser}>
            <img className={styles.buttonImg} src="/images/logout.png" alt="" />
        </button>
    </div>}
    {/* {isAuth && <button onClick={logoutUser}>Logout</button>} */}
   </nav>
  )
}

export default Navigation