import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Album, Artist } from "~/utils/types";
interface Data {
  items: {
    albums: Album[];
    artists: Artist[];
  };
}

export const searchRouter = createTRPCRouter({
  searchPage: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const apiUrl = `https://beta-api.stats.fm/api/v1/search?query=${encodeURIComponent(
        input.text
      )}&type=album,artist&limit=10`;
      try {
        let response = await fetch(apiUrl);
        if (!response.ok) {
          if (response.status === 500) {
            const elasticApiUrl = `https://beta-api.stats.fm/api/v1/search/elastic?query=${encodeURIComponent(
              input.text
            )}&type=album,artist&limit=10`;
            response = await fetch(elasticApiUrl);
          } else {
            throw new Error("Network response was not ok");
          }
        }
        const data: Data = (await response.json()) as Data;
        const albums: Album[] = data.items.albums;
        const artists: Artist[] = data.items.artists;
        return {
          albums,
          artists,
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
});
