import { onCleanup, onMount, createEffect } from 'solid-js';

export type Direction = 'up' | 'down' | 'left' | 'right' | null;

type UseSwipeOptions = {
  onSwipe: (direction: Direction) => void;
  threshold?: number; // Minimum distance to determine a swipe
  element?: HTMLElement | null;
};

export function useSwipe(options: UseSwipeOptions) {
  const { onSwipe, threshold = 50 } = options;

  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;
  let isSwipeInProgress = false;
  
  const handleTouchStart = (e: Event) => {
    // Reset coordinates
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
    
    isSwipeInProgress = true;
    const touchEvent = e as TouchEvent;
    startX = touchEvent.touches[0].clientX;
    startY = touchEvent.touches[0].clientY;
  };
  
  const handleTouchMove = (e: Event) => {
    if (!isSwipeInProgress) return;
    
    const touchEvent = e as TouchEvent;
    endX = touchEvent.touches[0].clientX;
    endY = touchEvent.touches[0].clientY;
    
    // Prevent page scrolling if a horizontal swipe is detected
    const diffX = endX - startX;
    const diffY = endY - startY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    
    // If horizontal swipe is greater than vertical and exceeds threshold,
    // prevent page scrolling
    if (absX > absY && absX > threshold / 2) {
      e.preventDefault();
    }
  };
  
  const handleTouchEnd = () => {
    if (!isSwipeInProgress) return;
    
    isSwipeInProgress = false;
    
    const diffX = endX - startX;
    const diffY = endY - startY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    
    // Check if the swipe was long enough
    if (Math.max(absX, absY) < threshold) return;
    
    let direction: Direction = null;
    
    // Determine the swipe direction
    if (absX > absY) {
      // Horizontal swipe
      direction = diffX > 0 ? 'right' : 'left';
    } else {
      // Vertical swipe
      direction = diffY > 0 ? 'down' : 'up';
    }
    
    // Call the callback with the swipe direction
    onSwipe(direction);
    
    // Reset coordinates after the swipe
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
  };
  
  const handleMouseStart = (e: Event) => {
    // Reset coordinates
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
    
    isSwipeInProgress = true;
    const mouseEvent = e as MouseEvent;
    startX = mouseEvent.clientX;
    startY = mouseEvent.clientY;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseEnd);
  };
  
  const handleMouseMove = (e: Event) => {
    if (!isSwipeInProgress) return;
    
    const mouseEvent = e as MouseEvent;
    endX = mouseEvent.clientX;
    endY = mouseEvent.clientY;
  };
  
  const handleMouseEnd = () => {
    isSwipeInProgress = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseEnd);
    
    const diffX = endX - startX;
    const diffY = endY - startY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);
    
    // Check if the swipe was long enough
    if (Math.max(absX, absY) < threshold) return;
    
    let direction: Direction = null;
    
    // Determine the swipe direction
    if (absX > absY) {
      // Horizontal swipe
      direction = diffX > 0 ? 'right' : 'left';
    } else {
      // Vertical swipe
      direction = diffY > 0 ? 'down' : 'up';
    }
    
    // Call the callback with the swipe direction
    onSwipe(direction);
    
    // Reset coordinates after the swipe
    startX = 0;
    startY = 0;
    endX = 0;
    endY = 0;
  };

  // Function for setting up event listeners on the element
  const setupEventListeners = (element: HTMLElement | Document) => {
    // Remove previous listeners if they exist
    removeEventListeners();
    
    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Mouse events for desktop testing
    element.addEventListener('mousedown', handleMouseStart);
  };
  
  // Function for removing event listeners
  const removeEventListeners = () => {
    const elements = [document, options.element].filter(Boolean) as (HTMLElement | Document)[];
    
    elements.forEach(element => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleMouseStart);
    });
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseEnd);
  };

  // Track changes in the element
  createEffect(() => {
    const element = options.element || document;
    setupEventListeners(element);
  });

  // Set up event listeners when the component mounts
  onMount(() => {
    const element = options.element || document;
    setupEventListeners(element);
    
    // Clean up event listeners when the component unmounts
    onCleanup(removeEventListeners);
  });
  
  return {
    isActive: true
  };
} 