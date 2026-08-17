import { atlas as rawAtlas } from './data.js';

const actualFamilyCount = rawAtlas.families.length;
const actualVariantCount = rawAtlas.families.reduce((n,f)=>n+(f.variants?.length||0),0);

export const catalogIntegrity = {
  declaredFamilyCount: rawAtlas.familyCount,
  declaredVariantCount: rawAtlas.variantCount,
  declaredSourceFlatEffects: rawAtlas.sourceFlatEffects,
  actualFamilyCount,
  actualVariantCount,
  metadataMismatch: rawAtlas.familyCount !== actualFamilyCount || rawAtlas.variantCount !== actualVariantCount
};

// Runtime/UI must show what actually exists, never stale declared metadata.
export const atlas = {
  ...rawAtlas,
  familyCount: actualFamilyCount,
  variantCount: actualVariantCount
};
