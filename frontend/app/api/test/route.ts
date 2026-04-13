import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Test endpoint received:", body);
    
    return NextResponse.json({
      success: true,
      message: "Test endpoint working",
      received: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
