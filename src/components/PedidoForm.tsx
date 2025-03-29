import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/textarea'
import { supabaseService } from '../lib/services/supabaseService'
import { toast } from 'sonner'
import type { Cliente, Endereco, Pedido } from '../types'

const pedidoSchema = z.object({
  cliente_id: z.string().min(1, 'Cliente é obrigatório'),
  endereco_id: z.string().min(1, 'Endereço é obrigatório'),
  observacao: z.string().optional(),
  forma_pagamento: z.enum(['dinheiro', 'cartao_credito', 'cartao_debito', 'pix']),
  valor_total: z.number().min(0, 'Valor total deve ser maior que zero'),
})

type PedidoFormData = z.infer<typeof pedidoSchema>

interface PedidoFormProps {
  onSuccess?: () => void
}

export function PedidoForm({ onSuccess }: PedidoFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [enderecos, setEnderecos] = useState<Endereco[]>([])
  const [selectedClienteId, setSelectedClienteId] = useState<string>('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema)
  })

  useEffect(() => {
    loadClientes()
  }, [])

  useEffect(() => {
    if (selectedClienteId) {
      loadEnderecos(selectedClienteId)
    }
  }, [selectedClienteId])

  const loadClientes = async () => {
    try {
      const data = await supabaseService.getClientes()
      setClientes(data)
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
    }
  }

  const loadEnderecos = async (clienteId: string) => {
    try {
      const data = await supabaseService.getEnderecosByCliente(clienteId)
      setEnderecos(data)
    } catch (error) {
      console.error('Erro ao carregar endereços:', error)
    }
  }

  const onSubmit = async (data: PedidoFormData) => {
    try {
      setIsLoading(true)
      await supabaseService.createPedido({
        ...data,
        status: 'pendente'
      })
      toast.success('Pedido criado com sucesso!')
      reset()
      setSelectedClienteId('')
      setEnderecos([])
      onSuccess?.()
    } catch (error) {
      toast.error('Erro ao criar pedido')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cliente_id">Cliente</Label>
        <Select onValueChange={(value) => {
          setSelectedClienteId(value)
          register('cliente_id').onChange({ target: { value } })
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clientes.map((cliente) => (
              <SelectItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.cliente_id && (
          <p className="text-sm text-red-500">{errors.cliente_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco_id">Endereço de Entrega</Label>
        <Select onValueChange={(value) => register('endereco_id').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um endereço" />
          </SelectTrigger>
          <SelectContent>
            {enderecos.map((endereco) => (
              <SelectItem key={endereco.id} value={endereco.id}>
                {`${endereco.rua}, ${endereco.numero} - ${endereco.bairro}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.endereco_id && (
          <p className="text-sm text-red-500">{errors.endereco_id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observacao">Observação</Label>
        <Textarea id="observacao" {...register('observacao')} />
        {errors.observacao && (
          <p className="text-sm text-red-500">{errors.observacao.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
        <Select onValueChange={(value) => register('forma_pagamento').onChange({ target: { value } })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a forma de pagamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dinheiro">Dinheiro</SelectItem>
            <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
            <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
            <SelectItem value="pix">PIX</SelectItem>
          </SelectContent>
        </Select>
        {errors.forma_pagamento && (
          <p className="text-sm text-red-500">{errors.forma_pagamento.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_total">Valor Total</Label>
        <Input 
          id="valor_total" 
          type="number" 
          step="0.01"
          {...register('valor_total', { valueAsNumber: true })} 
        />
        {errors.valor_total && (
          <p className="text-sm text-red-500">{errors.valor_total.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Criando...' : 'Criar Pedido'}
      </Button>
    </form>
  )
} 