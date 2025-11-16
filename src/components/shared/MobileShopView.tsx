// 🚫 REDUNDANT COMPONENT REMOVED FOR PERFORMANCE OPTIMIZATION
// 
// This component was duplicating functionality already provided by:
// - HomePage.tsx → MobileHomeProductView.tsx for mobile experience
// 
// The mobile experience is properly handled through the existing routing:
// AppRouter → HomePage → MobileHomeProductView (with blue theme)
//
// Removing this redundant component improves:
// ✅ Bundle size reduction
// ✅ Eliminates code duplication  
// ✅ Single source of truth for mobile layouts
// ✅ Better performance and maintainability
//
// If specific shop pages need mobile layouts, use HomePageLayout.tsx 
// with custom mobile implementations instead of duplicating this logic.

export {}; // Empty export to maintain module structure temporarily