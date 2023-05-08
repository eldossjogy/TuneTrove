import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
 
const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.back();
    }
  }, [session, router]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      {!session ? (
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      ) : (
        <div>Redirecting...</div>
      )}
    </div>
  );
};

export default Login;
