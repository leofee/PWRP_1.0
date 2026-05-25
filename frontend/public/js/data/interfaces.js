/* ============================================================
   PRWP Interface Library Data
   ============================================================ */

const INTERFACES_DATA = [
  {
    id: 'IFC-001',
    material_a: { id: 'MAT-001', name: 'AgSnO₂', nameZh: '氧化锡银' },
    material_b: { id: 'MAT-002', name: 'Cu+Ag',  nameZh: '铜镀银'   },
    interface_type: {
      zh: '触点-导体界面 (高阻↔低阻)',
      en: 'Contact-Conductor Interface (High-R ↔ Low-R)'
    },
    heat_concentration: 'Very High / 极高',
    oxide_risk: 'High / 高',
    current_path_stability: 'Low / 低',
    recommended_process: 'DynamicResistanceControl / 动态电阻控制',
    process_template_id: 'TPL-002',
    priority: 'P0',
    difficulty_score: 5,
    known_failures: [
      { id: 'FAIL-001', nameZh: '飞溅',   nameEn: 'Splash' },
      { id: 'FAIL-002', nameZh: '虚焊',   nameEn: 'Weak Weld' },
      { id: 'FAIL-003', nameZh: '粘电极', nameEn: 'Electrode Sticking' },
    ],
    key_challenges: {
      zh: [
        'AgSnO₂侧接触电阻高且不稳定',
        '两侧材料热导率差异大，热集中难控',
        '银层薄时氧化膜干扰电流路径',
        '飞溅风险极高，需精密随动机构',
      ],
      en: [
        'High and unstable contact resistance on AgSnO₂ side',
        'Large thermal conductivity difference causes uncontrolled heat concentration',
        'Thin silver plating — oxide film disturbs current path',
        'Extreme splash risk requires precision follow-up mechanism',
      ]
    },
    notes: {
      zh: '这是精密电阻焊最难的界面之一。需要MFDC + 动态电阻控制 + 高随动焊头的组合。',
      en: 'One of the most challenging interfaces in precision resistance welding. Requires MFDC + Dynamic Resistance Control + high follow-up welding head combination.'
    }
  },
  {
    id: 'IFC-002',
    material_a: { id: 'MAT-004', name: 'AgCdO', nameZh: '氧化镉银' },
    material_b: { id: 'MAT-002', name: 'Cu',    nameZh: '铜'       },
    interface_type: {
      zh: '触点-铜基底界面',
      en: 'Contact-Copper Base Interface'
    },
    heat_concentration: 'High / 高',
    oxide_risk: 'Medium / 中',
    current_path_stability: 'Medium / 中',
    recommended_process: 'StandardMFDC / 标准MFDC',
    process_template_id: 'TPL-002',
    priority: 'P1',
    difficulty_score: 3,
    known_failures: [
      { id: 'FAIL-001', nameZh: '飞溅',   nameEn: 'Splash' },
      { id: 'FAIL-002', nameZh: '虚焊',   nameEn: 'Weak Weld' },
    ],
    key_challenges: {
      zh: [
        'CdO颗粒影响电流分布均匀性',
        '铜侧散热快，能量分配不对称',
      ],
      en: [
        'CdO particles affect current distribution uniformity',
        'Fast heat dissipation on copper side causes asymmetric energy distribution',
      ]
    },
    notes: {
      zh: '相对AgSnO₂界面稍容易，但仍需MFDC和压力控制。',
      en: 'Slightly easier than AgSnO₂ interface, but still requires MFDC and pressure control.'
    }
  },
  {
    id: 'IFC-003',
    material_a: { id: 'MAT-005', name: 'Cu (braided)', nameZh: '铜辫线' },
    material_b: { id: 'MAT-006', name: 'Cu Terminal',  nameZh: '铜端子'  },
    interface_type: {
      zh: '柔性导体-端子界面',
      en: 'Flexible Conductor-Terminal Interface'
    },
    heat_concentration: 'High / 高',
    oxide_risk: 'Medium-High / 中高',
    current_path_stability: 'Low-Medium / 中低',
    recommended_process: 'MultiPulseProgressive / 多脉冲渐进',
    process_template_id: 'TPL-003',
    priority: 'P1',
    difficulty_score: 4,
    known_failures: [
      { id: 'FAIL-001', nameZh: '飞溅',   nameEn: 'Splash' },
      { id: 'FAIL-004', nameZh: '偏焊',   nameEn: 'Off-Center Weld' },
    ],
    key_challenges: {
      zh: [
        '编织线股丝接触不均匀',
        '氧化铜表面增大接触电阻',
        '随动性要求高以保证压实',
      ],
      en: [
        'Uneven contact between braid strands',
        'Copper oxide surface increases contact resistance',
        'High follow-up requirement to ensure compaction',
      ]
    },
    notes: {
      zh: '多脉冲可以逐步压实并清除氧化膜，提高工艺稳定性。',
      en: 'Multi-pulse can progressively compact and clean oxide film, improving process stability.'
    }
  },
];
