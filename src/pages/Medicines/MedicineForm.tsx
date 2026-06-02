import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import type { Medicine } from '../../types/medicine.types';
import { medicineService } from '../../services/medicineService';
import { useAuth } from '../../hooks/useAuth';
import {
  Actions,
  Button,
  Card,
  CheckboxLabel,
  Error,
  FieldGroup,
  Grid,
  Header,
  Input,
  Label,
  Page,
  Section,
  SectionTitle,
  Select,
  Subtitle,
  TextArea,
  Title,
} from '../../styles/pages/Medicines/MedicineForm/styles';

type FormValues = {
  nome: string;
  principio_ativo: string;
  concentracao: string;
  forma_farmaceutica: string;
  categoria: string;
  quantidade: number;
  quantidade_minima: number;
  validade: string;
  localizacao_prateleira: string;
  descricao: string;
  contraindicacoes: string;
  precisa_receita: boolean;
};

const schema = Yup.object({
  nome: Yup.string().min(2, 'Mínimo 2 caracteres').required('Obrigatório'),
  principio_ativo: Yup.string().optional(),
  concentracao: Yup.string().optional(),
  forma_farmaceutica: Yup.string().optional(),
  categoria: Yup.string().optional(),
  quantidade: Yup.number().min(0, 'Mínimo 0').required('Obrigatório'),
  quantidade_minima: Yup.number().min(0, 'Mínimo 0').optional(),
  validade: Yup.string().optional(),
  localizacao_prateleira: Yup.string().optional(),
  descricao: Yup.string().optional(),
  contraindicacoes: Yup.string().optional(),
  precisa_receita: Yup.boolean().optional(),
});

const toInputDate = (value?: string | null) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function MedicineFormPage() {
  const { medicineId, id } = useParams();
  const rawId = id ?? medicineId;
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPharmacist = user?.role === 'pharmacist' || user?.role === 'admin';
  const isEdit = Boolean(rawId);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [current, setCurrent] = useState<Medicine | null>(null);

  const initialValues: FormValues = useMemo(
    () => ({
      nome: current?.nome || '',
      principio_ativo: current?.principio_ativo || '',
      concentracao: current?.concentracao || '',
      forma_farmaceutica: current?.forma_farmaceutica || '',
      categoria: current?.categoria || '',
      quantidade: current?.quantidade ?? 0,
      quantidade_minima: current?.quantidade_minima ?? 0,
      validade: toInputDate(current?.validade),
      localizacao_prateleira: current?.localizacao_prateleira || '',
      descricao: current?.descricao || '',
      contraindicacoes: current?.contraindicacoes || '',
      precisa_receita: Boolean(current?.precisa_receita),
    }),
    [current]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const cats = await medicineService.categories();
        if (mounted) setCategories(cats);
      } catch {
        if (mounted) setCategories([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await medicineService.getById(rawId!);
        if (mounted) setCurrent(data);
      } catch {
        toast.error('Falha ao carregar medicamento');
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [isEdit, rawId]);

  if (!isPharmacist) {
    return (
      <div>
        <h2>Cadastro/Edição de Medicamento</h2>
        <p>Acesso restrito.</p>
      </div>
    );
  }

  return (
    <Page>
      <Link to="/medicines" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#616161', fontSize: '0.875rem', marginBottom: 16, textDecoration: 'none' }}>
        ← Voltar
      </Link>

      <Card>
        <Header>
          <Title>{isEdit ? 'Editar medicamento' : 'Novo medicamento'}</Title>
          <Subtitle>
            {isEdit
              ? 'Atualize as informações do medicamento abaixo.'
              : 'Preencha os dados para cadastrar um novo medicamento.'}
          </Subtitle>
        </Header>

        {loading ? <p>Carregando...</p> : null}

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              setSaving(true);

              const payload: Partial<Medicine> = {
                nome: values.nome,
                principio_ativo: values.principio_ativo || null,
                concentracao: values.concentracao || null,
                forma_farmaceutica: values.forma_farmaceutica || null,
                categoria: values.categoria || null,
                quantidade: Number(values.quantidade) || 0,
                quantidade_minima: Number(values.quantidade_minima) || 0,
                validade: values.validade ? new Date(values.validade).toISOString() : null,
                localizacao_prateleira: values.localizacao_prateleira || null,
                descricao: values.descricao || null,
                contraindicacoes: values.contraindicacoes || null,
                precisa_receita: Boolean(values.precisa_receita),
              };

              const saved = isEdit
                ? await medicineService.update(rawId!, payload)
                : await medicineService.create(payload);

              toast.success(isEdit ? 'Medicamento atualizado' : 'Medicamento cadastrado');
              navigate(`/medicines/${saved.id}`, { replace: true });
            } catch (e: any) {
              toast.error(e?.response?.data?.message || 'Falha ao salvar');
            } finally {
              setSaving(false);
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, touched, errors, isSubmitting }) => (
            <Form>
              <Section>
                <SectionTitle>Informações básicas</SectionTitle>
                <Grid>
                  <FieldGroup className="full-width">
                    <Label>
                      Nome <span className="required">*</span>
                    </Label>
                    <Input name="nome" value={values.nome} onChange={handleChange} placeholder="Ex: Paracetamol 500mg" />
                    {touched.nome && errors.nome ? <Error>{errors.nome}</Error> : null}
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Princípio ativo</Label>
                    <Input name="principio_ativo" value={values.principio_ativo} onChange={handleChange} placeholder="Ex: Paracetamol" />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Categoria</Label>
                    <Select name="categoria" value={values.categoria} onChange={handleChange}>
                      <option value="">Selecione uma categoria</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Concentração</Label>
                    <Input name="concentracao" value={values.concentracao} onChange={handleChange} placeholder="Ex: 500mg" />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Forma farmacêutica</Label>
                    <Input
                      name="forma_farmaceutica"
                      value={values.forma_farmaceutica}
                      onChange={handleChange}
                      placeholder="Ex: Comprimido"
                    />
                  </FieldGroup>
                </Grid>
              </Section>

              <Section>
                <SectionTitle>Estoque</SectionTitle>
                <Grid>
                  <FieldGroup>
                    <Label>
                      Quantidade inicial <span className="required">*</span>
                    </Label>
                    <Input type="number" name="quantidade" value={values.quantidade} onChange={handleChange} min={0} />
                    {touched.quantidade && errors.quantidade ? <Error>{errors.quantidade}</Error> : null}
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Quantidade mínima (alerta)</Label>
                    <Input type="number" name="quantidade_minima" value={values.quantidade_minima} onChange={handleChange} min={0} />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Validade</Label>
                    <Input type="date" name="validade" value={values.validade} onChange={handleChange} />
                  </FieldGroup>

                  <FieldGroup>
                    <Label>Localização na prateleira</Label>
                    <Input
                      name="localizacao_prateleira"
                      value={values.localizacao_prateleira}
                      onChange={handleChange}
                      placeholder="Ex: Prateleira A3"
                    />
                  </FieldGroup>
                </Grid>
              </Section>

              <Section>
                <SectionTitle>Informações adicionais</SectionTitle>
                <Grid>
                  <FieldGroup className="full-width">
                    <Label>Descrição</Label>
                    <TextArea name="descricao" value={values.descricao} onChange={handleChange} rows={3} placeholder="Descrição do medicamento..." />
                  </FieldGroup>

                  <FieldGroup className="full-width">
                    <Label>Contraindicações</Label>
                    <TextArea
                      name="contraindicacoes"
                      value={values.contraindicacoes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Contraindicações e precauções..."
                    />
                  </FieldGroup>
                </Grid>

                <CheckboxLabel style={{ marginTop: 12 }}>
                  <input type="checkbox" name="precisa_receita" checked={values.precisa_receita} onChange={handleChange} />
                  Precisa de receita médica
                </CheckboxLabel>
              </Section>

              <Actions>
                <Button type="submit" disabled={isSubmitting || saving}>
                  {isSubmitting || saving ? 'Salvando...' : 'Salvar'}
                </Button>
                {isEdit ? (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={async () => {
                      const ok = window.confirm('Tem certeza que deseja excluir este medicamento?');
                      if (!ok) return;
                      try {
                        await medicineService.remove(rawId!);
                        toast.success('Medicamento excluído');
                        navigate('/medicines', { replace: true });
                      } catch (e: any) {
                        toast.error(e?.response?.data?.message || 'Falha ao excluir');
                      }
                    }}
                  >
                    Excluir
                  </Button>
                ) : null}
              </Actions>
            </Form>
          )}
        </Formik>
      </Card>
    </Page>
  );
}
