"use client";

import { useState } from "react";

export default function WriterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [qrRequested, setQrRequested] = useState(false);

  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);

  const [error, setError] = useState("");
  const [qrError, setQrError] = useState("");

  const [writerName, setWriterName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const formElement = e.currentTarget;

    setLoading(true);
    setError("");
    setSubmitted(false);
    setQrRequested(false);
    setQrError("");

    const form = new FormData(formElement);

    const writerData = {
      name: form.get("name"),
      telegram: form.get("telegram"),
      phone: form.get("phone"),
      city: form.get("city"),
      handwriting: form.get("handwriting"),
      pagesPerDay: form.get("pagesPerDay"),
      address: form.get("address"),
      experience: form.get("experience"),
    };

    try {
      const response = await fetch("/api/writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(writerData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Writer application failed"
        );
      }

      setWriterName(String(writerData.name || ""));
      setTelegram(String(writerData.telegram || ""));
      setPhone(String(writerData.phone || ""));

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

  async function handleQrRequest() {
    setQrLoading(true);
    setQrError("");
    setQrRequested(false);

    if (!writerName || !telegram || !phone) {
      setQrError(
        "Writer details are missing. Please submit the application first."
      );
      setQrLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/writer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "security-fee-request",
          name: writerName,
          telegram,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "QR request failed"
        );
      }

      setQrRequested(true);
    } catch (err) {
      console.error(err);

      setQrError(
        "Payment QR request could not be sent. Please try again."
      );
    } finally {
      setQrLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">

      {/* NAVBAR */}
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


      {/* HERO */}
      <section className="px-6 py-16 md:py-24">

        <div className="mx-auto max-w-3xl">

          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Become a Writer
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
            Write. Earn. Grow.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">
            Join WriteCircle as a handwriting writer and get
            opportunities to work on college assignments, notes,
            practical files and projects.
          </p>


          {/* BENEFITS */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-2xl">💰</p>

              <h3 className="mt-4 font-black">
                Earn Per Work
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Get paid according to the work and pages you
                complete.
              </p>
            </div>


            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-2xl">🏠</p>

              <h3 className="mt-4 font-black">
                Flexible Work
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Manage your writing work according to your
                availability.
              </p>
            </div>


            <div className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
              <p className="text-2xl">📚</p>

              <h3 className="mt-4 font-black">
                Regular Opportunities
              </h3>

              <p className="mt-2 text-sm leading-6 text-black/50">
                Build your profile and get suitable writing
                opportunities.
              </p>
            </div>

          </div>


          {/* APPLICATION FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-12 space-y-6 rounded-3xl border border-black/10 bg-white p-6 shadow-sm md:p-10"
          >

            <div>
              <h2 className="text-2xl font-black">
                Writer Application
              </h2>

              <p className="mt-2 text-sm text-black/50">
                Fill in your details carefully. Our team will
                review your application.
              </p>
            </div>


            {/* NAME */}
            <Input
              name="name"
              label="Full Name"
              placeholder="Your full name"
              required
            />


            {/* TELEGRAM */}
            <Input
              name="telegram"
              label="Telegram Username"
              placeholder="@username"
              required
            />


            {/* PHONE */}
            <Input
              name="phone"
              label="Phone Number"
              placeholder="10 digit mobile number"
              required
            />


            {/* CITY */}
            <Input
              name="city"
              label="City"
              placeholder="Your city"
              required
            />


            {/* HANDWRITING */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Handwriting Type
              </label>

              <select
                name="handwriting"
                required
                className="w-full rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              >
                <option value="">
                  Select handwriting type
                </option>

                <option>
                  Normal & Neat
                </option>

                <option>
                  Very Neat
                </option>

                <option>
                  Cursive
                </option>

                <option>
                  Mixed
                </option>
              </select>
            </div>


            {/* PAGES PER DAY */}
            <Input
              name="pagesPerDay"
              label="Pages You Can Write Per Day"
              placeholder="Example: 30"
              required
            />


            {/* ADDRESS */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Complete Address
              </label>

              <textarea
                name="address"
                required
                rows={4}
                placeholder="House/Hostel, Street, City, Pincode..."
                className="w-full resize-none rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              />
            </div>


            {/* EXPERIENCE */}
            <div>
              <label className="mb-2 block text-sm font-bold">
                Previous Writing Experience
              </label>

              <textarea
                name="experience"
                rows={4}
                placeholder="Tell us about any previous handwriting/writing work..."
                className="w-full resize-none rounded-2xl border border-black/15 bg-[#faf9f6] px-4 py-4 outline-none transition focus:border-blue-600"
              />
            </div>


            {/* SECURITY FEE NOTICE */}
            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6">

              <p className="font-black text-yellow-900">
                ⚠️ Important — ₹350 Material & Security Fee
              </p>

              <p className="mt-3 text-sm leading-6 text-yellow-900/70">
                Selected writers may be required to pay a
                one-time <strong>₹350 material & security fee</strong>
                before starting work.
              </p>

              <p className="mt-3 text-sm leading-6 text-yellow-900/70">
                This requirement will be discussed with you
                through Telegram after your application is
                reviewed. Please proceed only if you understand
                and are comfortable with this requirement.
              </p>

            </div>


            {/* SAMPLE NOTICE */}
            <div className="rounded-2xl bg-blue-50 p-5 text-sm leading-6 text-black/70">

              📸 <strong>Handwriting Sample Required</strong>

              <br />

              After submitting your application, please send
              2–3 clear photos of your handwriting sample in
              Telegram when our team contacts you.

            </div>


            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black px-7 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending Application..."
                : "Submit Writer Application →"}
            </button>


            {/* APPLICATION SUCCESS */}
            {submitted && (
              <div className="rounded-3xl bg-green-50 p-6">

                <p className="text-center text-sm font-semibold text-green-700">
                  ✅ Writer application submitted successfully!
                </p>

                <p className="mt-3 text-center text-sm leading-6 text-green-700">
                  Your details have been sent to our team.
                  We&apos;ll review your application and continue
                  the conversation through Telegram.
                </p>


                {/* SECURITY FEE CTA */}
                <div className="mt-6 rounded-2xl bg-white p-5">

                  <p className="text-sm font-bold text-black">
                    Ready to proceed?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-black/60">
                    If you are genuinely interested in working
                    with WriteCircle and understand the ₹350
                    material & security fee requirement, you can
                    request a payment QR.
                  </p>


                  <button
                    type="button"
                    onClick={handleQrRequest}
                    disabled={qrLoading}
                    className="mt-5 w-full rounded-full bg-black px-6 py-4 font-bold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {qrLoading
                      ? "Sending QR Request..."
                      : "Request ₹350 Payment QR →"}
                  </button>


                  {/* QR SUCCESS */}
                  {qrRequested && (
                    <div className="mt-5 rounded-2xl bg-green-50 p-5 text-center">

                      <p className="text-sm font-semibold text-green-700">
                        ✅ Payment QR request sent!
                      </p>

                      <p className="mt-2 text-sm leading-6 text-green-700">
                        Our team will contact you through
                        Telegram and manually provide the
                        available payment QR.
                      </p>

                    </div>
                  )}


                  {/* QR ERROR */}
                  {qrError && (
                    <div className="mt-5 rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                      ❌ {qrError}
                    </div>
                  )}

                </div>

              </div>
            )}


            {/* APPLICATION ERROR */}
            {error && (
              <div className="rounded-2xl bg-red-50 p-5 text-center text-sm font-semibold text-red-600">
                ❌ {error}
              </div>
            )}


            <p className="text-center text-xs text-black/40">
              Your application details are not stored in a database.
            </p>

          </form>

        </div>

      </section>

    </main>
  );
}


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