/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function InlineCopy({ href }) {
  return (
    <div className={clsx(styles.container)}>
      <code>{href}</code>
      <button
        className={clsx(styles.copy_button)} type="button" aria-label="Copy to clipboard"
        onClick={() => { navigator.clipboard.writeText(href) }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"></path></svg>
      </button>
    </div>
  );
}
