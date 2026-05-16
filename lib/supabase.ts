import { createClient } from '@supabase/supabase-js'

type SupabaseClient = ReturnType<typeof createClient>

// Both clients are created lazily to avoid errors at build time when env vars
// contain placeholder values. They are memoised after first creation.

let _browser: SupabaseClient | null = null
let _admin: SupabaseClient | null = null

export function getSupabaseBrowser(): SupabaseClient {
  if (!_browser) {
    _browser = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _browser
}

export function getSupabaseAdmin(): SupabaseClient {
  if (!_admin) {
    _admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
  }
  return _admin
}

// Lazy Proxy exports so existing import syntax `supabaseBrowser` / `supabaseAdmin`
// continues to work without callers needing to call the getter functions.
const makeProxy = (getter: () => SupabaseClient): SupabaseClient =>
  new Proxy({} as SupabaseClient, {
    get(_t, prop) {
      return (getter() as unknown as Record<string | symbol, unknown>)[prop]
    },
  })

export const supabaseBrowser: SupabaseClient = makeProxy(getSupabaseBrowser)
export const supabaseAdmin: SupabaseClient = makeProxy(getSupabaseAdmin)
