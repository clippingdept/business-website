import express from "express";

type Inquiry = {
  name: string;
  contact: string;
  content?: string;
  details: string;
};

function isInquiry(value: unknown): value is Inquiry {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const inquiry = value as Record<string, unknown>;
  return (
    typeof inquiry.name === "string" &&
    inquiry.name.trim().length > 0 &&
    inquiry.name.length <= 120 &&
    typeof inquiry.contact === "string" &&
    inquiry.contact.trim().length > 0 &&
    inquiry.contact.length <= 200 &&
    (inquiry.content === undefined ||
      (typeof inquiry.content === "string" && inquiry.content.length <= 120)) &&
    typeof inquiry.details === "string" &&
    inquiry.details.trim().length > 0 &&
    inquiry.details.length <= 5000
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function createInquiryRouter(routePaths = ["/api/inquiry"]) {
  const router = express.Router();
  router.use(express.json({ limit: "10kb" }));

  router.post(routePaths, async (req, res) => {
    if (!isInquiry(req.body)) {
      res.status(400).json({ error: "Please check your inquiry and try again." });
      return;
    }

    const apiKey = process.env.RESEND_API;
    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!apiKey || !businessEmail) {
      console.error("Inquiry email is not configured: set RESEND_API and BUSINESS_EMAIL.");
      res.status(503).json({ error: "The inquiry form is temporarily unavailable. Please try again later." });
      return;
    }

    const inquiry = req.body;
    const name = inquiry.name.trim();
    const contact = inquiry.contact.trim();
    const content = inquiry.content?.trim() || "Not specified";
    const details = inquiry.details.trim();
    const message = [
      "NEW CAMPAIGN INQUIRY",
      "",
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Content type: ${content}`,
      "",
      "Campaign goal and details:",
      details,
    ].join("\n");
    const html = `
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        New campaign inquiry from ${escapeHtml(name)}
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#f3f4f6;padding:32px 12px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid #e5e7eb;">
              <tr>
                <td style="background-color:#0b0d12;padding:28px 32px;">
                  <p style="margin:0;color:#ffffff;font-size:14px;font-weight:bold;letter-spacing:1px;">CLIPPING DEPARTMENT</p>
                  <p style="margin:8px 0 0;color:#aeb4c1;font-size:12px;">CAMPAIGN INQUIRY</p>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 8px;color:#1557ff;font-size:12px;font-weight:bold;letter-spacing:1px;">NEW LEAD</p>
                  <h1 style="margin:0;color:#111827;font-size:26px;line-height:1.25;">A new campaign inquiry is in.</h1>
                  <p style="margin:12px 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">${escapeHtml(name)} shared some details about their content and goals.</p>

                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border:1px solid #e5e7eb;">
                    <tr>
                      <td style="width:130px;padding:14px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Name</td>
                      <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">${escapeHtml(name)}</td>
                    </tr>
                    <tr>
                      <td style="width:130px;padding:14px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Contact</td>
                      <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;word-break:break-word;">${escapeHtml(contact)}</td>
                    </tr>
                    <tr>
                      <td style="width:130px;padding:14px 16px;color:#6b7280;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:.5px;">Content type</td>
                      <td style="padding:14px 16px;color:#111827;font-size:14px;">${escapeHtml(content)}</td>
                    </tr>
                  </table>

                  <h2 style="margin:28px 0 10px;color:#111827;font-size:16px;">Campaign goal and details</h2>
                  <div style="padding:18px;background-color:#f3f4f6;border-left:3px solid #1557ff;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;overflow-wrap:anywhere;">${escapeHtml(details)}</div>
                  <p style="margin:28px 0 0;color:#6b7280;font-size:12px;line-height:1.6;">Reply to the contact above to follow up on this inquiry.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:11px;line-height:1.5;">
                  Sent from the Clipping Department website inquiry form.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Clipping Department <${businessEmail}>`,
          to: [businessEmail],
          subject: `New campaign inquiry from ${name}`,
          text: message,
          html,
        }),
      });

      if (!response.ok) {
        const details = await response.text();
        console.error(`Resend rejected an inquiry (${response.status}): ${details}`);
        res.status(502).json({ error: "We couldn't send your inquiry. Please try again shortly." });
        return;
      }

      res.status(200).json({ message: "Your inquiry has been sent." });
    } catch (error) {
      console.error("Failed to send an inquiry through Resend:", error);
      res.status(502).json({ error: "We couldn't send your inquiry. Please try again shortly." });
    }
  });

  return router;
}
