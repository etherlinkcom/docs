import React from 'react';
import clsx from 'clsx';
import {
  NavbarSecondaryMenuFiller,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';
import styles from './styles.module.css'

// eslint-disable-next-line react/function-component-definition
const DocSidebarMobileSecondaryMenu = ({
  sidebar,
  path,
}) => {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
      <DocSidebarItems
        items={sidebar}
        activePath={path}
        onItemClick={(item) => {
          // Mobile sidebar should only be closed if the category has a link
          if (item.type === 'category' && item.href) {
            mobileSidebar.toggle();
          }
          if (item.type === 'link') {
            mobileSidebar.toggle();
          }
        }}
        level={1}
      />
      <div className={styles.socialBox}>
        <a href='https://x.com/etherlink' target='_blank'><img src='/img/X.svg' alt='X icon' /></a>
        <a href='https://discord.com/invite/etherlink' target='_blank'><img src='/img/discord.svg' alt='discord icon' /></a>
        <a href='https://gitlab.com/tezos/tezos/-/tree/master/etherlink?ref_type=heads' target='_blank'><img src='/img/Gitlab.svg' alt='Gitlab icon' /></a>
      </div>
    </ul>
  );
};

function DocSidebarMobile(props) {
  return (
    <NavbarSecondaryMenuFiller
      component={DocSidebarMobileSecondaryMenu}
      props={props}
    />
  );
}

export default React.memo(DocSidebarMobile);
