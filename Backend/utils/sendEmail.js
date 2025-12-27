const nodemailer = require("nodemailer");

// ============================
// COMMON TRANSPORTER
// ============================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

// ============================
// COMMON SEND FUNCTION
// ============================
const sendMail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: '"DormStays" <no-reply@dormstays.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email send failed:", error.message);
  }
};

// ============================
// VERIFY EMAIL
// ============================
exports.sendVerificationEmail = async (toEmail, verifyLink) => {
  await sendMail({
    to: toEmail,
    subject: "Verify your email for DormStays",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2 style="color:#2e126a;">Welcome to DormStays 👋</h2>

        <p>Thanks for signing up with <strong>DormStays</strong>.</p>

        <p>Please verify your email address by clicking the button below:</p>

        <a href="${verifyLink}"
          style="display:inline-block;margin:16px 0;padding:12px 20px;
          background:#2e126a;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
          Verify My Email
        </a>

        <p>If you didn’t create an account, you can safely ignore this email.</p>

        <p style="margin-top:24px;">
          Regards,<br/><strong>DormStays Team</strong>
        </p>

        <hr />
        <p style="font-size:12px;color:#777;">
          This link will expire in 24 hours.
        </p>
      </div>
    `,
  });
};

// ============================
// RESET PASSWORD
// ============================
exports.sendResetPasswordEmail = async (toEmail, resetLink) => {
  await sendMail({
    to: toEmail,
    subject: "Reset your DormStays password",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#333;">
        <h2 style="color:#2e126a;">Password Reset Request</h2>

        <p>We received a request to reset your password.</p>

        <a href="${resetLink}"
          style="display:inline-block;margin:16px 0;padding:12px 20px;
          background:#2e126a;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">
          Reset My Password
        </a>

        <p>If you didn’t request this, ignore this email.</p>

        <p style="margin-top:24px;">
          Regards,<br/><strong>DormStays Team</strong>
        </p>

        <hr />
        <p style="font-size:12px;color:#777;">
          This link will expire in 1 hour.
        </p>
      </div>
    `,
  });
};

// ============================
// SUBSCRIPTION CONFIRMATION
// ============================
exports.sendSubscriptionConfirmationEmail = async (
  toEmail,
  planName,
  startDate,
  endDate
) => {
  await sendMail({
    to: toEmail,
    subject: "✅ Your DormStays Subscription is Active!",
    html: `
      <div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;
      background:#fff;border-radius:8px;border:1px solid #eee;">

        <div style="background:#2e126a;padding:20px;text-align:center;">
          <h1 style="color:#fff;margin:0;">DormStays</h1>
          <p style="color:#dcd6f7;">Subscription Confirmation</p>
        </div>

        <div style="padding:24px;">
          <h2>🎉 Subscription Activated!</h2>

          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px;border:1px solid #eee;">Plan</td>
              <td style="padding:8px;border:1px solid #eee;">${planName}</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #eee;">Start Date</td>
              <td style="padding:8px;border:1px solid #eee;">
                ${startDate.toDateString()}
              </td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #eee;">End Date</td>
              <td style="padding:8px;border:1px solid #eee;">
                ${endDate ? endDate.toDateString() : "Unlimited"}
              </td>
            </tr>
          </table>

          <div style="text-align:center;margin:30px 0;">
            <a href="https://dormstays.com/dashboard"
              style="background:#2e126a;color:#fff;padding:12px 24px;
              text-decoration:none;border-radius:6px;font-weight:bold;">
              Go to Dashboard
            </a>
          </div>

          <p>Warm regards,<br/><strong>DormStays Team</strong></p>
        </div>

        <div style="background:#f7f7f7;padding:12px;text-align:center;font-size:12px;color:#777;">
          © ${new Date().getFullYear()} DormStays. All rights reserved.
        </div>
      </div>
    `,
  });
};

exports.SendPropertyCreationEmail = async (toEmail, propertyName) => {
  await sendMail({
    to: toEmail,
    subject: "🏠 Your Property Is Live on DormStays!",
    html: `
      <div style="font-family:Arial, Helvetica, sans-serif; background:#f8f9fb; padding:24px;">
        <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:12px; padding:28px; box-shadow:0 10px 25px rgba(0,0,0,0.08);">
          
          <h2 style="color:#4f46e5; margin-bottom:12px;">
            🎉 Property Created Successfully!
          </h2>

          <p style="font-size:15px; color:#374151;">
            Hi there,
          </p>

          <p style="font-size:15px; color:#374151;">
            Your property <strong>${propertyName}</strong> has been successfully created on 
            <strong>DormStays</strong>.
          </p>

          <p style="font-size:15px; color:#374151;">
            You can now start adding rooms, managing availability, and connecting with tenants — all from one place.
          </p>

          <div style="margin:24px 0; padding:16px; background:#eef2ff; border-radius:8px;">
            <p style="margin:0; font-size:14px; color:#4338ca;">
              👉 <strong>Next step:</strong> Add rooms to make your property visible to tenants.
            </p>
          </div>

          <p style="font-size:14px; color:#6b7280;">
            If you need any help, feel free to reach out — we’re always here for you.
          </p>

          <p style="margin-top:24px; font-size:14px; color:#374151;">
            Warm regards,<br/>
            <strong>DormStays Team</strong>
          </p>

        </div>

        <p style="text-align:center; font-size:12px; color:#9ca3af; margin-top:16px;">
          © ${new Date().getFullYear()} DormStays. All rights reserved.
        </p>
      </div>
    `,
  });
};
