import React, {useState} from 'react';
import ComponentTypes from '@theme/NavbarItem/ComponentTypes';
import type {NavbarItemType, Props} from '@theme/NavbarItem';

function normalizeComponentType(type: NavbarItemType, props: object) {
  // Backward compatibility: navbar item with no type set
  // but containing dropdown items should use the type "dropdown"
  if (!type || type === 'default') {
    return 'items' in props ? 'dropdown' : 'default';
  }
  return type;
}

export default function NavbarItem({type, ...props}: Props): JSX.Element {
  const componentType = normalizeComponentType(type, props);
  const NavbarItemComponent = ComponentTypes[componentType];
  if (!NavbarItemComponent) {
    throw new Error(`No NavbarItem component found for type "${type}".`);
  }
  const [isHovered, setIsHovered] = useState(false);

  const hoverStyle = {
    boxShadow: isHovered ? '0px 0px 6px 0px rgba(56, 255, 156, 0.40)' : 'none',
    transition: 'box-shadow 0.3s ease',
    borderRadius: '8px',
    padding: '4px 8px',
  };

  return (
    <NavbarItemComponent   
      style={hoverStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)} 
      {...(props as any)} 
    />
  ) 
}
