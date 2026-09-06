"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

function PaymentPageContent() {
  const searchParams = useSearchParams();

  const orderIdFromUrl = searchParams.get("orderId") || "";

  const [orderId, setOrderId] = useState(orderIdFromUrl);
  const [totalAmount, setTotalAmount] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [proofLoading, setProofLoading] = useState(false);

  const [error, setError] = useState("");
  const [proofError, setProofError] = useState("");

  // Display-only calculation.
  // Server independently calculates the final advance amount.
  const advanceAmount =
    totalAmount && Number(totalAmount) > 0
      ? Math.ceil(Number(totalAmount) / 2)
      : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSubmitted(false);

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        // Server calculates the 50% advance itself.
        body: JSON.stringify({
          orderId,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Payment request failed");
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);

      setError(
        "Something went wrong. Please try again or contact us on Telegram."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleProofSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setProofLoading(true);
    setProofError("");
    setProofSubmitted(false);

    if (!screenshot) {
      setProofError("Please select your payment screenshot.");
      setProofLoading(false);
      return;
    }

    if (!orderId) {
      setProofError("Order ID is required.");
      setProofLoading(false);
      return;
    }

    if (!totalAmount || Number(totalAmount) <= 0) {
      setProofError("Please enter the total order amount first.");
      setProofLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("orderId", orderId);

      // Used only for the current no-database workflow.
      // Payment API calculates the advance independently.
      formData.append(
        "advanceAmount",
        advanceAmount.toString()
      );

      formData.append("screenshot", screenshot);

      const response = await fetch("/api/payment-proof", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Payment proof upload failed"
        );
      }

      setProofSubmitted(true);
      setScreenshot(null);

      // Reset file input
      const fileInput = document.getElementById(
        "paymentScreenshot"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error(err);

      setProofError(
        "Payment proof could not be sent. Please try again."
      );
    } finally {
      setProofLoading(false);
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

          {/* TITLE */}
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Advance Payment
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            Pay your 50% advance.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
            Request your payment QR and submit your payment
            screenshot after completing the payment.
          </p>


          {/* PAYMENT REQUEST FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10"
          >

            {/* ORDER ID */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Order ID
              </label>

              <input
                type="text"
                value={orderId}
                onChange={(e) => {
                  setOrderId(e.target.value);
                  setSubmitted(false);
                  setError("");
                }}
                placeholder="Example: WM-483921"
                required
                className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 uppercase outline-none transition focus:border-blue-600"
              />

              {orderIdFromUrl && (
                <p className="mt-2 text-xs text-green-600">
                  ✓ Order ID automatically added from your order
                </p>
              )}
            </div>


            {/* TOTAL AMOUNT */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Total Order Amount
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold">
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={totalAmount}
                  onChange={(e) => {
                    setTotalAmount(e.target.value);
                    setSubmitted(false);
                    setError("");
                  }}
                  placeholder="Example: 800"
                  required
                  className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] py-4 pl-9 pr-4 outline-none transition focus:border-blue-600"
                />

              </div>
            </div>


            {/* ADVANCE */}
            <div className="rounded-3xl bg-blue-50 p-6">

              <p className="text-sm font-semibold text-black/60">
                50% Advance Required
              </p>

              <p className="mt-2 text-4xl font-black text-blue-600">
                ₹{advanceAmount || "0"}
              </p>

              <p className="mt-2 text-sm text-black/50">
                This amount must be paid before work/material
                processing begins.
              </p>

            </div>


            {/* QR INFO */}
            <div className="rounded-2xl border border-dashed border-black/20 p-5">

              <h3 className="font-bold">
                💳 How will I pay?
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/60">
                Click the button below to request a payment QR.
                Our team will manually send an available payment
                QR through Telegram.
              </p>

            </div>


            {/* REQUEST QR */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Requesting Payment QR..."
                : "Request Payment QR →"}
            </button>


            {/* REQUEST SUCCESS */}
            {submitted && (
              <div className="rounded-2xl bg-green-50 p-5 text-center text-sm font-semibold text-green-700">

                ✅ Payment QR request sent!

                <br />

                Our team will send the QR through Telegram.

                <br />

                <span className="mt-2 inline-block font-black">
                  Order: {orderId}
                </span>

              </div>
            )}


            {/* REQUEST ERROR */}
            {error && (
              <div className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                ❌ {error}
              </div>
            )}

          </form>


          {/* PAYMENT PROOF SECTION */}
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Payment Completed?
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Submit Payment Proof
            </h2>

            <p className="mt-3 text-sm leading-6 text-black/60">
              After completing the payment, upload a clear screenshot
              of your successful transaction. Our team will verify it
              manually.
            </p>


            <form
              onSubmit={handleProofSubmit}
              className="mt-8 space-y-5"
            >

              {/* ORDER ID */}
              <div>
                <label className="mb-2 block text-sm font-bold">
                  Order ID
                </label>

                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setProofSubmitted(false);
                    setProofError("");
                  }}
                  placeholder="Example: WM-483921"
                  required
                  className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 uppercase outline-none transition focus:border-blue-600"
                />
              </div>


              {/* SCREENSHOT */}
              <div>

                <label
                  htmlFor="paymentScreenshot"
                  className="mb-2 block text-sm font-bold"
                >
                  Payment Screenshot
                </label>

                <input
                  id="paymentScreenshot"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  onChange={(e) => {
                    setScreenshot(
                      e.target.files?.[0] || null
                    );
                    setProofSubmitted(false);
                    setProofError("");
                  }}
                  className="w-full rounded-2xl border border-dashed border-black/20 bg-[#faf9f6] px-4 py-4 text-sm"
                />

                <p className="mt-2 text-xs text-black/40">
                  JPG, PNG or WEBP • Maximum 10 MB
                </p>

              </div>


              {/* AMOUNT */}
              <div className="rounded-2xl bg-blue-50 p-5">

                <p className="text-sm text-black/60">
                  Expected Advance
                </p>

                <p className="mt-1 text-2xl font-black text-blue-600">
                  ₹{advanceAmount || "0"}
                </p>

              </div>


              {/* SUBMIT PROOF */}
              <button
                type="submit"
                disabled={proofLoading}
                className="w-full rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {proofLoading
                  ? "Sending Payment Proof..."
                  : "Submit Payment Proof →"}
              </button>


              {/* PROOF SUCCESS */}
              {proofSubmitted && (
                <div className="rounded-2xl bg-green-50 p-5 text-center text-sm font-semibold text-green-700">

                  ✅ Payment proof submitted successfully!

                  <br />

                  Our team will verify your payment manually.

                </div>
              )}


              {/* PROOF ERROR */}
              {proofError && (
                <div className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                  ❌ {proofError}
                </div>
              )}

            </form>

          </div>

        </div>

      </section>

    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f6]" />
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}