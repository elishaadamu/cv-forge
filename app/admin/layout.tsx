import { Navbar } from "@/components/Navbar"
import { Breadcrumbs } from "@/components/admin/Breadcrumbs"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto pt-6">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  )
}
