import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetServerSidePropsContext } from "next";
import type { Profile, Rating } from "~/utils/types";
import { useRouter } from "next/router";
import Avatar from "~/components/Avatar";
import { api } from "~/utils/api";
import BarGraph from "~/components/BarGraph";
import Image from "next/image";

export default function Profile({
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
  function handleRateClick() {
    router.push(`${router.asPath}/rate`).catch((error) => {
      console.error(error);
    });
  }
  let latestInfo:
    | {
        image: string;
        name: string;
        id: number;
        artist: { id: number; name: string }[];
      }
    | null
    | undefined = null;
  if (lastRated && lastRated.album_id) {
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
                {"Joined " +
                  new Date(user.updated_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
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
              <p className="mb-2">{rateStats.count.toString() + " Albums"}</p>
              <p className="font-bold">Mean Score</p>
              <p className="mb-2">{rateStats.average}</p>
            </div>
          </div>
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 pb-3 md:col-span-4">
            <div className="mb-3">
              <p className="font-bold">Recently Rated:</p>
              {latestInfo ? (
                <a href={"/album/" + latestInfo.id.toString()}>
                  <div className="mt-2 flex items-center ">
                    <Image
                      src={latestInfo.image}
                      alt="Album Cover"
                      width={150}
                      height={150}
                      className="rounded-lg"
                    />
                    <div className="ml-2">
                      <p className="text-xl font-bold">{latestInfo.name}</p>
                      <p>
                        {latestInfo.artist.map((item) => item.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </a>
              ) : (
                <></>
              )}
            </div>
            {distribution && rateStats.count > 0 ? (
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

  const { data } = await supabase
    .from("profiles")
    .select()
    .match({ username: userName });

  if (data && data[0]) {
    const { data: rateData } = await supabase
      .from("rates")
      .select()
      .match({ user_id: data[0].id as number });

    let rateCount = 0;
    let rateAverage = 0;
    const rateDistribution: { [key: number]: number } = {
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
    let latest: Rating | null | undefined = null;
    if (rateData) {
      rateData.forEach((ele: { rating?: number }) => {
        if (ele.rating) {
          rateAverage += ele.rating;
          rateDistribution[ele.rating] += 1;
        }
      });
      rateCount = rateData.length;
      if (rateData.length > 0) {
        rateAverage = rateAverage / rateCount;
        latest = rateData[rateData?.length - 1];
      }
    }
    return {
      props: {
        initialSession: session,
        user: data[0],
        profilePictureUrl: data[0].avatar_url as string,
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
