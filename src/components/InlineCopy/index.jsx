/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

import CopyButton from '@site/src/components/CopyButton'

export default function InlineCopy({ code }) {
  return (
    <div className={clsx(styles.container)}>
      <code>{code}</code>
      <CopyButton code={code} />
    </div>
  );
}
