import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type { Database } from "~/utils/supabase";
import Image from "next/image";
type Profiles = Database["public"]["Tables"]["profiles"]["Row"];

export default function Avatar({
  uid,
  url,
  size,
  rounded,
  onUpload,
}: {
  uid: string | undefined;
  url: Profiles["avatar_url"];
  size: number;
  rounded: number;
  onUpload?: (url: string) => void;
}) {
  const supabase = useSupabaseClient<Database>();
  const [avatarUrl, setAvatarUrl] = useState<Profiles["avatar_url"]>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url)
      downloadImage(url).catch((error) => {
        console.error(error);
      });
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

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file?.name.split(".").pop();
      const fileName = `${uid as string}.${fileExt as string}`;
      const filePath = `${fileName}`;
      if (file != undefined) {
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });
        if (uploadError) {
          throw uploadError;
        }
      } else {
        alert("Invalid image upload");
      }

      if (onUpload) {
        onUpload(filePath);
      }
    } catch (error) {
      alert("Error uploading avatar!");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          width={size}
          height={size}
          style={{ height: size, width: size, borderRadius: rounded }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      {onUpload ? (
        <div style={{ width: size }}>
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading ..." : "Upload"}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={(e) => void uploadAvatar(e)}
            disabled={uploading}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
