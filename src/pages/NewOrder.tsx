
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const products = [
  { id: "PRD001", name: "Fertilizante NPK 10-10-10", price: 120 },
  { id: "PRD002", name: "Defensivo Agrícola", price: 89 },
  { id: "PRD003", name: "Sementes de Milho", price: 250 },
  { id: "PRD004", name: "Adubo Orgânico", price: 65 },
  { id: "PRD005", name: "Herbicida Seletivo", price: 110 },
  { id: "PRD006", name: "Sementes de Soja", price: 320 },
];

const customers = [
  { id: "CLT001", name: "João Silva" },
  { id: "CLT002", name: "Maria Oliveira" },
  { id: "CLT003", name: "Carlos Santos" },
  { id: "CLT004", name: "Ana Pereira" },
];

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

const NewOrder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!selectedProduct || quantity < 1) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      price: product.price,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customerId) {
      toast({
        title: "Informações incompletas",
        description: "Adicione pelo menos um item e selecione um cliente.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulação de envio - será substituído por integração com Supabase
    setTimeout(() => {
      toast({
        title: "Pedido criado com sucesso!",
        description: "O pedido foi registrado no sistema.",
      });
      setIsSubmitting(false);
      navigate("/orders");
    }, 1000);
  };

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
              <CardDescription>Selecione o cliente para este pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="customer">Cliente</Label>
                <Select onValueChange={setCustomerId} value={customerId} required>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(customer => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
              <CardDescription>Adicione os produtos para este pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-4 items-end mb-4">
                <div>
                  <Label htmlFor="product">Produto</Label>
                  <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Selecione um produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - R${product.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full md:w-24"
                  />
                </div>
                <Button 
                  type="button" 
                  onClick={handleAddItem}
                  className="bg-agro-primary hover:bg-agro-dark"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              {items.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Preço Unit.</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">R${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right font-medium">
                            R${(item.quantity * item.price).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Remover</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md border-dashed">
                  <p className="text-muted-foreground">
                    Nenhum item adicionado ao pedido.
                  </p>
                </div>
              )}

              {items.length > 0 && (
                <div className="mt-4 flex justify-end">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-2xl font-bold">R${calculateTotal().toFixed(2)}</div>
                  </div>
                </div>
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
            disabled={isSubmitting || items.length === 0 || !customerId}
          >
            {isSubmitting ? "Salvando..." : "Finalizar Pedido"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewOrder;
