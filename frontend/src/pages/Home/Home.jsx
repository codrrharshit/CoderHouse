import React from "react";
import { Link ,useNavigate} from "react-router-dom";
import styles from "./Home.module.css";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

function Home() {
    const signinlinkstyle={
        color:'#0077FF',
        fontWeight:'bold',
        textDecoration:'none',
        marginLeft:'10px'
    }
    const navigate=useNavigate();

    const startRegister=()=>{
        navigate('/authenticate');
    }

  return (
    <div className={`${styles.cardwrapper}`}>
      <Card title="Welcome to Coderhouse!" icon="Emoji (1)">
        <p className={`${styles.text}`}>
          We’re working hard to get Codershouse ready for everyone! While we
          wrap up the finishing youches, we’re adding people gradually to make
          sure nothing breaks
        </p>
        <div>
           <Button onclick={startRegister} text="Lets Go"/>
        </div>
        <div className={`${styles.signinwrapper}`}>
            <span className={`${styles.hasinvite}`}>Have an invite text?</span>
        </div>
      </Card>
     
    </div>
  );
}

export default Home;
