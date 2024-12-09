import React from 'react'
import styles from './styles.module.css'

const Cta = ({title, description, btnText, link, iconUrl}) => {
    const isExternal = link.startsWith('http')

  return (
    <div className={styles.ctaContainer}>
        <img className={styles.bgVector} src='/img/CtaVector.png' alt='bg vector' />
        <div className={styles.textBox}>
            <p className={styles.title}>{title}</p>
            {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.btnBox}>
            <a href={link} target={isExternal ? '_blank' : '_self'}>
                <button className={styles.ctaButton}>
                    {iconUrl && <img src={iconUrl} />}
                    {btnText}
                    {iconUrl && <img src={iconUrl} />}
                </button>
            </a>
        </div>
    </div>
  )
}

export default Cta