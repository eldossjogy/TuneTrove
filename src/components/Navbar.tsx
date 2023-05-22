import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  useUser,
  useSession,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import type { Database } from "~/utils/supabase";
import Avatar from "./Avatar";
import DropDown from "./DropDown";
import Link from "next/link";
import Image from "next/image";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function NavBar() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  const getProfile = useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username,  avatar_url`)
        .eq("id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username as string);
        setAvatarUrl(data.avatar_url as string);
      }
    } finally {
    }
  }, [supabase, user]);

  useEffect(() => {
    getProfile().catch((error) => {
      console.error(error);
    });
  }, [session, getProfile]);

  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchValue.trim() !== "") {
      router.push(`/search/${searchValue.trim()}`).catch((error) => {
        console.error(error);
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
  return (
    <div className="flex flex-row bg-[#19191c]  py-2 lg:px-40">
      <div className=" basis-1/4">
        <Link href="/">
          <Image src="/awesome_logo.png" alt="logo" width={50} height={50} />
        </Link>
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
          <Link href="/login">
            <button className="button mr-4 rounded-lg bg-green-400 px-8 py-2 font-bold">
              Login
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex items-center">
          <Avatar uid={user?.id} url={avatar_url} size={40} rounded={100} />
          <DropDown username={username} />
        </div>
      )}
    </div>
  );
}
