export interface Medicine {
  id: number;
  nome: string;
  principio_ativo?: string | null;
  concentracao?: string | null;
  forma_farmaceutica?: string | null;
  categoria?: string | null;
  precisa_receita?: boolean;
  contraindicacoes?: string | null;
  descricao?: string | null;
  localizacao_prateleira?: string | null;
  codigo_barras?: string | null;
  validade?: string | null;
  quantidade: number;
  quantidade_minima?: number | null;
  active?: boolean;
  is_favorite?: boolean;
}
