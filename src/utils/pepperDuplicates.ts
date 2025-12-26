import { Pepper } from '@/data/pepperTypes';

/**
 * Normalize a pepper name for comparison
 */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[,\\-_'"]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity between two strings (Jaccard similarity on words)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(normalizeName(str1).split(' '));
  const words2 = new Set(normalizeName(str2).split(' '));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

export interface DuplicateGroup {
  id: string;
  entries: Pepper[];
  reason: 'exact-id' | 'similar-name';
}

/**
 * Find peppers with identical IDs
 */
export function findDuplicatesById(peppers: Pepper[]): DuplicateGroup[] {
  const idMap = new Map<string, Pepper[]>();
  
  for (const pepper of peppers) {
    const existing = idMap.get(pepper.id) || [];
    existing.push(pepper);
    idMap.set(pepper.id, existing);
  }
  
  const duplicates: DuplicateGroup[] = [];
  for (const [id, entries] of idMap.entries()) {
    if (entries.length > 1) {
      duplicates.push({ id, entries, reason: 'exact-id' });
    }
  }
  
  return duplicates;
}

/**
 * Find peppers with similar names (threshold 0-1, default 0.8)
 */
export function findSimilarByName(peppers: Pepper[], threshold = 0.8): DuplicateGroup[] {
  const groups: DuplicateGroup[] = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < peppers.length; i++) {
    if (processed.has(i)) continue;
    
    const similar: Pepper[] = [peppers[i]];
    
    for (let j = i + 1; j < peppers.length; j++) {
      if (processed.has(j)) continue;
      
      const similarity = calculateSimilarity(peppers[i].name, peppers[j].name);
      if (similarity >= threshold) {
        similar.push(peppers[j]);
        processed.add(j);
      }
    }
    
    if (similar.length > 1) {
      processed.add(i);
      groups.push({
        id: peppers[i].id,
        entries: similar,
        reason: 'similar-name'
      });
    }
  }
  
  return groups;
}

/**
 * Merge two pepper entries, preferring more complete data
 */
export function mergePepperEntries(primary: Pepper, secondary: Pepper): Pepper {
  // Helper to pick the better value (longer string, defined value, etc.)
  const pickBetter = <T>(a: T, b: T): T => {
    if (a === undefined || a === null) return b;
    if (b === undefined || b === null) return a;
    if (typeof a === 'string' && typeof b === 'string') {
      return (a.length >= b.length ? a : b) as T;
    }
    return a;
  };

  const pickLongerArray = <T>(a: T[] | undefined, b: T[] | undefined): T[] | undefined => {
    if (!a || a.length === 0) return b;
    if (!b || b.length === 0) return a;
    return a.length >= b.length ? a : b;
  };

  // Combine alternate names
  const combinedAlternateNames = [
    ...(primary.alternateNames || []),
    ...(secondary.alternateNames || []),
    // Add the name from the entry being merged if different
    ...(primary.name !== secondary.name ? [secondary.name] : [])
  ];
  const uniqueAlternateNames = [...new Set(combinedAlternateNames)].filter(n => n !== primary.name);

  // Merge galleries
  const combinedGallery = [
    ...(primary.gallery || []),
    ...(secondary.gallery || [])
  ];
  const uniqueGallery = combinedGallery.filter((img, idx, arr) => 
    arr.findIndex(i => i.url === img.url) === idx
  );

  return {
    id: primary.id,
    name: primary.name,
    alternateNames: uniqueAlternateNames.length > 0 ? uniqueAlternateNames : undefined,
    scientificName: pickBetter(primary.scientificName, secondary.scientificName),
    species: primary.species,
    origin: pickBetter(primary.origin, secondary.origin),
    region: primary.region,
    // For Scoville, prefer the wider range or more accurate data
    scovilleMin: Math.min(primary.scovilleMin, secondary.scovilleMin),
    scovilleMax: Math.max(primary.scovilleMax, secondary.scovilleMax),
    heatLevel: pickBetter(primary.heatLevel, secondary.heatLevel),
    flavorNotes: pickLongerArray(primary.flavorNotes, secondary.flavorNotes) || [],
    aromaNotes: pickLongerArray(primary.aromaNotes, secondary.aromaNotes),
    description: pickBetter(primary.description, secondary.description),
    historicalNotes: pickBetter(primary.historicalNotes, secondary.historicalNotes),
    tradeRoute: pickBetter(primary.tradeRoute, secondary.tradeRoute),
    tradeRouteTags: pickLongerArray(primary.tradeRouteTags, secondary.tradeRouteTags),
    yearIntroduced: Math.min(primary.yearIntroduced, secondary.yearIntroduced),
    culinaryUses: pickLongerArray(primary.culinaryUses, secondary.culinaryUses) || [],
    pairings: pickLongerArray(primary.pairings, secondary.pairings),
    inStock: primary.inStock || secondary.inStock,
    gallery: uniqueGallery.length > 0 ? uniqueGallery : undefined,
    imageUrl: primary.imageUrl || secondary.imageUrl,
    imageLicense: primary.imageLicense || secondary.imageLicense,
    attributionText: primary.attributionText || secondary.attributionText,
  };
}

/**
 * Generate a report of all duplicates
 */
export function generateDuplicateReport(peppers: Pepper[]): void {
  console.group('🌶️ Pepper Duplicate Report');
  
  const idDuplicates = findDuplicatesById(peppers);
  const nameSimilar = findSimilarByName(peppers, 0.75);
  
  if (idDuplicates.length === 0 && nameSimilar.length === 0) {
    console.log('✅ No duplicates found!');
    console.groupEnd();
    return;
  }
  
  if (idDuplicates.length > 0) {
    console.group(`🔴 ${idDuplicates.length} ID Duplicate(s)`);
    for (const dup of idDuplicates) {
      console.log(`ID: \"${dup.id}\"`);
      for (const entry of dup.entries) {
        console.log(`  - \"${entry.name}\" (origin: ${entry.origin})`);
      }
    }
    console.groupEnd();
  }
  
  if (nameSimilar.length > 0) {
    console.group(`🟡 ${nameSimilar.length} Similar Name Group(s)`);
    for (const group of nameSimilar) {
      console.log(`Similar to: \"${group.entries[0].name}\"`);
      for (const entry of group.entries) {
        console.log(`  - ID: \"${entry.id}\", Name: \"${entry.name}\"`);
      }
    }
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Development-only validation to warn about duplicates
 */
export function validatePepperData(peppers: Pepper[]): boolean {
  const idDuplicates = findDuplicatesById(peppers);
  
  if (idDuplicates.length > 0) {
    console.warn(
      `⚠️ Found ${idDuplicates.length} duplicate pepper ID(s):`,
      idDuplicates.map(d => d.id).join(', ')
    );
    return false;
  }
  
  return true;
}

/**
 * Remove duplicates from pepper array, keeping the most complete entry
 */
export function deduplicatePeppers(peppers: Pepper[]): Pepper[] {
  const idMap = new Map<string, Pepper>();
  
  for (const pepper of peppers) {
    const existing = idMap.get(pepper.id);
    if (existing) {
      // Merge with existing, keeping more complete data
      idMap.set(pepper.id, mergePepperEntries(existing, pepper));
    } else {
      idMap.set(pepper.id, pepper);
    }
  }
  
  return Array.from(idMap.values());
}
