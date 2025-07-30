'use client'

import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'

const MenuButton = videojs.getComponent('MenuButton')
const MenuItem = videojs.getComponent('MenuItem')

class QualityMenuItem extends MenuItem {
  private qualityLevel: any

  constructor(player: Player, options: any) {
    const label = options.qualityLevel.height ? `${options.qualityLevel.height}p` : 'Auto'
    super(player, {
      ...options,
      label
    })
    this.qualityLevel = options.qualityLevel
  }

  handleClick() {
    // Call parent method if it exists
    if ((MenuItem.prototype as any).handleClick) {
      (MenuItem.prototype as any).handleClick.call(this)
    }
    const qualityLevels = (this as any).player_.qualityLevels()
    
    if ((this as any).options_.qualityLevel.height === 'auto') {
      // Enable all quality levels for auto selection
      for (const level of qualityLevels) {
        level.enabled = true
      }
    } else {
      // Disable all quality levels
      for (const level of qualityLevels) {
        level.enabled = false
      }
      // Enable only the selected quality level
      this.qualityLevel.enabled = true
    }
    
    // Update selected state of all menu items
    const menuItems = (this as any).player_.controlBar.qualitySelector.items
    if (menuItems) {
      menuItems.forEach((item: any) => {
        item.selected(item === this)
      })
    }
  }
}

class QualityMenuButton extends MenuButton {

  constructor(player: Player, options?: any) {
    super(player, options)
    ;(this as any).controlText('Quality')
    
    // Set initial label
    ;(this as any).el().querySelector('.vjs-icon-placeholder')!.innerHTML = 'HD'
    
    player.ready(() => {
      ;(this as any).createItems()
      ;(this as any).update()
    })

    // Listen for quality changes
    ;(player as any).qualityLevels().on('change', () => {
      ;(this as any).updateLabel()
    })
  }

  createItems() {
    const qualityLevels = (this as any).player_.qualityLevels()
    const items = []

    // Add auto option
    items.push(new QualityMenuItem(this.player_, {
      qualityLevel: { height: 'auto' },
      selected: true
    }))

    // Create a unique list of quality levels
    const uniqueLevels = new Map()
    for (const qualityLevel of qualityLevels) {
      if (qualityLevel.height && !uniqueLevels.has(qualityLevel.height)) {
        uniqueLevels.set(qualityLevel.height, qualityLevel)
      }
    }

    // Sort by height (descending) and create menu items
    Array.from(uniqueLevels.values())
      .sort((a, b) => b.height - a.height)
      .forEach(qualityLevel => {
        items.push(new QualityMenuItem(this.player_, {
          qualityLevel,
          selected: false
        }))
      })

    return items
  }

  updateLabel() {
    const qualityLevels = (this as any).player_.qualityLevels()
    let label = 'Auto'
    
    // Check if auto mode is enabled (multiple levels enabled)
    let enabledCount = 0
    let selectedHeight = 0
    
    for (const level of qualityLevels) {
      if (level.enabled) {
        enabledCount++
        selectedHeight = level.height
      }
    }
    
    if (enabledCount === 1) {
      label = selectedHeight ? `${selectedHeight}p` : 'SD'
    } else if (enabledCount > 1) {
      // In auto mode, show current quality
      const currentLevel = qualityLevels[qualityLevels.selectedIndex]
      if (currentLevel?.height) {
        label = `Auto (${currentLevel.height}p)`
      }
    }
    
    ;(this as any).el().querySelector('.vjs-icon-placeholder')!.innerHTML = label
  }
}

// Register the component
videojs.registerComponent('QualityMenuButton', QualityMenuButton)

export function addQualitySelector(player: Player) {
  // Add the quality selector to the control bar
  ;(player as any).controlBar.addChild('QualityMenuButton', {}, 1)
  
  // Store reference for cleanup
  return () => {
    const qualitySelector = (player as any).controlBar.getChild('QualityMenuButton')
    if (qualitySelector) {
      ;(player as any).controlBar.removeChild(qualitySelector)
    }
  }
}
