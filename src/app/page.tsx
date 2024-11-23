import Header from '@/components/Header'
import SwapCard from '@/components/SwapCard'
import FAQ from '@/components/FAQ'

export default function Home() {
  return (
    <div className="min-h-screen bg-nord-0">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-[480px] mx-auto">
          <SwapCard />
          <FAQ />
        </div>
      </main>
    </div>
  )
}
