"use client";

import { useState } from "react";

const statuses = [
  {
    title: "Order Received",
    description: "Your order has been received by our team.",
    icon: "📦",
  },
  {
    title: "Payment Verified",
    description: "Your advance payment has been verified.",
    icon: "💳",
  },
  {
    title: "Writing Started",
    description: "Your handwritten work is currently being prepared.",
    icon: "✍️",
  },
  {
    title: "Work Completed",
    description: "Your handwritten work has been completed.",
    icon: "✅",
  },
  {
    title: "Shipped",
    description: "Your order has been dispatched.",
    icon: "🚚",
  },
  {
    title: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: "🏠",
  },
];

export default function StatusPage() {
  const [orderId, setOrderId] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Order Received");

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!orderId.trim()) return;

    setLoading(true);
    setError("");
    setSearched(false);

    const cleanOrderId = orderId.trim().toUpperCase();

    try {
      const response = await fetch(
        `/api/order-status?orderId=${encodeURIComponent(cleanOrderId)}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to find order");
      }

      setOrderId(data.orderId);
      setCurrentStatus(data.status);
      setSearched(true);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to check order status. Please check your Order ID and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  const currentIndex = statuses.findIndex(
    (item) => item.title === currentStatus
  );

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      {/* Navbar */}
      <nav className="border-b border-black/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-2xl font-black">
            Write<span className="text-blue-600">Circle</span>
          </a>

          <a
            href="/"
            className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
          >
            ← Home
          </a>
        </div>
      </nav>

      {/* Main */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">

          {/* Heading */}
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Order Tracking
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Track your order.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-black/60">
              Enter your WriteCircle Order ID to check the current
              progress of your handwritten work.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-12 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10"
          >
            <label className="mb-2 block text-sm font-bold">
              Order ID
            </label>

            <input
              type="text"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setSearched(false);
                setError("");
              }}
              placeholder="Example: WM-483921"
              required
              className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 uppercase outline-none transition focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Checking Order..."
                : "Check Order Status →"}
            </button>

            {error && (
              <div className="mt-5 rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                ❌ {error}
              </div>
            )}
          </form>

          {/* Result */}
          {searched && (
            <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10">

              {/* Order Info */}
              <div className="border-b border-black/10 pb-6">
                <p className="text-sm font-semibold text-black/50">
                  ORDER ID
                </p>

                <p className="mt-1 text-3xl font-black">
                  {orderId}
                </p>

                <div className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
                  {currentStatus}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-8">
                {statuses.map((status, index) => {
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={status.title}
                      className="relative flex gap-5 pb-8 last:pb-0"
                    >
                      {/* Connecting Line */}
                      {index !== statuses.length - 1 && (
                        <div
                          className={`absolute left-[19px] top-10 h-full w-[2px] ${
                            index < currentIndex
                              ? "bg-blue-600"
                              : "bg-black/10"
                          }`}
                        />
                      )}

                      {/* Circle */}
                      <div
                        className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                          isCompleted
                            ? "bg-blue-600"
                            : "bg-black/10"
                        }`}
                      >
                        {status.icon}
                      </div>

                      {/* Text */}
                      <div>
                        <h3
                          className={`font-black ${
                            isCurrent
                              ? "text-blue-600"
                              : isCompleted
                              ? "text-black"
                              : "text-black/40"
                          }`}
                        >
                          {status.title}
                        </h3>

                        <p
                          className={`mt-1 text-sm leading-6 ${
                            isCompleted
                              ? "text-black/50"
                              : "text-black/30"
                          }`}
                        >
                          {status.description}
                        </p>

                        {isCurrent && (
                          <span className="mt-2 inline-block text-xs font-bold text-blue-600">
                            ● CURRENT STATUS
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Help */}
              <div className="mt-8 rounded-2xl bg-blue-50 p-5">
                <p className="text-sm font-bold">
                  Need help with your order?
                </p>

                <p className="mt-1 text-sm text-black/60">
                  Contact our team through Telegram and mention
                  your Order ID.
                </p>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="mt-8 text-center text-xs text-black/40">
            Keep your Order ID safe. You&apos;ll need it to track
            your order.
          </div>

        </div>
      </section>
    </main>
  );
}