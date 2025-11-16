# Bato - Development Guidelines

This document outlines the comprehensive design system and development guidelines for the Bato e-commerce application, an African clothing marketplace with sophisticated mobile and desktop experiences.

## General Development Principles

* **Mobile-First Design**: Always design for mobile first, then enhance for tablet and desktop
* **Component-Based Architecture**: Keep components small, focused, and reusable
* **State Management**: Use the centralized AppProvider pattern for global state
* **File Organization**: Group related components in folders, separate hooks, utils, and constants
* **Performance**: Use React.memo, useCallback, and useMemo for optimization
* **Accessibility**: Ensure all interactive elements are keyboard accessible
* **TypeScript**: Always use TypeScript with proper type definitions

## Design System

### Color Palette

The application uses a **blue-based African-inspired color theme**:

#### Primary Colors
* `--primary-blue: #5825ef` (Main brand blue)
* `--primary-dark-blue: #6e29f6` (Darker blue for contrast)
* `--primary-light-blue: #885cf8` (Lighter blue for highlights)
* `--primary-extra-light-blue: #d6c9fd` (Very light blue for backgrounds)

#### Secondary Colors
* `--success-green: #028b31` (Success states)
* `--success-light-green: #0fa342` (Light success)
* `--error-red: #e74c3c` (Error states)
* `--warning-yellow: #FFE087` (Warning states)

#### Neutrals
* `--pure-white: #ffffff`
* `--light-gray: #f0f4f9` (Main background)
* `--medium-gray: #868686` (Text secondary)
* `--dark-gray: #848584` (Text tertiary)
* `--black: #000000`

### Typography

* **Headings**: Ubuntu font family (`--font-heading: 'Ubuntu', sans-serif`)
* **Body Text**: Abel font family (`--font-body: 'Abel', sans-serif`)
* **Base Font Size**: 14px
* **Font Weights**: Use 300, 400, 500, 700 for Ubuntu; 400 for Abel

### Border Radius

**CRITICAL**: Maximum border radius is **3px** throughout the entire application.
* `--radius-sm: 1px`
* `--radius-md: 2px`  
* `--radius-lg: 3px`
* `--radius-xl: 3px` (capped at 3px)

### Spacing System

* `--spacing-xs: 4px`
* `--spacing-sm: 8px`
* `--spacing-md: 16px`
* `--spacing-lg: 24px`
* `--spacing-xl: 32px`
* `--spacing-xxl: 48px`

## Layout Architecture

### Mobile Layout (< 768px)
* **TikTok-Style Experience**: Full-screen product cards with swipe navigation
* **Dark Background**: Gradient background `linear-gradient(135deg, #ff6b6b, #ff8e53)`
* **Touch Navigation**: Vertical swipe for product browsing
* **Floating Elements**: Categories, chat button, toggle button
* **Single Product Focus**: One product displayed at a time

### Tablet Layout (768px - 1199px)
* **Two-Panel Layout**: Left (33% - search/filter), Middle (67% - products)
* **Independent Scrolling**: Each panel scrolls separately without affecting the other
* **Grid Layout**: 2-column product grid
* **Enhanced Spacing**: More generous padding and margins
* **Interactive Elements**: Hover effects and animations
* **Fixed Height**: 100vh - 70px (minus header)

### Desktop Layout (≥ 1200px)
* **Three-Panel Layout**: Left (16% - search/filter), Middle (flex-1 - products), Right (16% - trending)
* **Independent Scrolling**: Each panel scrolls separately without affecting others
* **Grid Layout**: 3-column product grid
* **Sophisticated Animations**: Enhanced hover effects and transitions
* **Professional Appearance**: Clean, business-focused design
* **Fixed Height**: 100vh - 80px (minus header)
* **Invisible Scrollbars**: Completely transparent for clean aesthetic

### Independent Panel Scrolling System

**Desktop & Tablet Only** - Each panel scrolls independently for focused user experience.

#### Implementation
* **CSS File**: `/styles/independent-panel-scrolling.css`
* **Import**: Already imported in `HomePage.tsx`
* **Main Container**: Fixed height, no scrolling
* **Individual Panels**: Each has independent vertical scroll

#### Panel Behavior
* **Left Panel**: Search, filters, categories - scrolls independently
* **Middle Panel**: Products, deals, incentives - scrolls independently
* **Right Panel**: Trending, live streams - scrolls independently (desktop only)
* **No Interference**: Scrolling one panel doesn't affect others

#### Invisible Scrollbars
* **Visibility**: Completely invisible/transparent
* **Functionality**: Full scroll functionality maintained
* **Firefox**: `scrollbar-width: none`
* **IE/Edge**: `-ms-overflow-style: none`
* **WebKit (Chrome/Safari/Opera)**: `width: 0`, `display: none`

#### Performance Features
* GPU-accelerated scrolling
* Smooth scroll behavior enabled
* Overscroll containment
* 60fps performance target
* Minimal CPU usage

#### Accessibility
* Keyboard navigation support
* Focus indicators on active panel
* Screen reader compatible
* Reduced motion support via media query

## Component Guidelines

### Button System (Moema)

Use the Moema button system for consistent styling:

```css
.btn-moema-primary     /* Orange gradient, white text */
.btn-moema-secondary   /* Transparent with orange border */
.btn-moema-success     /* Green gradient */
.btn-moema-outline     /* Light gray border */
.btn-moema-icon        /* Circular icon button */
```

**Button Rules:**
* Always use Moema classes for primary actions
* Maximum 3px border radius on all buttons
* Include hover and active state animations
* Use proper semantic HTML (`<button>` vs `<a>`)

### ProductCard Component

* **Consistent Styling**: Use `var(--shadow-standard-desktop)` for shadows
* **Aspect Ratio**: 3:4 for product images
* **Interactive States**: Hover animations with scale and shadow changes
* **Badge System**: Support for "Sale", "New", and custom badges
* **Action Buttons**: Quick view, add to cart, favorite toggle

### Icons

* **Bootstrap Icons Only**: Use the BootstrapIcon component wrapper
* **Consistent Sizing**: 16px, 20px, 24px standard sizes
* **Color Inheritance**: Icons should inherit color from parent
* **Accessibility**: Always include meaningful titles/labels

## State Management

### AppProvider Pattern

Use the centralized state management:

```typescript
const { state, actions, auth, cart, favorites } = useApp();
```

**State Categories:**
* `state` - UI state (current page, modals, mobile flags)
* `actions` - UI actions (navigation, toggles)
* `auth` - Authentication state and functions
* `cart` - Shopping cart state and functions  
* `favorites` - Favorites state and functions

### Hook Organization

* `useAppState` - Core application state
* `useAuth` - Authentication logic
* `useCart` - Shopping cart logic
* `useFavorites` - Favorites logic
* `useMobileTouchNavigation` - Mobile swipe navigation

## Page Routing

### Route Structure

* **Home**: `/` - Main landing page with products
* **Shop Pages**: `/new-arrivals`, `/dresses`, `/tops`, `/accessories`
* **User Pages**: `/profile`, `/favorites`, `/sign-in`, `/create-account`
* **Admin Pages**: `/admin-dashboard`, `/admin-sign-in`, `/admin-profile`
* **Utility Pages**: `/contact`, `/shipping`, `/returns`, `/size-guide`

### Navigation Rules

* Use `actions.navigateToPage()` for all navigation
* Mobile users get mobile-specific cart/favorites pages
* Admin users get redirected to admin chat room
* Preserve scroll position where appropriate

## Animation Guidelines

### Performance Optimizations

```css
.smooth-animated {
  will-change: transform, opacity;
  backface-visibility: hidden;
  transform-style: flat;
  contain: layout style;
}
```

### Animation Types

* **Entrance**: `fade-in`, `fade-in-up` for loading content
* **Hover**: Scale (1.01-1.02) and translateY(-1px to -2px)
* **Active**: Scale (0.98) for button press feedback
* **Loading**: Gradient animations for placeholder content

### Motion Principles

* **Smooth Transitions**: Use `cubic-bezier(0.25, 0.8, 0.25, 1)` easing
* **Subtle Effects**: Keep animations understated and professional
* **Performance First**: Use transform and opacity changes over layout properties

## Chat System

### Customer vs Admin Chat

* **Customer Chat**: `ChatRoom` component for general inquiries
* **Admin Chat**: `AdminChatRoom` component with enhanced features
* **Auto-Detection**: System detects admin users and routes appropriately
* **Debug Functions**: Use `enableAdminMode()` for testing

### Chat Features

* **Real-time Messaging**: Simulated real-time experience
* **Emoji Support**: Modern emoji picker with reactions
* **File Sharing**: Support for image and document uploads
* **Message Reactions**: Quick reaction system
* **Typing Indicators**: Visual feedback for active conversations

## Admin Dashboard

### Access Control

* **Admin Detection**: Check `user.isAdmin` or `state.isAdminMode`
* **Route Protection**: Admin pages require admin authentication
* **Debug Mode**: Use `enableAdminMode()` for development testing

### Admin Features

* **Dashboard Overview**: Analytics and key metrics
* **User Management**: View, edit, and manage user accounts
* **Product Management**: Add, edit, and manage products
* **Order Management**: Process and track orders
* **Chat Management**: Handle customer support conversations
* **Settings**: Configure shipping, notifications, integrations

## Shopping Cart & Checkout

### Cart Functionality

* **Size/Color Selection**: Support for product variants
* **Quantity Management**: Increment/decrement with validation
* **Persistence**: Maintain cart state across sessions
* **Mobile Optimization**: Dedicated mobile cart page

### Checkout Flow

* **Guest Checkout**: Support for non-registered users
* **Form Validation**: Comprehensive address and payment validation
* **Order Summary**: Clear pricing breakdown
* **Confirmation**: Order success with tracking information

## Mobile-Specific Guidelines

### TikTok-Style Experience

* **Full-Screen Focus**: Each product gets full screen attention
* **Gesture Navigation**: Swipe up/down for product browsing
* **Floating UI**: Minimize permanent UI, use floating elements
* **Quick Actions**: Easy access to cart, favorites, search

### Mobile Performance

* **Image Optimization**: Use appropriate image sizes for mobile
* **Touch Targets**: Minimum 44px touch targets
* **Loading States**: Show loading indicators for async operations
* **Reduced Motion**: Respect user motion preferences

## Code Organization

### File Structure

```
/components
  /ui - ShadCN components
  /pages - Page components
  /mobile - Mobile-specific components
  /admin - Admin dashboard components
  /chat - Chat system components
/constants - Static data and configuration
/hooks - Custom React hooks
/utils - Helper functions
/types - TypeScript type definitions
/styles - CSS files and design system
```

### Component Patterns

* **Props Interface**: Always define TypeScript interfaces for props
* **Default Props**: Use default parameters in function signature
* **Error Boundaries**: Wrap async components in error boundaries
* **Loading States**: Show loading UI for async operations

## Testing and Debug

### Debug Functions

Available in browser console:
* `enableAdminMode()` - Enable admin chat testing
* `testBootstrapIcons()` - Check icon loading status
* `navigateToAdminDashboard()` - Direct navigation to admin
* `forceOpenAdminChat()` - Force open admin chat room

### Performance Monitoring

* **Component Re-renders**: Use React DevTools Profiler
* **Bundle Size**: Monitor build output for size increases
* **Animation Performance**: Use browser DevTools for frame rate
* **Loading Times**: Monitor initial page load performance

## Accessibility Standards

### WCAG Compliance

* **Color Contrast**: Maintain 4.5:1 ratio for normal text
* **Keyboard Navigation**: All interactive elements accessible via keyboard
* **Screen Readers**: Proper ARIA labels and semantic HTML
* **Focus Management**: Visible focus indicators for all interactive elements

### Implementation

* **Alt Text**: Descriptive alt text for all images
* **Form Labels**: Proper label association for form inputs
* **Error Messages**: Clear, accessible error communication
* **Loading States**: Announce loading states to screen readers

## Deployment Guidelines

### Environment Configuration

* **Development**: Full debug features enabled
* **Staging**: Production-like with debug access
* **Production**: All debug features disabled

### Performance Optimization

* **Code Splitting**: Lazy load admin and chat components
* **Image Optimization**: Use appropriate formats and sizes
* **CSS Minification**: Minimize CSS bundle size
* **Bundle Analysis**: Regular bundle size monitoring

---

This document should be referenced for all development decisions to ensure consistency across the Bato application. When in doubt, prioritize user experience and performance while maintaining the sophisticated African-inspired aesthetic.