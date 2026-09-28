export type FactoryRun={id:string;name:string;status:string;targetRepository?:string|null;updatedAt:string};
export type FactoryActivityItem={id:string|number;name?:string;status?:string;conclusion?:string|null;updatedAt?:string;url?:string;text?:string;at?:string;actor?:string};
export type FactorySnapshot={runs:FactoryRun[];activity:FactoryActivityItem[];agents:unknown[];health:Record<string,unknown>;attention:FactoryRun[]};
export type FactoryRunDetail=FactoryRun&{intent:string;activity:FactoryActivityItem[]};
export type StartRunResult={runId:string;name:string;targetRepository:string;status:string};
export type FactoryProvider={id:string;name:string;kind:string;credentialRef?:string;baseUrl?:string;enabled:boolean};
export type FactoryModel={id:string;providerId:string;modelKey:string;displayName:string;capabilities:string[];enabled:boolean};
export type FactoryAgent={id:string;name:string;kind:'ogroup'|'external'|'custom'|'webhook'|'mcp';endpointRef?:string;enabled:boolean};
export type FactoryRoleAssignment={role:string;agentId:string;modelId?:string;fallbackModelId?:string;budgetLimitMicros?:number};
export type FactoryConfig={mode:'managed'|'custom';providers:FactoryProvider[];models:FactoryModel[];agents:FactoryAgent[];roles:FactoryRoleAssignment[]};
export type ProjectBrainEntry={section:string;content:unknown;version:number;updatedAt:string|null};
export type ProjectBrain={runId:string;sections:ProjectBrainEntry[]};

const baseUrl=(import.meta.env.VITE_FACTORY_API_URL||'').replace(/\/$/,'');
const tenantId=import.meta.env.VITE_FACTORY_TENANT_ID||'';
export const factoryConfigured=Boolean(baseUrl&&tenantId);
async function request<T>(path:string,init?:RequestInit):Promise<T>{if(!factoryConfigured)throw new Error('FACTORY_API_NOT_CONFIGURED');const response=await fetch(baseUrl+path,{...init,credentials:'include',headers:{'content-type':'application/json','x-tenant-id':tenantId,...(init?.headers||{})}});const payload=await response.json().catch(()=>({}));if(!response.ok)throw new Error(payload?.error?.code||'FACTORY_API_ERROR');return payload.data as T}
export const factoryApi={
 snapshot:()=>request<FactorySnapshot>('/api/v1/factory/snapshot'),
 run:(runId:string)=>request<FactoryRunDetail>(`/api/v1/factory/runs/${encodeURIComponent(runId)}`),
 startRun:(input:unknown)=>request<StartRunResult>('/api/v1/factory/runs',{method:'POST',body:JSON.stringify(input)}),
 config:()=>request<FactoryConfig>('/api/v1/factory/config'),
 saveConfig:(input:FactoryConfig)=>request<FactoryConfig>('/api/v1/factory/config',{method:'PUT',body:JSON.stringify(input)}),
 brain:(runId:string)=>request<ProjectBrain>(`/api/v1/factory/runs/${encodeURIComponent(runId)}/brain`),
 saveBrain:(runId:string,section:string,content:unknown)=>request<ProjectBrainEntry>(`/api/v1/factory/runs/${encodeURIComponent(runId)}/brain/${encodeURIComponent(section)}`,{method:'PUT',body:JSON.stringify({content})}),
 approveGate:(runId:string,gate:'design'|'production')=>request<unknown>(`/api/v1/factory/runs/${encodeURIComponent(runId)}/gates/${gate}/approve`,{method:'POST',body:'{}'}),
 requestChanges:(runId:string,gate:'design'|'production',feedback:string)=>request<unknown>(`/api/v1/factory/runs/${encodeURIComponent(runId)}/gates/${gate}/changes`,{method:'POST',body:JSON.stringify({feedback})})
};
