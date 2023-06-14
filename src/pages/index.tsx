import type { NextPage } from "next";
import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  useSession,
  useUser,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import type { Database } from "~/utils/supabase";
import Footer from "~/components/Footer";
import Avatar from "~/components/Avatar";
import DropDown from "~/components/DropDown";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface HomeProps {
  rateCount: number;
  userCount: number;
}

const Home: NextPage<HomeProps> = ({ rateCount, userCount }) => {
  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (
      (event.key === "Enter" || event.type == "click") &&
      searchValue.trim() !== ""
    ) {
      router.push(`/search/${searchValue.trim()}`).catch((error) => {
        console.error(error);
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };
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

  return (
    <>
      <Head>
        <title>TuneTrove</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col">
        <nav className="mr-4 mt-3  flex flex-col items-end justify-end  md:mr-20">
          {!session ? (
            <div className=" flex basis-1/4 flex-row items-center justify-center ">
              <Link href="/login">
                <button className="button  rounded-lg bg-green-400 px-8 py-2 font-bold">
                  Login
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <a href={`/u/${username || ""}`}>
                <Avatar
                  uid={user?.id}
                  url={avatar_url}
                  size={50}
                  rounded={100}
                />
              </a>
              <DropDown username={username} />
            </div>
          )}
        </nav>
        <Image
          src="/awesome_logo.png"
          alt="Logo"
          width={500}
          height={500}
          className="w-46 h-46 mx-auto my-4 "
        />
        <div className="container mx-auto ">
          <div className="mx-5 flex items-center rounded-full border-2 border-gray-500 px-3 py-2">
            <label
              htmlFor="search"
              className="mr-2 hidden font-bold text-white md:block"
            >
              Search:
            </label>
            <div className="relative flex flex-grow items-center">
              <input
                id="search"
                className="w-full border-none bg-transparent text-white focus:outline-none"
                type="text"
                onChange={handleChange}
                value={searchValue}
                onKeyDown={handleKeyDown}
              />
              <svg
                className="absolute right-3 h-5 w-5 fill-current text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onKeyDown={handleKeyDown}
              >
                <path
                  className="heroicon-ui"
                  d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.66 0 3.18-.62 4.36-1.64l.27.28v.79L20 20.59l1.41-1.41L16.5 14zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="container mx-auto">
          <div className="m-5 grid grid-cols-3 gap-4 ">
            <div className="col-span-3 rounded-lg bg-[#18181c]   p-4 md:col-span-1">
              <h2 className="mb-2 text-lg font-light text-white">
                With over{" "}
                <span className="font-bold text-green-400">{rateCount}</span>{" "}
                rates{" "}
              </h2>
            </div>
            <div className="col-span-3  rounded-lg bg-[#18181c] p-4 md:col-span-1">
              <h2 className="mb-2 text-lg font-light text-white">
                With over{" "}
                <span className="font-bold text-green-400">{userCount}</span>{" "}
                users{" "}
              </h2>
            </div>
            <div className="col-span-3 rounded-lg bg-[#18181c] p-4 md:col-span-1">
              <h2 className="mb-2 text-lg font-light text-white">
                With over{" "}
                <span className="font-bold text-green-400">{userCount}</span>{" "}
                users{" "}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  let userCount = 0;
  let rateCount = 0;
  const { data: userDB } = await supabase.from("profiles").select("*");
  const { data: rateDB } = await supabase.from("rates").select("*");
  if (userDB) {
    userCount = userDB.length;
  }
  if (rateDB) {
    rateCount = rateDB.length;
  }

  return {
    props: {
      userCount: userCount,
      rateCount: rateCount,
    },
  };
};
