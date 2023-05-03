import { type NextPage } from "next";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
const Search: NextPage = () => {
  return (
    <>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="flex flex-col">
          <div id="albums-container" className="mb-4">
            <h2 className="text-xl font-bold text-white ">Albums:</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((post) => (
                <div className="text-white">
                  <div className="mt-2 flex">
                    <img
                      src={
                        "https://stats.fm/_next/image?url=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b2731d97ca7376f835055f828139&w=256&q=75"
                      }
                      alt=""
                      width={150}
                      className="rounded-lg"
                    />
                    <div className="ml-2">
                      <p className="text-xl font-bold">
                        {"Random Access Memoeries"}
                      </p>
                      <p>{"daft Pink"}</p>
                      <p>{"30"} Tracks</p>
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
      <Footer />
    </>
  );
};

export default Search;
