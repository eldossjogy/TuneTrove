import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  useUser,
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Database } from "~/utils/supabase";
import Avatar from "./Avatar";
import DropDown from "./DropDown";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function NavBar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, privacy, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter" && searchValue.trim() !== "") {
      router.push(`/search/${searchValue.trim()}`);
    }
  };

  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
  };
  return (
    <div className="flex flex-row bg-[#19191c]  py-2 lg:px-40">
      <div className=" basis-1/4">
        <a href="/">
          <img src="/awesome_logo.png" alt="logo" width={50} />
        </a>
      </div>
      <div className="  my-auto basis-2/4">
        <input
          type="text"
          name=""
          id=""
          value={searchValue}
          onChange={handleChange}
          className="w-3/4 rounded-lg p-3"
          onKeyDown={handleKeyDown}
        />
      </div>

      {!session ? (
        <div className=" flex basis-1/4 flex-row items-center justify-center">
          <a href="/login">
            <button className="button mr-4 rounded-lg bg-green-400 px-8 py-2 font-bold">
              Login
            </button>
          </a>
        </div>
      ) : (
        <div className="flex items-center">
          <Avatar uid={user?.id} url={avatar_url} size={50} rounded={100} />
          <DropDown username={username}/>
        </div>
      )}
    </div>
  );
}
