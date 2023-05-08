import { type NextPage } from "next";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { Album } from "~/utils/types";
const Search: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const searchText = Array.isArray(id) ? id.join(" ") : id || "";
  const searchResult = api.search.searchPage.useQuery({ text: searchText });

  return (
    <>
      <NavBar />
      {searchResult.data ? (
        <div className="mt-8 flex justify-center text-white">
          <div className="flex flex-col">
            <div id="albums-container" className="mb-4">
              <h2 className="text-xl font-bold text-white ">Albums:</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {searchResult.data.albums.map((album: Album) => (
                  <div className="text-white">
                    <div className="mt-2 flex">
                      <img
                        src={album.image}
                        alt=""
                        width={150}
                        className="rounded-lg"
                      />
                      <div className="ml-2">
                        <p className="text-xl font-bold">{album.name}</p>
                        <p>{album.artists[0].name}</p>
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
            </div>
            <div id="artist-container" className="mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">Artist:</h2>{" "}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((post) => (
                    <div className="mt-2 flex items-center">
                      <div className="h-32 w-32 overflow-hidden rounded-full">
                        <img
                          src={
                            "https://i.scdn.co/image/ab6761610000e5eb1f43a06aa30561212e001a66"
                          }
                          alt="Your Image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="ml-2 text-xl font-bold text-white">
                        {"Daft Punk"}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-end">
                    <p className="rounded-2xl border p-1 text-xl font-bold text-white">
                      More... 👉
                    </p>
                  </div>
                </div>{" "}
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
