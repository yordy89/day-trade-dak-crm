import videojs from 'video.js';
import type Player from 'video.js/dist/types/player';

/**
 * Enhanced quality selector that matches Video.js button styling
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

  const MenuButton = videojs.getComponent('MenuButton');
  const MenuItem = videojs.getComponent('MenuItem');

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
        console.log('Switched to Auto quality');
      } else {
        // Manual quality selection - disable all others
        for (const level of this.qualityLevels) {
          level.enabled = level === this.qualityLevel;
        }
        console.log(`Forced quality to ${this.qualityLevel.height}p`);
      }
      
      // Update button text
      const button = (this.player() as any).controlBar.getChild('QualityMenuButton');
      if (button) {
        button.updateButtonText();
      }
    }
  }

  class QualityMenuButton extends MenuButton {
    constructor(playerInstance: Player, options: any) {
      super(playerInstance, options);
      (this as any).controlText('Quality');
      
      // Style the button to match playback rate button
      (this as any).addClass('vjs-quality-button');
      
      // Create button content element
      const buttonText = document.createElement('div');
      buttonText.className = 'vjs-quality-button-text';
      buttonText.textContent = 'Auto';
      (this as any).el().appendChild(buttonText);
      
      // Update button text when quality changes
      qualityLevels.on('change', () => {
        (this as any).updateButtonText();
      });
      
      // Set initial text after a delay
      setTimeout(() => {
        (this as any).updateButtonText();
      }, 100);
    }

    updateButtonText() {
      const buttonText = (this as any).el().querySelector('.vjs-quality-button-text');
      if (!buttonText) return;
      
      // Check if auto mode (all qualities enabled)
      let isAuto = true;
      for (const level of qualityLevels) {
        if (!level.enabled) {
          isAuto = false;
          break;
        }
      }
      
      if (isAuto) {
        // In auto mode, show current quality
        const selectedLevel = qualityLevels[qualityLevels.selectedIndex];
        if (selectedLevel) {
          buttonText.textContent = `Auto (${selectedLevel.height}p)`;
        } else {
          buttonText.textContent = 'Auto';
        }
      } else {
        // In manual mode, show the selected quality
        for (const level of qualityLevels) {
          if (level.enabled) {
            buttonText.textContent = `${level.height}p`;
            break;
          }
        }
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
          qualityLevels: qualityLevels,
          selected: false
        }));
      });
      
      return items;
    }

    // Override buildCSSClass to add custom class
    buildCSSClass() {
      return `vjs-quality-button ${super.buildCSSClass()}`;
    }
  }

  // Register components
  videojs.registerComponent('QualityMenuItem', QualityMenuItem);
  videojs.registerComponent('QualityMenuButton', QualityMenuButton);

  // Add the button to control bar
  const qualityButton = (player as any).controlBar.addChild('QualityMenuButton', {});
  
  // Position after playback rate button
  const playbackRateButton = (player as any).controlBar.getChild('PlaybackRateMenuButton');
  if (playbackRateButton) {
    (player as any).controlBar.el().insertBefore(
      qualityButton.el(),
      playbackRateButton.el().nextSibling
    );
  }
  
  (player as any).controlBar.qualitySelector = qualityButton;

  console.log('Quality selector added to player');
}