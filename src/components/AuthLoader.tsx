import { useEffect } from "react"
import { useRecoilState } from "recoil"
import { userState } from "~/state"
import { api } from "~/utils/api"

export default function AuthLoader() {
  const [_, setUserData] = useRecoilState(userState)

  const getOrCreateUserQuery = api.user.getOrCreateUser.useQuery()

  useEffect(() => {
    const user = getOrCreateUserQuery.data?.user
    setUserData(user ?? null)
  }, [getOrCreateUserQuery.data])

  return null
}
