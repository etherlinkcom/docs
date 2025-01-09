import React from 'react';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import DocPaginator from '@theme/DocPaginator';
import styles from './styles.module.css'


/**
 * This extra component is needed, because <DocPaginator> should remain generic.
 * DocPaginator is used in non-docs contexts too: generated-index pages...
 */
export default function DocItemPaginator(): JSX.Element {
  const {metadata} = useDoc();
  const prevLink = metadata.previous?.permalink ?? null
  const prevTitle = metadata.previous?.title ?? ''

  const nextLink = metadata.next?.permalink ?? null
  const nextTitle = metadata.next?.title ?? ''

  if(!nextLink) return <></>
  
  return (
    <div className={styles.paginationContainer}>
      {
        prevLink ?   
        <div className={styles.prevContainer}>
          <a href={prevLink} target='_self' className={styles.upper}>
            <img src='/img/FiChevronDown.svg' alt='arrow icon' />
            <p>Prev</p>
          </a>
          <div className={styles.divider} />
          <div className={styles.bottom}>
            {prevTitle}
          </div>
        </div> 
        :
        <div className={styles.disabledPrevContainer}>
          <div className={styles.upper}>
            <img src='/img/DisabledChevronDown.svg' alt='arrow icon' />
            <p>Prev</p>
          </div>
          <div className={styles.dsiabledDivider} />
          <div className={styles.bottom}>
            {metadata.title ?? ''}
          </div>  
        </div>
      }
      <div className={styles.nexContainer}>
        <a href={nextLink} target='_self' className={styles.upper}>
          <p>Next</p>
          <img src='/img/FiChevronDown.svg' alt='arrow icon' />
        </a>
        <div className={styles.divider} />
        <div className={styles.bottom}>
          {nextTitle}
        </div>
      </div>
    </div>
  )
  //  <DocPaginator previous={metadata.previous} next={metadata.next} />;
}
