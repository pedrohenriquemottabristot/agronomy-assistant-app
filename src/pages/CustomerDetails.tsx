import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Cliente, Endereco } from "@/types";

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEndereco, setSelectedEndereco] = useState<Endereco | null>(null);
  const [formData, setFormData] = useState({
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    is_principal: false,
  });

  useEffect(() => {
    if (id) {
      loadCliente();
      loadEnderecos();
    }
  }, [id]);

  const loadCliente = async () => {
    try {
      const data = await supabaseService.getClienteById(id!);
      setCliente(data);
    } catch (error) {
      console.error("Erro ao carregar cliente:", error);
      toast.error("Erro ao carregar cliente");
    }
  };

  const loadEnderecos = async () => {
    try {
      const data = await supabaseService.getEnderecosByCliente(id!);
      setEnderecos(data);
    } catch (error) {
      console.error("Erro ao carregar endereços:", error);
      toast.error("Erro ao carregar endereços");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedEndereco) {
        await supabaseService.updateEndereco(selectedEndereco.id, formData);
        toast.success("Endereço atualizado com sucesso!");
      } else {
        await supabaseService.createEndereco({
          ...formData,
          cliente_id: id!,
        });
        toast.success("Endereço cadastrado com sucesso!");
      }
      setFormData({
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        is_principal: false,
      });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedEndereco(null);
      loadEnderecos();
    } catch (error) {
      console.error("Erro ao salvar endereço:", error);
      toast.error("Erro ao salvar endereço");
    }
  };

  const handleEdit = (endereco: Endereco) => {
    setSelectedEndereco(endereco);
    setFormData({
      rua: endereco.rua,
      numero: endereco.numero,
      complemento: endereco.complemento || "",
      bairro: endereco.bairro,
      cidade: endereco.cidade,
      estado: endereco.estado,
      cep: endereco.cep,
      is_principal: endereco.is_principal,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (endereco: Endereco) => {
    if (window.confirm("Tem certeza que deseja excluir este endereço?")) {
      try {
        await supabaseService.deleteEndereco(endereco.id);
        toast.success("Endereço excluído com sucesso!");
        loadEnderecos();
      } catch (error) {
        console.error("Erro ao excluir endereço:", error);
        toast.error("Erro ao excluir endereço");
      }
    }
  };

  if (isLoading || !cliente) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{cliente.nome}</h1>
          <p className="text-muted-foreground mt-1">
            Detalhes do cliente
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{cliente.email}</p>
              </div>
              <div>
                <Label className="font-medium">Telefone</Label>
                <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
              </div>
              <div>
                <Label className="font-medium">Data de Cadastro</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(cliente.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Endereços</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={() => {
                    setIsEditMode(false);
                    setSelectedEndereco(null);
                    setFormData({
                      rua: "",
                      numero: "",
                      complemento: "",
                      bairro: "",
                      cidade: "",
                      estado: "",
                      cep: "",
                      is_principal: false,
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Endereço
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? "Editar Endereço" : "Novo Endereço"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rua">Rua</Label>
                    <Input
                      id="rua"
                      value={formData.rua}
                      onChange={(e) => setFormData({ ...formData, rua: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complemento">Complemento</Label>
                    <Input
                      id="complemento"
                      value={formData.complemento}
                      onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_principal"
                      checked={formData.is_principal}
                      onChange={(e) => setFormData({ ...formData, is_principal: e.target.checked })}
                    />
                    <Label htmlFor="is_principal">Endereço Principal</Label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {isEditMode ? "Salvar" : "Cadastrar"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enderecos.map((endereco) => (
                <div key={endereco.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {endereco.rua}, {endereco.numero}
                        {endereco.complemento && ` - ${endereco.complemento}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {endereco.bairro} - {endereco.cidade}/{endereco.estado}
                      </p>
                      <p className="text-sm text-muted-foreground">CEP: {endereco.cep}</p>
                      {endereco.is_principal && (
                        <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full mt-2">
                          Principal
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(endereco)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(endereco)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {enderecos.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Nenhum endereço cadastrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetails; 