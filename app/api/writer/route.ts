import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // --------------------------------
    // Telegram credentials
    // --------------------------------

    const botToken =
      process.env.TELEGRAM_BOT_TOKEN;

    const chatId =
      process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error(
        "Telegram credentials are missing"
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Writer service is temporarily unavailable",
        },
        { status: 500 }
      );
    }


    // ================================================
    // SECURITY FEE QR REQUEST
    // ================================================

    if (
      body.type === "security-fee-request"
    ) {
      const name = String(body.name || "").trim();
      const telegram = String(
        body.telegram || ""
      ).trim();
      const phone = String(
        body.phone || ""
      ).trim();

      // Basic validation
      if (!name) {
        return NextResponse.json(
          {
            success: false,
            error: "Writer name is required",
          },
          { status: 400 }
        );
      }

      if (!telegram) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Telegram username is required",
          },
          { status: 400 }
        );
      }

      if (!phone) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Phone number is required",
          },
          { status: 400 }
        );
      }


      // Telegram message
      const message = `
💰 WRITER SECURITY FEE REQUEST

👤 Name: ${name}

💬 Telegram: ${telegram}

📱 Phone: ${phone}

💵 Material & Security Fee: ₹350

⚡ Writer has confirmed that they are
genuinely interested in proceeding.

📌 ACTION REQUIRED:
Please contact the writer through Telegram
and manually provide the available payment QR.

❌ No fixed QR is stored on the website.

⚠️ Please communicate with the writer
before confirming the payment.
`;


      const telegramResponse =
        await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              chat_id: chatId,
              text: message,
            }),
          }
        );


      const telegramData =
        await telegramResponse.json();


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
            error:
              "Failed to send payment request",
          },
          { status: 500 }
        );
      }


      return NextResponse.json({
        success: true,
        message:
          "Security fee request sent successfully",
      });
    }


    // ================================================
    // WRITER APPLICATION
    // ================================================

    const name = String(body.name || "").trim();
    const telegram = String(
      body.telegram || ""
    ).trim();
    const phone = String(
      body.phone || ""
    ).trim();
    const city = String(
      body.city || ""
    ).trim();
    const handwriting = String(
      body.handwriting || ""
    ).trim();
    const pagesPerDay = String(
      body.pagesPerDay || ""
    ).trim();
    const address = String(
      body.address || ""
    ).trim();
    const experience = String(
      body.experience || ""
    ).trim();


    // --------------------------------
    // Required fields
    // --------------------------------

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Full name is required",
        },
        { status: 400 }
      );
    }

    if (!telegram) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Telegram username is required",
        },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Phone number is required",
        },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        {
          success: false,
          error: "City is required",
        },
        { status: 400 }
      );
    }

    if (!handwriting) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Handwriting type is required",
        },
        { status: 400 }
      );
    }

    if (!pagesPerDay) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Pages per day is required",
        },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Complete address is required",
        },
        { status: 400 }
      );
    }


    // --------------------------------
    // Writer application message
    // --------------------------------

    const message = `
✍️ NEW WRITER APPLICATION

👤 Name: ${name}

💬 Telegram: ${telegram}

📱 Phone: ${phone}

📍 City: ${city}

✍️ Handwriting Type: ${handwriting}

📄 Pages Per Day: ${pagesPerDay}

🏠 Complete Address:
${address}

📝 Previous Experience:
${experience || "None provided"}

💰 MATERIAL & SECURITY FEE:
₹350 may be required after application
review/acceptance.

📸 HANDWRITING SAMPLE:
Writer has been instructed to send
2–3 clear handwriting sample photos
through Telegram.

📌 NEXT STEP:
Review the application and contact the
writer through Telegram.
`;


    // --------------------------------
    // Send application to Telegram
    // --------------------------------

    const telegramResponse =
      await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
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
          error:
            "Failed to send writer application",
        },
        { status: 500 }
      );
    }


    // --------------------------------
    // Success
    // --------------------------------

    return NextResponse.json({
      success: true,
      message:
        "Writer application sent successfully",
    });

  } catch (error) {
    console.error(
      "Writer API error:",
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