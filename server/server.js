import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const user = process.env.SMTP_USER;
  const rawPass = process.env.SMTP_PASS || "";
  const pass = rawPass.replace(/["']/g, "").replace(/\s+/g, "");

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  // Fallback test transporter (creates preview in console or ethereal)
  return null;
};

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Vibe Media Networks Contact & Application API",
    time: new Date().toISOString(),
  });
});

// Contact Form / Job Application API
app.post("/api/contact", async (req, res) => {
  try {
    const {
      name,
      contactNumber,
      email,
      subject,
      content,
      opportunityCategory,
      inquirerType,
      workMode,
      state,
      district,
      fullAddress,
    } = req.body;

    // Field validations
    if (
      !name ||
      !contactNumber ||
      !email ||
      !subject ||
      !content ||
      !opportunityCategory
    ) {
      return res.status(400).json({
        success: false,
        error:
          "Please fill in all mandatory fields (Name, Contact Number, Email, Subject, Opportunity, Content).",
      });
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a; margin: 0; padding: 20px; }
          .container { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .header { background: #0b1320; color: #ffffff; padding: 24px; text-align: center; border-bottom: 3px solid #d4af37; }
          .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; color: #ffffff; }
          .header p { margin: 5px 0 0; font-size: 12px; color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px; }
          .content { padding: 28px; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 10px; border-radius: 9999px; font-weight: bold; font-size: 12px; margin-bottom: 20px; }
          .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
          .table td.label { width: 35%; font-weight: bold; color: #475569; background-color: #f8fafc; }
          .table td.value { color: #0f172a; font-weight: 500; }
          .message-box { background: #f8fafc; border-left: 4px solid #d4af37; padding: 16px; border-radius: 4px; font-size: 14px; line-height: 1.6; margin-top: 15px; }
          .footer { background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>VIBE MEDIA NETWORKS</h1>
            <p>Official Contact & Application Gateway</p>
          </div>
          <div class="content">
            <span class="badge">${opportunityCategory} • ${workMode || "General"}</span>
            <h2 style="font-size: 18px; margin-top: 0; color: #0f172a;">Subject: ${subject}</h2>

            <table class="table">
              <tr>
                <td class="label">Full Name</td>
                <td class="value">${name}</td>
              </tr>
              <tr>
                <td class="label">Contact Number</td>
                <td class="value">${contactNumber}</td>
              </tr>
              <tr>
                <td class="label">Email Address</td>
                <td class="value">${email}</td>
              </tr>
              <tr>
                <td class="label">Applicant / Inquirer Type</td>
                <td class="value">${inquirerType || "Not Specified"}</td>
              </tr>
              <tr>
                <td class="label">Category / Opportunity</td>
                <td class="value"><strong>${opportunityCategory}</strong></td>
              </tr>
              <tr>
                <td class="label">Preferred Work Mode</td>
                <td class="value">${workMode || "Not Specified"}</td>
              </tr>
              <tr>
                <td class="label">State</td>
                <td class="value">${state || "Not Specified"}</td>
              </tr>
              <tr>
                <td class="label">District</td>
                <td class="value">${district || "Not Specified"}</td>
              </tr>
              <tr>
                <td class="label">Full Complete Address</td>
                <td class="value">${fullAddress || "Not Provided"}</td>
              </tr>
            </table>

            <h3 style="font-size: 14px; color: #475569; text-transform: uppercase; margin-bottom: 5px;">Message / Content</h3>
            <div class="message-box">
              ${content.replace(/\n/g, "<br/>")}
            </div>
          </div>
          <div class="footer">
            Received via Vibe Media Networks Official Web Portal • ${new Date().toLocaleString()}
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = createTransporter();
    const recipient =
      process.env.RECIPIENT_EMAIL || "directorvijay225@gmail.com";

    if (transporter) {
      await transporter.sendMail({
        from: `"Vibe Media Networks" <${process.env.SMTP_USER}>`,
        to: recipient,
        replyTo: email,
        subject: `[Vibe Portal] ${opportunityCategory}: ${subject} (${name})`,
        html: emailHtml,
      });
      console.log(
        `[Email Delivered] From ${name} (${email}) for ${opportunityCategory}`,
      );
    } else {
      console.log(
        "--- [SIMULATED NODEMAILER DISPATCH - Set SMTP_USER & SMTP_PASS in .env for live dispatch] ---",
      );
      console.log(`To: ${recipient}`);
      console.log(`From: ${name} <${email}>`);
      console.log(`Phone: ${contactNumber}`);
      console.log(`Category: ${opportunityCategory} | Work Mode: ${workMode}`);
      console.log(`Location: ${district}, ${state}`);
      console.log(`Address: ${fullAddress}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${content}`);
      console.log(
        "---------------------------------------------------------------------------------------------",
      );
    }

    return res.status(200).json({
      success: true,
      message:
        "Your inquiry / application has been submitted successfully to Vibe Media Networks.",
    });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    return res.status(500).json({
      success: false,
      error:
        "An internal error occurred while transmitting your submission. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `🚀 Vibe Media Networks Backend Server running on http://localhost:${PORT}`,
  );
});
