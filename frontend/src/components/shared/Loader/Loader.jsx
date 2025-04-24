import React from 'react'
import styles from './Loader.module.css'
import Card from '../Card/Card'

const Loader = ({message}) => {
  return (
    <div className={styles.cardwrapper}>
        <Card >
            <img className={styles.image} src="/images/tube-spinner.svg" alt="" />
        <span className={styles.text}>{message}</span>
        </Card>
    </div>
  )
}

export default Loader