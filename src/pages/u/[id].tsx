import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Profile } from "~/utils/types";
export default function album({ user , profilePictureUrl}: { user: Profile , profilePictureUrl: string}) {
  return (
    <div>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="grid grid-cols-5 gap-2">
          <div className="h-64 w-64  overflow-hidden rounded-md">
            <img
              src={profilePictureUrl}
              alt="Profile Picture"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="col-span-5 flex items-end rounded-md bg-[#18181c] p-2 md:col-span-4">
            <div>
              <p className="text-2xl font-bold text-white">{user.username}</p>
              <p className="font-semibold text-gray-400">
                {"Joined " + user.updated_at}
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const userName = ctx.params?.id;
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { data, error } = await supabase
    .from("profiles")
    .select()
    .match({ username: userName });

  if (data && data[0]) {
    const { data: url } = await supabase.storage
    .from("avatars")
    .getPublicUrl(data[0].avatar_url);

    return {
      props: {
        initialSession: session,
        user: data[0],
        profilePictureUrl: url.publicUrl
      },
    };
  }
};
