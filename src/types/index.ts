
export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  status: "pendente" | "aprovado" | "entregue" | "cancelado";
  totalPrice: number;
  createdAt: string;
}
