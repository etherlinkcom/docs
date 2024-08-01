/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function Video({ src }) {
  return (
    <div className={clsx(styles.container)}>
      <iframe
        className={clsx(styles.iframe)}
        frameBorder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen={true}
        src={src}
      >
      </iframe>
    </div>
  );
}
