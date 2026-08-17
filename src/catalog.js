import { atlas as rawAtlas } from './data.js';
import { expansionFamilies } from './expansion.js';

const existingIds=new Set(rawAtlas.families.map(f=>f.id));
const additions=expansionFamilies.filter(f=>!existingIds.has(f.id));
const families=[...rawAtlas.families,...additions];
const actualFamilyCount=families.length;
const actualVariantCount=families.reduce((n,f)=>n+(f.variants?.length||0),0);

export const catalogIntegrity={
  declaredFamilyCount:rawAtlas.familyCount,
  declaredVariantCount:rawAtlas.variantCount,
  declaredSourceFlatEffects:rawAtlas.sourceFlatEffects,
  actualFamilyCount,
  actualVariantCount,
  addedExpansionFamilies:additions.length,
  metadataMismatch:rawAtlas.familyCount!==actualFamilyCount||rawAtlas.variantCount!==actualVariantCount
};

export const atlas={
  ...rawAtlas,
  version:'0.9.0',
  families,
  familyCount:actualFamilyCount,
  variantCount:actualVariantCount
};
