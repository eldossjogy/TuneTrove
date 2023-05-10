import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { searchRouter } from "~/server/api/routers/search";
import { albumRouter } from "~/server/api/routers/album";
 
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  search: searchRouter,
  album: albumRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
