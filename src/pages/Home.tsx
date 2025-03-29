
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  ShoppingBag, 
  Database, 
  CheckCircle, 
  ChevronRight
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Users className="h-10 w-10 text-agro-primary" />,
      title: "Gestão de Clientes",
      description: "Mantenha um cadastro organizado de todos os seus clientes e suas necessidades específicas."
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-agro-primary" />,
      title: "Controle de Pedidos",
      description: "Acompanhe seus pedidos do início ao fim, com status de aprovação e entrega."
    },
    {
      icon: <Database className="h-10 w-10 text-agro-primary" />,
      title: "Estoque de Produtos",
      description: "Mantenha controle rigoroso do seu estoque de produtos agrícolas e insumos."
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-agro-primary" />,
      title: "Relatórios Detalhados",
      description: "Acesse relatórios e análises para tomar decisões estratégicas para seu negócio."
    }
  ];

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-agro-light to-white py-16 lg:py-24">
        <div className="container px-4 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Simplifique a gestão do seu negócio agrícola
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Controle pedidos, gerencie produtos e acompanhe clientes em uma plataforma completa para profissionais da agronomia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {isAuthenticated ? (
                <Button 
                  className="text-lg bg-agro-primary hover:bg-agro-dark"
                  asChild
                >
                  <Link to="/dashboard">
                    Acessar Dashboard
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button 
                    className="text-lg bg-agro-primary hover:bg-agro-dark"
                    asChild
                  >
                    <Link to="/register">
                      Começar agora
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    variant="outline"
                    className="text-lg border-agro-primary text-agro-primary hover:bg-agro-light"
                    asChild
                  >
                    <Link to="/login">
                      Entrar
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="bg-white p-4 rounded-xl shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YWdyaWN1bHR1cmV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
                alt="Agricultura"
                className="rounded-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Funcionalidades Completas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Todas as ferramentas que você precisa para gerenciar seu negócio agrícola em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-agro-primary text-white">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Comece a transformar seu negócio hoje
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se aos profissionais de agronomia que já elevaram sua produtividade com o AgroAssist.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-agro-primary hover:bg-gray-100"
            asChild
          >
            {isAuthenticated ? (
              <Link to="/dashboard">Acessar Dashboard</Link>
            ) : (
              <Link to="/register">Criar conta gratuita</Link>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
