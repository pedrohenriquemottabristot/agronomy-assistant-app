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

export type Cliente = {
  id: string
  nome: string
  email: string
  telefone: string
  enderecos: Endereco[]
  created_at: string
}

export type Endereco = {
  id: string
  cliente_id: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
  is_principal: boolean
}

export type Pedido = {
  id: string
  cliente_id: string
  endereco_id: string
  status: 'pendente' | 'em_preparo' | 'em_entrega' | 'entregue' | 'cancelado'
  observacao?: string
  forma_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix'
  valor_total: number
  created_at: string
  updated_at: string
  cliente?: Cliente
  endereco?: Endereco
}

export type FormaPagamento = {
  id: string
  nome: string
  descricao: string
}
