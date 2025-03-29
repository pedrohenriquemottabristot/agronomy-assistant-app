import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Produto } from "@/types";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProduto();
    }
  }, [id]);

  const loadProduto = async () => {
    try {
      const data = await supabaseService.getProdutoById(id!);
      setProduto(data);
    } catch (error) {
      console.error("Erro ao carregar produto:", error);
      toast.error("Erro ao carregar produto");
    } finally {
      setIsLoading(false);
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 10) {
      return <span className="text-red-500 font-medium">Baixo</span>;
    } else if (stock <= 30) {
      return <span className="text-yellow-500 font-medium">Médio</span>;
    } else {
      return <span className="text-green-500 font-medium">Bom</span>;
    }
  };

  if (isLoading || !produto) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{produto.nome}</h1>
          <p className="text-muted-foreground mt-1">
            Detalhes do produto
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">ID</span>
                <p className="font-medium">{produto.id}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Categoria</span>
                <p className="font-medium">{produto.categoria}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Data de Cadastro</span>
                <p className="font-medium">
                  {new Date(produto.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">Descrição</span>
                <p className="font-medium">{produto.descricao}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Preço</span>
                <p className="font-medium">R$ {produto.preco.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Estoque</span>
                <p className="font-medium flex items-center gap-1">
                  {produto.estoque} {getStockStatus(produto.estoque)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex gap-4">
        <Button variant="outline" onClick={() => navigate("/products")}>
          Voltar
        </Button>
        <Button onClick={() => navigate(`/products/${id}/edit`)}>
          Editar Produto
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails; 