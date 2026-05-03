import { useCallback, useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardLayout from '@/components/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import Pessoas from '@/pages/Pessoas';
import Veiculos from '@/pages/veiculos/VeiculosPage';
import OS from '@/pages/OS';
import Produtos from '@/pages/Produtos';
import Tabelas from '@/pages/Tabelas';
import Fornecedores from '@/pages/Fornecedores';
import Configuracoes from '@/pages/Configuracoes';
import Relatorios from '@/pages/Relatorios';
import Usuarios from '@/pages/Usuarios';
import EditarOS from '@/pages/EditarOS';
import EditarPessoa from '@/pages/EditarPessoa';
import EditarProduto from '@/pages/EditarProduto';
import EditarVeiculoRoute from '@/pages/veiculos/EditarVeiculoPage';
import { mockUser, mockOrdensSevico, mockPessoas, mockProdutos } from '@/lib/mockData';
import type { User, OrdemServico, Pessoa, Produto } from '@/types';
import { clientesApi, veiculosApi, type VeiculoApi, type ClienteApi} from '@/api';


function Router({
  currentPath,
  onNavigate,
  user,
  onLogout,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: User;
  onLogout: () => void;
}) {
  const renderPage = () => {
    if (currentPath.startsWith('/os/') && currentPath.endsWith('/editar')) {
      const osId = currentPath.split('/')[2];
      const os = mockOrdensSevico.find((o) => o.id === osId);
      if (os) {
        return (
          <EditarOS
            os={os}
            onSave={(osAtualizada: OrdemServico) => {
              console.log('OS atualizada:', osAtualizada);
              onNavigate('/os');
            }}
            onCancel={() => onNavigate('/os')}
          />
        );
      }
    }

    if (currentPath.startsWith('/pessoas/') && currentPath.endsWith('/editar')) {
      const pessoaId = currentPath.split('/')[2];
      const pessoa = mockPessoas.find((p) => p.id === pessoaId);
      if (pessoa) {
        return (
          <EditarPessoa
            pessoa={pessoa}
            onSave={(pessoaAtualizada: Pessoa) => {
              console.log('Pessoa atualizada:', pessoaAtualizada);
              onNavigate('/pessoas');
            }}
            onCancel={() => onNavigate('/pessoas')}
          />
        );
      }
    }

    if (currentPath.startsWith('/produtos/') && currentPath.endsWith('/editar')) {
      const produtoId = currentPath.split('/')[2];
      const produto = mockProdutos.find((p) => p.id === produtoId);
      if (produto) {
        return (
          <EditarProduto
            produto={produto}
            onSave={(produtoAtualizado: Produto) => {
              console.log('Produto atualizado:', produtoAtualizado);
              onNavigate('/produtos');
            }}
            onCancel={() => onNavigate('/produtos')}
          />
        );
      }
    }

    if (currentPath.startsWith('/veiculos/') && currentPath.endsWith('/editar')) {
      const veiculoId = currentPath.split('/')[2];
      return <EditarVeiculoRoute id={veiculoId} onNavigate={onNavigate} />;
    }

    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/pessoas':
        return <Pessoas />;
      case '/veiculos':
        return <Veiculos />;
      case '/os':
        return <OS />;
      case '/produtos':
        return <Produtos />;
      case '/tabelas':
        return <Tabelas />;
      case '/fornecedores':
        return <Fornecedores />;
      case '/configuracoes':
        return <Configuracoes />;
      case '/relatorios':
        return <Relatorios />;
      case '/usuarios':
        return <Usuarios />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DashboardLayout
      user={user}
      currentPath={currentPath}
      onNavigate={onNavigate}
      onLogout={onLogout}
    >
      {renderPage()}
    </DashboardLayout>
  );
}

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [user] = useState<User>(mockUser);

  const handleNavigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  }, []);

  useEffect(() => {
    const handleCustomNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      handleNavigate(customEvent.detail);
    };
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('navigate', handleCustomNavigate);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('navigate', handleCustomNavigate);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handleNavigate]);

  const handleLogout = () => {
    console.log('Logout realizado');
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router
            currentPath={currentPath}
            onNavigate={handleNavigate}
            user={user}
            onLogout={handleLogout}
          />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
