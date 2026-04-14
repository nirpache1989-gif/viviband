import { NextRequest, NextResponse } from "next/server";
import { getResend } from "@/lib/resend";

export const dynamic = "force-dynamic";

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactPayload;
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const bandEmail = process.env.BAND_CONTACT_EMAIL;
    if (!bandEmail) {
      console.error("BAND_CONTACT_EMAIL not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    await getResend().emails.send({
      from: "Cores do Samba Website <onboarding@resend.dev>",
      to: bandEmail,
      subject: `[Website] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
