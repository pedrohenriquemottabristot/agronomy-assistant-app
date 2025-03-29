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
import type { Cliente, Pedido, Produto } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pedidosHoje: 0,
    totalProdutos: 0,
    produtosBaixoEstoque: 0,
    totalClientes: 0,
    clientesNovos: 0,
    pedidosPendentes: 0,
    valorTotalPedidos: 0,
    valorPedidosHoje: 0
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

      // Carregar produtos
      const produtos = await supabaseService.getProdutos();
      const produtosBaixoEstoque = produtos.filter(produto => 
        produto.estoque <= 10
      );

      // Calcular valores totais
      const valorTotalPedidos = pedidos.reduce((total, pedido) => total + pedido.valor_total, 0);
      const valorPedidosHoje = pedidosHoje.reduce((total, pedido) => total + pedido.valor_total, 0);

      setStats({
        totalPedidos: pedidos.length,
        pedidosHoje: pedidosHoje.length,
        totalProdutos: produtos.length,
        produtosBaixoEstoque: produtosBaixoEstoque.length,
        totalClientes: clientes.length,
        clientesNovos: clientesNovos.length,
        pedidosPendentes: pedidosPendentes.length,
        valorTotalPedidos,
        valorPedidosHoje
      });
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const dashboardStats = [
    {
      title: "Pedidos Totais",
      value: stats.totalPedidos.toString(),
      description: `${stats.pedidosHoje} pedidos hoje (${formatCurrency(stats.valorPedidosHoje)})`,
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
        return "text-green-500";
      case "aprovado":
        return "text-blue-500";
      case "pendente":
        return "text-orange-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta, {user?.name}! Aqui está um resumo do seu negócio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>
              Últimos pedidos realizados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">{order.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <p className={`text-sm ${getStatusColor(order.status)}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>
              Visão geral das finanças
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total de Vendas</p>
                <p className="font-medium">{formatCurrency(stats.valorTotalPedidos)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Vendas Hoje</p>
                <p className="font-medium">{formatCurrency(stats.valorPedidosHoje)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Pedidos Pendentes</p>
                <p className="font-medium">{stats.pedidosPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
