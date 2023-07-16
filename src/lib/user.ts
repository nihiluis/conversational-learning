import { EduUser } from "@prisma/client"
import { Settings } from "~/state"

export function canUserWriteMessage(
  userData: EduUser | undefined | null,
  settings: Settings
): boolean {
  const hasServerOpenAiAccess = userData ? userData.level > 0 : false
  const hasAccessKeyConfigured = settings.openAiAccessKey.length > 0

  return hasServerOpenAiAccess || hasAccessKeyConfigured
}

export function hasUserServerOpenAiAccess(
  userData: EduUser | undefined | null
): boolean {
  return userData ? userData.level > 0 : false
}
