
import React from "react";
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

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Pedidos Totais",
      value: "24",
      description: "3 pedidos hoje",
      icon: <ShoppingBag className="h-6 w-6 text-agro-primary" />,
      link: "/orders",
    },
    {
      title: "Produtos",
      value: "15",
      description: "2 com estoque baixo",
      icon: <Package className="h-6 w-6 text-agro-secondary" />,
      link: "/products",
    },
    {
      title: "Clientes",
      value: "8",
      description: "1 novo esta semana",
      icon: <Users className="h-6 w-6 text-agro-accent" />,
      link: "/customers",
    },
    {
      title: "Pedidos Pendentes",
      value: "3",
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
        {stats.map((stat, index) => (
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Pedidos Recentes</h2>
          <Button
            variant="outline"
            className="text-agro-primary border-agro-primary hover:bg-agro-light"
            asChild
          >
            <Link to="/orders">Ver todos</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="py-3 px-4 text-left text-sm font-medium">ID</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Cliente</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Data</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, index) => (
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
                  <td className="py-3 px-4 text-sm font-medium">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
