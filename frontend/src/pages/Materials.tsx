import Materials from '../components/Materials'

export default function MaterialsPage() {
  return (
    <main className="pt-20">
      <div className="py-16 bg-steel-950 text-center">
        <h1 className="text-5xl font-black mb-4">Our <span className="text-gold-400">Materials</span></h1>
        <p className="text-gray-400 max-w-2xl mx-auto">Premium ferrous, non-ferrous, and specialty alloy metals — sourced and traded globally.</p>
      </div>
      <Materials />
    </main>
  )
}
