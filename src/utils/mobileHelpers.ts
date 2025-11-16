/**
 * 🎯 MOBILE HELPERS - DIRECT BORDER RADIUS FIXES
 * 
 * Aggressive utility functions to directly fix border radius issues on mobile
 */

/**
 * Check if element should be skipped (featured products or circular elements)
 */
const shouldSkipElement = (element: Element): boolean => {
  // Skip featured products
  if (element.classList.contains('featured-product') ||
      element.closest('.featured-product') ||
      element.className.includes('featured-product')) {
    return true;
  }
  
  // Skip circular elements
  const styles = window.getComputedStyle(element);
  const borderRadius = styles.borderRadius;
  if (borderRadius === '50%' || borderRadius.includes('50%') ||
      element.classList.contains('rounded-full') ||
      element.className.includes('rounded-full')) {
    return true;
  }
  
  return false;
};

/**
 * Find all elements with border radius between 3px and 24px
 */
export const findProblematicBorderRadius = (): Element[] => {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return [];
  
  const allElements = document.querySelectorAll('*');
  const problematicElements: Element[] = [];
  
  allElements.forEach(element => {
    if (shouldSkipElement(element)) return;
    
    const styles = window.getComputedStyle(element);
    const borderRadius = styles.borderRadius;
    
    // Check if element has border radius
    if (borderRadius && borderRadius !== 'none' && borderRadius !== '0px') {
      // Parse all border radius values (border-radius can have multiple values)
      const radiusValues = borderRadius.split(' ').map(val => parseFloat(val));
      
      // Check if any value is in the problematic range (3px - 24px)
      const hasProblematicRadius = radiusValues.some(val => 
        !isNaN(val) && val >= 3 && val <= 24
      );
      
      if (hasProblematicRadius) {
        problematicElements.push(element);
      }
    }
  });
  
  return problematicElements;
};

/**
 * Automatically fix border radius issues on mobile with aggressive approach
 */
export const fixMobileBorderRadius = (): number => {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) {
    console.log('🎯 Not mobile viewport, skipping border radius fix');
    return 0;
  }
  
  let fixedCount = 0;
  
  // First, try the targeted approach
  const problematicElements = findProblematicBorderRadius();
  
  problematicElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.style.borderRadius = '8px';
    htmlElement.style.setProperty('border-radius', '8px', 'important');
    fixedCount++;
  });
  
  // Then, apply aggressive universal fix
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    if (shouldSkipElement(element)) return;
    
    const htmlElement = element as HTMLElement;
    const styles = window.getComputedStyle(element);
    const borderRadius = styles.borderRadius;
    
    // If element has any border radius that's not 8px or circular, fix it
    if (borderRadius && borderRadius !== 'none' && borderRadius !== '0px') {
      if (!borderRadius.includes('50%') && borderRadius !== '8px') {
        htmlElement.style.setProperty('border-radius', '8px', 'important');
        fixedCount++;
      }
    }
  });
  
  console.log(`🎯 Fixed ${fixedCount} elements with border radius issues`);
  return fixedCount;
};

/**
 * Add visual debugging to problematic elements
 */
export const debugBorderRadius = (): void => {
  const problematicElements = findProblematicBorderRadius();
  
  problematicElements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add('debug-border-radius');
    
    // Add tooltip with current border radius
    const styles = window.getComputedStyle(element);
    htmlElement.title = `Border Radius: ${styles.borderRadius}`;
  });
  
  console.log(`🎯 Found ${problematicElements.length} elements with problematic border radius`);
  console.log('Elements marked with red outline and tooltip');
};

/**
 * Remove debug styling
 */
export const clearBorderRadiusDebug = (): void => {
  const debugElements = document.querySelectorAll('.debug-border-radius');
  debugElements.forEach(element => {
    element.classList.remove('debug-border-radius');
    (element as HTMLElement).removeAttribute('title');
  });
  
  console.log('🎯 Debug styling cleared');
};

/**
 * Report on border radius usage across the app
 */
export const reportBorderRadiusUsage = (): void => {
  const allElements = document.querySelectorAll('*');
  const report: Record<string, number> = {};
  
  allElements.forEach(element => {
    const styles = window.getComputedStyle(element);
    const borderRadius = styles.borderRadius;
    
    if (borderRadius && borderRadius !== 'none' && borderRadius !== '0px') {
      if (report[borderRadius]) {
        report[borderRadius]++;
      } else {
        report[borderRadius] = 1;
      }
    }
  });
  
  console.log('🎯 Border Radius Usage Report:');
  console.table(report);
  
  return report;
};

/**
 * Apply mobile class to body based on viewport
 */
export const updateMobileClass = (): void => {
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    document.body.classList.add('mobile');
    document.body.classList.remove('desktop');
  } else {
    document.body.classList.add('desktop');
    document.body.classList.remove('mobile');
  }
};

// Mutation observer for continuous border radius fixing
let borderRadiusObserver: MutationObserver | null = null;

/**
 * Start continuous border radius monitoring on mobile
 */
const startBorderRadiusMonitoring = (): void => {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) return;
  
  // Stop existing observer
  if (borderRadiusObserver) {
    borderRadiusObserver.disconnect();
  }
  
  // Create new observer
  borderRadiusObserver = new MutationObserver((mutations) => {
    let needsFix = false;
    
    mutations.forEach((mutation) => {
      // Check for added nodes
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          needsFix = true;
        }
      });
      
      // Check for attribute changes (style changes)
      if (mutation.type === 'attributes' && 
          (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
        needsFix = true;
      }
    });
    
    if (needsFix) {
      setTimeout(() => fixMobileBorderRadius(), 50);
    }
  });
  
  // Start observing
  borderRadiusObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class']
  });
  
  console.log('🎯 Started continuous border radius monitoring');
};

/**
 * Stop border radius monitoring
 */
const stopBorderRadiusMonitoring = (): void => {
  if (borderRadiusObserver) {
    borderRadiusObserver.disconnect();
    borderRadiusObserver = null;
    console.log('🎯 Stopped border radius monitoring');
  }
};

/**
 * Initialize mobile helpers with optimized asynchronous loading
 */
export const initializeMobileHelpers = (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      // Minimal initialization - just set mobile class
      updateMobileClass();
      
      // Add debug functions only in development
      if (process.env.NODE_ENV === 'development') {
        (window as any).findProblematicBorderRadius = findProblematicBorderRadius;
        (window as any).fixMobileBorderRadius = fixMobileBorderRadius;
        (window as any).debugBorderRadius = debugBorderRadius;
        (window as any).clearBorderRadiusDebug = clearBorderRadiusDebug;
        (window as any).reportBorderRadiusUsage = reportBorderRadiusUsage;
        (window as any).startBorderRadiusMonitoring = startBorderRadiusMonitoring;
        (window as any).stopBorderRadiusMonitoring = stopBorderRadiusMonitoring;
        (window as any).forceMobileBorderRadius = forceMobileBorderRadius;
        (window as any).emergencyFixAllElements = emergencyFixAllElements;
        (window as any).highlightProblematicElements = highlightProblematicElements;
        (window as any).clearHighlighting = clearHighlighting;
      }
      
      // Defer heavy operations
      setTimeout(() => {
        // Add resize listener
        let resizeTimeout: number;
        const handleResize = () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(updateMobileClass, 250);
        };
        window.addEventListener('resize', handleResize);
        
        // Start monitoring if mobile (heavily deferred)
        if (window.innerWidth < 768) {
          setTimeout(() => {
            startBorderRadiusMonitoring();
            fixMobileBorderRadius();
          }, 1000);
        }
      }, 0);
      
      resolve();
    } catch (error) {
      resolve(); // Always resolve to not block app
    }
  });
};

/**
 * Force mobile border radius on specific element using CSS class
 */
export const forceMobileBorderRadius = (selector: string): number => {
  const elements = document.querySelectorAll(selector);
  let count = 0;
  
  elements.forEach(element => {
    if (shouldSkipElement(element)) return;
    
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add('mobile-force-8px-radius');
    htmlElement.style.setProperty('border-radius', '8px', 'important');
    count++;
  });
  
  return count;
};

/**
 * Emergency nuclear option - force fix ALL elements
 */
export const emergencyFixAllElements = (): number => {
  const isMobile = window.innerWidth < 768;
  if (!isMobile) {
    console.log('🎯 Not on mobile, skipping emergency fix');
    return 0;
  }
  
  let count = 0;
  const allElements = document.querySelectorAll('*');
  
  allElements.forEach(element => {
    if (shouldSkipElement(element)) return;
    
    const htmlElement = element as HTMLElement;
    
    // Add class and inline style
    htmlElement.classList.add('mobile-force-8px-radius');
    htmlElement.style.setProperty('border-radius', '8px', 'important');
    
    count++;
  });
  
  console.log(`🚨 EMERGENCY FIX: Applied 8px border radius to ${count} elements`);
  return count;
};

/**
 * Visual debug - highlight all elements that should be 8px
 */
export const highlightProblematicElements = (): number => {
  const elements = findProblematicBorderRadius();
  
  elements.forEach(element => {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add('debug-mobile-border-radius');
  });
  
  console.log(`🎯 Highlighted ${elements.length} problematic elements with red outline`);
  return elements.length;
};

/**
 * Clear visual debug highlighting
 */
export const clearHighlighting = (): void => {
  const elements = document.querySelectorAll('.debug-mobile-border-radius');
  elements.forEach(element => {
    element.classList.remove('debug-mobile-border-radius');
  });
  console.log('🎯 Cleared all debug highlighting');
};

/**
 * Recursive function to apply mobile border radius to all child elements
 */
export const applyMobileBorderRadiusRecursive = (element: Element): number => {
  let count = 0;
  const isMobile = window.innerWidth < 768;
  
  if (!isMobile) return 0;
  
  // Apply to current element
  const htmlElement = element as HTMLElement;
  const styles = window.getComputedStyle(element);
  const borderRadius = styles.borderRadius;
  
  if (borderRadius && borderRadius !== 'none' && borderRadius !== '0px') {
    const radiusValue = parseFloat(borderRadius);
    
    if (radiusValue >= 3 && radiusValue <= 24) {
      if (borderRadius !== '50%' && !borderRadius.includes('50%')) {
        if (!element.classList.contains('featured-product') && 
            !element.closest('.featured-product') &&
            !element.className.includes('featured-product')) {
          htmlElement.style.borderRadius = '8px';
          count++;
        }
      }
    }
  }
  
  // Apply to all children
  Array.from(element.children).forEach(child => {
    count += applyMobileBorderRadiusRecursive(child);
  });
  
  return count;
};