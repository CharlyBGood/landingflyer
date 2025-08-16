// Calcula el precio total y mensual según el formData del carrito
const MOD_PRICES = { ecommerce: 15, blog: 12, testimonials: 5, forms: 8, gallery: 6 };
const EXTRA_PRICES = { analytics: 15, maintenance: 20, support: 12 };
const DELIVERY_PRICES = { standard: 0, priority: 10, express: 25 };

export default function calculatePrice(formData) {
  let total = formData.publicationType === 'basic' ? 15 : 35;
  let monthly = 0;

  // Modificaciones
  if (formData.modifications) {
    total += formData.modifications.reduce((sum, m) => sum + (MOD_PRICES[m] || 0), 0);
  }
  // Delivery
  total += DELIVERY_PRICES[formData.deliveryTime] || 0;
  // Extras
  if (formData.extras) {
    formData.extras.forEach(e => {
      if (e === 'analytics') monthly += EXTRA_PRICES[e];
      else if (e === 'maintenance') monthly += EXTRA_PRICES[e];
      else if (e === 'support') monthly += EXTRA_PRICES[e];
    });
  }
  total += monthly;
  return { total, monthly };
}
