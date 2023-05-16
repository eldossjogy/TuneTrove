import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { Album, Artist } from "~/utils/types";
export default function album() {
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
  return (
    <div>
      <NavBar />
      {artistInfo ? (
        <div className="mt-8 flex justify-center text-white">
          <div className="grid grid-cols-5 gap-2">
            <img
              src={artistInfo.image}
              width={250}
              className="col-span-5 rounded-md bg-[#18181c] shadow-lg md:col-span-1"
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
                  href={
                    "https://open.spotify.com/artist/" +
                    artistInfo.externalIds.spotify[0]
                  }
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
              <div>
                <p className="font-bold">Spotify Popularity</p>
                <p className="mb-2">{artistInfo.spotifyPopularity}</p>
                <p className="font-bold">Distography:</p>
                <p className="mb-2">{"Album"}</p>
              </div>
            </div>
            <div className="col-span-5 rounded-md bg-[#18181c] p-2 pb-3 md:col-span-4">
              <h1 className="text-lg font-bold">Album content</h1>
              {artistDiscography ? (
                <div className="mx-4">
                  <div className="grid grid-cols-2">
                    {artistDiscography.map(
                      (album) =>
                        album.type === "album" && (
                          <a href={"/album/" + album.id}>
                            <div className="text-white">
                              <div className="mt-2 flex">
                                <img
                                  src={album.image}
                                  alt=""
                                  width={100}
                                  className="rounded-lg"
                                />
                                <div className="ml-2">
                                  <p className="text-xl font-bold">
                                    {album.name}
                                  </p>
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
