export type CartSelection = { id: string; quantity: number };

const key = 'beansource-cart-v1';

export function readCart(): CartSelection[] {
  try {
    const items = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(items) ? items.filter(item => typeof item?.id === 'string' &&
      /^[0-9a-f-]{36}$/i.test(item.id) && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20).slice(0, 30) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartSelection[]) {
  localStorage.setItem(key, JSON.stringify(items));
}
