import { ChangeEvent, useEffect, useState } from "react";
import { Database } from "~/utils/supabase";
import {
  useSupabaseClient,
  useUser,
  useSession,
} from "@supabase/auth-helpers-react";
type Rates = Database["public"]["Tables"]["rates"]["Row"];
import { Rating } from "~/utils/types";
export default function Rate({
  album_id,
  stored_rate,
}: {
  album_id: number;
  stored_rate: Rating[];
}) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [rating, setRating] = useState<Rates["rating"]>(0);
  const [createdDate, setCreateDate] = useState<Rates["created_at"]>("");
  const [updatedDate, setUpdateDate] = useState<Rates["updated_at"]>("");
  const [user_id, setUser] = useState<Rates["user_id"]>("");
  const session = useSession();

  // Only set on first load
  useEffect(() => {
    if (stored_rate && stored_rate.length > 0 && stored_rate[0]) {
      if (
        rating != stored_rate[0].rating ||
        createdDate != stored_rate[0].created_at ||
        updatedDate != stored_rate[0].updated_at
      ) {
        if (
          stored_rate[0].rating != undefined &&
          stored_rate[0].created_at &&
          stored_rate[0].updated_at
        ) {
          setRating(stored_rate[0].rating);
          setCreateDate(stored_rate[0].created_at);
          setUpdateDate(stored_rate[0].updated_at);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      setUser(user.id);
    }
  }, [session]);

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
      if (data[0]) {
        setCreateDate(data[0]?.created_at);
        setUpdateDate(data[0]?.updated_at);
      }
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
      } else {
        setRating(0);
        setCreateDate("");
        setUpdateDate("");
      }
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
          <p className="font-bold"> Rating:</p>
          <div className="flex items-center justify-center text-2xl">
            <div className="mr-10 flex items-center">
              <input
                type="number"
                name=""
                id=""
                max={10}
                min={0}
                defaultValue={0}
                value={rating}
                onChange={handleRatingChange}
                className="w-12 bg-transparent text-right "
              />
              <span className="mt-5 text-xl">/</span>
              <span className="mt-10 text-xl">10</span>
            </div>
          </div>
          <div>
            <p className="text-md font-bold">First time rated:</p>
            <p className="text-gray-400">{new Date(createdDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-md font-bold">Last time rated:</p>
            <p className="text-gray-400">{new Date(updatedDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
