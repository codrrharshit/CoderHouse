import React, { useState } from 'react'
import Card from '../../../components/shared/Card/Card'
import TextInput from '../../../components/shared/TextInput/TextInput'
import Button from '../../../components/shared/Button/Button'
import Styles from './StepFullName.module.css'
import { useDispatch } from 'react-redux'
import { setName } from '../../../store/Slice/activateSlice'
import { useSelector } from 'react-redux'

const StepFullName = ({onclick}) => {
  const [fullName,setFullName]=useState(useSelector(state=>state.activate.name))
  const dispatch=useDispatch();
  const submit=()=>{
    if(!fullName){
      return
    }
    console.log({fullName});
    dispatch(setName(fullName))
    onclick()

  }
  return (
    <Card title="What’s your full name?" icon="smiley">
    <TextInput value={fullName} onChange={(e)=>setFullName(e.target.value)}/>
    <p className={Styles.text}>
    People use real names at codershouse :) 
    </p>
    <div className={''} >
      <Button text="Next" onclick={submit} />
    </div>
    
  </Card>
  )
}

export default StepFullName