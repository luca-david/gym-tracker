export interface Category {
  id: number
  name: string
  user_id: number
}

export interface Exercise {
  id: number
  name: string
  category_id: number
}