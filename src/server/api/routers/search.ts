import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const searchRouter = createTRPCRouter({
  searchPage: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      const apiUrl: string = `https://beta-api.stats.fm/api/v1/search?query=${encodeURIComponent(input.text)}&type=album,artist&limit=10`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const albums = data.items.albums;
        const artists = data.items.artists;
        return {
          albums,
          artists
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
});
