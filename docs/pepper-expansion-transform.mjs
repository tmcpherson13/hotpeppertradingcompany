import fs from 'fs';
const data = JSON.parse(fs.readFileSync('docs/pepper-expansion-candidates.json','utf8'));
const slug = n => n.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
function heat(s){ const nums=(s.match(/[\d,]+/g)||[]).map(x=>parseInt(x.replace(/,/g,''),10)).filter(x=>!isNaN(x)); if(!nums.length) return [0,0]; const min=nums[0], max=nums.length>1?nums[1]:nums[0]; return [min,max]; }
function tier(max){ if(max<=0) return 'No Heat'; if(max<1000) return 'Very Mild'; if(max<5000) return 'Mild'; if(max<15000) return 'Medium'; if(max<50000) return 'Hot'; if(max<100000) return 'Very Hot'; if(max<350000) return 'Extreme'; return 'Superhot'; }
function region(o){ const s=o.toLowerCase();
  const A=['mexico','oaxaca','yucatan','puebla','veracruz','tabasco','chiapas','aguascalientes','peru','venezuela','margarita','brazil','goias','para','bolivia','honduras','jamaica','trinidad','caribbean','antilles','usa','united states','american','america','new mexico','colorado','texas','ohio','virginia','wisconsin','carolina','philadelphia','south america'];
  const AS=['india','kerala','goa','tamil','andhra','karnataka','telangana','maharashtra','gujarat','bangalore','warangal','sikkim','nepal','thailand','indonesia','java','japan','kyoto','china','korea','philippines','malaysia','asia','georgia'];
  const AF=['zimbabwe','nigeria','cameroon','africa'];
  const EU=['spain','basque','navarra','italy','italian','lombardy','piedmont','campania','hungary','serbia','balkans','france','netherlands','czech','romania','bulgaria','uk','wales','england','europe'];
  const ME=['turkey'];
  const has=(arr)=>arr.some(k=>s.includes(k));
  if(s.includes('italian-american')||s.includes('american')) return 'Americas';
  if(has(ME)) return 'Middle East';
  if(has(EU)) return 'Europe';
  if(has(AF)) return 'Africa';
  if(has(AS)) return 'Asia';
  if(has(A)) return 'Americas';
  return 'Americas'; // bred/ornamental/heirloom default
}
const rows = data.verified.map(v=>{ const [mn,mx]=heat(v.heat); return {id:slug(v.name), name:v.name, sci:'Capsicum '+v.species, species:v.species, origin:v.origin, region:region(v.origin), smin:mn, smax:mx, heat:tier(mx)}; });
// dedup by id
const seen=new Set(); const uniq=[]; for(const r of rows){ if(seen.has(r.id))continue; seen.add(r.id); uniq.push(r); }
const esc = s => "'"+String(s).replace(/'/g,"''")+"'";
const values = uniq.map(r=>`(${esc(r.id)},${esc(r.name)},${esc(r.sci)},${esc(r.species)},${esc(r.origin)},${esc(r.region)},${r.smin},${r.smax},${esc(r.heat)})`).join(',\n');
const sql =
`CREATE TABLE IF NOT EXISTS pepper_expansion_meta (
  id text PRIMARY KEY, name text, scientific_name text, species text,
  origin text, region text, scoville_min int, scoville_max int, heat_level text);
INSERT INTO pepper_expansion_meta (id,name,scientific_name,species,origin,region,scoville_min,scoville_max,heat_level) VALUES
${values}
ON CONFLICT (id) DO NOTHING;
INSERT INTO pepper_catalog (id,name,in_stock)
SELECT id,name,false FROM pepper_expansion_meta ON CONFLICT (id) DO NOTHING;`;
fs.writeFileSync('/tmp/claude-0/-home-user-hotpeppertradingcompany/55d87c33-2f67-553d-8ce4-c92c63eccd67/scratchpad/seed.sql', sql);
console.log('verified entries:', data.verified.length, '| unique rows:', uniq.length);
console.log('sample:', JSON.stringify(uniq.slice(0,3)));
console.log('region spread:', JSON.stringify(uniq.reduce((a,r)=>{a[r.region]=(a[r.region]||0)+1;return a;},{})));
console.log('tier spread:', JSON.stringify(uniq.reduce((a,r)=>{a[r.heat]=(a[r.heat]||0)+1;return a;},{})));
