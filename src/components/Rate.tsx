import { ChangeEvent, useEffect, useState } from "react";
import { Database } from "~/utils/supabase";
import {
  useSupabaseClient,
  useUser,
  useSession,
} from "@supabase/auth-helpers-react";
type Rates = Database["public"]["Tables"]["rates"]["Row"];

export default function Rate({ album_id }: { album_id: number }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [rating, setRating] = useState<Rates["rating"]>(0);
  const [user_id, setUser] = useState<Rates["user_id"]>("");
  const session = useSession();

  useEffect(() => {
    if (user?.id != null) {
      setUser(user?.id);
      // getRating();
    }
  }, [session]);

  // async function getRating() {
  //   const { data, error } = await supabase
  //     .from("rates")
  //     .select("created_at, updated_at, rating")
  //     .match({ user_id: user_id, album_id: album_id });
  //   console.log(data, error);
  // }

  async function saveRating() {
    try {
      const { data, error } = await supabase
        .from("rates")
        .upsert(
          {
            user_id: user_id,
            album_id: album_id,
            rating: rating,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id, album_id" }
        )
        .select();
      if (data == null) {
        throw error;
      }
      // else {
      //   console.log(data);
      // }
    } catch (error: any) {
      console.log(error);
    }
  }

  async function deleteRating() {
    try {
      const { data, error } = await supabase
        .from("rates")
        .delete()
        .match({ user_id: user_id, album_id: album_id })
        .select();
      if (data == null) {
        throw error;
      }
      // else {
      //   console.log(data);
      // }
    } catch (error: any) {
      console.log(error);
    }
  }

  const handleRatingChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      setRating(value);
    }
  };

  return (
    <div>
      {user_id ? (
        <div className="rounded-md bg-stone-800 p-2">
          <p className="font-bold">{album_id} Rating:</p>
          <div className="flex items-center justify-center text-2xl">
            <div className="mr-10 flex items-center">
              <input
                type="number"
                name=""
                id=""
                max={10}
                min={0}
                defaultValue={rating}
                onChange={handleRatingChange}
                className="w-12 bg-transparent text-right "
              />
              <span className="mt-5 text-xl">/</span>
              <span className="mt-10 text-xl">10</span>
            </div>
          </div>
          <div>
            <p className="text-md font-bold">First time rated:</p>
            <p className="text-gray-400">209123093 at 91023</p>
            <p className="text-md font-bold">Last time rated:</p>
            <p className="text-gray-400">209123093 at 91023</p>
          </div>
          <div className="flex justify-between">
            <button
              type="submit"
              className="mt-2 rounded  bg-green-500 px-2 py-1 font-bold text-white"
              onClick={saveRating}
            >
              Save
            </button>
            <button
              onClick={deleteRating}
              type="submit"
              className="mt-2 rounded bg-red-500 px-2 py-1 font-bold text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-2 rounded-md bg-stone-800 p-2 text-center font-bold">
          Login to Rate Albums
        </div>
      )}
    </div>
  );
}
