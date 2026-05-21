import { createFileRoute, Outlet } from "@tanstack/react-router"
import { Footer } from "@/components/Common/Footer"

export const Route = createFileRoute("/_layout")({
  component: Layout,
})

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout