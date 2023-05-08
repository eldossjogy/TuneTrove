import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "~/utils/supabase";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function ProfilePicture({
  url,
  size,
}: {
  uid: string | undefined;
  url: Profiles["avatar_url"];
  size: number;
}) {
  const supabase = useSupabaseClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  return (
     <div className="mt-2 flex items-center">
     <div className="h-12 w-12 overflow-hidden rounded-full">
       {avatarUrl ?
        <img
        src={avatarUrl
                 }
        alt="Your Image"
        className="h-full w-full object-cover"
      />
       : <></>}
     </div>
   </div>
  );
}
