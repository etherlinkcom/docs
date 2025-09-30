import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import type {Props} from '@theme/DocSidebarItem/Link';

import { sidebarOffset } from '../../constants';

import styles from './styles.module.css';

const ICONS_PATH = ['/img/etherlinkIcon.svg', '/img/HiTestnetAnnouncement.svg', '/img/map_green.png', '/img/HiOutlineStatusOnline.svg', '/img/MdCode.svg', '/img/Gitlab.svg']

const isTopSection = (name: string) => {
  return name === 'Etherlink' || name === 'Documentation' || name === 'Documentation map' || name === 'Status' || name === 'Developers' || name === 'GitLab' || name === 'Testnet migration'
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
        margin: `${(item.label === 'Etherlink' || item.label === 'Testnet migration')&& '40px 0px'}`,
        marginBottom: `${isTopSection(item.label) && index === sidebarOffset && '40px'}`,
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
          marginBottom: `${(index <= sidebarOffset) && isTopSection(item.label) && '8px'}`,
          backgroundColor: `${(index <= sidebarOffset) && isTopSection(item.label) &&  '#151515'}`,
          borderRadius: `${(index <= sidebarOffset) && isTopSection(item.label) &&  '100px'}`,
          padding: `${(index <= sidebarOffset) && isTopSection(item.label) &&  '10px 16px'}`,
        }}
        {...props}>
        <div className={styles.leftHand}>
          {(index <= sidebarOffset) && isTopSection(item.label) && <img src={ICONS_PATH[index]} alt='external link icon' />}
          {label}
        </div>
        {(index <= sidebarOffset) && isTopSection(item.label) && <img src='/img/FiArrowUpRight.svg' alt='external link icon' />}
      </Link>
    </li>
  );
}
