import React from 'react';
// import Logo from '@theme/Logo';
import styles from './styles.module.css'

export default function NavbarLogo() {
  return (
    <a href='/'>
      <img className={styles.logoImage} src='/img/Etherlink-Docs-Logo.svg' alt='logo' />
    </a>
  );
}
