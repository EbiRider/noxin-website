import 'next-auth'
import type { Server } from 'socket.io'

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      username: string
    }
  }
}

declare global {
  // eslint-disable-next-line no-var
  var _io: Server | undefined
}
