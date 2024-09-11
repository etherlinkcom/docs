import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/MDXComponents/A';
import styles from './styles.module.css'

export default function MDXA(props: Props): JSX.Element {
  return <Link className={styles.externalLink} {...props} />;
}
