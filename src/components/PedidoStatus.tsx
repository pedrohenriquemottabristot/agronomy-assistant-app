import { useState } from 'react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { supabaseService } from '../lib/services/supabaseService'
import { toast } from 'sonner'
import type { Pedido } from '../types'

interface PedidoStatusProps {
  pedido: Pedido
  onStatusChange?: () => void
}

export function PedidoStatus({ pedido, onStatusChange }: PedidoStatusProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (newStatus: Pedido['status']) => {
    try {
      setIsLoading(true)
      await supabaseService.updatePedidoStatus(pedido.id, newStatus)
      toast.success('Status do pedido atualizado com sucesso!')
      onStatusChange?.()
    } catch (error) {
      toast.error('Erro ao atualizar status do pedido')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusLabel = (status: Pedido['status']) => {
    const labels = {
      pendente: 'Pendente',
      em_preparo: 'Em Preparo',
      em_entrega: 'Em Entrega',
      entregue: 'Entregue',
      cancelado: 'Cancelado'
    }
    return labels[status]
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        defaultValue={pedido.status}
        onValueChange={handleStatusChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pendente">Pendente</SelectItem>
          <SelectItem value="em_preparo">Em Preparo</SelectItem>
          <SelectItem value="em_entrega">Em Entrega</SelectItem>
          <SelectItem value="entregue">Entregue</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>
      <span className="text-sm text-gray-500">
        {isLoading ? 'Atualizando...' : getStatusLabel(pedido.status)}
      </span>
    </div>
  )
} 