import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { sessionStore } from '@/shared/lib/auth-storage'
import { API_URL, REVERB_CONFIG } from '@/shared/lib/env'
import type { UserNotification } from '../types'

type NotificationHandler = (notification: UserNotification) => void
type EventPayload = { notification?: UserNotification }

interface SharedSubscription {
  client: Echo<'reverb'>
  dispatch: (payload: EventPayload) => void
  handlers: Set<NotificationHandler>
}

let echo: Echo<'reverb'> | null = null
let echoToken: string | null = null
const subscriptions = new Map<string, SharedSubscription>()

function getEcho(token: string): Echo<'reverb'> {
  if (echo && echoToken === token) return echo

  echo?.disconnect()
  subscriptions.clear()
  window.Pusher = Pusher
  echo = new Echo<'reverb'>({
    broadcaster: 'reverb',
    key: REVERB_CONFIG.key,
    wsHost: REVERB_CONFIG.host,
    wsPort: REVERB_CONFIG.port,
    wssPort: REVERB_CONFIG.port,
    forceTLS: REVERB_CONFIG.scheme === 'https',
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })
  echoToken = token
  return echo
}

/** Suscribe al usuario a los canales privados de avisos globales y dirigidos. */
export function subscribeToUserNotifications(userId: string, handler: NotificationHandler): () => void {
  const token = sessionStore.getToken()
  if (!token || !userId) return () => {}

  const client = getEcho(token)
  let subscription = subscriptions.get(userId)

  if (!subscription) {
    const handlers = new Set<NotificationHandler>()
    const dispatch = (payload: EventPayload) => {
      if (!payload?.notification) return
      handlers.forEach((listener) => listener(payload.notification as UserNotification))
    }

    client.private('notifications.all').listen('.notification.created', dispatch)
    client.private(`notifications.${userId}`).listen('.notification.created', dispatch)

    subscription = { client, dispatch, handlers }
    subscriptions.set(userId, subscription)
  }

  subscription.handlers.add(handler)

  return () => {
    const current = subscriptions.get(userId)
    if (!current) return
    current.handlers.delete(handler)
    if (current.handlers.size > 0) return

    current.client.private('notifications.all').stopListening('.notification.created', current.dispatch)
    current.client.private(`notifications.${userId}`).stopListening('.notification.created', current.dispatch)
    current.client.leaveChannel('notifications.all')
    current.client.leaveChannel(`notifications.${userId}`)
    subscriptions.delete(userId)
  }
}

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}
