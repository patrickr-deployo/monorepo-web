import { TENANT_KEY, USER_INFO_KEY } from "../enums/cacheEnums"

const merge = (...args: (string | string[] | (() => string | string[]))[]) => {
  const newArray = args.map((element) => {
    if (typeof element === "function") {
      return element()
    }
    return element
  })
  return newArray.flat()
}

export const QUERY_KEYS = {
  STORE: ["STORE"],
  REGISTER: () => merge(QUERY_KEYS.STORE, ["REGISTER__"]),
  LOGIN: () => merge(QUERY_KEYS.STORE, ["LOGIN__"]),
  USER_INFO: () => merge(QUERY_KEYS.STORE, [USER_INFO_KEY]),
  CURRENT_TENANT: () => merge(QUERY_KEYS.STORE, [TENANT_KEY]),
  CREATE_TENANT: () => merge(QUERY_KEYS.STORE, ["CREATE_TENANT__"]),
  STRIPE_CONFIG: () => merge(QUERY_KEYS.STORE, ["STRIPE_CONFIG__"]),
  STRIPE_PRICING: () => merge(QUERY_KEYS.STORE, ["STRIPE_PRICING__"]),
  CHECKOUT: () => merge(QUERY_KEYS.STORE, ["CHECKOUT__"]),
  UPDATE_PROFILE: () => merge(QUERY_KEYS.STORE, ["UPDATE_PROFILE__"]),
  MODELS: () => merge(QUERY_KEYS.STORE, ["MODELS__"]),
  FORGET_PASSWORD: () => merge(QUERY_KEYS.STORE, ["FORGET_PASSWORD__"]),
  CHANGE_PASSWORD_BY_FORGET: () =>
    merge(QUERY_KEYS.STORE, ["CHANGE_PASSWORD_BY_FORGET__"]),
  NOTIFICATIONS: () => merge(QUERY_KEYS.STORE, ["NOTIFICATIONS__"]),
  USERS: () => merge(QUERY_KEYS.STORE, ["USERS__"]),
  AVAILABLE_MENUS: () => merge(QUERY_KEYS.STORE, ["AVAILABLE_MENUS__"]),
  CURRENT_PERMISSIONS: () => merge(QUERY_KEYS.STORE, ["CURRENT_PERMISSIONS__"]),
}
