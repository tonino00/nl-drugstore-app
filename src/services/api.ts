import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

// Configuração de retry para 503
const MAX_RETRIES = 3;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (AxiosRequestConfig & { __retryCount?: number });
    const status = error.response?.status;

    // Se não houver config, ou não for 503, segue o fluxo normal
    if (!config || status !== 503) {
      return Promise.reject(error);
    }

    const method = (config.method || 'get').toUpperCase();

    // Mapear 503 para mensagem amigável sempre
    const baseMessage = 'Muitos acessos no momento, tente novamente em alguns segundos.';

    // Métodos não-idempotentes: não fazemos retry automático
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      toast.error(baseMessage);
      return Promise.reject(error);
    }

    // Apenas GET/HEAD com retry
    config.__retryCount = config.__retryCount ?? 0;
    if (config.__retryCount >= MAX_RETRIES) {
      toast.error(baseMessage);
      return Promise.reject(error);
    }

    config.__retryCount += 1;

    // Calcular delay: usa Retry-After se presente, senão backoff exponencial com jitter
    const retryAfterHeader = error.response?.headers?.['retry-after'];
    let delayMs: number;

    if (retryAfterHeader) {
      const seconds = Number(retryAfterHeader);
      if (!Number.isNaN(seconds)) {
        delayMs = seconds * 1000;
      } else {
        // Retry-After em data; fallback para 1s
        delayMs = 1000;
      }
    } else {
      const base = Math.pow(2, config.__retryCount - 1) * 1000; // 1s, 2s, 4s
      const jitter = Math.random() * 300; // até 300ms
      delayMs = base + jitter;
    }

    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return api(config);
  }
);

export default api;
