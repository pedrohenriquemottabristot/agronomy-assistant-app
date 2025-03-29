import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Produto } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [products, setProducts] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProdutos();
  }, []);

  const loadProdutos = async () => {
    try {
      const data = await supabaseService.getProdutos();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      toast.error("Erro ao carregar produtos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (produto: Produto) => {
    if (window.confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        await supabaseService.deleteProduto(produto.id);
        toast.success("Produto excluído com sucesso!");
        loadProdutos();
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        toast.error("Erro ao excluir produto");
      }
    }
  };

  // Categorias únicas para o filtro
  const categories = [...new Set(products.map(product => product.categoria))];

  // Filtragem de produtos
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === "" || 
      product.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descricao.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = category === "all" || product.categoria === category;
    
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

  if (isLoading) {
    return <div>Carregando produtos...</div>;
  }

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

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="fertilizantes">Fertilizantes</SelectItem>
              <SelectItem value="pesticidas">Pesticidas</SelectItem>
              <SelectItem value="sementes">Sementes</SelectItem>
              <SelectItem value="equipamentos">Equipamentos</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => navigate("/products/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((produto) => (
          <Card key={produto.id}>
            <CardHeader>
              <CardTitle>{produto.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Categoria</span>
                  <p className="font-medium">{produto.categoria}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Preço</span>
                  <p className="font-medium">R$ {produto.preco.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Estoque</span>
                  <p className="font-medium">{produto.estoque}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/products/${produto.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/products/${produto.id}/edit`)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(produto)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Products;
