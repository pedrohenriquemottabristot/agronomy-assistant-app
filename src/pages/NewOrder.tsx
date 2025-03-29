import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Plus, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabaseService } from "@/lib/services/supabaseService";
import type { Cliente, Produto, Endereco } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

const NewOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [enderecoId, setEnderecoId] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<"dinheiro" | "cartao_credito" | "cartao_debito" | "pix">("dinheiro");
  const [status, setStatus] = useState<"pendente">("pendente");
  const [observacao, setObservacao] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnderecoDialogOpen, setIsEnderecoDialogOpen] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    is_principal: false,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (customerId) {
      loadEnderecos();
    } else {
      setEnderecos([]);
      setEnderecoId("");
    }
  }, [customerId]);

  const loadData = async () => {
    try {
      const [clientesData, produtosData] = await Promise.all([
        supabaseService.getClientes(),
        supabaseService.getProdutos()
      ]);
      setClientes(clientesData);
      setProdutos(produtosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadEnderecos = async () => {
    try {
      const enderecosData = await supabaseService.getEnderecosByCliente(customerId);
      setEnderecos(enderecosData);
      if (enderecosData.length > 0) {
        setEnderecoId(enderecosData[0].id);
      }
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os endereços do cliente",
        variant: "destructive",
      });
    }
  };

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = produtos.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: OrderItem = {
      productId: product.id,
      productName: product.nome,
      price: product.preco,
      quantity: quantity
    };

    setItems([...items, newItem]);
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customerId || !enderecoId) {
      toast({
        title: "Informações incompletas",
        description: "Adicione pelo menos um item, selecione um cliente e um endereço de entrega.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await supabaseService.createPedido({
        cliente_id: customerId,
        endereco_id: enderecoId,
        observacao: observacao,
        forma_pagamento: formaPagamento,
        valor_total: calculateTotal(),
        status: "pendente"
      });

      toast({
        title: "Pedido criado com sucesso!",
        description: "O pedido foi registrado no sistema.",
      });
      navigate("/orders");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEndereco = async () => {
    if (!customerId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro",
        variant: "destructive",
      });
      return;
    }

    try {
      const enderecoData = await supabaseService.createEndereco({
        ...novoEndereco,
        cliente_id: customerId,
      });

      setEnderecos([...enderecos, enderecoData]);
      setEnderecoId(enderecoData.id);
      setIsEnderecoDialogOpen(false);
      setNovoEndereco({
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        is_principal: false,
      });

      toast({
        title: "Sucesso",
        description: "Endereço cadastrado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o endereço",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando dados...</div>;
  }

  return (
    <div className="container max-w-4xl py-8 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Novo Pedido</h1>
        <p className="text-muted-foreground mt-1">
          Crie um novo pedido para um cliente
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Selecione o cliente e o endereço de entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customer">Cliente</Label>
                <Select onValueChange={setCustomerId} value={customerId} required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {customerId && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="endereco">Endereço de Entrega</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEnderecoDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Endereço
                    </Button>
                  </div>
                  <Select onValueChange={setEnderecoId} value={enderecoId} required>
                    <SelectTrigger id="endereco">
                      <SelectValue placeholder="Selecione o endereço de entrega" />
                    </SelectTrigger>
                    <SelectContent>
                      {enderecos.map(endereco => (
                        <SelectItem key={endereco.id} value={endereco.id}>
                          {`${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="pagamento">Forma de Pagamento</Label>
                <Select onValueChange={(value: "dinheiro" | "cartao_credito" | "cartao_debito" | "pix") => setFormaPagamento(value)} value={formaPagamento} required>
                  <SelectTrigger id="pagamento">
                    <SelectValue placeholder="Selecione a forma de pagamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                    <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="observacao">Observação</Label>
                <Textarea
                  id="observacao"
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Digite uma observação para o pedido (opcional)"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
              <CardDescription>Adicione os produtos ao pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Label htmlFor="product">Produto</Label>
                  <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {produtos.map(produto => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome} - R$ {produto.preco.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-32">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    onClick={handleAddItem}
                    disabled={!selectedProduct || quantity < 1}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10 border rounded-md border-dashed">
                  <p className="text-muted-foreground">
                    Nenhum item adicionado ao pedido.
                  </p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Quantidade</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">
                            R$ {item.price.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Separator className="my-4" />
                  <div className="flex justify-end">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Total</div>
                      <div className="text-2xl font-bold">
                        R$ {calculateTotal().toFixed(2)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/orders")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-agro-primary hover:bg-agro-dark"
            disabled={isSubmitting || items.length === 0 || !customerId || !enderecoId}
          >
            {isSubmitting ? "Salvando..." : "Finalizar Pedido"}
          </Button>
        </div>
      </form>

      <Dialog open={isEnderecoDialogOpen} onOpenChange={setIsEnderecoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Endereço</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="rua">Rua</Label>
              <Input
                id="rua"
                value={novoEndereco.rua}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, rua: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                value={novoEndereco.numero}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, numero: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={novoEndereco.complemento}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, complemento: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={novoEndereco.bairro}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, bairro: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                value={novoEndereco.cidade}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, cidade: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                value={novoEndereco.estado}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, estado: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={novoEndereco.cep}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, cep: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_principal"
                checked={novoEndereco.is_principal}
                onChange={(e) => setNovoEndereco({ ...novoEndereco, is_principal: e.target.checked })}
              />
              <Label htmlFor="is_principal">Endereço Principal</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEnderecoDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveEndereco}>
              Salvar Endereço
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewOrder;
