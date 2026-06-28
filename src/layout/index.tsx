import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, PenTool, Mail, ShieldAlert, MessageSquare, 
  Settings, Github, User, Sun, Moon, Search 
} from 'lucide-react';
import { GlassCard, Badge } from '../components/ui/Glass';
import { useThemeStore } from '../store';
import { Scene3D } from '../components/background/Scene3D';
import { cn } from '../components/ui/Glass';

const NAV_ITEMS = [
  { path: '/', label: 'Prompt Writer', icon: PenTool, isNew: false },
  { path: '/cold-outreach', label: 'Cold Outreach', icon: Mail, isNew: true },
  { path: '/objection-handler', label: 'Objection Handler', icon: ShieldAlert, isNew: true },
  { path: '/sales-consultant', label: 'Sales Consultant', icon: MessageSquare, isNew: true },
];

export const Topbar = () => {
  const { theme, setTheme } = useThemeStore();
  const location = useLocation();
  const currentTitle = NAV_ITEMS.find(i => i.path === location.pathname)?.label || 'FlowMind Tools';

  return (
    <GlassCard className="h-16 px-6 flex items-center justify-between mb-6 shrink-0 z-20 sticky top-4 mx-4 md:mx-8 !rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight">{currentTitle}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-secondary-text hover:text-primary-text"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </GlassCard>
  );
};

export const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isExpanded = isOpen || isHovered;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 280 : 88 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen z-40 py-4 pl-4 pr-0 flex flex-col transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <GlassCard className="h-full flex flex-col py-6 px-3">
          <div className={cn("flex items-center justify-between mb-10 transition-all", isExpanded ? "px-1" : "pl-2")}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-semibold whitespace-nowrap"
                  >
                    FlowMind
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {/* Mobile close button */}
            <button className="md:hidden p-2 text-secondary-text" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(
                  "relative flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 group overflow-hidden",
                  isActive 
                    ? "bg-accent-blue/10 text-accent-blue" 
                    : "text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text"
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav" 
                        className="absolute inset-0 bg-accent-blue/10 rounded-2xl" 
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon size={22} className="shrink-0 relative z-10" />
                    
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="flex items-center justify-between flex-1 relative z-10 overflow-hidden"
                        >
                          <span className="whitespace-nowrap font-medium pr-2">{item.label}</span>
                          {item.isNew && <Badge>New</Badge>}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border/50 flex flex-col gap-2">
            <button className="flex items-center gap-3 px-3 py-3 rounded-2xl text-secondary-text hover:bg-black/5 dark:hover:bg-white/5 hover:text-primary-text transition-all overflow-hidden">
              <Github size={22} className="shrink-0" />
              {isExpanded && <span className="whitespace-nowrap font-medium">GitHub</span>}
            </button>
          </div>
        </GlassCard>
      </motion.aside>
    </>
  );
};

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', systemDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen relative overflow-hidden text-primary-text">
      <Scene3D />
      
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      
      <main className="flex-1 flex flex-col h-screen overflow-y-auto hide-scrollbar relative">
        <button 
          className="md:hidden absolute top-6 left-4 z-30 p-2 rounded-xl bg-panel backdrop-blur-xl border border-border"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>
        
        <Topbar />
        
        <div className="flex-1 px-4 md:px-8 pb-8 relative z-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    className="h-full"
  >
    {children}
  </motion.div>
);
