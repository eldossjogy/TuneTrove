import type { NextPage } from "next";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import type { Album, Artist } from "~/utils/types";
import Image from "next/image";
import Head from "next/head";


const Search: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const searchText = Array.isArray(id) ? id.join(" ") : id || "";
  const searchResult = api.search.searchPage.useQuery({ text: searchText });

  return (
    <>
      <Head>
        <title>{`Search - ${id}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {searchResult.data ? (
        <div className="mt-8 flex justify-center text-white">
          <div className="flex flex-col">
            <div id="albums-container" className="mb-4">
              <h2 className="text-xl font-bold text-white ">Albums:</h2>
              {searchResult.data.albums ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {searchResult.data.albums.map((album: Album) => (
                    <div
                      className="text-white"
                      key={album.id}
                      onClick={() => {
                        {
                          router.push(`/album/${album.id}`).catch((error) => {
                            console.error(error);
                          });
                        }
                      }}
                    >
                      <div className="mt-2 flex">
                        <Image
                          src={album.image}
                          alt="Album Cover"
                          width={150}
                          height={150}
                          className="rounded-lg"
                        />
                        <div className="ml-2">
                          <p className="text-xl font-bold">{album.name}</p>
                          <p>
                            {album.artists && album.artists[0]
                              ? album.artists[0].name
                              : "NONE"}
                          </p>
                          <p>{album.totalTracks} Tracks</p>
                          <p>{album.id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-end">
                    <p className="rounded-2xl border p-1 text-xl font-bold text-white">
                      More... 👉
                    </p>
                  </div>
                </div>
              ) : (
                <>No Album</>
              )}
            </div>
            <div id="artist-container" className="mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Artist:</h2>{" "}
                {searchResult.data.artists ? (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                    {searchResult.data.artists.map((artist: Artist) => (
                      <div
                        className="mt-2 flex items-center"
                        key={artist.id}
                        onClick={() => {
                          {
                            router
                              .push(`/artist/${artist.id}`)
                              .catch((error) => {
                                console.error(error);
                              });
                          }
                        }}
                      >
                        <div className="h-32 w-32 overflow-hidden rounded-full">
                          <Image
                            src={artist.image}
                            alt="Artist Cover"
                            width={150}
                            height={150}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <p className="ml-2 text-xl font-bold text-white">
                          {artist.name}
                        </p>
                      </div>
                    ))}
                    <div className="flex items-end">
                      <p className="rounded-2xl border p-1 text-xl font-bold text-white">
                        More... 👉
                      </p>
                    </div>
                  </div>
                ) : (
                  <>No Artist</>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Footer />
    </>
  );
};

export default Search;
