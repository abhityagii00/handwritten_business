"use client";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#faf9f6]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="text-2xl font-black tracking-tight">
            Write<span className="text-blue-600">Mate</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#services" className="text-sm font-medium hover:text-blue-600">
              Services
            </a>
            <a href="#how" className="text-sm font-medium hover:text-blue-600">
              How It Works
            </a>
            <a href="#faq" className="text-sm font-medium hover:text-blue-600">
              FAQ
            </a>

            <a
              href="/order"
              className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Order Now →
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-black/10 px-6 py-5 md:hidden">
            <div className="flex flex-col gap-5">
              <a href="#services">Services</a>
              <a href="#how">How It Works</a>
              <a href="#faq">FAQ</a>
              <a
                href="#order"
                className="rounded-full bg-black px-5 py-3 text-center font-semibold text-white"
              >
                Order Now →
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Handwritten. Packed. Delivered.
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-8xl">
              Your college work.
              <br />
              <span className="text-blue-600">Done by hand.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-black/60 md:text-xl">
              Send us your notes, assignments or practical files.
              We handwrite everything neatly and deliver the physical
              copy straight to your doorstep.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="/order"
                className="rounded-full bg-black px-7 py-4 text-center font-bold text-white transition hover:-translate-y-1 hover:bg-blue-600"
              >
                Order Your Work →
              </a>

              <a
                 href="/writer"
                className="rounded-full border border-black/20 bg-white px-7 py-4 text-center font-bold transition hover:-translate-y-1 hover:border-black"
              >
                Become a Writer
              </a>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            <Stat number="100%" text="Handwritten" />
            <Stat number="QC" text="Checked Work" />
            <Stat number="Fast" text="Delivery" />
            <Stat number="1:1" text="Human Service" />
          </div>
        </div>

        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-40 top-20 hidden h-96 w-96 rounded-full bg-blue-600/10 blur-3xl lg:block" />
      </section>

      {/* SERVICES */}
      <section id="services" className="border-t border-black/10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              What we handle
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Everything your college file needs.
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Service
              icon="✍️"
              title="Assignments"
              text="Neatly handwritten assignments prepared according to your requirements."
            />

            <Service
              icon="📚"
              title="Notes"
              text="Class notes and study material written clearly and consistently."
            />

            <Service
              icon="🧪"
              title="Practical Files"
              text="Lab records, practical files and diagrams handled from start to finish."
            />

            <Service
              icon="📁"
              title="Project Files"
              text="Complete handwritten project documentation with proper presentation."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-black px-6 py-24 text-white md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Simple process
          </p>

          <h2 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            You send it.
            <br />
            We handle the rest.
          </h2>

          <div className="mt-16 grid gap-10 md:grid-cols-4">
            <Step number="01" title="Send Details" text="Tell us what you need written and share your material." />
            <Step number="02" title="Get Your Quote" text="We check the work and tell you the final price and deadline." />
            <Step number="03" title="50% Advance" text="Pay 50% to confirm your order and start the work." />
            <Step number="04" title="We Deliver" text="Your handwritten physical copy is checked, packed and delivered." />
          </div>
        </div>
      </section>

      {/* ORDER CTA */}
      <section id="order" className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-blue-600 px-7 py-14 text-center text-white md:px-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            Ready?
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
            Stop worrying about handwritten work.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
            Send your requirements on Telegram and our team will take it from there.
          </p>

          <a
            href="/order"
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-block rounded-full bg-white px-8 py-4 font-bold text-black transition hover:-translate-y-1"
          >
            Order on Telegram →
          </a>
        </div>
      </section>

      {/* WRITER */}
      <section id="writer" className="border-t border-black/10 px-6 py-24 md:py-32">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              For writers
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Got neat handwriting?
              <br />
              Turn it into income.
            </h2>

            <p className="mt-6 text-lg leading-8 text-black/60">
              Join our writer network, receive the required material,
              complete assigned work and get paid for every order.
            </p>
          </div>

          <a
            href="https://t.me/WriteMateSupportBot"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-black px-8 py-4 text-center font-bold text-white transition hover:bg-blue-600"
          >
            Apply as Writer →
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-black/10 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            FAQ
          </p>

          <h2 className="text-4xl font-black tracking-tight md:text-6xl">
            Questions, answered.
          </h2>

          <div className="mt-12 divide-y divide-black/10 border-y border-black/10">
            <Faq
              q="How does ordering work?"
              a="Send your requirements and files to us on Telegram. We review them, provide the final quote and start after the 50% advance payment."
            />

            <Faq
              q="Do I receive a physical copy?"
              a="Yes. The work is handwritten on the required material, checked and physically delivered to the address you provide."
            />

            <Faq
              q="How do I become a writer?"
              a="Use the Become a Writer option and send your details and handwriting sample to our Telegram team."
            />

            <Faq
              q="How is payment handled?"
              a="Payment is handled manually through Telegram. Our team will provide the payment details/QR when your payment is due."
            />

            <Faq
              q="What is your cancellation and refund policy?"
              a="If an order is cancelled before writing or material processing begins, refund eligibility will be reviewed based on the order status and any costs already incurred. Once writing or material processing has started, the advance may not be fully refundable because resources and work have already been allocated. If WriteMate is unable to fulfil an accepted order, the amount paid by the customer will be reviewed and refunded as applicable."
            />

            <Faq
            q="How is payment verified?"
            a="All payment proofs are manually verified by the WriteMate team after the customer submits the payment screenshot."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row">
          <div>
            <p className="text-xl font-black">
              Write<span className="text-blue-600">Mate</span>
            </p>
            <p className="mt-2 text-sm text-black/50">
              Handwritten college work, without the hassle.
            </p>
          </div>

          <p className="text-sm text-black/40">
            © 2026 WriteMate. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

/* COMPONENTS */

function Stat({ number, text }: { number: string; text: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-2xl font-black">{number}</p>
      <p className="mt-1 text-sm text-black/50">{text}</p>
    </div>
  );
}

function Service({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="text-4xl">{icon}</div>

      <h3 className="mt-7 text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-black/55">{text}</p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="text-sm font-bold text-blue-400">{number}</p>

      <h3 className="mt-4 text-xl font-black">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-white/50">{text}</p>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-7">
      <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-bold">
        {q}

        <span className="ml-5 text-2xl transition group-open:rotate-45">
          +
        </span>
      </summary>

      <p className="mt-4 max-w-3xl leading-7 text-black/55">{a}</p>
    </details>
  );
}