import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateId } from '@/lib/utils';
import type { Usuario } from '@/types';

interface UsuarioFormProps {
  onSubmit: (usuario: Usuario) => void;
  onCancel: () => void;
  initialData?: Usuario;
}

interface FormDataState {
  id: string;
  nome: string;
  email: string;
  perfil: 'Administrador' | 'Supervisor' | 'Padrão';
  status: 'Ativo' | 'Inativo';
  dataCriacao: string;
  dataAtualizacao: string;
}

export default function UsuarioForm({
  onSubmit,
  onCancel,
  initialData,
}: UsuarioFormProps) {
  const getInitialData = (): FormDataState => {
    if (initialData) {
      return {
        ...initialData,
      };
    }
    return {
      id: generateId(),
      nome: '',
      email: '',
      perfil: 'Padrão',
      status: 'Ativo',
      dataCriacao: new Date().toISOString().split('T')[0],
      dataAtualizacao: new Date().toISOString().split('T')[0],
    };
  };

  const [formData, setFormData] = useState<FormDataState>(getInitialData());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const usuario: Usuario = {
      id: formData.id,
      nome: formData.nome,
      email: formData.email,
      perfil: formData.perfil,
      status: formData.status,
      dataCriacao: formData.dataCriacao,
      dataAtualizacao: new Date().toISOString().split('T')[0],
    };
    onSubmit(usuario);
  };

  const handleInputChange = (field: keyof FormDataState, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <div>
        <h3 className="font-semibold mb-4">Informações do Usuário</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Nome completo"
              required
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="usuario@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="perfil">Perfil *</Label>
            <Select
              value={formData.perfil}
              onValueChange={(value: any) => handleInputChange('perfil', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Padrão">Padrão</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Usuário</Button>
      </div>
    </form>
  );
}
