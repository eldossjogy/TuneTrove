import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import Account from "../components/Account";

const Home = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

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
          // appearance={{
          //   style: {
          //     button: { background: 'red', color: 'white' },
          //     anchor: { color: 'blue' },
          //   }
          // }}
          providers={[]}
          // theme="dark"
        />
      ) : (
        <Account session={session} />
      )}
    </div>
  );
};

export default Home;
