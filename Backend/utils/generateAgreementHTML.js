module.exports = ({
  owner,
  tenant,
  room,
  property,
  rentAmount,
  advanceAmount,
  bookingDate,
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Rental Agreement</title>

  <style>
    body {
      font-family: "Inter", Arial, sans-serif;
      background: #f3f4f6;
      padding: 40px;
      color: #111827;
      font-size: 14px;
    }

    .page {
      max-width: 850px;
      margin: auto;
      background: #ffffff;
      border-radius: 16px;
      padding: 45px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    /* ---------- BRAND HEADER (INVOICE STYLE) ---------- */
    .brand-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 35px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 20px;
    }

    .brand {
      font-size: 32px;
      font-weight: 800;
      color: #4f46e5;
      letter-spacing: 0.5px;
    }

    .brand span {
      color: #22c55e;
    }

    .brand-meta {
      text-align: right;
      font-size: 13px;
      color: #374151;
    }

    .brand-meta p {
      margin: 4px 0;
    }

    h1 {
      text-align: center;
      text-transform: uppercase;
      margin: 30px 0;
      letter-spacing: 1px;
      font-size: 22px;
    }

    h2 {
      font-size: 15px;
      margin-top: 26px;
      text-decoration: underline;
    }

    .section {
      margin-bottom: 18px;
    }

    .label {
      font-weight: 600;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 14px;
    }

    td {
      border: 1px solid #e5e7eb;
      padding: 12px;
    }

    ul li {
      margin-bottom: 6px;
    }

    .signature-box {
      margin-top: 70px;
      display: flex;
      justify-content: space-between;
      gap: 40px;
    }

    .signature {
      width: 45%;
      text-align: center;
      font-size: 14px;
    }

    .line {
      border-top: 1px solid #000;
      margin-top: 45px;
    }

    .footer-note {
      margin-top: 45px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 90px;
      font-weight: 800;
      color: rgba(79, 70, 229, 0.08); /* light purple */
      z-index: 0;
      pointer-events: none;
      user-select: none;
      white-space: nowrap;
    }

  </style>
</head>

<body>
  <div class="watermark">DORMSTAYS</div>
  <div class="page">

    <!-- BRANDING HEADER -->
    <div class="brand-header">
      <div class="brand">
        Dorm<span>Stays</span>
      </div>

      <div class="brand-meta">
        <p>Rental Agreement</p>
        <p>Date: ${new Date(bookingDate).toDateString()}</p>
      </div>
    </div>

    <h1>Rental Agreement</h1>

    <div class="section">
      This Rental Agreement is made and executed on
      <strong>${new Date(bookingDate).toDateString()}</strong>,
      between the following parties:
    </div>

    <div class="section">
      <span class="label">Owner / Lessor:</span><br/>
      Name: ${owner.Name}<br/>
      Phone: ${owner.Phone}
    </div>

    <div class="section">
      <span class="label">Tenant / Lessee:</span><br/>
      Name: ${tenant.fullName}<br/>
      Phone: ${tenant.phone}<br/>
      Email: ${tenant.email || "N/A"}
    </div>

    <div class="section">
      <span class="label">Property Details:</span><br/>
      Property Name: ${property.name}<br/>
      Room Number: ${room.roomNumber}
    </div>

    <h2>1. Rent & Security Deposit</h2>
    <table>
      <tr>
        <td>Monthly Rent</td>
        <td>₹ ${rentAmount}</td>
      </tr>
      <tr>
        <td>Security / Advance Amount</td>
        <td>₹ ${advanceAmount || 0}</td>
      </tr>
      <tr>
        <td>Agreement Start Date</td>
        <td>${new Date(bookingDate).toDateString()}</td>
      </tr>
    </table>

    <h2>2. Duration of Tenancy</h2>
    <div class="section">
      This agreement shall remain valid on a monthly basis unless terminated
      by either party by serving prior notice as per the terms mentioned below.
    </div>

    <h2>3. Payment Terms</h2>
    <ul>
      <li>Rent must be paid on or before the due date of each billing cycle.</li>
      <li>Delay in rent payment may attract penalties.</li>
      <li>Rent shall be paid via cash, UPI, bank transfer, or approved modes.</li>
    </ul>

    <h2>4. Security Deposit / Advance</h2>
    <ul>
      <li>Advance amount is refundable subject to deductions.</li>
      <li>Deductions include unpaid rent, damages, or utility charges.</li>
    </ul>

    <h2>5. Use of Premises</h2>
    <ul>
      <li>Premises shall be used only for residential purposes.</li>
      <li>No illegal or commercial activities are permitted.</li>
      <li>Tenant must maintain cleanliness and hygiene.</li>
    </ul>

    <h2>6. Notice Period & Termination</h2>
    <ul>
      <li>30 days prior notice is mandatory for termination.</li>
      <li>Immediate termination may occur in case of misconduct or non-payment.</li>
    </ul>

    <h2>7. Governing Law</h2>
    <div class="section">
      This agreement shall be governed by the laws applicable in India.
    </div>

    <div class="signature-box">
      <div class="signature">
        <strong>Owner Signature</strong>
        <div class="line"></div>
        ${owner.Name}
      </div>

      <div class="signature">
        <strong>Tenant Signature</strong>
        <div class="line"></div>
        ${tenant.fullName}
      </div>
    </div>

    <div class="footer-note">
      This agreement is digitally generated via DormStays platform
      and is valid without a physical stamp.
    </div>

  </div>
</body>
</html>
`;
};
