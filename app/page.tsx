import { Header } from "@/components/landing/header"
import { Hero } from "@/components/landing/hero"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-100 selection:text-zinc-900 flex flex-col justify-between">
      <Header />

      <main className="flex-1">
        <Hero />
      </main>

      <Footer />
    </div>
  )
}
