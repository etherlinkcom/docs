import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/DocSidebarItem/Link';

import styles from './styles.module.css';

const ICONS_PATH = ['/img/etherlinkIcon.svg', '/img/HiOutlineStatusOnline.svg', '/img/MdCode.svg', '/img/Gitlab.svg']

const isTopSection = (name: string) => {
  return name === 'Etherlink' || name === 'Documentation' || name === 'Status' || name === 'Developers' || name === 'GitLab'
}

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): JSX.Element {  
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);
  const isInternalLink = isInternalUrl(href);

  return (
    <li
      className={clsx(
        // ThemeClassNames.docs.docSidebarItemLink,
        // ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        // 'menu__list-item',
        // className,
        level === 2 && styles.customLi,
        level === 3 && styles.level3Box
      )}
      style={{
        margin: `${item.label === 'Etherlink' && '40px 0px'}`,
        marginBottom: `${!isInternalLink && isTopSection(item.label) && index === 3 && '40px'}`,
      }}
      key={label}>
      <Link
        className={clsx(
          'menu__link',
          isTopSection(item.label) && styles.menuExternalLink,
          {
            'menu__link--active': isActive,
          },
        )}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        {...(isInternalLink && {
          onClick: onItemClick ? () => onItemClick(item) : undefined,
        })}
        style={{
          marginBottom: `${!isInternalLink && isTopSection(item.label) && '8px'}`,
          backgroundColor: `${!isInternalLink && isTopSection(item.label) &&  '#151515'}`,
          borderRadius: `${!isInternalLink && isTopSection(item.label) &&  '100px'}`,
          padding: `${!isInternalLink && isTopSection(item.label) &&  '10px 16px'}`,
        }}
        {...props}>
        <div className={styles.leftHand}>
          {!isInternalLink && isTopSection(item.label) && <img src={ICONS_PATH[index]} alt='external link icon' />}
          {label}
        </div>
        {!isInternalLink && isTopSection(item.label) && <img src='/img/FiArrowUpRight.svg' alt='external link icon' />}
      </Link>
    </li>
  );
}
