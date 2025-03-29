
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("");

  const products = [
    {
      id: "PRD001",
      name: "Fertilizante NPK 10-10-10",
      description: "Fertilizante mineral misto para diversos cultivos",
      category: "Fertilizantes",
      price: "R$ 120,00",
      stock: 45
    },
    {
      id: "PRD002",
      name: "Defensivo Agrícola",
      description: "Defensivo para controle de pragas em vegetais",
      category: "Defensivos",
      price: "R$ 89,00",
      stock: 30
    },
    {
      id: "PRD003",
      name: "Sementes de Milho",
      description: "Sementes de milho híbrido de alta produtividade",
      category: "Sementes",
      price: "R$ 250,00",
      stock: 15
    },
    {
      id: "PRD004",
      name: "Adubo Orgânico",
      description: "Composto orgânico para fertilização do solo",
      category: "Fertilizantes",
      price: "R$ 65,00",
      stock: 50
    },
    {
      id: "PRD005",
      name: "Herbicida Seletivo",
      description: "Controle de ervas daninhas em cultivos específicos",
      category: "Defensivos",
      price: "R$ 110,00",
      stock: 25
    },
    {
      id: "PRD006",
      name: "Sementes de Soja",
      description: "Sementes de alta germinação para cultivo de soja",
      category: "Sementes",
      price: "R$ 320,00",
      stock: 10
    },
  ];

  // Categorias únicas para o filtro
  const categories = [...new Set(products.map(product => product.category))];

  // Filtragem de produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "" || product.category === category;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (stock: number) => {
    if (stock <= 10) {
      return <span className="text-red-500 font-medium">Baixo</span>;
    } else if (stock <= 30) {
      return <span className="text-yellow-500 font-medium">Médio</span>;
    } else {
      return <span className="text-green-500 font-medium">Bom</span>;
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e visualize todos os produtos disponíveis
          </p>
        </div>
        <Button className="mt-4 md:mt-0 bg-agro-primary hover:bg-agro-dark" asChild>
          <Link to="/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar produtos..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todas categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas categorias</SelectItem>
              {categories.map((cat, index) => (
                <SelectItem key={index} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={index} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{product.category}</span>
                  <span className="text-sm font-medium">{product.id}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Preço</span>
                    <p className="font-semibold">{product.price}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Estoque</span>
                    <p className="font-semibold flex items-center gap-1">
                      {product.stock} {getStockStatus(product.stock)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={`/products/${product.id}`}>
                      Detalhes
                    </Link>
                  </Button>
                  <Button variant="secondary" className="flex-1" asChild>
                    <Link to={`/products/${product.id}/edit`}>
                      Editar
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            Nenhum produto encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
