import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import NavBar from "~/components/Navbar";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";

const Home: NextPage = ({rateCount, userCount} : {rateCount: number , userCount: number}) => {
 
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 pt-4">
        <img src="/awesome_logo.png" alt="Logo" className="w-50 h-46 mx-auto mb-4" />
        <form className="max-w-lg mx-auto">
          <div className="flex items-center  border-b-2 border-gray-500 py-2">
            <label htmlFor="search" className="block text-gray-700 font-bold mb-2">
              Search:
            </label>
            <input
              id="search"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search"
            />
            <button
              className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="container mx-auto mt-8">
        <div className="flex justify-between mb-4">
          <div className="bg-white rounded-lg p-4 w-1/3 mr-4">
            <h2 className="text-lg font-bold mb-2">With over {rateCount - 1} rates </h2>
          </div>
          <div className="bg-white rounded-lg p-4 w-1/3 mr-4">
            <h2 className="text-lg font-bold mb-2">With over {userCount - 1} users</h2>
           </div>
          <div className="bg-white rounded-lg p-4 w-1/3">
            <h2 className="text-lg font-bold mb-2">Stat 3</h2>
            <p className="text-gray-700">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      
      </div>
    </div>
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
