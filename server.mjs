import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app=express();
const port=Number(process.env.PORT||3000);
const factoryUrl=(process.env.FACTORY_API_URL||process.env.VITE_FACTORY_API_URL||'').replace(/\/$/,'');
const factoryToken=(process.env.FACTORY_CONTROL_API_KEY||'').trim();
const tenantId=(process.env.FACTORY_TENANT_ID||process.env.VITE_FACTORY_TENANT_ID||'').trim();

if(!factoryUrl) throw new Error('FACTORY_API_URL_REQUIRED');
if(!factoryToken) throw new Error('FACTORY_CONTROL_API_KEY_REQUIRED');
if(!tenantId) throw new Error('FACTORY_TENANT_ID_REQUIRED');

app.disable('x-powered-by');
app.use(express.json({limit:'256kb'}));

app.use('/api/factory',async(req,res)=>{
  try{
    const target=factoryUrl+req.originalUrl.replace(/^\/api\/factory/,'');
    const headers={'authorization':`Bearer ${factoryToken}`,'x-tenant-id':tenantId};
    if(req.method!=='GET'&&req.method!=='HEAD') headers['content-type']='application/json';
    const upstream=await fetch(target,{method:req.method,headers,body:req.method==='GET'||req.method==='HEAD'?undefined:JSON.stringify(req.body??{})});
    const body=await upstream.text();
    res.status(upstream.status);
    const ct=upstream.headers.get('content-type'); if(ct)res.setHeader('content-type',ct);
    res.send(body);
  }catch{
    res.status(502).json({error:{code:'FACTORY_PROXY_UNAVAILABLE'}});
  }
});

const root=path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(root,'dist'),{index:false}));
app.get('*',(req,res)=>res.sendFile(path.join(root,'dist','index.html')));
app.listen(port,()=>console.log(JSON.stringify({event:'DASHBOARD_READY',port})));
