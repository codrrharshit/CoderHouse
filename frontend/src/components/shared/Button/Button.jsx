import React from "react";
import styles from "./Button.module.css";

const Button = ({text,onclick}) => {
  return (
    <button className={`${styles.button}`} onClick={onclick}>
      <span>{text}</span>
      <img className={`${styles.arrow}`} src="/images/arrow_forward.png" alt="" />
    </button>
  );
};

export default Button;
