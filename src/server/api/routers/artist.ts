import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Album, Artist } from "~/utils/types";

export const artistRouter = createTRPCRouter({
  getArtist: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      if (input.id == -1) {
        return undefined;
      }
      const apiUrl: string = `https://beta-api.stats.fm/api/v1/artists/${input.id}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const artistInfo: Artist = data.item;
        return {
          artistInfo: artistInfo,
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
  getDiscography: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      if (input.id == -1) {
        return undefined;
      }
      const apiUrl: string = `https://beta-api.stats.fm/api/v1/artists/${input.id}/albums`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const albumList: Album[] = data.items;

        return {
          albumList: albumList,
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
});
