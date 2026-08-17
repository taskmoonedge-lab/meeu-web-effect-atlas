import fs from 'node:fs';
import crypto from 'node:crypto';
import { atlas } from '../src/data.js';
import { semanticPreview } from '../src/semantic-preview.js';
import { mediaPreview } from '../src/media-preview.js';
import legacyCore from '../src/legacy-preview-core.js';

const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const dedicatedIds = new Set([...main.matchAll(/'([^']+)':\(\)=>/g)].map(m => m[1]));
const aliasBlock = main.match(/const legacyAlias=\{([\s\S]*?)\};/);
const aliasPairs = aliasBlock ? [...aliasBlock[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(m=>[m[1],m[2]]) : [];
const aliases = Object.fromEntries(aliasPairs);

function normalize(html='') {
  return html
    .replace(/https?:\/\/[^'\"\s>]+/g,'URL')
    .replace(/style="[^"]*"/g,'')
    .replace(/>[^<]+</g,'><')
    .replace(/\s+/g,' ')
    .trim();
}
function hash(s){return crypto.createHash('sha1').update(s).digest('hex').slice(0,10)}
function resolve(f){
  const media = mediaPreview(f); if(media) return {source:'media',html:media};
  if(dedicatedIds.has(f.id)) return {source:'dedicated',html:`DEDICATED:${f.id}`};
  const semantic = semanticPreview(f); if(semantic) return {source:'semantic',html:semantic};
  if(legacyCore[f.id]) return {source:'legacy-exact',html:legacyCore[f.id]};
  if(aliases[f.id] && legacyCore[aliases[f.id]]) return {source:'legacy-alias',html:legacyCore[aliases[f.id]]};
  return {source:'unmapped',html:''};
}

const rows = atlas.families.map(f=>{
  const r=resolve(f); return {id:f.id,name:f.nameEn,category:f.categoryName||f.category,source:r.source,fp:r.html?hash(normalize(r.html)):null};
});
const byFp = new Map();
for(const r of rows){if(!r.fp||r.source==='dedicated') continue; const k=`${r.source}:${r.fp}`; if(!byFp.has(k))byFp.set(k,[]); byFp.get(k).push(r);}
const shared=[...byFp.values()].filter(g=>g.length>1);
const unmapped=rows.filter(r=>r.source==='unmapped');
const legacyAlias=rows.filter(r=>r.source==='legacy-alias');
const legacyExact=rows.filter(r=>r.source==='legacy-exact');
const duplicateIds=rows.filter((r,i,a)=>a.findIndex(x=>x.id===r.id)!==i);
const variantCount=atlas.families.reduce((n,f)=>n+(f.variants?.length||0),0);

const report={
  declared:{families:atlas.familyCount,variants:atlas.variantCount,flat:atlas.sourceFlatEffects},
  actual:{families:atlas.families.length,variants:variantCount},
  sources:Object.fromEntries([...new Set(rows.map(r=>r.source))].map(s=>[s,rows.filter(r=>r.source===s).length])),
  unmapped,legacyAlias,legacyExact,duplicateIds,sharedFingerprints:shared
};
fs.mkdirSync('audit',{recursive:true});
fs.writeFileSync('audit/preview-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));

let fail=false;
if(atlas.families.length!==315 || atlas.familyCount!==315){console.error('FAIL family count');fail=true}
if(variantCount!==620 || atlas.variantCount!==620){console.error('FAIL variant count');fail=true}
if(unmapped.length){console.error(`FAIL ${unmapped.length} unmapped families`);fail=true}
if(legacyAlias.length){console.error(`FAIL ${legacyAlias.length} legacy aliases`);fail=true}
if(duplicateIds.length){console.error(`FAIL duplicate ids`);fail=true}
if(shared.length){console.error(`WARN ${shared.length} shared structural fingerprints need visual review`)}
process.exit(fail?1:0);
