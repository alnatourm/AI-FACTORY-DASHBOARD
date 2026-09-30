import crypto from 'node:crypto';
import {OAuth2Client} from 'google-auth-library';
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app=express();
const port=Number(process.env.PORT||3000);
const factoryUrl=(process.env.FACTORY_API_URL||process.env.VITE_FACTORY_API_URL||'').replace(/\/$/,'');
const factoryToken=(process.env.FACTORY_CONTROL_API_KEY||'').trim();
const googleClientId=(process.env.GOOGLE_OIDC_CLIENT_ID||'').trim();
const googleClientSecret=(process.env.GOOGLE_OIDC_CLIENT_SECRET||'').trim();
const publicUrl=(process.env.PUBLIC_URL||'https://ai-factory-dashboard-production.up.railway.app').replace(/\/$/,'');
const oidcReady=Boolean(googleClientId&&googleClientSecret);
const oauth=oidcReady?new OAuth2Client(googleClientId,googleClientSecret,publicUrl+'/auth/google/callback'):null;
const states=new Map();

if(!factoryUrl) throw new Error('FACTORY_API_URL_REQUIRED');
if(!factoryToken) throw new Error('FACTORY_CONTROL_API_KEY_REQUIRED');

app.disable('x-powered-by');
app.use(express.json({limit:'256kb'}));
app.use(cookieParser());

app.get('/api/auth/status',(req,res)=>res.json({data:{google:oidcReady,authenticated:Boolean(req.cookies?.ogroup_session)}}));
app.post('/api/auth/logout',(_req,res)=>{res.clearCookie('ogroup_session',{httpOnly:true,secure:true,sameSite:'lax',path:'/'});res.status(204).send();});
app.get('/auth/google',(req,res)=>{
  if(!oauth){res.status(503).json({error:{code:'GOOGLE_OIDC_NOT_CONFIGURED'}});return;}
  const state=crypto.randomBytes(32).toString('base64url');
  states.set(state,Date.now()+10*60*1000);
  const url=oauth.generateAuthUrl({access_type:'online',scope:['openid','email','profile'],state,prompt:'select_account'});
  res.redirect(url);
});
app.get('/auth/google/callback',async(req,res)=>{
  try{
    if(!oauth){res.status(503).send('Google sign-in is not configured.');return;}
    const state=typeof req.query.state==='string'?req.query.state:'';
    const expiry=states.get(state); states.delete(state);
    if(!expiry||expiry<Date.now()){res.status(400).send('Invalid or expired sign-in state.');return;}
    const code=typeof req.query.code==='string'?req.query.code:'';
    if(!code){res.status(400).send('Missing authorization code.');return;}
    const {tokens}=await oauth.getToken(code);
    if(!tokens.id_token){res.status(401).send('Google identity token missing.');return;}
    const ticket=await oauth.verifyIdToken({idToken:tokens.id_token,audience:googleClientId});
    const payload=ticket.getPayload();
    if(!payload?.sub||!payload.email||payload.email_verified!==true){res.status(401).send('Google identity could not be verified.');return;}
    const bridge=await fetch(factoryUrl+'/internal/v1/auth/google/session',{method:'POST',headers:{'authorization':`Bearer ${factoryToken}`,'content-type':'application/json'},body:JSON.stringify({subject:payload.sub,email:payload.email,displayName:payload.name??null})});
    const result=await bridge.json().catch(()=>null);
    if(!bridge.ok||!result?.data?.token){res.status(bridge.status===403?403:502).json({error:{code:result?.error?.code??'SESSION_BRIDGE_FAILED'}});return;}
    res.cookie('ogroup_session',result.data.token,{httpOnly:true,secure:true,sameSite:'lax',path:'/',maxAge:7*24*60*60*1000});
    res.redirect('/');
  }catch{res.status(401).send('Google sign-in failed.');}
});

app.use('/api/factory',async(req,res)=>{
  try{
    const target=factoryUrl+req.originalUrl.replace(/^\/api\/factory/,'');
    const headers={'authorization':`Bearer ${factoryToken}`};
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
app.use((req,res,next)=>{if(req.method!=='GET'){next();return}res.sendFile(path.join(root,'dist','index.html'));});
app.listen(port,()=>console.log(JSON.stringify({event:'DASHBOARD_READY',port})));
