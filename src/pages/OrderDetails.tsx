import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Pedido } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

export function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPedido();
  }, [id]);

  const loadPedido = async () => {
    try {
      const data = await supabaseService.getPedido(id!);
      setPedido(data);
    } catch (error) {
      console.error("Erro ao carregar pedido:", error);
      toast.error("Erro ao carregar detalhes do pedido");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregue":
        return "bg-green-100 text-green-800";
      case "em_preparo":
        return "bg-blue-100 text-blue-800";
      case "em_entrega":
        return "bg-purple-100 text-purple-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

  if (isLoading) {
    return <div>Carregando detalhes do pedido...</div>;
  }

  if (!pedido) {
    return <div>Pedido não encontrado.</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Pedido</h1>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Informações do Pedido</h2>
              <div className="space-y-2">
                <p><span className="font-medium">ID:</span> {pedido.id}</p>
                <p><span className="font-medium">Data:</span> {format(new Date(pedido.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                    {getStatusLabel(pedido.status)}
                  </span>
                </p>
                <p><span className="font-medium">Valor Total:</span> R$ {pedido.valor_total.toFixed(2)}</p>
                <p><span className="font-medium">Forma de Pagamento:</span> {pedido.forma_pagamento}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Cliente</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Nome:</span> {pedido.cliente?.nome}</p>
                <p><span className="font-medium">Email:</span> {pedido.cliente?.email}</p>
                <p><span className="font-medium">Telefone:</span> {pedido.cliente?.telefone}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Endereço de Entrega</h2>
            <div className="space-y-2">
              <p>{pedido.endereco?.rua}, {pedido.endereco?.numero}</p>
              {pedido.endereco?.complemento && <p>Complemento: {pedido.endereco.complemento}</p>}
              <p>{pedido.endereco?.bairro}</p>
              <p>{pedido.endereco?.cidade} - {pedido.endereco?.estado}</p>
              <p>CEP: {pedido.endereco?.cep}</p>
            </div>
          </div>
        </div>

        {pedido.observacao && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Observação</h2>
            <p className="text-gray-600">{pedido.observacao}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails; 