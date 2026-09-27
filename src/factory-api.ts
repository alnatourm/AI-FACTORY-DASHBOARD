export type FactorySnapshot = {
  runs: unknown[];
  activity: unknown[];
  agents: unknown[];
  health: Record<string, unknown>;
  attention: unknown[];
};

const baseUrl = (import.meta.env.VITE_FACTORY_API_URL || '').replace(/\/$/, '');
const tenantId = import.meta.env.VITE_FACTORY_TENANT_ID || '';

export const factoryConfigured = Boolean(baseUrl && tenantId);

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  if (!factoryConfigured) throw new Error('FACTORY_API_NOT_CONFIGURED');
  const response = await fetch(baseUrl + path, {
    ...init,
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'x-tenant-id': tenantId,
      ...(init?.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error?.code || 'FACTORY_API_ERROR');
  return payload.data as T;
}

export const factoryApi = {
  snapshot: () => request<FactorySnapshot>('/api/v1/factory/snapshot'),
  startRun: (input: unknown) => request<unknown>('/api/v1/factory/runs', { method: 'POST', body: JSON.stringify(input) }),
  approveGate: (runId: string, gate: 'design'|'production') =>
    request<unknown>(`/api/v1/factory/runs/${encodeURIComponent(runId)}/gates/${gate}/approve`, { method: 'POST', body: '{}' }),
  requestChanges: (runId: string, gate: 'design'|'production', feedback: string) =>
    request<unknown>(`/api/v1/factory/runs/${encodeURIComponent(runId)}/gates/${gate}/changes`, { method: 'POST', body: JSON.stringify({ feedback }) }),
};
