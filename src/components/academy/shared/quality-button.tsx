import type Player from 'video.js/dist/types/player';

/**
 * Simple quality selector button for Video.js
 */
export function addQualityButton(player: Player) {
  const qualityLevels = (player as any).qualityLevels();
  
  if (!qualityLevels || qualityLevels.length === 0) {
    console.log('No quality levels available yet');
    return;
  }

  // Create a button element
  const button = document.createElement('button');
  button.className = 'vjs-quality-button vjs-menu-button vjs-menu-button-popup vjs-control vjs-button';
  button.type = 'button';
  button.setAttribute('aria-disabled', 'false');
  button.setAttribute('title', 'Quality');
  button.setAttribute('aria-haspopup', 'true');
  button.setAttribute('aria-expanded', 'false');
  
  // Create the text span (like playback rate button)
  const buttonText = document.createElement('span');
  buttonText.className = 'vjs-quality-value';
  buttonText.textContent = 'Auto';
  button.appendChild(buttonText);

  // Create the menu
  const menu = document.createElement('div');
  menu.className = 'vjs-menu';
  menu.setAttribute('role', 'presentation');
  menu.style.display = 'none';
  
  const menuContent = document.createElement('ul');
  menuContent.className = 'vjs-menu-content';
  menuContent.setAttribute('role', 'menu');
  menu.appendChild(menuContent);
  
  button.appendChild(menu);

  // Update button text based on quality
  const updateButtonText = () => {
    // Check if in auto mode
    let enabledCount = 0;
    let selectedQuality = '';
    
    for (const level of qualityLevels) {
      if (level.enabled) {
        enabledCount++;
        selectedQuality = `${level.height}p`;
      }
    }
    
    if (enabledCount === qualityLevels.length || enabledCount === 0) {
      // Auto mode
      const currentLevel = qualityLevels[qualityLevels.selectedIndex];
      buttonText.textContent = currentLevel ? `Auto` : 'Auto';
    } else if (enabledCount === 1) {
      // Manual mode
      buttonText.textContent = selectedQuality;
    }
  };

  // Build menu items
  const buildMenu = () => {
    menuContent.innerHTML = '';
    
    // Check current selection state
    let isAutoMode = true;
    let selectedHeight = 0;
    for (const level of qualityLevels) {
      if (!level.enabled) {
        isAutoMode = false;
      }
      if (level.enabled && qualityLevels.length > 1) {
        selectedHeight = level.height;
      }
    }
    
    // Auto option
    const autoItem = document.createElement('li');
    autoItem.className = `vjs-menu-item${isAutoMode ? ' vjs-selected' : ''}`;
    autoItem.setAttribute('role', 'menuitemradio');
    autoItem.setAttribute('tabindex', '-1');
    autoItem.innerHTML = '<span class="vjs-menu-item-text">Auto</span>';
    autoItem.onclick = () => {
      // Enable all qualities
      for (const level of qualityLevels) {
        level.enabled = true;
      }
      menu.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
      updateButtonText();
    };
    menuContent.appendChild(autoItem);
    
    // Quality options
    const qualities: any[] = [];
    for (const level of qualityLevels) {
      if (!qualities.find((q: any) => q.height === level.height)) {
        qualities.push(level);
      }
    }
    
    qualities.sort((a, b) => b.height - a.height);
    
    qualities.forEach(level => {
      const item = document.createElement('li');
      const isSelected = !isAutoMode && level.height === selectedHeight;
      item.className = `vjs-menu-item${isSelected ? ' vjs-selected' : ''}`;
      item.setAttribute('role', 'menuitemradio');
      item.setAttribute('tabindex', '-1');
      item.innerHTML = `<span class="vjs-menu-item-text">${level.height}p</span>`;
      item.onclick = () => {
        // Disable all qualities except selected
        for (const ql of qualityLevels) {
          ql.enabled = ql.height === level.height;
        }
        menu.style.display = 'none';
        button.setAttribute('aria-expanded', 'false');
        updateButtonText();
      };
      menuContent.appendChild(item);
    });
  };

  // Toggle menu on click
  button.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Quality button clicked');
    const isOpen = menu.style.display === 'block';
    console.log('Menu currently open:', isOpen);
    
    // Close all other menus first
    const allMenus = player.el().querySelectorAll('.vjs-menu');
    allMenus.forEach((m: Element) => {
      if (m !== menu && m instanceof HTMLElement) {
        m.style.display = 'none';
      }
    });
    
    if (isOpen) {
      menu.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
    } else {
      buildMenu();
      menu.style.display = 'block';
      button.setAttribute('aria-expanded', 'true');
      console.log('Menu opened, items:', menuContent.children.length);
    }
  });

  // Close menu when clicking elsewhere
  const closeMenu = (e: MouseEvent) => {
    if (!button.contains(e.target as Node)) {
      menu.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
    }
  };
  
  document.addEventListener('click', closeMenu);
  player.on('dispose', () => {
    document.removeEventListener('click', closeMenu);
  });

  // Listen for quality changes
  qualityLevels.on('change', updateButtonText);

  // Insert button before fullscreen
  const controlBar = (player as any).controlBar.el();
  const fullscreenControl = controlBar.querySelector('.vjs-fullscreen-control');
  if (fullscreenControl) {
    controlBar.insertBefore(button, fullscreenControl);
  } else {
    controlBar.appendChild(button);
  }

  // Initial update
  setTimeout(updateButtonText, 100);
  
  console.log('Quality button added');
}