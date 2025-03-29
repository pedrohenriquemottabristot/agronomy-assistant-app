import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight, Package, DollarSign, ShoppingCart, Users } from "lucide-react";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Pedido } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Dashboard() {
  const [pedidosRecentes, setPedidosRecentes] = useState<Pedido[]>([]);
  const [resumoFinanceiro, setResumoFinanceiro] = useState({
    totalVendas: 0,
    numeroVendas: 0,
    variacao: 0
  });
  const [numeroProdutos, setNumeroProdutos] = useState(0);
  const [numeroClientes, setNumeroClientes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [pedidos, resumo, produtos, clientes] = await Promise.all([
        supabaseService.getPedidosRecentes(),
        supabaseService.getResumoFinanceiro(),
        supabaseService.getNumeroProdutos(),
        supabaseService.getNumeroClientes()
      ]);
      setPedidosRecentes(pedidos);
      setResumoFinanceiro(resumo);
      setNumeroProdutos(produtos);
      setNumeroClientes(clientes);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast.error("Erro ao carregar dados do dashboard");
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
    return <div>Carregando dashboard...</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do seu negócio
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {resumoFinanceiro.totalVendas.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {resumoFinanceiro.variacao > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {resumoFinanceiro.variacao.toFixed(1)}% em relação ao mês anterior
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  {Math.abs(resumoFinanceiro.variacao).toFixed(1)}% em relação ao mês anterior
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas no Mês</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resumoFinanceiro.numeroVendas}</div>
            <p className="text-xs text-muted-foreground">
              Pedidos realizados este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numeroProdutos}</div>
            <p className="text-xs text-muted-foreground">
              Produtos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numeroClientes}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pedidosRecentes.map((pedido) => (
                <div key={pedido.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Pedido #{pedido.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pedido.cliente?.nome}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                      {getStatusLabel(pedido.status)}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/orders/${pedido.id}`}>Ver detalhes</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Vendas do Mês</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">R$ {resumoFinanceiro.totalVendas.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">
                    {resumoFinanceiro.numeroVendas} pedidos
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Variação</p>
                  <p className="text-sm text-muted-foreground">
                    Em relação ao mês anterior
                  </p>
                </div>
                <div className="text-right">
                  {resumoFinanceiro.variacao > 0 ? (
                    <p className="text-sm font-medium text-green-500">
                      +{resumoFinanceiro.variacao.toFixed(1)}%
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-red-500">
                      {resumoFinanceiro.variacao.toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
