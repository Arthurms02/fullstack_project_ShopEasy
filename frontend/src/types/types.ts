export interface User {
  id: number
  name: string
  email: string
}

export interface LoginResponse {
  token: string
  user: User
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}