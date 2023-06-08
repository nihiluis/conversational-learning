import { createTRPCRouter } from "~/server/api/trpc";
import { onboardingRouter } from "~/server/api/routers/onboarding";
import { chatRouter } from "./routers/chat";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  onboarding: onboardingRouter,
  chat: chatRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
