export interface ClienteApi {
  id: number;
  nome: string;
  email: string;
  telefone: string;
}

export type ClientePayload = Omit<ClienteApi, "id">;

export interface VeiculoApi {
  id: number;
  id_cliente: number;
  placa: string;
  modelo: string;
  ano: number;
  cor: string;
  quilometragem: number;
  tipoVeiculo?: string | null;
  motorizacao?: string | null;
  numeroChasse?: string | null;
  tipoCombustivel?: string | null;
  dataUltimaRevisao?: string | null;
  data_criacao?: string;
  data_atualizacao?: string;
}

export type VeiculoPayload = Omit<VeiculoApi, "id">;

export interface ServicoApi {
  id: number;
  descricao: string;
  status: string;
  data_inicio: string;
  data_fim: string | null;
  valor_total: number;
  id_veiculo: number;
}

export type ServicoPayload = Omit<ServicoApi, "id">;

export interface ProdutoApi {
  id: number;
  nome: string;
  quantidade: number;
  preco_unitario: number;
}

export type ProdutoPayload = Omit<ProdutoApi, "id">;

export interface ItemServicoApi {
  id: number;
  id_servico: number;
  id_produto: number;
  quantidade_utilizada: number;
}

export type ItemServicoPayload = Omit<ItemServicoApi, "id">;

export interface UsuarioApi {
  id: string;
  nome: string;
  email: string;
  perfil: "Administrador" | "Supervisor" | "Padrão";
  status: "Ativo" | "Inativo";
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioApi;
}
