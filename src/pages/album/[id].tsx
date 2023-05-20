import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import Rate from "~/components/Rate";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Album, Rating, Track } from "~/utils/types";
import { api } from "~/utils/api";

export default function album({ rating }: { rating: Rating[] }) {
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
      <NavBar />
      {albumInfo ? (
        <div className="mt-8 flex justify-center text-white">
          <div className="grid grid-cols-5 gap-2">
            <img
              src={albumInfo.image}
              width={250}
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
                  href={
                    "https://open.spotify.com/album/" +
                    albumInfo.externalIds.spotify[0]
                  }
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://www.freepnglogos.com/uploads/spotify-logo-png/file-spotify-logo-png-4.png"
                    alt=""
                    width={25}
                    className="mt-2"
                  />
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
                <p className="mb-2">{albumInfo.totalTracks + " Tracks"}</p>
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
