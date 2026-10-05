import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
const cors={"Access-Control-Allow-Origin":"https://vsphotographs.com","Access-Control-Allow-Headers":"authorization,x-client-info,apikey,content-type","Access-Control-Allow-Methods":"POST,OPTIONS"};
Deno.serve(async(req)=>{if(req.method==="OPTIONS")return new Response("ok",{headers:cors});try{const {code}=await req.json();const c=String(code||"").trim().toUpperCase();if(!/^[A-Z0-9-]{4,16}$/.test(c))return json({error:"Invalid gallery code."},400);
const admin=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false}});
const {data:g,error:ge}=await admin.from("galleries").select("id,title,expires_at,active").eq("code",c).maybeSingle();
if(ge||!g||!g.active)return json({error:"That gallery code is not valid."},404);
if(g.expires_at&&new Date(g.expires_at).getTime()<Date.now())return json({error:"This gallery has expired."},410);
const {data:ps,error:pe}=await admin.from("gallery_photos").select("storage_path,filename").eq("gallery_id",g.id).order("sort_order",{ascending:true});
if(pe)return json({error:"Gallery could not be loaded."},500);
const paths=(ps||[]).map(p=>p.storage_path);const {data:s,error:se}=await admin.storage.from("client-galleries").createSignedUrls(paths,3600);
if(se)return json({error:"Photos could not be prepared."},500);
return json({title:g.title,expires_at:g.expires_at,photos:(ps||[]).map((p,i)=>({name:p.filename,url:s?.[i]?.signedUrl||null})).filter(p=>p.url)});
}catch(e){return json({error:"Gallery service unavailable."},500)}});
function json(body:unknown,status=200){return new Response(JSON.stringify(body),{status,headers:{...cors,"Content-Type":"application/json","Cache-Control":"no-store"}})}