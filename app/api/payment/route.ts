import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --------------------------------
    // Order ID
    // --------------------------------

    const orderId = String(body.orderId || "")
      .trim()
      .toUpperCase();

    // --------------------------------
    // Total Amount
    // --------------------------------

    const totalAmount = Number(body.totalAmount);

    // --------------------------------
    // Basic validation
    // --------------------------------

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    // Order ID format validation
    if (!/^WM-\d{6}$/.test(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Order ID format",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid total order amount",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // 🔐 SERVER-SIDE ADVANCE CALCULATION
    // --------------------------------
    //
    // IMPORTANT:
    // We do NOT trust advanceAmount
    // sent by the browser.
    //
    // The server calculates it itself.

    const advanceAmount = Math.ceil(totalAmount / 2);

    // --------------------------------
    // Telegram credentials
    // --------------------------------

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error(
        "Telegram credentials are missing"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment service is temporarily unavailable",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // Telegram message
    // --------------------------------

    const message = `
💰 PAYMENT QR REQUEST

🆔 Order ID: ${orderId}

💵 Total Order Amount: ₹${totalAmount}

💳 50% Advance Required: ₹${advanceAmount}

⚡ Customer has requested a payment QR.

📌 ACTION REQUIRED:
Please check which team member is currently available and manually send their payment QR to the customer through Telegram.

❌ No fixed QR is stored on the website.

🔐 Advance amount was calculated server-side.
`;

    // --------------------------------
    // Send Telegram message
    // --------------------------------

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

    const telegramData =
      await telegramResponse.json();

    // --------------------------------
    // Telegram validation
    // --------------------------------

    if (
      !telegramResponse.ok ||
      !telegramData.ok
    ) {
      console.error(
        "Telegram error:",
        telegramData
      );

      return NextResponse.json(
        {
          success: false,
          error: "Telegram message failed",
        },
        { status: 500 }
      );
    }

    // --------------------------------
    // Success
    // --------------------------------

    return NextResponse.json({
      success: true,
      message: "Payment request sent to Telegram",

      // Server-calculated amount
      advanceAmount,
    });

  } catch (error) {
    console.error(
      "Payment API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}