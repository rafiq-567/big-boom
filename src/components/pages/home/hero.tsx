import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative h-screen mt-[-40px] w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920')"
        }}
      >
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center text-white max-w-3xl px-4">
          
          {/* Heading */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Luxury Furniture for Modern Living
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl lg:text-2xl mb-8 font-light">
            Premium quality furniture crafted with care. Find the perfect piece for every room in your home.
          </p>
          
          {/* Button */}
          <Link href="/shop">
            <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
          </Link>
          
        </div>
      </div>
    </section>
  )
}