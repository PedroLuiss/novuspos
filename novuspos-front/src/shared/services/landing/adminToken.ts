/** Inyección del token maestro: `shared/` no importa `features/admin`. */
let readToken: () => string | undefined = () => undefined

export function setLandingAdminTokenReader(reader: () => string | undefined): void {
  readToken = reader
}

export function landingAdminHeaders(): Record<string, string> {
  const token = readToken()?.trim()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
