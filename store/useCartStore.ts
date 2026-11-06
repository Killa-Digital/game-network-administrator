import { create } from 'zustand'

interface CartState {
  playerId: string
  nickname: string
  productCode: string
  price: number
  setPlayer: (id: string, name: string) => void
  setProduct: (code: string, price: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  playerId: '',
  nickname: '',
  productCode: '',
  price: 0,
  setPlayer: (id, name) => set({ playerId: id, nickname: name }),
  setProduct: (code, price) => set({ productCode: code, price }),
  clearCart: () => set({ playerId: '', nickname: '', productCode: '', price: 0 }),
}))