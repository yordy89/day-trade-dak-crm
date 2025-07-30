import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

/**
 * Adds a quality selector menu to the video player
 */
export function addQualitySelector(player: Player) {
  const qualityLevels = (player as any).qualityLevels();
  
  if (!qualityLevels || qualityLevels.length === 0) {
    console.log('No quality levels available yet');
    return;
  }
  
  // Remove existing quality selector if present
  const existingSelector = (player as any).controlBar.qualitySelector;
  if (existingSelector) {
    (player as any).controlBar.removeChild(existingSelector);
    (player as any).controlBar.qualitySelector = null;
  }
  
  console.log(`Adding quality selector with ${qualityLevels.length} levels`);

  // Create quality menu button
  const MenuButton = videojs.getComponent('MenuButton');
  const MenuItem = videojs.getComponent('MenuItem');
  const _Menu = videojs.getComponent('Menu');

  class QualityMenuItem extends MenuItem {
    private qualityLevel: any;
    private qualityLevels: any;

    constructor(playerInstance: Player, options: any) {
      super(playerInstance, options);
      this.qualityLevel = options.qualityLevel;
      this.qualityLevels = options.qualityLevels;
      
      // Set initial selected state
      if (this.qualityLevel) {
        (this as any).selected(this.qualityLevel.enabled);
      }
    }

    handleClick() {
      // If "Auto" is clicked
      if (!this.qualityLevel) {
        // Enable all levels for auto quality
        for (const level of this.qualityLevels) {
          level.enabled = true;
        }
      } else {
        // Manual quality selection - disable all others
        for (const level of this.qualityLevels) {
          level.enabled = level === this.qualityLevel;
        }
      }
      
      // Update selected state for all menu items
      const menu = (this.player() as any).controlBar.qualitySelector.menu;
      const items = menu.children();
      
      items.forEach((item: any) => {
        if (item.qualityLevel === this.qualityLevel) {
          item.selected(true);
        } else {
          item.selected(false);
        }
      });
    }
  }

  class QualityMenuButton extends MenuButton {
    constructor(playerInstance: Player, options: any) {
      super(playerInstance, options);
      (this as any).controlText('Quality');
      
      // Add a visible label to the button
      const buttonEl = (this as any).el();
      const labelEl = document.createElement('span');
      labelEl.className = 'vjs-quality-level-label';
      labelEl.style.cssText = 'font-size: 0.8em; line-height: 3em;';
      buttonEl.appendChild(labelEl);
      
      // Store reference for updates
      (this as any).labelEl = labelEl;
      
      // Update button text when quality changes
      qualityLevels.on('change', () => {
        (this as any).updateButtonText();
      });
      
      // Set initial text
      playerInstance.ready(() => {
        setTimeout(() => {
          (this as any).updateButtonText();
        }, 100);
      });
    }

    updateButtonText() {
      const selectedLevel = qualityLevels[qualityLevels.selectedIndex];
      const labelEl = (this as any).labelEl;
      
      if (selectedLevel && labelEl) {
        labelEl.textContent = `${selectedLevel.height}p`;
        (this as any).controlText(`Quality: ${selectedLevel.height}p`);
      } else if (labelEl) {
        labelEl.textContent = 'Auto';
        (this as any).controlText('Quality: Auto');
      }
    }

    createItems() {
      const items = [];
      
      // Add "Auto" option
      items.push(new QualityMenuItem((this as any).player(), {
        label: 'Auto',
        qualityLevel: null,
        qualityLevels,
        selected: true
      }));
      
      // Group quality levels by height and select best bitrate for each
      const levelsByHeight = new Map();
      
      for (const level of qualityLevels) {
        const height = level.height;
        
        if (!levelsByHeight.has(height) || level.bitrate > levelsByHeight.get(height).bitrate) {
          levelsByHeight.set(height, level);
        }
      }
      
      // Sort by height (descending) and add menu items
      const sortedLevels = Array.from(levelsByHeight.values()).sort((a, b) => b.height - a.height);
      
      console.log('Available quality levels for menu:', sortedLevels.map(l => `${l.height}p`));
      
      sortedLevels.forEach(level => {
        items.push(new QualityMenuItem((this as any).player(), {
          label: `${level.height}p`,
          qualityLevel: level,
          qualityLevels,
          selected: false
        }));
      });
      
      return items;
    }
  }

  // Register components if not already registered
  if (!videojs.getComponent('QualityMenuItem')) {
    videojs.registerComponent('QualityMenuItem', QualityMenuItem);
  }
  if (!videojs.getComponent('QualityMenuButton')) {
    videojs.registerComponent('QualityMenuButton', QualityMenuButton);
  }

  // Add the button to control bar
  const qualitySelector = (player as any).controlBar.addChild('QualityMenuButton', {});
  
  // Position it before the fullscreen button
  const fullscreenIndex = (player as any).controlBar.children().findIndex(
    (child: any) => child.name() === 'FullscreenToggle'
  );
  if (fullscreenIndex > 0) {
    (player as any).controlBar.el().insertBefore(
      qualitySelector.el(),
      (player as any).controlBar.children()[fullscreenIndex].el()
    );
  }
  
  (player as any).controlBar.qualitySelector = qualitySelector;

  console.log('Quality selector added to player');
}