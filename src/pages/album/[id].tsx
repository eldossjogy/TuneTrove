import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import Rate from "~/components/Rate";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { GetServerSidePropsContext } from "next";
import type { Album, Rating, Track } from "~/utils/types";
import { api } from "~/utils/api";
import Image from "next/image";
import Head from "next/head";

export default function Album({ rating }: { rating: Rating[] }) {
  const router = useRouter();
  const { id } = router.query;
  const album_id = parseInt(Array.isArray(id) ? id.join(" ") : id || "");
  const albumInfo: Album | undefined = api.album.getAlbum.useQuery({
    id: album_id,
  })?.data?.albumInfo;

  const trackList: Track[] | undefined = api.album.getTrackList.useQuery({
    id: album_id,
  }).data?.trackList;

  return (
    <div>
      <Head>
        <title>{albumInfo && albumInfo.name ? `${albumInfo.name}` : "Loading..."}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavBar />
      {albumInfo ? (
        <div className="mt-8 flex justify-center text-white">
          <div className="grid grid-cols-5 gap-2">
            <Image
              src={albumInfo.image}
              width={250}
              height={250}
              alt="Album Cover"
              className="col-span-5 rounded-md bg-[#18181c] shadow-lg md:col-span-1"
            />
            <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4">
              <div>
                {albumInfo.artists && albumInfo.artists[0] ? (
                  <>
                    {albumInfo.artists.map((artist, index) => (
                      <span
                        key={artist.id}
                        className="text-lg font-semibold text-[#a3a3a3]"
                      >
                        <a href={`/artist/${artist.id}`}>{artist.name}</a>
                        {index !== albumInfo.artists.length - 1 && ", "}
                      </span>
                    ))}
                  </>
                ) : (
                  ""
                )}

                <p className="text-2xl font-bold text-white">
                  {albumInfo.name}
                </p>
              </div>
              <div>
                <a
                  target="_blank"
                  href={`https://open.spotify.com/album/${
                    albumInfo.externalIds.spotify[0]?.toString() as string
                  }`}
                  rel="noopener noreferrer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="25px"
                    width="25px"
                    version="1.1"
                    viewBox="0 0 168 168"
                  >
                    <path
                      fill="#1ED760"
                      d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="col-span-5 rounded-md  bg-[#18181c] p-2 md:col-span-1">
              <Rate album_id={album_id} stored_rate={rating} />
              <div>
                <p className="font-bold">Release Date</p>
                <p className="mb-2">
                  {new Date(albumInfo.releaseDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="font-bold">Genre</p>
                <p className="mb-2">{albumInfo.genres}</p>
                <p className="font-bold">Spotify Popularity</p>
                <p className="mb-2">{albumInfo.spotifyPopularity}</p>
                <p className="font-bold">Album Type</p>
                <p className="mb-2">{albumInfo.type}</p>
                <p className="font-bold">Number of Tracks</p>
                <p className="mb-2">
                  {albumInfo.totalTracks.toString() + " Tracks"}
                </p>
                <p className="font-bold">Release Label</p>
                {albumInfo.label}
              </div>
            </div>
            <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4">
              {trackList ? (
                <>
                  <h1 className="text-lg font-bold">Album content</h1>
                  <div className="grid grid-cols-3">
                    {trackList.map((track, index) => (
                      <div
                        key={index}
                        className="col-span-3 rounded-md p-2 md:col-span-1"
                        style={{ flexBasis: "30%" }}
                      >
                        <p className="font-bold">{track.name}</p>
                        <p className="ml-4 font-semibold text-[#a3a3a3]">
                          {track.artists && track.artists[0]
                            ? track.artists[0].name
                            : "NONE"}
                        </p>
                      </div>
                    ))}
                  </div>{" "}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </div>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const album_id = ctx.params?.id;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      props: {
        initialSession: session,
        rating: {},
      },
    };

  // Get stored album rating
  const { data, error } = await supabase
    .from("rates")
    .select("created_at, updated_at, rating")
    .match({ user_id: session.user.id, album_id: album_id });

  if (error) {
    console.log(error);
  }

  return {
    props: {
      initialSession: session,
      rating: data,
    },
  };
};
