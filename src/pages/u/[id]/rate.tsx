import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
export default function rate() {
  return (
    <>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="flex flex-col">
        <h1 className="text-2xl font-bold mb-2">eldoss' ratings:</h1>
          <div id="albums-container" className="mb-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((post) => (
                <div className="h-50 w-44 bg-[#18181c] p-2 rounded-md">
                  <div className="h-40 w-40 rounded-lg">
                    <img
                      src={
                        "https://stats.fm/_next/image?url=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273339f780dfdbc38558ea0761d&w=256&q=75"
                      }
                      className="rounded-lg"
                    />
                  </div>
                  <div className="mt-1">
                    <p className="text-lg font-bold">THE GOAT </p>
                    <div className="flex justify-between">
                      <p className="font-semibold">Polo G</p>
                      <p className="font-bold">8</p>
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
