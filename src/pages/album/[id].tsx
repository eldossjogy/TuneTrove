import React from "react";
import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";
import Rate from "~/components/Rate";
import { useRouter } from "next/router";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Rating } from "~/utils/types";

export default function album({ rating }: { rating: Rating[] }) {
  const router = useRouter();
  const { id } = router.query;
  const album_id = parseInt(Array.isArray(id) ? id.join(" ") : id || "");
  return (
    <div>
      <NavBar />
      <div className="mt-8 flex justify-center text-white">
        <div className="grid grid-cols-5 gap-2">
          <img
            src={
              "https://i.scdn.co/image/ab67616d0000b2739034364176f931f5eba3382e"
            }
            width={250}
            className="col-span-5 rounded-md bg-[#18181c] shadow-lg md:col-span-1"
          />
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4">
            <div>
              <p className="text-lg font-semibold text-[#a3a3a3]">
                {"Daft Punk"}
              </p>
              <p className="text-2xl font-bold text-white">{"Discovery"}</p>
            </div>
            <div>
              <a
                target="_blank"
                // href={
                //   "https://open.spotify.com/album/" +
                //   posts.externalIds.spotify[0]
                // }
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
                {/* {new Date(posts.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} */}
                {"September 29, 2002"}
              </p>
              <p className="font-bold">Genre</p>
              <p className="mb-2">{"Disco"}</p>
              <p className="font-bold">Spotify Popularity</p>
              <p className="mb-2">{"100"}</p>
              <p className="font-bold">Album Type</p>
              <p className="mb-2">{"Album"}</p>
              <p className="font-bold">Number of Tracks</p>
              <p className="mb-2">{"25 Tracks"}</p>
              <p className="font-bold">Release Label</p>
              {"Daft Punk Inc."}
            </div>
          </div>
          <div className="col-span-5 rounded-md bg-[#18181c] p-2 md:col-span-4">
            <h1 className="text-lg font-bold">Album content</h1>
            <div className="grid grid-cols-3">
              {[
                "Around the World",
                "One More Time",
                "Get Lucky",
                "Harder, Better, Faster, Stronger",
                "Digital Love",
                "Instant Crush",
                "Something About Us",
                "Lose Yourself to Dance",
                "Robot Rock",
                "Aerodynamic",
                "Face to Face",
                "Technologic",
                "Da Funk",
                "Veridis Quo",
                "Giorgio by Moroder",
                "Human After All",
                "Teachers",
                "Within",
                "Crescendolls",
                "Touch",
                "Superheroes",
                "Nightvision",
                "Voyager",
                "Doin' It Right",
                "The Game of Love",
              ].map((item, index) => (
                <div
                  key={index}
                  className="col-span-3 rounded-md p-2 md:col-span-1"
                  style={{ flexBasis: "30%" }}
                >
                  <p className="font-bold">
                    {index + 1}. {item}
                  </p>
                  <p className="ml-4 font-semibold text-[#a3a3a3]">
                    {"Daft Punk"}
                  </p>
                </div>
              ))}
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
  const album_id = ctx.params?.id;
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
