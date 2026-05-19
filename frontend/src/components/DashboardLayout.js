import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, AlertCircle, MapPin, BarChart3, Bell, Users, LogOut, Menu, X, Shield, ChevronLeft, ChevronRight, Radar, Brain, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIChatbot from './AIChatbot';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/predict', icon: Radar, label: 'Predict Crime' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/dashboard/reports', icon: AlertCircle, label: 'Reports' },
    { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { to: '/dashboard/ai-model', icon: Brain, label: 'AI Model' },
    { to: '/dashboard/dataset', icon: Database, label: 'Dataset' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ to: '/dashboard/admin', icon: Users, label: 'Admin Panel' });
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className={`p-4 border-b border-white/10 flex items-center ${collapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-lg bg-[#00F0FF]/15 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]" />
        </div>
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
              <h1 className="text-base font-bold tracking-tight text-white whitespace-nowrap" style={{ fontFamily: "'Outfit', sans-serif" }}>
                CrimePredict
              </h1>
              <p className="text-[10px] text-[#00F0FF] font-mono uppercase tracking-wider">AI Intelligence</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group ${collapsed && !isMobile ? 'justify-center' : ''} ${
                isActive
                  ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20'
                  : 'text-[#A1A1AA] hover:bg-white/[0.03] hover:text-white border border-transparent'
              }`
            }
            data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
          >
            <item.icon className="w-[18px] h-[18px] shrink-0" strokeWidth={2} />
            <AnimatePresence>
              {(!collapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  style={{ fontFamily: "'Manrope', sans-serif" }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        {(!collapsed || isMobile) && (
          <div className="mb-2 px-1">
            <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "'Manrope', sans-serif" }}>{user?.name}</p>
            <p className="text-xs text-[#52525B] truncate">{user?.email}</p>
            {user?.role === 'admin' && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/20 text-[10px] uppercase tracking-wider font-mono rounded">
                Admin
              </span>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-[#A1A1AA] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 transition-all duration-200 ${collapsed && !isMobile ? 'justify-center' : ''}`}
          data-testid="logout-button"
        >
          <LogOut className="w-4 h-4" />
          {(!collapsed || isMobile) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] flex relative">
      {/* Background texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04]" style={{
        backgroundImage: `url(https://static.prod-images.emergentagent.com/jobs/10ebf411-2305-456d-9eb3-79b083ca1340/images/e77cb5271831c30a50b55d6b3fd08261d8777567c0a7ee8b8999ffa298a71779.png)`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }} />

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block relative z-10 shrink-0 transition-all duration-300 ease-in-out ${collapsed ? 'w-16' : 'w-60'}`}
        data-testid="sidebar"
      >
        <div className="fixed top-0 left-0 h-full backdrop-blur-2xl bg-black/60 border-r border-white/10" style={{ width: collapsed ? '64px' : '240px', transition: 'width 0.3s' }}>
          <SidebarContent />
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-[#A1A1AA] hover:text-white hover:border-[#00F0FF]/30 transition-colors z-20"
            data-testid="collapse-sidebar"
          >
            {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-black/60 border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00F0FF]" />
            <h1 className="text-base font-bold tracking-tight text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>CrimePredict</h1>
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-2" data-testid="mobile-menu-button">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden backdrop-blur-2xl bg-black/80 border-r border-white/10"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-h-screen relative z-10">
        <main className="lg:pt-0 pt-16">
          <Outlet />
        </main>
      </div>

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default DashboardLayout;
