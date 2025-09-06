import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState, CartItem, Product } from '@/types';

interface CartStore extends CartState {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      
      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.product.id === product.id);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...items, { product, quantity }];
        }
        
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        set({ items: newItems, total });
      },
      
      removeItem: (productId: string) => {
        const { items } = get();
        const newItems = items.filter(item => item.product.id !== productId);
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        set({ items: newItems, total });
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const { items } = get();
        const newItems = items.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        );
        const total = newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        set({ items: newItems, total });
      },
      
      clearCart: () => {
        set({ items: [], total: 0 });
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);