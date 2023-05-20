import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  useSession,
} from "@supabase/auth-helpers-react";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Database } from "~/utils/supabase";
import Avatar from "~/components/Avatar";
import { useRouter } from "next/router";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account() {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [privacy, setprivacy] = useState<Profiles["privacy"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, privacy, avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setprivacy(data.privacy);
        setAvatarUrl(data.avatar_url);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    privacy,
    avatar_url,
  }: {
    username: Profiles["username"];
    privacy: Profiles["privacy"];
    avatar_url: Profiles["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        privacy,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-widget text-white">
      <Avatar
        uid={user?.id}
        url={avatar_url}
        size={150}
        rounded={0}
        onUpload={(url) => {
          setAvatarUrl(url);
          updateProfile({ username, privacy, avatar_url: url });
        }}
      />
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session?.user.email} disabled />
      </div>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          className="text-black"
          value={username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="privacy">privacy</label>
        <input
          id="privacy"
          type="url"
          className="text-black"
          value={privacy || ""}
          onChange={(e) => setprivacy(e.target.value)}
        />
      </div>

      <div>
        <button
          className="button primary block"
          onClick={() => updateProfile({ username, privacy, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button
          className="button block"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {  
  const supabase = createServerSupabaseClient(ctx)
 
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  }
}