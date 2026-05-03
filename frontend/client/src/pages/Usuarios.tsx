import { useState } from 'react';
import { Plus, Lock, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import DataTable from '@/components/DataTable';
import Breadcrumbs from '@/components/Breadcrumbs';
import { mockUsuarios } from '@/lib/mockData';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Usuario } from '@/types';
import UsuarioForm from '@/components/forms/UsuarioForm';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(mockUsuarios);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [alertAction, setAlertAction] = useState<{ type: 'disable' | 'reset'; usuario: Usuario } | null>(null);

  const handleAddUsuario = (novoUsuario: Usuario) => {
    setUsuarios([...usuarios, novoUsuario]);
    setIsDialogOpen(false);
    toast.success('Usuário cadastrado com sucesso!');
  };

  const handleDesabilitar = (usuario: Usuario) => {
    setAlertAction({ type: 'disable', usuario });
  };

  const handleResetarSenha = (usuario: Usuario) => {
    setAlertAction({ type: 'reset', usuario });
  };

  const confirmAction = () => {
    if (!alertAction) return;

    if (alertAction.type === 'disable') {
      setUsuarios(
        usuarios.map((u) =>
          u.id === alertAction.usuario.id
            ? { ...u, status: u.status === 'Ativo' ? 'Inativo' : 'Ativo' }
            : u
        )
      );
      toast.success(
        `Usuário ${alertAction.usuario.status === 'Ativo' ? 'desabilitado' : 'habilitado'} com sucesso!`
      );
    } else if (alertAction.type === 'reset') {
      toast.success(`Senha resetada para ${alertAction.usuario.email}!`);
    }

    setAlertAction(null);
  };

  const getPerfilColor = (perfil: string) => {
    switch (perfil) {
      case 'Administrador':
        return 'bg-red-100 text-red-800';
      case 'Supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'Padrão':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const columns = [
    {
      key: 'nome' as const,
      label: 'Nome',
    },
    {
      key: 'email' as const,
      label: 'E-mail',
    },
    {
      key: 'perfil' as const,
      label: 'Perfil',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-xs font-medium ${getPerfilColor(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'status' as const,
      label: 'Status',
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>{value}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard' }, { label: 'Usuários' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Usuários</h1>
          <p className="text-muted-foreground mt-1">Gerenciamento de usuários do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
              <DialogDescription>
                Preencha os dados abaixo para cadastrar um novo usuário
              </DialogDescription>
            </DialogHeader>
            <UsuarioForm onSubmit={handleAddUsuario} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Nome</th>
                <th className="px-4 py-3 text-left font-semibold">E-mail</th>
                <th className="px-4 py-3 text-left font-semibold">Perfil</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario, index) => (
                <tr key={usuario.id} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}>
                  <td className="px-4 py-3">{usuario.nome}</td>
                  <td className="px-4 py-3">{usuario.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPerfilColor(usuario.perfil)}`}>
                      {usuario.perfil}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={getStatusColor(usuario.status)}>{usuario.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDesabilitar(usuario)}
                        title={usuario.status === 'Ativo' ? 'Desabilitar' : 'Habilitar'}
                      >
                        <Lock className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleResetarSenha(usuario)}
                        title="Resetar Senha"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Alert Dialog */}
      <AlertDialog open={!!alertAction} onOpenChange={() => setAlertAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertAction?.type === 'disable' ? 'Desabilitar Usuário' : 'Resetar Senha'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction?.type === 'disable'
                ? `Tem certeza que deseja ${alertAction?.usuario.status === 'Ativo' ? 'desabilitar' : 'habilitar'} o usuário ${alertAction?.usuario.nome}?`
                : `Tem certeza que deseja resetar a senha do usuário ${alertAction?.usuario.nome}? Um e-mail será enviado para ${alertAction?.usuario.email}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>Confirmar</AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
