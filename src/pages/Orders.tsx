import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Plus, Search, Filter } from "lucide-react";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Pedido } from "@/types";

const Orders = () => {
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPedidos();
  }, []);

  const loadPedidos = async () => {
    try {
      const data = await supabaseService.getPedidos();
      setPedidos(data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
      toast.error("Erro ao carregar pedidos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (pedidoId: string, newStatus: Pedido['status']) => {
    try {
      await supabaseService.updatePedidoStatus(pedidoId, newStatus);
      toast.success("Status do pedido atualizado com sucesso!");
      loadPedidos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do pedido");
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

  // Filtragem de pedidos
  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = searchQuery === "" || 
      pedido.cliente?.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = status === "all" || pedido.status === status;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <div>Carregando pedidos...</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e visualize todos os pedidos
          </p>
        </div>
        <Button className="mt-4 md:mt-0 bg-agro-primary hover:bg-agro-dark" asChild>
          <Link to="/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por cliente ou ID do pedido..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="em_preparo">Em Preparo</SelectItem>
              <SelectItem value="em_entrega">Em Entrega</SelectItem>
              <SelectItem value="entregue">Entregue</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "dd/MM/yyyy") : "Data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="py-3 px-4 text-left text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Cliente</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Data</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Observação</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Valor Total</th>
              <th className="py-3 px-4 text-right text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPedidos.length > 0 ? (
              filteredPedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm">
                    <Link to={`/orders/${pedido.id}`} className="text-agro-primary hover:underline">
                      {pedido.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm">{pedido.cliente?.nome}</td>
                  <td className="py-3 px-4 text-sm">
                    {format(new Date(pedido.created_at), "dd/MM/yyyy")}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <Select
                      value={pedido.status}
                      onValueChange={(value: Pedido['status']) => handleStatusChange(pedido.id, value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                            {getStatusLabel(pedido.status)}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_preparo">Em Preparo</SelectItem>
                        <SelectItem value="em_entrega">Em Entrega</SelectItem>
                        <SelectItem value="entregue">Entregue</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="max-w-xs overflow-hidden text-ellipsis">
                      {pedido.observacao || "Sem observações"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">
                    R$ {pedido.valor_total.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orders/${pedido.id}`}>Ver detalhes</Link>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                  Nenhum pedido encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
