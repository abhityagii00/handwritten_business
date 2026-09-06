import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const orderIdValue = formData.get("orderId");
    const advanceAmountValue = formData.get("advanceAmount");
    const screenshot = formData.get("screenshot");

    // --------------------------------
    // Basic field validation
    // --------------------------------

    if (!orderIdValue || typeof orderIdValue !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const orderId = orderIdValue.trim().toUpperCase();

    if (!/^WM-\d{6}$/.test(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Order ID format",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Advance amount validation
    // --------------------------------

    const advanceAmount = Number(advanceAmountValue);

    if (
      !Number.isFinite(advanceAmount) ||
      advanceAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid advance amount",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Screenshot validation
    // --------------------------------

    if (!screenshot || !(screenshot instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment screenshot is required",
        },
        { status: 400 }
      );
    }

    // Allow only common image formats
    if (!ALLOWED_IMAGE_TYPES.includes(screenshot.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only JPG, PNG or WEBP images are allowed",
        },
        { status: 400 }
      );
    }

    // Maximum 10 MB
    if (screenshot.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Screenshot must be smaller than 10 MB",
        },
        { status: 400 }
      );
    }

    // Empty file check
    if (screenshot.size === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Uploaded screenshot is empty",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Telegram credentials
    // --------------------------------

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error("Telegram credentials are missing");

      return NextResponse.json(
        {
          success: false,
          error: "Payment service is temporarily unavailable",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // Telegram caption
    // --------------------------------

    const caption = `
💰 PAYMENT PROOF RECEIVED

🆔 Order ID: ${orderId}

💳 Advance Amount: ₹${advanceAmount}

📸 Customer has submitted a payment screenshot.

⚠️ ACTION REQUIRED:
Please verify the payment manually before marking the order as paid.
`;

    // --------------------------------
    // Send screenshot to Telegram
    // --------------------------------

    const telegramForm = new FormData();

    telegramForm.append("chat_id", chatId);
    telegramForm.append(
      "photo",
      screenshot,
      screenshot.name || "payment-screenshot"
    );
    telegramForm.append("caption", caption);

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendPhoto`,
      {
        method: "POST",
        body: telegramForm,
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      console.error("Telegram error:", telegramData);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to send payment proof to Telegram",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // Success
    // --------------------------------

    return NextResponse.json({
      success: true,
      message: "Payment proof sent successfully",
    });
  } catch (error) {
    console.error("Payment proof error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}