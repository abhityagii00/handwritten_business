"use client";

import { useState } from "react";

export default function OrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget;

    setLoading(true);
    setError("");
    setSubmitted(false);

    const form = new FormData(formElement);

    // Unique Order ID
    const newOrderId = `WM-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const orderData = {
      orderId: newOrderId,
      name: form.get("name"),
      telegram: form.get("telegram"),
      phone: form.get("phone"),
      workType: form.get("workType"),
      pages: form.get("pages"),
      date: form.get("date"),
      address: form.get("address"),
      instructions: form.get("instructions"),
    };

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error("Telegram notification failed");
      }

      setOrderId(newOrderId);
      setSubmitted(true);

      formElement.reset();
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again or contact us on Telegram."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">

      {/* NAVBAR */}
      <nav className="border-b border-black/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">

          <a href="/" className="text-2xl font-black">
            Write<span className="text-blue-600">Mate</span>
          </a>

          <a
            href="/"
            className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            ← Home
          </a>

        </div>
      </nav>

      {/* MAIN */}
      <section className="px-6 py-16 md:py-24">

        <div className="mx-auto max-w-3xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Place an order
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            Tell us what you need.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
            Fill in your details. We&apos;ll review your requirements and
            continue the order through Telegram.
          </p>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10"
          >

            <Input
              name="name"
              label="Full Name"
              placeholder="Your full name"
              required
            />

            <Input
              name="telegram"
              label="Telegram Username"
              placeholder="@username"
              required
            />

            <Input
              name="phone"
              label="Phone Number"
              placeholder="10 digit mobile number"
              required
            />

            {/* WORK TYPE */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Work Type
              </label>

              <select
                name="workType"
                required
                className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              >
                <option value="">Select work type</option>
                <option>Assignment</option>
                <option>College Notes</option>
                <option>Practical File</option>
                <option>Lab Record</option>
                <option>Project File</option>
                <option>Other</option>
              </select>
            </div>

            <Input
              name="pages"
              label="Approximate Pages"
              placeholder="Example: 50"
              required
            />

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Required By
              </label>

              <input
                type="date"
                name="date"
                required
                className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Complete Delivery Address
              </label>

              <textarea
                name="address"
                required
                rows={4}
                placeholder="House/Hostel, Street, City, Pincode..."
                className="w-full resize-none rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              />
            </div>

            {/* INSTRUCTIONS */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Special Instructions
              </label>

              <textarea
                name="instructions"
                rows={4}
                placeholder="Any specific handwriting, diagrams, binding, etc."
                className="w-full resize-none rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              />
            </div>

            {/* INFO */}
            <div className="rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-black/70">
              📎 After submitting, your order details will be sent directly
              to our team on Telegram. You can then send your PDF/images
              there.
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending Order..." : "Submit Order →"}
            </button>

            {/* SUCCESS */}
            {submitted && (
              <div className="rounded-2xl bg-green-50 p-5 text-center">

                <p className="text-sm font-semibold text-green-700">
                  ✅ Order submitted successfully!
                </p>

                <p className="mt-2 text-sm text-green-700">
                  Your Order ID is:
                </p>

                <p className="mt-1 text-2xl font-black text-green-700">
                  {orderId}
                </p>

                <a
                  href={`/payment?orderId=${orderId}`}
                  className="mt-5 inline-block rounded-full bg-black px-7 py-3 font-bold text-white transition hover:bg-blue-600"
                >
                  💳 Proceed to 50% Advance Payment →
                </a>

              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                ❌ {error}
              </div>
            )}

            <p className="text-center text-xs text-black/40">
              Your form details are not stored in a database.
            </p>

          </form>

        </div>

      </section>

    </main>
  );
}


/* INPUT COMPONENT */

function Input({
  name,
  label,
  placeholder,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-bold">
        {label}
      </label>

      <input
        name={name}
        type="text"
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
      />

    </div>
  );
}