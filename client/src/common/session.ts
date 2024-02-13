const storeToSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value)
}

const lookInSession = (key: string) => {
  return sessionStorage.getItem(key)
}

const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key)
}

export interface UserSession {
  access_token: string,
  profile_img?: string,
  username?: string,
  fullname?: string,
}

export { storeToSession, lookInSession, removeFromSession }