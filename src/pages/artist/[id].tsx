import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import type { Album, Artist } from "~/utils/types";
import Image from "next/image";
import Head from "next/head";

export default function Artist() {
  const router = useRouter();
  const { id } = router.query;
  const artist_id = parseInt(Array.isArray(id) ? id.join(" ") : id || "-1");
  const artistInfo: Artist | undefined = api.artist.getArtist.useQuery({
    id: artist_id,
  })?.data?.artistInfo;

  const artistDiscography: Album[] | undefined =
    api.artist.getDiscography.useQuery({
      id: artist_id,
    })?.data?.albumList;

    // Sort by release date
    const sortedDiscography = artistDiscography?.sort((a, b) => b.releaseDate - a.releaseDate);

  return (
    <div>
      <Head>
        <title>{`${artistInfo?.name}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {artistInfo ? (
        <div className="mt-8 flex justify-center text-white">
          <div className="grid grid-cols-5 gap-2">
            <Image
              src={artistInfo.image}
              width={250}
              height={250}
              alt="Artist Image"
              className="col-span-5 rounded-md bg-[#18181c] shadow-lg md:col-span-1 mx-auto"
              />
            <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4">
              <div>
                <p className="text-lg font-semibold text-[#a3a3a3]">
                  {artistInfo.genres.join(", ")}
                </p>
                <p className="text-2xl font-bold text-white">
                  {artistInfo.name}
                </p>
              </div>
              <div>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://open.spotify.com/artist/${
                    artistInfo.externalIds.spotify[0]?.toString() as string
                  }`}
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
              <div>
                <p className="font-bold">Spotify Popularity</p>
                <p className="mb-2">{artistInfo.spotifyPopularity}</p>
                <p className="font-bold">Distography:</p>
                <p className="mb-2">{"Album"}</p>
              </div>
            </div>
            <div className="col-span-5 rounded-md bg-[#18181c] p-2 pb-3 md:col-span-4">
              <h1 className="text-lg font-bold">Album content</h1>
              {sortedDiscography ? (
                <div className="mx-4">
                  <div className="grid md:grid-cols-2 ">
                    {sortedDiscography.map(
                      (album) =>
                        album.type === "album" && 
                        (
                          <a
                            href={"/album/" + album.id.toString()}
                            key={album.id}
                          >
                            <div className="text-white">
                              <div className="mt-2 flex">
                                <Image
                                  src={album.image}
                                  alt="Album Cover"
                                  width={100}
                                  height={100}
                                  className="rounded-lg"
                                />
                                <div className="ml-2">
                                  <p className="text-xl font-bold">
                                    {album.name}
                                  </p>
                                  {/* <p>
                                    {album.type.charAt(0).toUpperCase() + album.type.slice(1)}
                                  </p> */}
                                  <p>
                                    {album.artists
                                      .map((item) => item.name)
                                      .join(", ")}
                                  </p>
                                  <p>{album.totalTracks} Tracks</p>
                                </div>
                              </div>
                            </div>
                          </a>
                        )
                    )}
                  </div>
                </div>
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
