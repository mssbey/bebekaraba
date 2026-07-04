import { Resend } from 'resend';

let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

const FROM = process.env.RESEND_FROM_EMAIL || 'Bebek Arabacınız <noreply@bebekarabaciniz.com>';
const ADMIN_EMAIL = 'admin@bebekarabaciniz.com';

export interface OrderMailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; price: number; quantity: number }[];
  total: number;
  address: string;
  city: string;
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(n);
}

// Müşteriye sipariş özeti maili
export async function sendOrderConfirmation(data: OrderMailData) {
  const resend = getResend();
  if (!resend) return;

  const itemRows = data.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;">${i.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;text-align:center">${i.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0ebe4;text-align:right;font-weight:600">${formatPrice(i.price * i.quantity)}</td>
      </tr>`
    )
    .join('');

  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Siparişiniz Alındı — ${data.orderNumber}`,
    html: `
<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F9F7F2;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(27,58,92,0.08);">
    <div style="background:linear-gradient(135deg,#1B3A5C,#245480);padding:32px 40px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">Siparişiniz Alındı! 🎉</h1>
      <p style="color:rgba(255,255,255,0.7);margin:8px 0 0;font-size:14px">${data.orderNumber}</p>
    </div>
    <div style="padding:32px 40px;">
      <p style="color:#2D2D3A;font-size:15px;margin:0 0 24px">Merhaba <strong>${data.customerName}</strong>,</p>
      <p style="color:#6B7280;font-size:14px;line-height:1.6;margin:0 0 24px">Siparişinizi aldık ve en kısa sürede hazırlayacağız. Aşağıda sipariş detaylarınızı bulabilirsiniz.</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#F9F7F2;">
            <th style="padding:10px 0;text-align:left;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Ürün</th>
            <th style="padding:10px 0;text-align:center;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Adet</th>
            <th style="padding:10px 0;text-align:right;font-size:12px;color:#6B7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Tutar</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <div style="border-top:2px solid #EDE9E4;padding-top:16px;text-align:right;">
        <span style="font-size:18px;font-weight:700;color:#1B3A5C">Toplam: ${formatPrice(data.total)}</span>
      </div>

      <div style="background:#F9F7F2;border-radius:12px;padding:20px;margin-top:24px;">
        <h3 style="margin:0 0 10px;font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Teslimat Adresi</h3>
        <p style="margin:0;color:#2D2D3A;font-size:14px;line-height:1.6">${data.address}<br>${data.city}</p>
      </div>
    </div>
    <div style="background:#F9F7F2;padding:24px 40px;text-align:center;border-top:1px solid #EDE9E4;">
      <p style="color:#6B7280;font-size:13px;margin:0">Sorularınız için: <a href="mailto:${ADMIN_EMAIL}" style="color:#F4723A;text-decoration:none">${ADMIN_EMAIL}</a></p>
    </div>
  </div>
</body>
</html>`,
  });
}

// Admin'e yeni sipariş bildirim maili
export async function sendNewOrderNotification(data: OrderMailData) {
  const resend = getResend();
  if (!resend) return;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🛒 Yeni Sipariş — ${data.orderNumber} (${formatPrice(data.total)})`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
  <h2 style="color:#1B3A5C">Yeni Sipariş!</h2>
  <p><strong>Sipariş No:</strong> ${data.orderNumber}</p>
  <p><strong>Müşteri:</strong> ${data.customerName} (${data.customerEmail})</p>
  <p><strong>Toplam:</strong> ${formatPrice(data.total)}</p>
  <p><strong>Adres:</strong> ${data.address}, ${data.city}</p>
  <hr style="border:1px solid #EDE9E4;margin:16px 0">
  <h3 style="color:#1B3A5C">Ürünler:</h3>
  <ul>
    ${data.items.map((i) => `<li>${i.name} x${i.quantity} — ${formatPrice(i.price * i.quantity)}</li>`).join('')}
  </ul>
  <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/siparisler" style="display:inline-block;background:#F4723A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">Admin Paneli →</a>
</div>`,
  });
}

// Durum değişikliği maili
export async function sendStatusUpdateMail(data: {
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  status: string;
}) {
  const resend = getResend();
  if (!resend || !data.customerEmail) return;

  const statusLabels: Record<string, string> = {
    PREPARING: '🔧 Hazırlanıyor',
    SHIPPED: '🚚 Kargoya Verildi',
    DELIVERED: '✅ Teslim Edildi',
    CANCELLED: '❌ İptal Edildi',
  };

  const label = statusLabels[data.status] || data.status;

  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Sipariş Durumu Güncellendi — ${data.orderNumber}`,
    html: `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;background:#fff;border-radius:12px;">
  <h2 style="color:#1B3A5C">Siparişiniz Güncellendi</h2>
  <p>Merhaba <strong>${data.customerName}</strong>,</p>
  <p><strong>${data.orderNumber}</strong> numaralı siparişinizin durumu güncellendi:</p>
  <div style="background:#F9F7F2;border-radius:8px;padding:16px 20px;font-size:18px;font-weight:700;color:#1B3A5C;margin:20px 0">${label}</div>
  <p style="color:#6B7280;font-size:13px">Sorularınız için bize ulaşın: <a href="mailto:${ADMIN_EMAIL}" style="color:#F4723A">${ADMIN_EMAIL}</a></p>
</div>`,
  });
}
