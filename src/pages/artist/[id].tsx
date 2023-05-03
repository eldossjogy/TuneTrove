import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default function album() {
  return (
    <div>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="grid grid-cols-5 gap-2">
          <img
            src={
              "https://stats.fm/_next/image?url=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab6761610000e5eb7994fcde1acc0cc39b5c3a5a&w=256&q=75"
            }
            width={250}
            className="col-span-5 rounded-md bg-[#18181c] shadow-lg md:col-span-1"
          />
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4">
            <div>
              <p className="text-lg font-semibold text-[#a3a3a3]">
                {"UK Drill"}
              </p>
              <p className="text-2xl font-bold text-white">{"K-Trap"}</p>
            </div>
            <div>
              <a target="_blank" rel="noopener noreferrer">
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
              <p className="font-bold">Release Date</p>
              <p className="mb-2">
                {"September 29, 2002"}
              </p>
              <p className="font-bold">Spotify Popularity</p>
              <p className="mb-2">{"100"}</p>
              <p className="font-bold">Distography:</p>
              <p className="mb-2">{"Album"}</p>
            </div>
          </div>
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4 pb-3">
           <h1 className="text-lg font-bold">Album content</h1>
           <div className="mx-4">
            <div className="grid grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((post) => (
                <div className="text-white">
                  <div className="mt-2 flex">
                    <img
                      src={
                        "https://stats.fm/_next/image?url=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b2738a629945daf305b669ffe2d6&w=256&q=75"
                      }
                      alt=""
                      width={100}
                      className="rounded-lg"
                    />
                    <div className="ml-2">
                      <p className="text-xl font-bold">{"Trapo"}</p>
                      <p>{"daft Pink"}</p>
                      <p>{"30"} Tracks</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
