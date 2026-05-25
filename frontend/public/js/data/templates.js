/* ============================================================
   PRWP Process Template Library Data
   ============================================================ */

const TEMPLATES_DATA = [
  {
    id: 'TPL-001',
    nameZh: '高导热模板',
    nameEn: 'High Conductivity Template',
    control_mode: 'Current Control / 电流控制',
    applicable_materials: ['铜/铜', '铜镀银', '纯铜'],
    applicable_en: ['Cu/Cu', 'Silver-plated Cu', 'Pure Cu'],
    color: '#06D6A0',
    key_parameters: {
      current_range: '3–8 kA',
      weld_time: '20–80 ms',
      pressure: '300–600 N',
      frequency: '1000 Hz (MFDC)',
    },
    sensor_requirements: ['Dynamic R', 'Displacement'],
    recommended_electrode: 'CuCrZr / 铬锆铜',
    known_risks: {
      zh: ['热量散失快、需足够电流', '高电流下飞溅风险'],
      en: ['Fast heat dissipation requires sufficient current', 'Splash risk at high current']
    },
    description: {
      zh: '适用于高导热材料配对。核心策略：高电流密度快速建立熔核，避免热量散失过多。需要动态电阻监控以判断熔核形成时机。',
      en: 'For high thermal conductivity material pairs. Strategy: high current density to rapidly form nugget before heat dissipates. Dynamic resistance monitoring required to detect nugget formation timing.'
    }
  },
  {
    id: 'TPL-002',
    nameZh: '高阻模板',
    nameEn: 'High Resistance Template',
    control_mode: 'Dynamic R Control / 动态电阻控制',
    applicable_materials: ['AgSnO₂', 'AgCdO', '触点材料'],
    applicable_en: ['AgSnO₂', 'AgCdO', 'Contact materials'],
    color: '#EF476F',
    key_parameters: {
      current_range: '2–6 kA',
      weld_time: '10–40 ms',
      pressure: '400–700 N',
      frequency: '1000–4000 Hz (MFDC)',
    },
    sensor_requirements: ['Dynamic R', 'Displacement', 'Force'],
    recommended_electrode: 'CuCrZr + W Insert / 铬锆铜+钨镶件',
    known_risks: {
      zh: ['高接触电阻导致局部过热飞溅', '电流路径不稳定', '粘电极'],
      en: ['High contact resistance causes localized overheating and splash', 'Unstable current path', 'Electrode sticking']
    },
    description: {
      zh: '专为高接触电阻材料设计。核心策略：动态电阻闭环控制，实时监测熔核形成，在R下降点精准截止。高di/dt配合高随动焊头。',
      en: 'Designed for high contact resistance materials. Strategy: closed-loop dynamic resistance control, real-time nugget formation monitoring, precise cutoff at R-drop point. High di/dt with high follow-up welding head.'
    }
  },
  {
    id: 'TPL-003',
    nameZh: '柔性导体模板',
    nameEn: 'Flexible Conductor Template',
    control_mode: 'Multi-Pulse / 多脉冲',
    applicable_materials: ['铜辫线', '铜绞线', '多层铜箔'],
    applicable_en: ['Cu braid', 'Cu stranded wire', 'Multi-layer Cu foil'],
    color: '#F7931E',
    key_parameters: {
      current_range: '2–5 kA (per pulse)',
      weld_time: '3×10–30 ms',
      pressure: '200–500 N',
      frequency: '1000 Hz',
    },
    sensor_requirements: ['Displacement', 'Force', 'Dynamic R'],
    recommended_electrode: 'CuCrZr Flat / 平面铬锆铜',
    known_risks: {
      zh: ['多股接触不均', '氧化膜影响早期电流路径', '压实度不足导致强度低'],
      en: ['Uneven multi-strand contact', 'Oxide film affects initial current path', 'Insufficient compaction leads to low strength']
    },
    description: {
      zh: '多脉冲策略：首脉冲破除氧化膜并初步压实；后续脉冲逐步加热形成冶金连接。每脉冲之间有冷却间隔以控制热量累积。',
      en: 'Multi-pulse strategy: first pulse breaks oxide film and provides initial compaction; subsequent pulses gradually heat to form metallurgical bond. Cooling interval between pulses to control heat accumulation.'
    }
  },
  {
    id: 'TPL-004',
    nameZh: '高频短脉冲模板',
    nameEn: 'High-Frequency Short Pulse Template',
    control_mode: 'High-Freq Current Control / 高频电流控制',
    applicable_materials: ['精密触点', '薄片', '微焊'],
    applicable_en: ['Precision contacts', 'Thin foil', 'Micro welding'],
    color: '#8338EC',
    key_parameters: {
      current_range: '0.5–3 kA',
      weld_time: '1–10 ms',
      pressure: '50–200 N',
      frequency: '4000 Hz (MFDC)',
    },
    sensor_requirements: ['Dynamic R', 'Displacement (µm)'],
    recommended_electrode: 'W/Mo Point / 钨钼尖电极',
    known_risks: {
      zh: ['极小能量窗口', '热量均匀性差', '焊点尺寸一致性'],
      en: ['Extremely narrow energy window', 'Poor heat uniformity', 'Weld spot size consistency']
    },
    description: {
      zh: '适用于微型精密焊接。高频减少单个周期能量，实现更精细的热量控制。需要高精度位移传感器（µm级）监控塌陷量。',
      en: 'For micro precision welding. High frequency reduces per-cycle energy for finer thermal control. Requires high-precision displacement sensor (µm level) to monitor collapse.'
    }
  },
  {
    id: 'TPL-005',
    nameZh: '多段压力模板',
    nameEn: 'Multi-Stage Force Template',
    control_mode: 'Force + Current Coordinated / 力-电协调控制',
    applicable_materials: ['多层叠焊', '异种材料', '精密组件'],
    applicable_en: ['Multi-layer stack', 'Dissimilar materials', 'Precision assemblies'],
    color: '#4CC9F0',
    key_parameters: {
      current_range: '1–6 kA',
      weld_time: '20–100 ms',
      pressure: 'Stage 1: 200N / Stage 2: 500N',
      frequency: '1000–2000 Hz',
    },
    sensor_requirements: ['Force', 'Displacement', 'Dynamic R'],
    recommended_electrode: 'CuCrZr Custom / 定制铬锆铜',
    known_risks: {
      zh: ['多层界面热分布不均', '压力切换时机影响质量', '复杂控制需求'],
      en: ['Uneven heat distribution across multi-layer interfaces', 'Timing of force switching affects quality', 'Complex control requirements']
    },
    description: {
      zh: '焊接过程中主动切换压力档位。低压阶段：高接触电阻，热量集中生成熔核；高压阶段：压实熔核，防止飞溅，提高强度。',
      en: 'Actively switches force levels during welding. Low force stage: high contact resistance concentrates heat to form nugget; high force stage: compacts nugget, prevents splash, increases strength.'
    }
  },
];
