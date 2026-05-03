import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Breadcrumbs from '@/components/Breadcrumbs';
import { toast } from 'sonner';
import type { Pessoa } from '@/types';

interface EditarPessoaProps {
  pessoa: Pessoa;
  onSave: (pessoa: Pessoa) => void;
  onCancel: () => void;
}

export default function EditarPessoa({ pessoa, onSave, onCancel }: EditarPessoaProps) {
  const [formData, setFormData] = useState<Pessoa>(pessoa);

  const handleInputChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleEnderecoChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      endereco: {
        ...formData.endereco,
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success('Pessoa atualizada com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard' }, { label: 'Pessoas' }, { label: 'Editar' }]} />

      {/* Header */}
      <div>
        <h1>Editar Pessoa</h1>
        <p className="text-muted-foreground mt-1">ID: {formData.id}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Pessoais */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Informações Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="nomeCompleto">Nome Completo *</Label>
              <Input
                id="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="genero">Gênero</Label>
              <Select
                value={formData.genero}
                onValueChange={(value: any) => handleInputChange('genero', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value: any) => handleInputChange('tipo', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Física">Pessoa Física</SelectItem>
                  <SelectItem value="Jurídica">Pessoa Jurídica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Contato */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Informações de Contato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Endereço */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="logradouro">Logradouro *</Label>
              <Input
                id="logradouro"
                value={formData.endereco.logradouro}
                onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                value={formData.endereco.numero}
                onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                value={formData.endereco.complemento || ''}
                onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                value={formData.endereco.bairro}
                onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={formData.endereco.cidade}
                onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="uf">UF *</Label>
              <Input
                id="uf"
                value={formData.endereco.uf}
                onChange={(e) => handleEnderecoChange('uf', e.target.value)}
                maxLength={2}
                required
              />
            </div>
            <div>
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                value={formData.endereco.cep}
                onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="pais">País *</Label>
              <Input
                id="pais"
                value={formData.endereco.pais}
                onChange={(e) => handleEnderecoChange('pais', e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        {/* Observações */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Observações</h3>
          <div>
            <Label htmlFor="observacao">Observação</Label>
            <Textarea
              id="observacao"
              value={formData.observacao || ''}
              onChange={(e) => handleInputChange('observacao', e.target.value)}
              rows={3}
            />
          </div>
        </Card>

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Alterações</Button>
        </div>
      </form>
    </div>
  );
}
