import React, { useState } from 'react'
import Card from '../../../../components/shared/Card/Card'
import Button from '../../../../components/shared/Button/Button'
import TextInput from '../../../../components/shared/TextInput/TextInput'
import styles from '../StepPhoneEmail.module.css'

const Email = ({onclick}) => {
    const [email,setEmail]=useState('')
  return (
    <Card title="Enter your Email Id" icon="emailLogo">
        <TextInput value={email} onChange={(e)=>setEmail(e.target.value)}/>
    <div className={styles.actionbuttonwrapper}>
      <Button text="Next" onclick={onclick} />
    </div>
    <p className={styles.text}>
    By entering your email, you’re agreeing to our Terms of Service and Privacy Policy. Thanks!
    </p>
  </Card>
  )
}

export default Email