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
    try {
      const { data, error } = await supabase
        .from('clientes')
        .update({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone
        })
        .eq('id', id)
        .select('*')

      if (error) {
        console.error('Erro ao atualizar cliente:', error)
        throw error
      }

      if (!data || data.length === 0) {
        throw new Error('Cliente não encontrado')
      }

      return data[0]
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error)
      throw error
    }
  },

  async deleteCliente(id: string) {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao excluir cliente:', error)
        throw error
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      throw error
    }
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

  async getPedidosRecentes(limit: number = 5) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*),
        endereco:enderecos(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  async getResumoFinanceiro() {
    const hoje = new Date()
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const fimDoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0)

    const { data: pedidosMes, error: errorMes } = await supabase
      .from('pedidos')
      .select('valor_total, created_at')
      .gte('created_at', inicioDoMes.toISOString())
      .lte('created_at', fimDoMes.toISOString())

    if (errorMes) throw errorMes

    const { data: pedidosMesAnterior, error: errorMesAnterior } = await supabase
      .from('pedidos')
      .select('valor_total')
      .gte('created_at', new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1).toISOString())
      .lte('created_at', new Date(hoje.getFullYear(), hoje.getMonth(), 0).toISOString())

    if (errorMesAnterior) throw errorMesAnterior

    const totalVendasMes = pedidosMes.reduce((acc, pedido) => acc + pedido.valor_total, 0)
    const totalVendasMesAnterior = pedidosMesAnterior.reduce((acc, pedido) => acc + pedido.valor_total, 0)
    const variacao = totalVendasMesAnterior > 0 
      ? ((totalVendasMes - totalVendasMesAnterior) / totalVendasMesAnterior) * 100 
      : 0

    return {
      totalVendas: totalVendasMes,
      numeroVendas: pedidosMes.length,
      variacao: variacao
    }
  },

  async getNumeroProdutos() {
    const { count, error } = await supabase
      .from('produtos')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  async getNumeroClientes() {
    const { count, error } = await supabase
      .from('clientes')
      .select('*', { count: 'exact', head: true })

    if (error) throw error
    return count || 0
  },

  async getPedido(id: string) {
    const { data, error } = await supabase
      .from('pedidos')
      .select(`
        *,
        cliente:clientes(*),
        endereco:enderecos(*)
      `)
      .eq('id', id)
      .single()

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