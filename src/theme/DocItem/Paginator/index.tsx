import React from 'react';
import {useDoc} from '@docusaurus/theme-common/internal';
import DocPaginator from '@theme/DocPaginator';
import styles from './styles.module.css'


/**
 * This extra component is needed, because <DocPaginator> should remain generic.
 * DocPaginator is used in non-docs contexts too: generated-index pages...
 */
export default function DocItemPaginator(): JSX.Element {
  const {metadata} = useDoc();
  const nextLink = metadata.next?.permalink ?? null
  const title = metadata.next?.title ?? ''

  if(!nextLink) return <></>
  
  return (
    <div className={styles.paginationContainer}>
      <a href={nextLink} target='_self' className={styles.upper}>
        <p>Next</p>
        <img src='/img/FiChevronDown.svg' alt='arrow icon' />
      </a>
      <div className={styles.divider} />
      <div className={styles.bottom}>
        {title}
      </div>
    </div>
  )
  //  <DocPaginator previous={metadata.previous} next={metadata.next} />;
}
