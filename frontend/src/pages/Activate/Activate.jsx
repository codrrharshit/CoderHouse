import React, { useState } from 'react'
import StepFullName from "../Steps/StepFullName/StepFullName"
import StepAvatar from "../Steps/StepAvatar/StepAvatar"
import styles from "./Activate.module.css"

const steps={
  1:StepFullName,
  2:StepAvatar
}

const Activate = () => {
  const [step,setStep]=useState(1)
  const Step=steps[step];
  const next=()=>{
    setStep(step+1)
  }

  return (
    <div className={styles.cardwrapper}><Step onclick={next}/></div>
  )
}

export default Activate