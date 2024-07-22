/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

import CopyButton from '@site/src/components/CopyButton';

export default function InlineCopy({ code, href, children }) {
  return (
    <div className={clsx(styles.container)}>
      {href ?
        <Link to={href} className={clsx(styles.link)}>
          <code>{children || code}</code>
        </Link>
      :
        <code>{children || code}</code>
      }
      <CopyButton code={code} />
    </div>
  );
}
