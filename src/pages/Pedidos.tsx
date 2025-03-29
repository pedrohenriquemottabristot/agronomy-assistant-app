import { useState, useEffect } from 'react'
import { supabaseService } from '../lib/services/supabaseService'
import { PedidoStatus } from '../components/PedidoStatus'
import { PedidoForm } from '../components/PedidoForm'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import type { Pedido } from '../types'

export function Pedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPedidos()
  }, [])

  const loadPedidos = async () => {
    try {
      const data = await supabaseService.getPedidos()
      setPedidos(data)
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: Pedido['status']) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_preparo: 'bg-blue-100 text-blue-800',
      em_entrega: 'bg-purple-100 text-purple-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    }
    return colors[status]
  }

  if (isLoading) {
    return <div>Carregando pedidos...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Novo Pedido</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Pedido</DialogTitle>
            </DialogHeader>
            <PedidoForm onSuccess={loadPedidos} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pedidos.map((pedido) => (
          <div
            key={pedido.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Pedido #{pedido.id}</h3>
                <p className="text-sm text-gray-600">
                  Cliente: {pedido.cliente?.nome}
                </p>
                <p className="text-sm text-gray-600">
                  Endereço: {pedido.endereco?.rua}, {pedido.endereco?.numero}
                </p>
                <p className="text-sm text-gray-600">
                  Valor Total: R$ {pedido.valor_total.toFixed(2)}
                </p>
                {pedido.observacao && (
                  <p className="text-sm text-gray-600">
                    Observação: {pedido.observacao}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(pedido.status)}`}>
                  {pedido.status}
                </span>
                <PedidoStatus pedido={pedido} onStatusChange={loadPedidos} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 