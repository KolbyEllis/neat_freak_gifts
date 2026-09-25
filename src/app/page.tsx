import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=2000&q=80"
            alt="Carefully wrapped gifts with ribbon and soft light"
            fill
            priority
            className="hero-media object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c2b24]/88] via-[#1c2b24]/55] to-[#1c2b24]/20" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-end px-6 pb-16 pt-10 sm:px-10 sm:pb-20">
          <p className="animate-rise font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-paper sm:text-6xl md:text-7xl">
            Neat Freak Gifts
            <span className="brand-underline mt-3 block h-1 w-28 bg-mint" />
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-xl font-[family-name:var(--font-display)] text-2xl font-medium leading-snug text-paper sm:text-3xl">
            Gifts that feel intentional, tidy, and ready to delight.
          </h1>
          <p className="animate-rise-delay mt-4 max-w-lg text-base leading-relaxed text-sand sm:text-lg">
            Curated presents for organizers, hosts, and anyone who notices the
            details.
          </p>
          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <a
              href="#collections"
              className="rounded-md bg-mint px-5 py-3 text-sm font-semibold text-ink transition hover:bg-[#95c9ad]"
            >
              Browse collections
            </a>
            <a
              href="#contact"
              className="rounded-md border border-sand/50 px-5 py-3 text-sm font-semibold text-paper transition hover:bg-paper/10"
            >
              Request a custom gift
            </a>
          </div>
        </div>
      </section>

      <section id="collections" className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Collections
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/75">
          A starter storefront for your brand. We can expand this into product
          pages, checkout, custom orders, and more.
        </p>
        <ul className="mt-10 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Desk Reset",
              copy: "Pens, trays, and tidy tools that make work feel calm.",
            },
            {
              title: "Host Kit",
              copy: "Ready-to-gift pieces for dinner parties and guest rooms.",
            },
            {
              title: "Little Luxuries",
              copy: "Small, thoughtful items that still feel premium.",
            },
          ].map((item) => (
            <li key={item.title} className="border-t border-ink/15 pt-5">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-semibold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{item.copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="border-t border-ink/10 bg-sand/40 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight">
            Let’s build this out
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/75">
            Tell me what you sell, your vibe, and any products/photos — and I’ll
            turn this into a full gift shop experience.
          </p>
        </div>
      </section>
    </main>
  );
}
