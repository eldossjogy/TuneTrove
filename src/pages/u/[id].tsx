import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Profile, Rating } from "~/utils/types";
import { useRouter } from "next/router";
import Avatar from "~/components/Avatar";
import { api } from "~/utils/api";
import BarGraph from "~/components/BarGraph";

export default function album({
  user,
  profilePictureUrl,
  rateStats,
  lastRated,
  distribution,
}: {
  user: Profile;
  profilePictureUrl: string;
  rateStats: { count: number; average: number };
  lastRated: Rating;
  distribution: { [key: number]: number };
}) {
  const router = useRouter();
  const handleRateClick = () => {
    router.push(`${router.asPath}/rate`);
  };

  let latestInfo:
    | {
        image: string;
        name: string;
        id: number;
        artist: { id: number; name: string }[];
      }
    | undefined = undefined;

  if (lastRated.album_id) {
    latestInfo = api.album.getMetadata.useQuery({ id: lastRated.album_id }).data
      ?.metadata;
  }

  return (
    <div>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="grid grid-cols-5 gap-2">
          <div className="h-64 w-64 overflow-hidden ">
            <Avatar
              uid={user?.id}
              url={profilePictureUrl}
              size={256}
              rounded={10}
            />
          </div>
          <div className="col-span-5 flex items-end rounded-md bg-[#18181c] p-2 md:col-span-4">
            <div className="flex-shrink flex-grow">
              <p className="text-2xl font-bold text-white">{user.username}</p>
              <p className="font-semibold text-gray-400">
                {"Joined " + user.updated_at}
              </p>
            </div>
            <div className="ml-auto">
              <button
                onClick={handleRateClick}
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Rate List
              </button>
            </div>
          </div>

          <div className="col-span-5 rounded-md  bg-[#18181c] p-2 md:col-span-1">
            <div>
              <p className="font-bold">Albums Rated</p>
              <p className="mb-2">{rateStats.count + " Albums"}</p>
              <p className="font-bold">Mean Score</p>
              <p className="mb-2">{rateStats.average}</p>
            </div>
          </div>
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 pb-3 md:col-span-4">
            <div className="mb-3">
              <p className="font-bold">Recently Rated:</p>
              {latestInfo ? (
                <div className="mt-2 flex items-center">
                  <img
                    src={latestInfo.image}
                    alt=""
                    width={150}
                    className="rounded-lg"
                  />
                  <div className="ml-2">
                    <p className="text-xl font-bold">{latestInfo.name}</p>
                    <p>
                      {latestInfo.artist.map((item) => item.name).join(", ")}
                    </p>
                    <p>⭐⭐⭐⭐</p>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {distribution ? (
              <div className="container ">
                <BarGraph data={distribution} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const userName = ctx.params?.id;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .match({ username: userName });

  if (data && data[0]) {
    const { data: rateData, error } = await supabase
      .from("rates")
      .select()
      .match({ user_id: data[0].id });

    let rateCount = 0;
    let rateAverage = 0;
    let rateDistribution: { [key: number]: number } = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
    };
    let latest: Rating | undefined = {};
    if (rateData) {
      rateData.forEach((ele) => {
        rateAverage += ele.rating;
        if (ele.rating) {
          rateDistribution[ele.rating] = rateDistribution[ele.rating] + 1;
        }
      });
      rateCount = rateData.length;
      rateAverage = rateAverage / rateCount;
      latest = rateData[rateData?.length - 1];
    }
    return {
      props: {
        initialSession: session,
        user: data[0],
        profilePictureUrl: data[0].avatar_url,
        rateStats: {
          average: rateAverage,
          count: rateCount,
        },
        distribution: rateDistribution,
        lastRated: latest,
      },
    };
  }
};
