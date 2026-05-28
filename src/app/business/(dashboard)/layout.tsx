"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BusinessProvider, useBusiness } from '../BusinessContext';
import { 
  Building2, 
  Users, 
  Image as ImageIcon, 
  LogOut, 
  Menu, 
  X, 
  Building,
  User
} from 'lucide-react';

function BusinessDashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { businessProfile, userProfile, loading, logout } = useBusiness();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const navItems = [
    { href: '/business/profile', label: 'Perfil de Empresa', icon: Building2 },
    { href: '/business/team', label: 'Gestionar Equipo', icon: Users },
    { href: '/business/gallery', label: 'Galería de Fotos', icon: ImageIcon },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden selection:bg-violet-500/30">
      
      {/* Mobile Top App Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          {businessProfile?.logo_url ? (
            <img src={businessProfile.logo_url} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <Building className="w-8 h-8 text-violet-500" />
          )}
          <span className="font-bold text-white tracking-tight">{businessProfile?.business_name || 'Mi Empresa'}</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar for Desktop / Drawer for Mobile */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 z-40 bg-slate-900 border-r border-slate-800 flex flex-col 
        transition-all duration-300 ease-in-out md:translate-x-0 md:w-64 w-64
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand identity header */}
        <div className="p-6 hidden md:flex flex-col items-start border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            {businessProfile?.logo_url ? (
              <img 
                src={businessProfile.logo_url} 
                alt="Logo" 
                className="w-10 h-10 rounded-xl object-cover border border-slate-800" 
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Building className="w-5 h-5 text-violet-400" />
              </div>
            )}
            <div>
              <h2 className="font-black text-white text-base leading-tight tracking-tight max-w-[140px] truncate">
                {businessProfile?.business_name || 'Mi Empresa'}
              </h2>
              <span className="bg-violet-500/10 text-violet-400 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-violet-500/20 mt-1 inline-block">
                Empresa B2B
              </span>
            </div>
          </div>
        </div>

        {/* Mobile menu top spacing spacer */}
        <div className="h-16 md:hidden block" />

        {/* User Info (Mobile) */}
        <div className="p-4 md:hidden border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">{userProfile?.full_name}</p>
            <p className="text-[10px] text-slate-500 font-medium">Administrador</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 py-3 px-4 rounded-xl font-bold transition-all duration-200
                  ${isActive 
                    ? 'bg-[#FF6600] text-white shadow-lg shadow-[#FF6600]/15' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
                `}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              logout();
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-bold transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0 bg-slate-950">
        <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 shrink-0 flex items-center justify-between z-10">
          <h1 className="text-xl font-black text-white tracking-tight">
            {navItems.find(item => item.href === pathname)?.label || 'Panel B2B'}
          </h1>
          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-white">{userProfile?.full_name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Administrador</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
              <User className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-300">
            {children}
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #334155; }
      ` }} />
    </div>
  );
}

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BusinessProvider>
      <BusinessDashboardLayoutInner>
        {children}
      </BusinessDashboardLayoutInner>
    </BusinessProvider>
  );
}
