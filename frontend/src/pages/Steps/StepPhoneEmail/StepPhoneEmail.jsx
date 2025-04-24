import React, { useState } from "react";
import Phone from "./Phone/Phone";
import Email from "./Email/Email";
import styles from "./StepPhoneEmail.module.css";

const types = {
  phone: Phone,
  email: Email,
};

const StepPhoneEmail = ({ onclick }) => {
  const [type, setType] = useState("phone");
  const Type = types[type];


  return (
    <div className={styles.cardwrapper}>
      <div>
        <div className={styles.buttonwrapper}>
          <button className={`${styles.tabButton} ${type=='phone'?styles.active:''}`} onClick={() => setType("phone")}>
            <img src="/images/phone_android.png" alt="phone" />
          </button>
          <button className={`${styles.tabButton} ${type=='email'?styles.active:''}`} onClick={() => setType("email")}>
            <img src="/images/emalVector.png" alt="email" />
            </button>
        </div>
        <Type onclick={onclick} />
      </div>
    </div>
  );
};

export default StepPhoneEmail;
