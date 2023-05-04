import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";

export default function album() {
  return (
    <div>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="grid grid-cols-5 gap-2">
          <div className="h-64 w-64  overflow-hidden rounded-md">
            <img
              src={
                "https://qmctnmadiyjqmckffnao.supabase.co/storage/v1/object/sign/avatars/84f6357e-99dc-4751-80a9-cb43ac7f6fc8.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzLzg0ZjYzNTdlLTk5ZGMtNDc1MS04MGE5LWNiNDNhYzdmNmZjOC53ZWJwIiwiaWF0IjoxNjgzMTYzODgzLCJleHAiOjE2ODM3Njg2ODN9.PSQSONXE32tgj0-hnpoEI3ZPiMY2z0UKgnB4ZZQVcGs&t=2023-05-04T01%3A31%3A22.685Z"
              }
              alt="Your Image"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-span-5 flex items-end rounded-md bg-[#18181c] p-2 md:col-span-4">
            <div>
              <p className="text-2xl font-bold text-white">{"eldossjogy"}</p>
              <p className="font-semibold text-gray-400">
                {"Joined Septemer 29, 2002"}
              </p>
            </div>
          </div>
          <div className="col-span-5 rounded-md  bg-[#18181c] p-2 md:col-span-1">
            <div>
              <p className="font-bold">Albums Rated</p>
              <p className="mb-2">{"52 Albums"}</p>
              <p className="font-bold">Mean Score</p>
              <p className="mb-2">{"64.73"}</p>
            </div>
          </div>
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 pb-3 md:col-span-4">
            <div className="mb-3">
              <p className="font-bold">Recently Rated:</p>
              <div className="mt-2 flex items-center">
                <img
                  src={
                    "https://stats.fm/_next/image?url=https%3A%2F%2Fi.scdn.co%2Fimage%2Fab67616d0000b273c01fb46a028208757ee93fbc&w=256&q=75"
                  }
                  alt=""
                  width={150}
                  className="rounded-lg"
                />
                <div className="ml-2">
                  <p className="text-xl font-bold">{"Tana Talk 4"}</p>
                  <p>{"Benny The Butcher"}</p>
                  <p>⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>
            <div>
              <p className="font-bold">Score Distribution:</p>
              
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
