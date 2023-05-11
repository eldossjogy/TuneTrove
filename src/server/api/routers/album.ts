import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Album, Track } from "~/utils/types";

export const albumRouter = createTRPCRouter({
  getAlbum: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const apiUrl: string = `https://beta-api.stats.fm/api/v1/albums/${input.id}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const albumInfo: Album = data.item;
        return {
          albumInfo: albumInfo,
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
  getTrackList: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const apiUrl: string = `https://beta-api.stats.fm/api/v1/albums/${input.id}/tracks`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const trackList: Track[] = data.items;

        return {
          trackList: trackList,
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
    getMetadata: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const apiUrl: string = `https://beta-api.stats.fm/api/v1/albums/${input.id}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const albumInfo: Album = data.item;
        const metadata = {
          image : albumInfo.image,
          name: albumInfo.name,
          artist: albumInfo.artists,
          id: albumInfo.id

        };
        return {
          metadata: metadata,
        };
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw new Error("Unable to fetch album results");
      }
    }),
});
