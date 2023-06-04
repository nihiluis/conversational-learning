export const DEV = process.env.NODE_ENV !== "production"
export const IS_SERVER = typeof window === "undefined"

export const SITE_NAME = "Coding Partner"
export const CHATBOT_NAME = "Fonsi"
export const SITE_DESCRIPTION = "Learn coding together with our smart AI."

export function isDevelopmentMode() {
  return process.env.NODE_ENV === "development"
}
