import { supabase } from '../supabase'
import type { Cliente, Endereco, Pedido } from '../../types'

export const supabaseService = {
  // Clientes
  async createCliente(cliente: {
    nome: string
    email: string
    telefone: string
  }) {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getClientes() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // Endereços
  async createEndereco(endereco: Omit<Endereco, 'id'>) {
    const { data, error } = await supabase
      .from('enderecos')
      .insert([endereco])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getEnderecosByCliente(clienteId: string) {
    const { data, error } = await supabase
      .from('enderecos')
      .select('*')
      .eq('cliente_id', clienteId)

    if (error) throw error
    return data
  },

  // Pedidos
  async createPedido(pedido: {
    cliente_id: string
    endereco_id: string
    observacao?: string
    forma_pagamento: 'dinheiro' | 'cartao_credito' | 'cartao_debito' | 'pix'
    valor_total: number
    status: 'pendente'
  }) {
    const { data, error } = await supabase
      .from('pedidos')
      .insert([pedido])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePedidoStatus(pedidoId: string, status: Pedido['status']) {
    const { data, error } = await supabase
      .from('pedidos')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', pedidoId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getPedidos() {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*),
        endereco:enderecos(*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }
} 