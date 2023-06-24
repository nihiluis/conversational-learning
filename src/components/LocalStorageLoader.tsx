import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { LOCAL_STORAGE_OPENAI_ACCESS_KEY } from "~/constants/key"
import { localStorageLoaded, settingsState } from "~/state"

export default function LocalStorageLoader() {
  const [settings, setSettings] = useRecoilState(settingsState)
  const [isLocalStorageLoaded, setLocaleStorageLoaded] =
    useRecoilState(localStorageLoaded)

  useEffect(() => {
    if (isLocalStorageLoaded) return

    const newSettings = { ...settings }
    if (newSettings.openAiAccessKey.length === 0) {
      newSettings.openAiAccessKey =
        localStorage.getItem(LOCAL_STORAGE_OPENAI_ACCESS_KEY) ??
        settings.openAiAccessKey
    }
    
    setSettings(newSettings)
    setLocaleStorageLoaded(true)
  }, [])

  return null
}
