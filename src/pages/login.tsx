import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      const isNewUser = session.user?.aud === 'authenticated' && session.user?.role === 'authenticated';
      if (isNewUser) {
        router.push('/setting').catch((error) => {
          console.error(error);
        });
      } else {
        router.back();
      }
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
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Image
          src="/awesome_logo.png"
          alt="Logo"
          width={250}
          height={250}
          className="w-46 h-46 mx-auto my-4 "
        />
        {!session ? (
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                anchor: { color: "white" },
                input: { color: "white" },
                message: { color: "white" },
                label: { color: "white" },
              },
            }}
            providers={[]}
          />
        ) : (
          <div>Redirecting...</div>
        )}
      </div>
    </div>
  );
};

export default Login;
