"use client";

import { useState } from "react";

const statusOptions = [
  "Order Received",
  "Payment Verified",
  "Writing Started",
  "Work Completed",
  "Shipped",
  "Delivered",
];

export default function AdminPage() {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("Order Received");

  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!orderId.trim()) {
      setError("Please enter an Order ID.");
      return;
    }

    setLoading(true);
    setUpdated(false);
    setError("");

    try {
      const response = await fetch("/api/order-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId.trim().toUpperCase(),
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Status update failed");
      }

      setOrderId(data.orderId);
      setStatus(data.status);
      setUpdated(true);
    } catch (error) {
      console.error(error);

      setError(
        "Status update failed. Please check your Order ID and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLogoutLoading(true);

    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }

    window.location.href = "/admin/login";
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
      {/* Navbar */}
      <nav className="border-b border-black/10 px-6 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/" className="text-2xl font-black">
            Write<span className="text-blue-600">Circle</span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-full border border-black/20 px-5 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              ← Home
            </a>

            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">

          {/* Heading */}
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Admin Panel
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
              Manage orders.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
              Update the current status of a customer&apos;s handwritten
              order.
            </p>
          </div>

          {/* Admin Form */}
          <form
            onSubmit={handleUpdate}
            className="mt-12 space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10"
          >

            {/* Order ID */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Order ID
              </label>

              <input
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setUpdated(false);
                  setError("");
                }}
                placeholder="Example: WM-483921"
                required
                className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 uppercase outline-none transition focus:border-blue-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Order Status
              </label>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setUpdated(false);
                  setError("");
                }}
                className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Status */}
            <div className="rounded-2xl bg-blue-50 p-5">
              <p className="text-sm font-semibold text-black/50">
                STATUS TO SET
              </p>

              <p className="mt-2 text-2xl font-black text-blue-600">
                {status}
              </p>

              <p className="mt-1 text-sm text-black/50">
                Order: {orderId || "Not selected"}
              </p>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Updating Status..."
                : "Update Order Status →"}
            </button>

            {/* Success */}
            {updated && (
              <div className="rounded-2xl bg-green-50 p-5 text-center">
                <p className="text-sm font-semibold text-green-700">
                  ✅ Status updated successfully!
                </p>

                <p className="mt-2 text-sm text-green-700">
                  Order ID:
                </p>

                <p className="text-xl font-black text-green-700">
                  {orderId}
                </p>

                <p className="mt-2 text-sm font-bold text-green-700">
                  Current Status: {status}
                </p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                ❌ {error}
              </div>
            )}
          </form>

          {/* Status Flow */}
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-black">
              Order Status Flow
            </h2>

            <div className="mt-6 space-y-4">
              {statusOptions.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-2xl bg-[#faf9f6] p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <p className="font-semibold">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Development Notice */}
          <div className="mt-8 rounded-2xl bg-yellow-50 p-5 text-sm leading-6 text-yellow-800">
            ⚠️ Status is currently stored temporarily for testing.
            Permanent status storage will be added later.
          </div>

        </div>
      </section>
    </main>
  );
}