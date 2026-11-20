import { create } from 'zustand'

interface CartState {
  playerId: string
  nickname: string
  zoneId: string
  productCode: string
  price: number
  setPlayer: (playerId: string, nickname: string, zoneId?: string) => void
  setProduct: (code: string, price: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>((set) => ({
  playerId: '',
  nickname: '',
  zoneId: '',
  productCode: '',
  price: 0,
  setPlayer: (playerId, nickname, zoneId = '') => set({ playerId, nickname, zoneId }),
  setProduct: (code, price) => set({ productCode: code, price }),
  clearCart: () => set({ playerId: '', nickname: '', zoneId: '', productCode: '', price: 0 }),
}))
