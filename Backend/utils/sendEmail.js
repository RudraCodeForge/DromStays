const nodemailer = require("nodemailer");

exports.sendVerificationEmail = async (toEmail, verifyLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL, // 🔁 apni email
      pass: process.env.EMAIL_PASS, // 🔁 Gmail App Password (not your real password)
    },
  });

  const mailOptions = {
    from: '"DromStays" <wizard21official@gmail.com>',
    to: toEmail,
    subject: "Verify your email for DromStays",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color:#2e126a;">Welcome to DromStays 👋</h2>

      <p>
        Thanks for signing up with <strong>DromStays</strong> — your trusted
        platform for finding and managing rental spaces easily.
      </p>

      <p>
        Please verify your email address by clicking the button below:
      </p>

      <a href="${verifyLink}"
         style="
           display:inline-block;
           margin:16px 0;
           padding:12px 20px;
           background-color:#2e126a;
           color:#ffffff;
           text-decoration:none;
           border-radius:6px;
           font-weight:bold;
         ">
         Verify My Email
      </a>

      <p>
        If you didn’t create an account on DromStays, you can safely ignore this email.
      </p>

      <p style="margin-top:24px;">
        Regards,<br/>
        <strong>DromStays Team</strong>
      </p>

      <hr style="margin-top:30px;" />
      <p style="font-size:12px; color:#777;">
        This link will expire in 24 hours for security reasons.
      </p>
    </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendResetPasswordEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: '"DromStays" <jitandradaksh533@gmail.com>',
    to: toEmail,
    subject: "Reset your DromStays password",
    html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color:#2e126a;">Password Reset Request</h2>
      <p>
        We received a request to reset the password for your DromStays account associated with this email address.
      </p>
      <p>
        To reset your password, please click the button below:
      </p>
      <a href="${resetLink}"  
          style=" 
            display:inline-block;
            margin:16px 0;
            padding:12px 20px;
            background-color:#2e126a;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
            font-weight:bold;
          ">
          Reset My Password
      </a>
      <p>
        If you did not request a password reset, please ignore this email. Your password will remain unchanged.
      </p>
      <p style="margin-top:24px;">
        Regards,<br/>
        <strong>DromStays Team</strong>
      </p>
      <hr style="margin-top:30px;" />
      <p style="font-size:12px; color:#777;">
        This link will expire in 1 hour for security reasons.
      </p>
    </div>
  `,
  };
  await transporter.sendMail(mailOptions);
};
