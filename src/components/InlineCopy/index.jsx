/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

import CopyButton from '@site/src/components/CopyButton';
import { getAbbreviation } from '@site/src/utils';

// For the abbreviate property, pass two numbers separated by a comma
export default function InlineCopy({ code, href, abbreviate, children }) {
  // If abbreviate, automatically abbreviate the code as an address
  const codeToShow = abbreviate ? getAbbreviation(code, abbreviate) : children || code;
  return (
    <div className={clsx(styles.container)}>
      {href ?
        <Link to={href} className={clsx(styles.link)}>
          <code>{codeToShow}</code>
        </Link>
      :
        <code>{codeToShow}</code>
      }
      <CopyButton code={code} />
    </div>
  );
}
