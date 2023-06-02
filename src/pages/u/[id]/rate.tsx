import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import type { Rating, AlbumRating } from "~/utils/types";
import Image from "next/image";
import Head from "next/head";

export default function rate({
  rateList,
  username,
}: {
  rateList: Rating[];
  username: string;
}) {
  const updatedRateList: AlbumRating[] = [];
  rateList.forEach((track) => {
    if (track.album_id) {
      const albumMeta = api.album.getMetadata.useQuery({ id: track.album_id })
        .data?.metadata;
      const combinedDict: AlbumRating = Object.assign({}, track, albumMeta);
      updatedRateList.push(combinedDict);
    }
  });

  // Sort by rating and then alphabetically
  updatedRateList.sort((a, b) => {
    // Handle undefined rating property
    const ratingA = a.rating || 0; 
    const ratingB = b.rating || 0; 
    
    if (ratingA === ratingB) {
      // Handle undefined name property
      const nameA = a.name || ""; 
      const nameB = b.name || "";  
      return nameA.localeCompare(nameB);
    }
    
    return ratingB - ratingA;
  });

  function addPossessiveGrammar(username: string) {
    let possessiveUsername;
    if (username.endsWith("s")) {
      possessiveUsername = username + "'";
    } else {
      possessiveUsername = username + "'s";
    }
    return possessiveUsername;
  }

  return (
    <>
      <Head>
        <title>{`${addPossessiveGrammar(username)} rating`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="flex flex-col">
          <h1 className="mb-2 text-2xl font-bold">
            {addPossessiveGrammar(username)} ratings:
          </h1>
          <div id="albums-container" className="mb-4">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {updatedRateList.map((album, index) => (
                <a href={"/album/" + album.id.toString()} key={index}>
                  <div className="h-50 w-44 rounded-md bg-[#18181c] p-2">
                    <div className="h-40 w-40 rounded-lg">
                      <img
                        src={album.image}
                        alt="Album Cover"
                        height={500}
                        width={500}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="mt-1">
                      <p className="text-lg font-bold">{album.name} </p>
                      <div className="flex justify-between">
                        <p className="font-semibold">
                          {album.artist && album.artist[0]
                            ? album.artist[0].name
                            : ""}
                        </p>
                        <p className="font-bold">{album.rating}</p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
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
      .match({ user_id: data[0].id as number })
      .order("rating", { ascending: false });
    return {
      props: {
        initialSession: session,
        username: userName,
        rateList: rateData,
      },
    };
  }
};
