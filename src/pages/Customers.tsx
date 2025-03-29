import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Search, Pencil, Trash2, Eye } from "lucide-react";
import { supabaseService } from "@/lib/services/supabaseService";
import { toast } from "sonner";
import type { Cliente } from "@/types";
import { useNavigate } from "react-router-dom";

const Customers = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      console.log('Carregando clientes...')
      const data = await supabaseService.getClientes()
      console.log('Clientes carregados:', data)
      setClientes(data)
    } catch (error) {
      console.error("Erro ao carregar clientes:", error)
      toast.error("Erro ao carregar clientes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedCliente) {
        await supabaseService.updateCliente(selectedCliente.id, formData);
        toast.success("Cliente atualizado com sucesso!");
      } else {
        await supabaseService.createCliente(formData);
        toast.success("Cliente cadastrado com sucesso!");
      }
      setFormData({ nome: "", email: "", telefone: "" });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedCliente(null);
      await loadClientes();
    } catch (error: any) {
      console.error("Erro ao salvar cliente:", error);
      const errorMessage = error.message || "Erro ao salvar cliente";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (cliente: Cliente) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await supabaseService.deleteCliente(cliente.id);
        toast.success("Cliente excluído com sucesso!");
        setClientes(clientes.filter(c => c.id !== cliente.id));
      } catch (error: any) {
        console.error("Erro ao excluir cliente:", error);
        const errorMessage = error.message || "Erro ao excluir cliente";
        toast.error(errorMessage);
      }
    }
  };

  const handleViewDetails = (cliente: Cliente) => {
    navigate(`/customers/${cliente.id}`);
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cliente.telefone.includes(searchQuery)
  );

  if (isLoading) {
    return <div>Carregando clientes...</div>;
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus clientes
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="mt-4 md:mt-0"
              onClick={() => {
                setIsEditMode(false);
                setSelectedCliente(null);
                setFormData({ nome: "", email: "", telefone: "" });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="dialog-description">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            </DialogHeader>
            <div id="dialog-description" className="sr-only">
              {isEditMode ? "Formulário para editar os dados do cliente" : "Formulário para cadastrar um novo cliente"}
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  required
                />
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
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClientes.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
          </div>
        ) : (
          filteredClientes.map((cliente) => (
            <Card key={cliente.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{cliente.nome}</CardTitle>
                    <CardDescription>ID: {cliente.id}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(cliente)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(cliente)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(cliente)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {cliente.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Telefone:</span> {cliente.telefone}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Endereços:</span> {cliente.enderecos?.length || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Customers; 