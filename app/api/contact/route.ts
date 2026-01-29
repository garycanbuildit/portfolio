import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: ContactFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Log the submission (for development)
    console.log("Contact form submission:", {
      name: data.name,
      email: data.email,
      company: data.company || "Not provided",
      message: data.message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Add Resend email integration
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL,
    //   subject: `New Contact: ${data.name}`,
    //   html: `<p>Name: ${data.name}</p><p>Email: ${data.email}</p><p>Company: ${data.company}</p><p>Message: ${data.message}</p>`,
    // });

    // TODO: Add database storage
    // import { sql } from '@vercel/postgres';
    // await sql`
    //   INSERT INTO contacts (name, email, company, message, created_at)
    //   VALUES (${data.name}, ${data.email}, ${data.company}, ${data.message}, NOW())
    // `;

    return NextResponse.json({
      success: true,
      message: "Thank you for your message! I'll be in touch soon."
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}
