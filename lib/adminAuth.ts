import { cookies } from 'next/headers'

const COOKIE_NAME = 'sportech_admin'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export function setAdminCookie() {
  cookies().set(COOKIE_NAME, 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export function clearAdminCookie() {
  cookies().delete(COOKIE_NAME)
}

export function isAdminAuthenticated(): boolean {
  return cookies().get(COOKIE_NAME)?.value === 'authenticated'
}
