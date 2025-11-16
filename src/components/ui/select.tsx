"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select@2.1.6";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react@0.487.0";

import { cn } from "./utils";

// Main Select Component
const Select = SelectPrimitive.Root;

// Select Group Component
const SelectGroup = SelectPrimitive.Group;

// Select Value Component
const SelectValue = SelectPrimitive.Value;

// Select Trigger Component with Enhanced Animations
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: "sm" | "default";
  }
>(({ className, size = "default", children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styles
      "flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm",
      "whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] outline-none cursor-pointer",
      "font-body relative overflow-hidden", // Use design system font
      
      // Enhanced interaction styles
      "hover:bg-opacity-80 hover:border-primary hover:shadow-lg hover:scale-[1.02]",
      "active:scale-[0.98] active:transition-none",
      
      // Border and focus styles - using design system colors
      "border-input focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-[4px]",
      "focus-visible:scale-[1.01] focus-visible:shadow-xl",
      
      // Placeholder and disabled styles
      "data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
      "disabled:hover:scale-100 disabled:hover:shadow-none",
      
      // Invalid state
      "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
      
      // Dark mode support
      "dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40",
      
      // Size variants
      size === "default" ? "h-9" : "h-8",
      
      // Icon styles with enhanced animation
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "[&_svg]:transition-all [&_svg]:duration-300 [&_svg]:ease-[cubic-bezier(0.16,1,0.3,1)]",
      
      // Open state styles
      "data-[state=open]:border-primary data-[state=open]:ring-primary/20 data-[state=open]:ring-4",
      "data-[state=open]:shadow-xl data-[state=open]:scale-[1.01]",
      "data-[state=open]:[&_svg]:rotate-180 data-[state=open]:[&_svg]:text-primary",
      
      className
    )}
    style={{
      borderRadius: '3px', // 3px max from design system
      fontFamily: 'var(--font-body)', // Abel font
      backgroundColor: 'var(--input-background)', // #f0f4f9
      border: '0.5px solid var(--border)', // Standardized border width
      fontSize: 'var(--font-size)', // 14px base font size
      willChange: 'transform, box-shadow',
      backfaceVisibility: 'hidden'
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon 
        className="size-4 opacity-60 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]" 
        style={{ color: 'var(--muted-foreground)' }}
      />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// Enhanced Select Content Component with Captivating Animations
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentProps<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Base styles with enhanced visual depth
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border",
        "bg-popover text-popover-foreground backdrop-blur-sm",
        
        // Enhanced shadow and depth
        "shadow-2xl border-primary/20",
        
        // Captivating entrance animations
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        
        // Enhanced scaling with elegant easing
        "data-[state=closed]:zoom-out-[0.92] data-[state=open]:zoom-in-[0.92]",
        "data-[state=open]:duration-300 data-[state=closed]:duration-200",
        "data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
        "data-[state=closed]:ease-[cubic-bezier(0.4,0,0.2,1)]",
        
        // Enhanced slide animations with smooth descent
        "data-[side=bottom]:slide-in-from-top-3 data-[side=left]:slide-in-from-right-3",
        "data-[side=right]:slide-in-from-left-3 data-[side=top]:slide-in-from-bottom-3",
        
        // Popper position styles with enhanced movement
        position === "popper" &&
          "data-[side=bottom]:translate-y-2 data-[side=left]:-translate-x-2 data-[side=right]:translate-x-2 data-[side=top]:-translate-y-2",
        
        className
      )}
      position={position}
      style={{
        backgroundColor: 'var(--pure-white)', // White background from design system
        borderRadius: '3px', // 3px max border radius
        border: '0.5px solid var(--primary-blue)', // Enhanced border with primary color
        boxShadow: `
          0 20px 25px -5px rgba(88, 37, 239, 0.1),
          0 10px 10px -5px rgba(88, 37, 239, 0.04),
          0 0 0 1px rgba(88, 37, 239, 0.05)
        `, // Enhanced shadow with blue tint
        fontFamily: 'var(--font-body)', // Abel font
        maxHeight: 'var(--radix-select-content-available-height, 300px)',
        willChange: 'transform, opacity, box-shadow',
        backfaceVisibility: 'hidden',
        transformOrigin: 'var(--radix-select-content-transform-origin)',
        // Add subtle background gradient for depth
        backgroundImage: 'linear-gradient(to bottom, var(--pure-white), rgba(88, 37, 239, 0.01))'
      }}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

// Select Label Component
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentProps<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs text-muted-foreground font-body font-medium tracking-wide uppercase",
      className
    )}
    style={{
      fontFamily: 'var(--font-body)', // Abel font
      color: 'var(--muted-foreground)', // #868686
      fontSize: '12px'
    }}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// Enhanced Select Item Component with Smooth Interactions
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentProps<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Base styles with enhanced interactivity
      "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-2 pr-8 text-sm",
      "outline-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] font-body",
      
      // Enhanced focus and hover styles with subtle animations
      "focus:bg-accent focus:text-accent-foreground focus:scale-[1.01] focus:translate-x-1",
      "hover:bg-accent hover:text-accent-foreground hover:scale-[1.01] hover:translate-x-1",
      "hover:shadow-sm",
      
      // Active state with smooth feedback
      "active:scale-[0.99] active:transition-none",
      
      // Selected state with enhanced styling
      "data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary",
      "data-[state=checked]:font-medium data-[state=checked]:shadow-sm",
      
      // Disabled styles
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      
      // Icon styles
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      
      className
    )}
    style={{
      fontFamily: 'var(--font-body)', // Abel font
      fontSize: 'var(--font-size)', // 14px
      borderRadius: '2px', // Slightly rounded for mobile
      willChange: 'transform, background-color',
      backfaceVisibility: 'hidden'
    }}
    {...props}
  >
    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon 
          className="h-4 w-4 transition-all duration-200 ease-out" 
          style={{ color: 'var(--primary-blue)' }}
        />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Select Separator Component
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentProps<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn(
      "-mx-1 my-1 h-px bg-border pointer-events-none opacity-60",
      className
    )}
    style={{
      backgroundColor: 'var(--border)' // Design system border color
    }}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// Enhanced Select Scroll Up Button
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      "hover:bg-accent transition-all duration-200 hover:scale-105",
      className
    )}
    style={{
      color: 'var(--muted-foreground)'
    }}
    {...props}
  >
    <ChevronUpIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

// Enhanced Select Scroll Down Button
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      "hover:bg-accent transition-all duration-200 hover:scale-105",
      className
    )}
    style={{
      color: 'var(--muted-foreground)'
    }}
    {...props}
  >
    <ChevronDownIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

// Export all components
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};