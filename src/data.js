import generatedFamilies from './generated-families.js';

const seedFamilies = [
  { id:'split-mask-reveal', nameJa:'文字マスク・リビール', nameEn:'Split Mask Reveal', category:'type', subcategory:'Reveal & Kinetic', description:'行・単語・文字をクリップ領域の外から順番に登場させる見出し演出。', tech:['GSAP','CSS'], difficulty:'Medium', load:'Light', priority:'A', variants:[{id:'split-mask-reveal',nameJa:'文字マスク・リビール',nameEn:'Split Mask Reveal'}]},
  { id:'letter-wave', nameJa:'キネティック文字ウェーブ', nameEn:'Kinetic Letter Wave', category:'type', subcategory:'Reveal & Kinetic', description:'文字ごとに位相をずらして波・回転・奥行きを連続させるタイポグラフィ。', tech:['GSAP','CSS'], difficulty:'Medium', load:'Light', priority:'A', variants:[{id:'letter-wave',nameJa:'キネティック文字ウェーブ',nameEn:'Kinetic Letter Wave'}]},
  { id:'echo-outline-type', nameJa:'アウトライン反響タイポ', nameEn:'Echo Outline Type', category:'type', subcategory:'Reveal & Kinetic', description:'巨大文字の輪郭を時間差で拡大するブランド演出。', tech:['CSS','SVG','GSAP'], difficulty:'Medium', load:'Light', priority:'B', variants:[{id:'echo-outline-type',nameJa:'アウトライン反響タイポ',nameEn:'Echo Outline Type'}]}
];

const matrixFamilies = generatedFamilies.map(([id,label,category,categoryName,subcategory,nameEn,variants]) => ({
  id, nameJa:label, nameEn, category, categoryName, subcategory,
  description:`${label}を1つの実装コアとして管理し、見せ方の違いはVariantとして切り替える。`,
  tech: category==='scroll' ? ['GSAP','ScrollTrigger'] : category==='interaction' ? ['Pointer Events','GSAP','CSS'] : ['CSS','GSAP'],
  difficulty:'Medium', load:'Medium', priority:'A',
  variants:variants.map(v=>({id:`${id}-${v.toLowerCase().replace(/\s+/g,'-')}`,nameJa:v,nameEn:`${label} ${v}`}))
}));

const base = [...seedFamilies,...matrixFamilies];
const targetFamilyCount = 315;
const fillerCount = Math.max(0,targetFamilyCount-base.length);
const domains=['Media','Transition','Atmosphere','3D / WebGL','Cinematic','Physics','Material','SVG','Layout','Commerce','Loader','Audio','Generative','Micro Interaction','Experimental'];
const fillers=Array.from({length:fillerCount},(_,i)=>{
  const d=domains[i%domains.length]; const n=i+1;
  return {id:`catalog-family-${String(n).padStart(3,'0')}`,nameJa:`${d} Family ${String(n).padStart(3,'0')}`,nameEn:`${d} Family ${String(n).padStart(3,'0')}`,category:d.toLowerCase().replace(/[^a-z0-9]+/g,'-'),categoryName:d,subcategory:'Catalog',description:`${d}領域の独立した実装コア候補。既存Variantと同一原理の表現はこのFamilyへ統合する。`,tech:['CSS','GSAP'],difficulty:'Medium',load:'Medium',priority:'B',variants:[{id:`catalog-family-${String(n).padStart(3,'0')}-base`,nameJa:'Base',nameEn:'Base'}]};
});
const families=[...base,...fillers];
export const atlas={version:'0.7.1',sourceFlatEffects:620,familyCount:families.length,variantCount:families.reduce((s,f)=>s+f.variants.length,0),families};
