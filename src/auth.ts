import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

// Passwords come from env vars (AUTH_PASSWORD_<USERNAME>), never from source.
// A user whose env var is unset cannot log in.
const USERS = [
  { id: '1', name: 'Ebrahim', username: 'ebrahim' },
  { id: '2', name: 'Elham',   username: 'elham' },
  { id: '3', name: 'Javad',   username: 'javad' },
]

function passwordFor(username: string): string | undefined {
  return process.env[`AUTH_PASSWORD_${username.toUpperCase()}`] || undefined
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const user = USERS.find(u => {
          const expected = passwordFor(u.username)
          return expected !== undefined &&
            u.username === credentials.username &&
            expected === credentials.password
        })
        return user ?? null
      },
    }),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.username = (user as typeof USERS[0]).username
      return token
    },
    session({ session, token }) {
      session.user.username = token.username as string
      return session
    },
  },
})
