const WHATSAPP_NUMBER = '256755195151'

export function orderWhatsApp(productName, price) {
  const formatted = price.toLocaleString('en-UG')
  const msg = `Hi Daniel Perfumes! 👋\n\nI'd like to order *${productName}* (UGX ${formatted}).\n\nPlease assist me with the order. 🙏`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export function generalWhatsApp(message) {
  const msg = message || "Hi Daniel Perfumes! I'd like to know more about your fragrances."
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export function cartWhatsApp(items) {
  const lines = items.map((item, i) =>
    `${i + 1}. *${item.product.name}* × ${item.qty} — UGX ${(item.product.price * item.qty).toLocaleString('en-UG')}`
  ).join('\n')
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0)
  const msg = `Hi Daniel Perfumes! 👋\n\nI'd like to place the following order:\n\n${lines}\n\n*Total: UGX ${total.toLocaleString('en-UG')}*\n\nPlease assist me with delivery. 🙏`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
