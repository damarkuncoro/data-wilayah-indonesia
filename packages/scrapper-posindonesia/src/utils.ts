import { PostalCodeResult } from './parser';

/**
 * Formats a raw numerical code into standard Indonesian administrative format (PP.KK.CC.DD).
 * @param code - The raw code (e.g., 1101012001)
 * @returns The formatted code (e.g., 11.01.01.2001)
 */
export function formatCode(code: string): string {
    if (!code) return '';
    const cleanCode = code.replace(/\./g, '');
    const p1 = cleanCode.substring(0, 2);
    const p2 = cleanCode.substring(2, 4);
    const p3 = cleanCode.substring(4, 6);
    const p4 = cleanCode.substring(6);
    return [p1, p2, p3, p4].filter(Boolean).join('.');
}

/**
 * Finds the best match in a list of search results based on village and district names.
 * @param results - The list of parsed results
 * @param villageName - The target village name
 * @param districtName - The target district name
 * @returns The best matching object or null
 */
export function findBestMatch(
    results: PostalCodeResult[], 
    villageName: string, 
    districtName: string
): PostalCodeResult | null {
    if (!results || results.length === 0) return null;

    return results.find(r => 
        (r.desa_kelurahan.toLowerCase().includes(villageName.toLowerCase()) || 
         villageName.toLowerCase().includes(r.desa_kelurahan.toLowerCase())) &&
        (r.kecamatan.toLowerCase().includes(districtName.toLowerCase()) || 
         districtName.toLowerCase().includes(r.kecamatan.toLowerCase()))
    ) || results[0]; // Fallback to first result
}
