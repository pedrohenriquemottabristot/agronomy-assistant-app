import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  Package, 
  Users, 
  CalendarDays, 
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabaseService } from "@/lib/services/supabaseService";
import type { Cliente, Pedido } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosHoje: 0,
    totalProdutos: 0,
    produtosBaixoEstoque: 0,
    totalClientes: 0,
    clientesNovos: 0,
    pedidosPendentes: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Carregar clientes
      const clientes = await supabaseService.getClientes();
      const hoje = new Date();
      const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0));
      const clientesNovos = clientes.filter(cliente => 
        new Date(cliente.created_at) >= inicioDoDia
      );

      // Carregar pedidos
      const pedidos = await supabaseService.getPedidos();
      const pedidosHoje = pedidos.filter(pedido => 
        new Date(pedido.created_at) >= inicioDoDia
      );
      const pedidosPendentes = pedidos.filter(pedido => 
        pedido.status === 'pendente'
      );

      setStats({
        totalPedidos: pedidos.length,
        pedidosHoje: pedidosHoje.length,
        totalProdutos: 15, // TODO: Implementar contagem de produtos
        produtosBaixoEstoque: 2, // TODO: Implementar verificação de estoque
        totalClientes: clientes.length,
        clientesNovos: clientesNovos.length,
        pedidosPendentes: pedidosPendentes.length
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  };

  const dashboardStats = [
    {
      title: "Pedidos Totais",
      value: stats.totalPedidos.toString(),
      description: `${stats.pedidosHoje} pedidos hoje`,
      icon: <ShoppingBag className="h-6 w-6 text-agro-primary" />,
      link: "/orders",
    },
    {
      title: "Produtos",
      value: stats.totalProdutos.toString(),
      description: `${stats.produtosBaixoEstoque} com estoque baixo`,
      icon: <Package className="h-6 w-6 text-agro-secondary" />,
      link: "/products",
    },
    {
      title: "Clientes",
      value: stats.totalClientes.toString(),
      description: `${stats.clientesNovos} novos esta semana`,
      icon: <Users className="h-6 w-6 text-agro-accent" />,
      link: "/customers",
    },
    {
      title: "Pedidos Pendentes",
      value: stats.pedidosPendentes.toString(),
      description: "Aguardando aprovação",
      icon: <CalendarDays className="h-6 w-6 text-orange-500" />,
      link: "/orders?status=pendente",
    },
  ];

  const recentOrders = [
    { id: "PED001", customer: "João Silva", date: "15/06/2023", status: "entregue", amount: "R$ 560,00" },
    { id: "PED002", customer: "Maria Oliveira", date: "12/06/2023", status: "aprovado", amount: "R$ 890,00" },
    { id: "PED003", customer: "Carlos Santos", date: "10/06/2023", status: "pendente", amount: "R$ 350,00" },
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

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo, <span className="font-medium">{user?.name}</span>! Aqui está o resumo do seu negócio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <Link 
                to={stat.link} 
                className="text-agro-primary hover:underline text-sm font-medium inline-flex items-center mt-4"
              >
                Ver detalhes
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
