import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const app=express(); const port=Number(process.env.PORT??3000);
const factoryUrl=process.env.FACTORY_CONTROL_URL?.replace(/\/$/,'');
const factoryToken=process.env.FACTORY_CONTROL_TOKEN;
app.disable('x-powered-by'); app.use(express.json({limit:'256kb'}));
app.use('/api/factory',async(req,res)=>{
 if(!factoryUrl||!factoryToken){res.status(503).json({error:{code:'FACTORY_NOT_CONFIGURED',message:'Factory control connection is not configured.'}});return}
 try{
  const upstream=await fetch(factoryUrl+'/api/factory'+req.url,{method:req.method,headers:{Authorization:'Bearer '+factoryToken,'Content-Type':'application/json'},body:['GET','HEAD'].includes(req.method)?undefined:JSON.stringify(req.body??{})});
  const text=await upstream.text();res.status(upstream.status);res.type(upstream.headers.get('content-type')??'application/json').send(text);
 }catch{res.status(502).json({error:{code:'FACTORY_UNREACHABLE',message:'Factory control service is unavailable.'}})}
});
app.get('/health',(_req,res)=>res.json({status:'ok',factoryConfigured:Boolean(factoryUrl&&factoryToken)}));
const root=path.dirname(fileURLToPath(import.meta.url));app.use(express.static(path.join(root,'dist')));
app.get('*',(_req,res)=>res.sendFile(path.join(root,'dist','index.html')));
app.listen(port,'0.0.0.0',()=>console.log('Dashboard server listening on '+port));
