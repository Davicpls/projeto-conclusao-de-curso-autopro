import { useState, useEffect } from 'react';
import EditarVeiculo from '@/components/forms/EditarVeiculo';
import { clientesApi, veiculosApi, type VeiculoApi, type ClienteApi } from '@/api';
import { toast } from 'sonner';

export default function EditarVeiculoRoute({ id, onNavigate }: { id: string; onNavigate: (path: string) => void }) {
  const [veiculo, setVeiculo] = useState<VeiculoApi | null>(null);
  const [clientes, setClientes] = useState<ClienteApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVeiculo = async () => {
      try {
        setLoading(true);
        const [veiculoResponse, clientesResponse] = await Promise.all([
          veiculosApi.getById(id),
          clientesApi.getAll(),
        ]);
        setVeiculo(veiculoResponse);
        setClientes(clientesResponse);
      } catch (error: any) {
        const message = error.response?.data?.messsage || 'Erro ao carregar';
        toast.error(message);
        onNavigate('/veiculos');
      } finally {
        setLoading(false);
      }
    };

    loadVeiculo();
  }, [id, onNavigate]);

  if (loading) {
    return <div>Carregando veiculo...</div>;
  }

  if (!veiculo) {
    return null;
  }

  return (
    <EditarVeiculo
      id={id}
      clientes={clientes}
      veiculo={veiculo}
      onNavigate={onNavigate}
      onSave={async (veiculoAtualizado: VeiculoApi) => {
        await veiculosApi.update(veiculoAtualizado.id, veiculoAtualizado);
        onNavigate('/veiculos');
      }}
      onCancel={() => onNavigate('/veiculos')}
      
    />
  );
}
