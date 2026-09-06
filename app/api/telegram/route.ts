import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram credentials missing",
        },
        { status: 500 }
      );
    }

    const message = `
📚 NEW ORDER REQUEST

🆔 Order ID: ${body.orderId}

👤 Name: ${body.name}
💬 Telegram: ${body.telegram}
📱 Phone: ${body.phone}

📄 Work Type: ${body.workType}
📑 Approx Pages: ${body.pages}
📅 Required By: ${body.date}

🏠 Delivery Address:
${body.address}

📝 Special Instructions:
${body.instructions || "None"}

📎 Customer will send PDF/images in Telegram.
`;

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

    const telegramData = await telegramResponse.json();

    if (!telegramData.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Telegram message failed",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order sent to Telegram",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}