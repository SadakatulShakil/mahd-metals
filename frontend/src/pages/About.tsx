import About from '../components/About'
import Stats from '../components/Stats'

export default function AboutPage() {
  return (
    <main className="pt-20">
      <div className="py-16 bg-steel-950 text-center">
        <h1 className="text-5xl font-black mb-4">About <span className="text-gold-400">MAHD Metals</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">A partnership built on 40 years of Gulf expertise and global trust.</p>
      </div>
      <Stats />
      <About />
    </main>
  )
}
