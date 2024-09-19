import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/TOCItems/Tree';
import { useLocation } from '@docusaurus/router';

// Recursive component rendering the toc tree
function TOCItemTree({
  toc,
  className,
  linkClassName,
  isChild,
}: Props): JSX.Element | null {
  if (!toc.length) {
    return null;
  }
  const location = useLocation();
  
  return (
    <ul className={isChild ? undefined : className}>
      {toc.map((heading) => {
        const isActive = location.hash.replace('#', '') === heading.id; 

        return (
        <li 
          key={heading.id}
          style={{ color: isActive ? '#38FF9C' : '#FFFFFF' }} 
        >
          <Link
            to={`#${heading.id}`}
            style={{ color: isActive ? '#38FF9C' : '#FFFFFF' }} 
            className={linkClassName ?? undefined}
            // Developer provided the HTML, so assume it's safe.
            dangerouslySetInnerHTML={{__html: heading.value}}
          />
          <TOCItemTree
            isChild
            toc={heading.children}
            className={className}
            linkClassName={linkClassName}
          />
        </li>
      )
    })}
    </ul>
  );
}

// Memo only the tree root is enough
export default React.memo(TOCItemTree);
