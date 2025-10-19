import React from 'react';
import MenuItem from './MenuItem';

/**
 * Navigation Menu Component
 * Renders the list of menu items
 */
const NavigationMenu = ({ 
  menuItems, 
  activeItem, 
  openSubmenus, 
  onNavClick, 
  onToggleSubmenu, 
  isRTL 
}) => {
  return (
    <nav className="flex-1 overflow-y-auto mt-6 px-4" role="menubar">
      <ul className="space-y-2" role="none">
        {menuItems.map((item) => (
          <li key={item.id} role="none" className='cursor-pointer'>
            <MenuItem
              item={item}
              activeItem={activeItem}
              openSubmenus={openSubmenus}
              onNavClick={onNavClick}
              onToggleSubmenu={onToggleSubmenu}
              isRTL={isRTL}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
