"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function BusinessRootPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.replace("/business/login");
          return;
        }

        // Fetch profile to see if B2B is authorized
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_business_admin, business_id, account_type")
          .eq("id", session.user.id)
          .single();

        if (profile?.is_business_admin && profile?.business_id && profile?.account_type === 'business') {
          router.replace("/business/profile");
        } else {
          router.replace("/business/login");
        }
      } catch (err) {
        console.error("Error in B2B redirect:", err);
        router.replace("/business/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#FF6600] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium text-sm animate-pulse">Redireccionando...</p>
      </div>
    </div>
  );
}
