import { type NextPage } from "next";
import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  useSession,
  useUser,
  useSupabaseClient,
} from "@supabase/auth-helpers-react";
import { Database } from "~/utils/supabase";
import ProfilePicture from "~/components/ProfilePicture";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

interface HomeProps {
  rateCount: number;
  userCount: number;
}


const Home: NextPage<HomeProps> = ({ rateCount, userCount }) => {
  const session = useSession();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [username, setUsername] = useState<Profiles["username"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);
  const handleKeyDown = (event: any) => {
    if (
      (event.key === "Enter" || event.type == "click") &&
      searchValue.trim() !== ""
    ) {
      router.push(`/search/${searchValue.trim()}`);
    }
  };

  const handleChange = (event: any) => {
    setSearchValue(event.target.value);
  };

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

  return (
    <>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="bg-stone-900 flex  flex-col items-end justify-end md:mr-20 mr-4 mt-3">
        {!session ? (
          <div className=" flex basis-1/4 flex-row items-center justify-center ">
            <a href="/login">
              <button className="button  rounded-lg bg-green-400 px-8 py-2 font-bold">
                Login
              </button>
            </a>
          </div>
        ) : (
          <a href={`/u/${username}`} className="flex items-center">
            <ProfilePicture uid={user?.id} url={avatar_url} size={40} />
            <h5 className="ml-3 hidden font-bold text-white md:block">
              {username}
            </h5>
          </a>
        )}
      </nav>
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="container mx-auto px-4 pt-4">
          <img
            src="/awesome_logo.png"
            alt="Logo"
            className="w-46 h-46 mx-auto mb-4 bg-blue-300"
          />
          <div className="mx-auto max-w-lg  bg-cyan-300">
            <div className="flex items-baseline  border-b-2 border-gray-500 py-2 ">
              <label
                htmlFor="search"
                className="mb-2 block font-bold text-white"
              >
                Search:
              </label>
              <input
                id="search"
                className="mr-3 w-full appearance-none border-none bg-transparent px-2 py-1 leading-tight text-white focus:outline-none"
                type="text"
                onChange={handleChange}
                value={searchValue}
                onKeyDown={handleKeyDown}
              />
              <button
                className="flex-shrink-0 rounded border-4 border-blue-500 bg-blue-500 px-2 py-1 text-sm text-white hover:border-blue-700 hover:bg-blue-700"
                type="button"
                onClick={handleKeyDown}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto mt-8 bg-purple-300">
          <div className="mb-4 flex justify-between">
            <div className="mr-4 w-1/3 rounded-lg bg-[#18181c] p-4">
              <h2 className="mb-2 text-lg font-light text-white">
                With over{" "}
                <span className="font-bold text-green-400">
                  {rateCount - 1}
                </span>{" "}
                rates{" "}
              </h2>
            </div>
            <div className="mr-4 w-1/3 rounded-lg bg-[#18181c] p-4">
              <h2 className="mb-2 text-lg font-light text-white">
                With over{" "}
                <span className="font-bold text-green-400">
                  {userCount - 1}
                </span>{" "}
                users
              </h2>
            </div>
            <div className="w-1/3 rounded-lg bg-[#18181c] p-4">
              <h2 className="mb-2 text-lg font-light text-white">Stat 3</h2>
            </div>
          </div>
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
  const { data: userDB, error: userDBError } = await supabase
    .from("profiles")
    .select("*");
  const { data: rateDB, error: rateDBError } = await supabase
    .from("rates")
    .select("*");
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
