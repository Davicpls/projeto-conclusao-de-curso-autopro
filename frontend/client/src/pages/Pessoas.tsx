import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DataTable from '@/components/DataTable';
import Breadcrumbs from '@/components/Breadcrumbs';
import { mockPessoas } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import type { Pessoa } from '@/types';
import PessoaForm from '@/components/forms/PessoaForm';

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>(mockPessoas);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPessoa = (novaPessoa: Pessoa) => {
    setPessoas([...pessoas, novaPessoa]);
    setIsDialogOpen(false);
  };

  const handleEditPessoa = (pessoa: Pessoa) => {
    const event = new CustomEvent('navigate', { detail: `/pessoas/${pessoa.id}/editar` });
    window.dispatchEvent(event);
  };

  const columns = [
    {
      key: 'nomeCompleto' as const,
      label: 'Nome Completo',
    },
    {
      key: 'genero' as const,
      label: 'Gênero',
    },
    {
      key: 'dataNascimento' as const,
      label: 'Data de Nascimento',
      render: (value: string) => formatDate(value),
    },
    {
      key: 'tipo' as const,
      label: 'Tipo',
    },
    {
      key: 'telefone' as const,
      label: 'Telefone',
    },
    {
      key: 'email' as const,
      label: 'E-mail',
    },
    {
      key: 'isFornecedor' as const,
      label: 'Fornecedor',
      render: (value: boolean) => (value ? 'Sim' : 'Não'),
    },
  ];

  const handleRowClick = (row: Pessoa) => {
    handleEditPessoa(row);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard' }, { label: 'Pessoas' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Pessoas</h1>
          <p className="text-muted-foreground mt-1">Gerenciamento de pessoas e clientes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Pessoa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Pessoa</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para cadastrar uma nova pessoa
              </DialogDescription>
            </DialogHeader>
            <PessoaForm onSubmit={handleAddPessoa} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="p-6">
        <DataTable<Pessoa>
          data={pessoas}
          columns={columns}
          searchFields={['nomeCompleto', 'email', 'telefone']}
          pageSize={10}
          onRowClick={handleRowClick}
        />
      </Card>
    </div>
  );
}
