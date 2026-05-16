export default function SimulatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen min-h-dvh bg-white overscroll-none">
      {children}
    </div>
  )
}
