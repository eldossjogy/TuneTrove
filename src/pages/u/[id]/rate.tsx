import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { api } from "~/utils/api";
import { Rating, AlbumRating } from "~/utils/types";

export default function rate({ rateList ,username }: { rateList: Rating[], username: string }) {
  const albumMeta = api.album.getMetadata.useQuery({ id: 65252 }).data
    ?.metadata;

  const updatedRateList: AlbumRating[] = [];
  rateList.forEach((track) => {
    if (track.album_id) {
      const albumMeta = api.album.getMetadata.useQuery({ id: track.album_id })
        .data?.metadata;
      const combinedDict: AlbumRating = Object.assign({}, track, albumMeta);
      updatedRateList.push(combinedDict);
    }
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

  
  // console.log(updatedRateList)
  return (
    <>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="flex flex-col">
          <h1 className="mb-2 text-2xl font-bold">{addPossessiveGrammar(username)} ratings:</h1>
          <div id="albums-container" className="mb-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {updatedRateList.map((album, index) => (
                <div
                  className="h-50 w-44 rounded-md bg-[#18181c] p-2"
                  key={index}
                >
                  <div className="h-40 w-40 rounded-lg">
                    <img src={album.image} className="rounded-lg" />
                  </div>
                  <div className="mt-1">
                    <p className="text-lg font-bold">{album.name} </p>
                    <div className="flex justify-between">
                      <p className="font-semibold">
                        {album.artist && album.artist[0] ? album.artist[0].name : ""}
                      </p>
                      <p className="font-bold">{album.rating}</p>
                    </div>
                  </div>
                </div>
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

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .match({ username: userName });

  if (data && data[0]) {
    const { data: rateData, error } = await supabase
      .from("rates")
      .select()
      .match({ user_id: data[0].id });
    return {
      props: {
        initialSession: session,
        username: userName,
        rateList: rateData,
      },
    };
  }
};
