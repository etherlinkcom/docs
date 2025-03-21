import React, { useState } from 'react';
import clsx from 'clsx';

import styles from './styles.module.css';

export default function CollapsibleSection({ children, title }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen((prev) => !prev);
  };

  const currentTitleStyles = clsx(styles.title) + " " + (isOpen ? clsx(styles.titleOpen) : "");

  return (
    <>
      <div className={currentTitleStyles} onClick={toggleSection}>{title}</div>
      {isOpen &&
        <div className={clsx(styles.content)}>{children}</div>
      }
    </>
  )
}