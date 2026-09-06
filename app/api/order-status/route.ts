import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth";

type OrderStatus =
  | "Order Received"
  | "Payment Verified"
  | "Writing Started"
  | "Work Completed"
  | "Shipped"
  | "Delivered";

const orderStatuses = new Map<string, OrderStatus>();

const validStatuses: OrderStatus[] = [
  "Order Received",
  "Payment Verified",
  "Writing Started",
  "Work Completed",
  "Shipped",
  "Delivered",
];

async function isAdminAuthenticated(request: NextRequest) {
  const token = request.cookies.get("wm_admin_session")?.value;

  if (!token) {
    return false;
  }

  return await verifyAdminSession(token);
}

export async function POST(request: NextRequest) {
  try {
    // 🔐 Admin authentication check
    const authenticated = await isAdminAuthenticated(request);

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Admin login required.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const orderId = String(body.orderId || "")
      .trim()
      .toUpperCase();

    const status = body.status as OrderStatus;

    if (!orderId || !status) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID and status are required",
        },
        { status: 400 }
      );
    }

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid order status",
        },
        { status: 400 }
      );
    }

    orderStatuses.set(orderId, status);

    return NextResponse.json({
      success: true,
      orderId,
      status,
    });
  } catch (error) {
    console.error("Order status update error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const orderId = String(searchParams.get("orderId") || "")
      .trim()
      .toUpperCase();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    const status = orderStatuses.get(orderId);

    return NextResponse.json({
      success: true,
      orderId,
      status: status || "Order Received",
    });
  } catch (error) {
    console.error("Order status fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Something went wrong",
      },
      { status: 500 }
    );
  }
}