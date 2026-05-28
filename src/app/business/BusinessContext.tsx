"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { User } from '@supabase/supabase-js';

export interface BusinessProfile {
  id: string;
  business_name: string;
  category: string;
  sector: string;
  phone: string;
  email: string;
  website: string;
  instagram: string;
  description?: string; // fallback in case description is accessed, but we use bio
  bio: string;
  logo_url: string;
  show_location: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  role: string;
  business_id: string | null;
  is_business_admin: boolean;
  account_type?: 'app' | 'business';
}

interface BusinessContextType {
  user: User | null;
  userProfile: UserProfile | null;
  businessId: string | null;
  businessProfile: BusinessProfile | null;
  loading: boolean;
  error: string | null;
  refreshBusinessProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthPage = pathname === '/business/login' || pathname === '/business/register';

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setUser(null);
        setUserProfile(null);
        setBusinessId(null);
        setBusinessProfile(null);
        if (!isAuthPage) {
          router.push('/business/login');
        }
        return;
      }

      const currentUser = session.user;
      setUser(currentUser);

      // Fetch user profile to verify B2B permissions
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role, business_id, is_business_admin, account_type')
        .eq('id', currentUser.id)
        .single();

      if (profileError || !profile) {
        throw new Error('No se pudo verificar tu perfil de usuario.');
      }

      const typedProfile = profile as UserProfile;
      setUserProfile(typedProfile);

      if (!typedProfile.is_business_admin || !typedProfile.business_id || typedProfile.account_type !== 'business') {
        // If not a business admin, or not business account, sign them out from this portal context
        await supabase.auth.signOut();
        setUser(null);
        setUserProfile(null);
        setBusinessId(null);
        setBusinessProfile(null);
        throw new Error('Acceso restringido. Este portal es exclusivo para cuentas de empresa.');
      }

      setBusinessId(typedProfile.business_id);

      // Fetch business profile details
      const { data: bizProfile, error: bizError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', typedProfile.business_id)
        .single();

      if (bizError) {
        throw new Error('Error al cargar la información de la empresa.');
      }

      setBusinessProfile(bizProfile as BusinessProfile);

      if (isAuthPage) {
        router.push('/business/profile');
      }

    } catch (err: any) {
      console.error('B2B Auth Error:', err);
      setError(err.message || 'Ocurrió un error inesperado de autenticación.');
      if (!isAuthPage) {
        router.push('/business/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshBusinessProfile = async () => {
    if (!businessId) return;
    try {
      const { data: bizProfile, error: bizError } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('id', businessId)
        .single();

      if (!bizError && bizProfile) {
        setBusinessProfile(bizProfile as BusinessProfile);
      }
    } catch (err) {
      console.error('Error refreshing business profile:', err);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setBusinessId(null);
      setBusinessProfile(null);
      router.push('/business/login');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setBusinessId(null);
        setBusinessProfile(null);
        if (!isAuthPage) {
          router.push('/business/login');
        }
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAuth();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname]);

  return (
    <BusinessContext.Provider
      value={{
        user,
        userProfile,
        businessId,
        businessProfile,
        loading,
        error,
        refreshBusinessProfile,
        logout,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}
