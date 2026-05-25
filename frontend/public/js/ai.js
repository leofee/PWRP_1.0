/* ============================================================
   PRWP AI Module — PubChem + Gemini material lookup
   ============================================================ */
const AI = (() => {
  const _KEY_STORAGE = 'prwp_gemini_key';

  const getKey = () => localStorage.getItem(_KEY_STORAGE) || '';
  const setKey = (key) => localStorage.setItem(_KEY_STORAGE, key.trim());

  /* ---- PubChem: basic chemistry data ---- */
  const queryPubChem = async (query) => {
    try {
      const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(query)}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const p = data.PropertyTable?.Properties?.[0];
      if (!p) return null;
      return {
        cid: p.CID,
        formula: p.MolecularFormula || null,
        iupac: p.IUPACName || null,
        molecularWeight: p.MolecularWeight ? `${p.MolecularWeight} g/mol` : null
      };
    } catch (e) {
      console.error('[AI] PubChem error:', e);
      return null;
    }
  };

  /* ---- Gemini: welding-specific properties ---- */
  const queryGemini = async (formula, name, pubchemData) => {
    const key = getKey();
    if (!key) return null;

    const known = pubchemData
      ? `PubChem data: Formula=${pubchemData.formula}, MW=${pubchemData.molecularWeight}, IUPAC=${pubchemData.iupac}.`
      : '';

    // Clear, unambiguous prompt — no placeholder examples
    const prompt = `You are a resistance welding materials expert (中频MF焊机).
Task: Return physical and welding properties for the material: formula="${formula}", name="${name || formula}".
${known}

IMPORTANT: Return ONLY a raw JSON object. No markdown. No explanation. No "e.g." in values. All values must be real data for THIS specific material.

{
  "nameZh": "<Chinese name>",
  "nameEn": "<English name>",
  "category": "<one of: contact-material | base-metal | electrode-material>",
  "melting_point": "<temperature with unit, e.g. 1085°C>",
  "density": "<density with unit, e.g. 8.96 g/cm³>",
  "conductivity": "<one of: Very High / 极高 | High / 高 | Medium / 中 | Low / 低>",
  "thermal_conductivity": "<one of: Very High / 极高 | High / 高 | Medium / 中 | Low / 低>",
  "hardness": "<one of: Very High / 极高 | High / 高 | Medium / 中 | Low / 低 | Very Low / 极低>",
  "contact_resistance": "<one of: Very High / 极高 | High / 高 | Medium-High / 中高 | Medium / 中 | Low-Medium / 中低 | Low / 低>",
  "weldability_level": <integer 1 to 5>,
  "splash_risk": "<one of: Very High / 极高 | High / 高 | Medium / 中 | Low / 低>",
  "crack_risk": "<one of: High / 高 | Medium / 中 | Low / 低>",
  "recommended_current_density": "<range with unit, e.g. 300-500 A/mm²>",
  "recommended_pressure": "<range with unit, e.g. 200-400 N>",
  "priority": "<one of: P0 | P1 | P2>",
  "tags": ["<tag1>", "<tag2>"],
  "notes": {
    "zh": "<one sentence welding engineering note in Chinese>",
    "en": "<one sentence welding engineering note in English>"
  },
  "ai_summary": "<two sentence technical summary for knowledge base>"
}`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 1024 }
          })
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('[AI] Gemini error', res.status, err?.error?.message);
        return null;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      // Extract the JSON object from response
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) { console.error('[AI] No JSON in response:', text); return null; }
      return JSON.parse(match[0]);
    } catch (e) {
      console.error('[AI] Gemini exception:', e);
      return null;
    }
  };

  /* ---- Main lookup ---- */
  const lookupMaterial = async (formula, name = '') => {
    const pubchem = await queryPubChem(formula || name);
    const gemini  = await queryGemini(formula, name, pubchem);

    const merged = {
      formula: pubchem?.formula || formula,
      molecular_weight: pubchem?.molecularWeight || null,
      ...(gemini || {})
    };

    console.log('[AI] Lookup result:', JSON.stringify({ pubchem, gemini, merged }));
    return { pubchem, gemini, merged };
  };

  /* ---- Download lib sidecar JSON ---- */
  const saveToLib = (merged, pubchem, formula) => {
    const date     = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const safeName = (formula || 'unknown').replace(/[^a-zA-Z0-9]/g, '');
    const filename = `${safeName}_${date}.json`;
    const category = merged.category || 'contact-material';

    const record = {
      id: `${safeName}_${date}`,
      type: 'material',
      category,
      name: { zh: merged.nameZh || '', en: merged.nameEn || formula },
      formula,
      source: [pubchem ? 'PubChem' : null, 'Gemini AI'].filter(Boolean),
      createdAt: new Date().toISOString().slice(0, 10),
      tags: merged.tags || [],
      files: {
        json: `materials/${category}/${filename}`,
        pdf:  `materials/${category}/${safeName}_${date}.pdf`
      },
      properties: {
        melting_point:   merged.melting_point,
        density:         merged.density,
        molecular_weight: merged.molecular_weight,
        conductivity:    merged.conductivity,
        weldability_level: merged.weldability_level,
        splash_risk:     merged.splash_risk,
        crack_risk:      merged.crack_risk,
        recommended_current_density: merged.recommended_current_density,
        recommended_pressure:        merged.recommended_pressure
      },
      pubchem:    pubchem || null,
      ai_summary: merged.ai_summary || '',
      notes:      merged.notes || {}
    };

    UI.downloadJSON(record, filename);
    return { record, filename, targetPath: `~/lib/materials/${category}/${filename}` };
  };

  return { getKey, setKey, lookupMaterial, saveToLib };
})();
