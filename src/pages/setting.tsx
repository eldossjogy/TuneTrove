import { useState, useEffect, useCallback } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetServerSidePropsContext } from "next";
import type { Database } from "~/utils/supabase";
import Avatar from "~/components/Avatar";
import Head from "next/head";
import { useRouter } from "next/router";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account() {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username,  avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } finally {
      setLoading(false);
    }
  }, [supabase, user]);

  useEffect(() => {
    getProfile().catch((error) => {
      console.error(error);
    });
  }, [session, getProfile]);

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: Profiles["username"];
    avatar_url: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      if (!username) {
        setIsUsernameValid(false);
        return;
      }

      setIsUsernameValid(true);

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
 
  const router = useRouter();
  function signOut() {
    supabase.auth.signOut().catch((error) => {
      console.error(error);
    });
    router.push("/").catch((error) => {
      console.error(error);
    });
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Head>
        <title>Setting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="form-widget mx-auto w-96 rounded-lg bg-[#18181c] p-6 text-gray-900 shadow-md ">
        <h1 className=" text-center text-2xl font-bold text-white">Settings</h1>
        <label htmlFor="email" className="mb-1 block text-white">
          Avatar
        </label>
        <div className="h-46 w-46 mb-6 rounded-lg ">
          <Avatar
            uid={user?.id}
            url={avatar_url}
            size={250}
            rounded={20}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, avatar_url: url }).catch((error) => {
                console.error(error);
              });
            }}
          />
        </div>
        <div className="mb-6">
          <p className="w-full rounded-lg  text-white  ">
            Email: {session?.user.email} 🔒
          </p>
        </div>
        <div className="mb-6">
          <label htmlFor="username" className="mb-1 block text-white">
            Username
          </label>
          <input
            id="username"
            type="text"
            className={`w-full rounded-lg border ${
              isUsernameValid ? "border-gray-600" : "border-red-500"
            } bg-[#101113] px-3 py-2 text-white`}
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          {!isUsernameValid && (
            <p className="text-sm text-red-500">Username is required</p>
          )}
        </div>
        <div className="mb-6">
          <button
            className="button primary w-full rounded-2xl  bg-green-500 p-3 text-black"
            onClick={() => {
              updateProfile({ username, avatar_url }).catch((error) => {
                console.error(error);
              });
            }}
            disabled={loading}
          >
            {loading ? "Loading..." : "Update"}
          </button>
        </div>
        <div>
          <button
            className="button w-full rounded-2xl bg-red-500 p-3 text-white"
            onClick={signOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};
