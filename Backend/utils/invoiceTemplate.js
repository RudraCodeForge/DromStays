const invoiceTemplate = (invoice) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f7f8fc;
      padding: 30px;
    }

    .invoice-box {
      background: #ffffff;
      padding: 30px;
      border-radius: 12px;
      max-width: 800px;
      margin: auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    .title {
      font-size: 28px;
      font-weight: bold;
      color: #2e126a;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    table th {
      background: #2e126a;
      color: #fff;
      padding: 10px;
    }

    table td {
      padding: 10px;
      border-bottom: 1px solid #eee;
    }

    .total {
      text-align: right;
      margin-top: 20px;
      font-size: 18px;
      font-weight: bold;
    }

    .footer {
      margin-top: 40px;
      font-size: 13px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>

<body>
  <div class="invoice-box">
    <div class="header">
      <div>
        <div class="title">INVOICE</div>
        <p>DormStays</p>
      </div>
      <div>
        <p>Invoice #: ${invoice.invoiceNumber}</p>
        <p>Date: ${new Date(invoice.invoiceDate).toDateString()}</p>
      </div>
    </div>

    <p><strong>Bill To:</strong><br/>${invoice.notes}</p>

    <table>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
      ${invoice.items
            .map(
                (item) => `
        <tr>
          <td>${item.title}</td>
          <td>${item.quantity}</td>
          <td>₹${item.price}</td>
          <td>₹${item.quantity * item.price}</td>
        </tr>`
            )
            .join("")}
    </table>

    <div class="total">Grand Total: ₹${invoice.totalAmount}</div>

    <div class="footer">
      Thank you for staying with DormStays 💜
    </div>
  </div>
</body>
</html>
`;
};

module.exports = invoiceTemplate;
