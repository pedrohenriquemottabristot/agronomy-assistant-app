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
      .order('nome')

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      throw error
    }

    console.log('Clientes encontrados:', data)
    return data || []
  },

  async updateCliente(id: string, cliente: { nome: string; email: string; telefone: string }) {
    const { data, error } = await supabase
      .from('clientes')
      .update(cliente)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteCliente(id: string) {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getClienteById(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

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

  async updateEndereco(id: string, endereco: Omit<Endereco, 'id' | 'cliente_id'>) {
    const { data, error } = await supabase
      .from('enderecos')
      .update(endereco)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteEndereco(id: string) {
    const { error } = await supabase
      .from('enderecos')
      .delete()
      .eq('id', id)

    if (error) throw error
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
  },

  // Produtos
  async createProduto(produto: {
    nome: string
    descricao: string
    categoria: string
    preco: number
    estoque: number
  }) {
    const { data, error } = await supabase
      .from('produtos')
      .insert([produto])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome')

    if (error) throw error
    return data
  },

  async getProdutoById(id: string) {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async updateProduto(id: string, produto: {
    nome: string
    descricao: string
    categoria: string
    preco: number
    estoque: number
  }) {
    const { data, error } = await supabase
      .from('produtos')
      .update(produto)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProduto(id: string) {
    const { error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
} 