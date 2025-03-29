import React, { useState } from "react";
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

const Orders = () => {
  const [date, setDate] = useState<Date>();
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const orders = [
    { 
      id: "PED001", 
      customer: "João Silva", 
      date: "15/06/2023", 
      status: "entregue", 
      amount: "R$ 560,00",
      items: "Fertilizante NPK, Defensivo agrícola" 
    },
    { 
      id: "PED002", 
      customer: "Maria Oliveira", 
      date: "12/06/2023", 
      status: "aprovado", 
      amount: "R$ 890,00",
      items: "Sementes de milho, Fungicida" 
    },
    { 
      id: "PED003", 
      customer: "Carlos Santos", 
      date: "10/06/2023", 
      status: "pendente", 
      amount: "R$ 350,00",
      items: "Adubo orgânico" 
    },
    { 
      id: "PED004", 
      customer: "Ana Pereira", 
      date: "08/06/2023", 
      status: "cancelado", 
      amount: "R$ 720,00",
      items: "Calcário, Inseticida" 
    },
    { 
      id: "PED005", 
      customer: "Paulo Ribeiro", 
      date: "05/06/2023", 
      status: "entregue", 
      amount: "R$ 480,00",
      items: "Herbicida, Regulador de crescimento" 
    },
    { 
      id: "PED006", 
      customer: "Lucia Fernandes", 
      date: "01/06/2023", 
      status: "entregue", 
      amount: "R$ 930,00",
      items: "Kit de irrigação, Fertilizante foliar" 
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregue":
        return "bg-green-100 text-green-800";
      case "aprovado":
        return "bg-blue-100 text-blue-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "cancelado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filtragem de pedidos
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === "" || 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = status === "all" || order.status === status;
    
    return matchesSearch && matchesStatus;
  });

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
              <SelectItem value="aprovado">Aprovado</SelectItem>
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

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="py-3 px-4 text-left text-sm font-medium">ID</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Cliente</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Data</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Itens</th>
              <th className="py-3 px-4 text-left text-sm font-medium">Valor</th>
              <th className="py-3 px-4 text-left text-sm font-medium sr-only">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 text-sm">
                    <Link to={`/orders/${order.id}`} className="text-agro-primary hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm">{order.customer}</td>
                  <td className="py-3 px-4 text-sm">{order.date}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className="max-w-xs overflow-hidden text-ellipsis">{order.items}</span>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium">{order.amount}</td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orders/${order.id}`}>Ver detalhes</Link>
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
