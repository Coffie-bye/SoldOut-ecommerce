import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { formData, position } = req.body;

    // Send confirmation to applicant
    await resend.emails.send({
      from: "careers@soldout.com",
      to: formData.email,
      subject: `Application Received: ${position}`,
      html: `
        <h2>Thank you for your application!</h2>
        <p>We've received your application for the <strong>${position}</strong> position at SoldOut.</p>
        <p>Our team will review your information and get back to you soon.</p>
        <p>Best regards,<br>The SoldOut Team</p>
      `,
    });

    // Send notification to HR
    const hrEmail = await resend.emails.send({
      from: "careers@soldout.com",
      to: "hr@soldout.com", // Replace with your HR email
      subject: `New Application: ${position}`,
      html: `
        <h2>New Job Application Received</h2>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Name:</strong> ${formData["full-name"]}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || "Not provided"}</p>
        <p><strong>Location:</strong> ${formData.location}</p>
        ${
          formData.linkedin
            ? `<p><strong>LinkedIn:</strong> ${formData.linkedin}</p>`
            : ""
        }
        ${
          formData.portfolio
            ? `<p><strong>Portfolio:</strong> ${formData.portfolio}</p>`
            : ""
        }
        <h3>Cover Letter:</h3>
        <p>${formData["cover-letter"].replace(/\n/g, "<br>")}</p>
        <p>Resume attached as PDF</p>
      `,
      attachments: formData.resume
        ? [
            {
              filename: formData.resume.name,
              content: formData.resume.content,
            },
          ]
        : [],
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: error.message });
  }
}
