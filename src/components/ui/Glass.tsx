import React, { forwardRef, useState, MouseEvent } from 'react';
import { motion, HTMLMotionProps, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ----------------------------------------------------------------------
// GlassCard
// ----------------------------------------------------------------------
interface GlassCardProps extends HTMLMotionProps<'div'> {
  surface?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, surface, children, ...props }, ref) => {
    // Parallax & Tilt Effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);
    const translateX = useTransform(mouseXSpring, [-0.5, 0.5], ["-3px", "3px"]);
    const translateY = useTransform(mouseYSpring, [-0.5, 0.5], ["-3px", "3px"]);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      
      x.set(xPct);
      y.set(yPct);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const isReducedMotion = typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

    return (
      <motion.div
        ref={ref}
        style={isReducedMotion ? {} : {
          rotateX,
          rotateY,
          x: translateX,
          y: translateY,
          transformPerspective: 1000
        }}
        onMouseMove={isReducedMotion ? undefined : handleMouseMove}
        onMouseLeave={isReducedMotion ? undefined : handleMouseLeave}
        className={cn(
          surface ? 'liquid-glass-surface' : 'liquid-glass',
          'rounded-[32px] overflow-hidden',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';

// ----------------------------------------------------------------------
// GlassButton
// ----------------------------------------------------------------------
interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    const baseStyle = 'relative flex items-center justify-center font-bold transition-all focus:outline-none overflow-hidden active:scale-[0.98]';
    
    const sizeStyles = {
      sm: 'h-8 px-4 text-sm rounded-xl',
      md: 'h-11 px-6 text-sm rounded-2xl',
      lg: 'h-14 px-8 text-base rounded-2xl',
    };
    
    const variantStyles = {
      primary: 'bg-accent-blue hover:bg-accent-blue/90 text-white shadow-[0_8px_24px_rgba(10,132,255,0.3)]',
      secondary: 'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-secondary-text hover:text-primary-text dark:hover:text-white',
      danger: 'bg-danger hover:bg-danger/90 text-white shadow-[0_8px_24px_rgba(239,68,68,0.3)]',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.97 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        disabled={disabled}
        className={cn(
          baseStyle,
          sizeStyles[size],
          variantStyles[variant],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    );
  }
);
GlassButton.displayName = 'GlassButton';

// ----------------------------------------------------------------------
// Form Controls
// ----------------------------------------------------------------------
const formBaseStyles = 
  'w-full bg-black/5 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-2xl px-4 py-3 text-sm ' +
  'text-primary-text placeholder:text-primary-text/50 dark:placeholder:text-secondary-text/70 ' +
  'focus:outline-none focus:border-accent-blue ' +
  'transition-all duration-300';

export const GlassInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input ref={ref} className={cn(formBaseStyles, className)} {...props} />
    );
  }
);
GlassInput.displayName = 'GlassInput';

export const GlassTextarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea 
        ref={ref} 
        className={cn(formBaseStyles, 'resize-y min-h-[120px]', className)} 
        {...props} 
      />
    );
  }
);
GlassTextarea.displayName = 'GlassTextarea';

export const GlassSelect = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <select 
        ref={ref} 
        className={cn(formBaseStyles, 'appearance-none cursor-pointer', className)} 
        {...props}
      >
        {children}
      </select>
    );
  }
);
GlassSelect.displayName = 'GlassSelect';

// ----------------------------------------------------------------------
// Badge
// ----------------------------------------------------------------------
export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn(
    "bg-accent-blue/10 text-accent-blue text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ml-auto",
    className
  )}>
    {children}
  </span>
);
