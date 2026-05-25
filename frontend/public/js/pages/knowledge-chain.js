/* ============================================================
   PRWP Knowledge Chain Page
   ============================================================ */

const KnowledgeChainPage = {
  render() {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();

    const steps = [
      {
        num: 'Step 01',
        titleZh: '材料识别',
        titleEn: 'Material Identification',
        icon: '⚗️',
        bodyZh: '输入材料：AgSnO₂（氧化锡银触点）\n导电性：高 | 导热性：高 | 接触电阻：中高 | 可焊性：困难(3/5)',
        bodyEn: 'Input material: AgSnO₂ (Silver Tin Oxide Contact)\nConductivity: High | Thermal: High | Contact R: Medium-High | Weldability: Difficult (3/5)',
        resultZh: 'MAT-001 AgSnO₂',
        resultEn: 'MAT-001 AgSnO₂',
      },
      {
        num: 'Step 02',
        titleZh: '界面特征分析',
        titleEn: 'Interface Characteristic Analysis',
        icon: '🔗',
        bodyZh: 'AgSnO₂ ↔ 铜镀银 界面\n→ SnO₂颗粒 = 高接触电阻\n→ 热导率差异大 = 热集中难控\n→ 热集中难度：极高(5/5) | 氧化风险：高',
        bodyEn: 'AgSnO₂ ↔ Silver-Plated Cu Interface\n→ SnO₂ particles = High contact resistance\n→ Large thermal conductivity gap = Uncontrolled heat concentration\n→ Heat difficulty: Very High (5/5) | Oxide risk: High',
        resultZh: 'IFC-001 高接触电阻界面',
        resultEn: 'IFC-001 High Contact-R Interface',
      },
      {
        num: 'Step 03',
        titleZh: '工艺模型选择',
        titleEn: 'Process Model Selection',
        icon: '📐',
        bodyZh: '因接触电阻高且不稳定 → 选择动态电阻控制工艺\n→ 实时监测R曲线，在R下降点精准截止\n→ 防止过热飞溅',
        bodyEn: 'High and unstable contact resistance → Select Dynamic Resistance Control\n→ Real-time R curve monitoring, precise cutoff at R-drop point\n→ Prevents overheating and splash',
        resultZh: 'TPL-002 高阻模板',
        resultEn: 'TPL-002 High Resistance Template',
      },
      {
        num: 'Step 04',
        titleZh: '电源系统选型',
        titleEn: 'Power System Selection',
        icon: '⚡',
        bodyZh: '高di/dt需求 + 动态R控制 → 选择中频直流(MFDC)电源\n→ 1000–4000 Hz，快速响应\n→ 推荐：Matuschek M400W + MF8控制器',
        bodyEn: 'High di/dt + Dynamic R control → Select MFDC Power Source\n→ 1000–4000 Hz, fast response\n→ Recommended: Matuschek M400W + MF8 Controller',
        resultZh: 'MFDC 中频直流电源',
        resultEn: 'MFDC Power Source',
      },
      {
        num: 'Step 05',
        titleZh: '焊头机构选型',
        titleEn: 'Welding Head Selection',
        icon: '🔩',
        bodyZh: '高飞溅风险 = 需要快速随动机构\n→ 熔核形成瞬间，固相壳层消失，需即时增压\n→ 气动随动焊头，响应时间 < 5ms',
        bodyEn: 'High splash risk = Fast follow-up mechanism required\n→ When nugget forms, solid shell disappears — immediate pressure increase needed\n→ Pneumatic follow-up head, response time < 5ms',
        resultZh: '高随动气动焊头',
        resultEn: 'High Follow-Up Pneumatic Head',
      },
      {
        num: 'Step 06',
        titleZh: '电极选型',
        titleEn: 'Electrode Selection',
        icon: '🔋',
        bodyZh: 'AgSnO₂粘电极风险高 → 需要抗粘接材料\n→ 选择CuCrZr基体 + 钨(W)镶件\n→ 高强度 + 高耐温 + 抗银合金化',
        bodyEn: 'High AgSnO₂ sticking risk → Anti-stick material required\n→ CuCrZr base + Tungsten (W) insert\n→ High strength + High temperature resistance + Anti-silver alloying',
        resultZh: 'CuCrZr + W镶件电极',
        resultEn: 'CuCrZr + W Insert Electrode',
      },
      {
        num: 'Step 07',
        titleZh: '传感器配置',
        titleEn: 'Sensor Configuration',
        icon: '📡',
        bodyZh: '动态R控制 → 需要高速动态电阻传感\n随动监控 → 需要位移传感器\n压力验证 → 需要压力传感器\n→ 三传感器闭环系统',
        bodyEn: 'Dynamic R control → High-speed dynamic resistance sensing\nFollow-up monitoring → Displacement sensor\nForce verification → Pressure sensor\n→ Triple-sensor closed-loop system',
        resultZh: 'Dynamic R + 位移 + 压力 三合一',
        resultEn: 'Dynamic R + Displacement + Force',
      },
      {
        num: 'Step 08',
        titleZh: '工艺参数生成',
        titleEn: 'Process Parameter Generation',
        icon: '🎯',
        bodyZh: '初始工艺参数窗口：\n电流：2–4 kA | 频率：1000–4000 Hz\n焊接时间：10–40 ms | 压力：400–700 N\n→ 以此为起点开始DOE优化',
        bodyEn: 'Initial process parameter window:\nCurrent: 2–4 kA | Frequency: 1000–4000 Hz\nWeld time: 10–40 ms | Force: 400–700 N\n→ Use as DOE starting point',
        resultZh: '初始参数窗口建立',
        resultEn: 'Initial Parameter Window Established',
      },
      {
        num: 'Step 09',
        titleZh: 'DOE优化',
        titleEn: 'DOE Optimization',
        icon: '📊',
        bodyZh: '采集波形数据 → 建立良品/不良品波形数据库\n分析关键变量影响 → 收窄参数窗口\n→ 建立量产黄金窗口与报警阈值',
        bodyEn: 'Collect waveform data → Build good/defect waveform database\nAnalyze key variable effects → Narrow parameter window\n→ Establish production golden window and alarm thresholds',
        resultZh: '黄金工艺窗口',
        resultEn: 'Golden Process Window',
      },
      {
        num: 'Step 10',
        titleZh: '知识沉淀',
        titleEn: 'Knowledge Retention',
        icon: '🧠',
        bodyZh: '将全流程数据结构化存入平台：\n材料卡 + 界面卡 + 波形库 + DOE库 + 量产窗口\n→ 未来AI推理的训练数据基础',
        bodyEn: 'Structured storage of complete process data:\nMaterial Card + Interface Card + Waveform DB + DOE Library + Production Window\n→ Foundation for future AI reasoning training data',
        resultZh: 'PRWP 知识库更新',
        resultEn: 'PRWP Knowledge Base Updated',
      },
    ];

    const chainHTML = steps.map((step, i) => `
      <div class="chain-step animate-in" style="animation-delay:${i*0.06}s;">
        <div class="chain-connector">
          <div class="chain-dot"></div>
          <div class="chain-line"></div>
        </div>
        <div class="chain-content">
          <div class="chain-card">
            <div class="chain-step-num">${step.icon} ${step.num}</div>
            <div class="chain-step-title">${lang==='zh' ? step.titleZh : step.titleEn}</div>
            <div class="chain-step-body">${(lang==='zh' ? step.bodyZh : step.bodyEn).replace(/\n/g,'<br>')}</div>
            <div class="chain-step-result">→ ${lang==='zh' ? step.resultZh : step.resultEn}</div>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="page-inner animate-in">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);font-family:var(--font-mono);">KNOWLEDGE CHAIN / 知识推导链</div>
              <h1 class="page-title">${t('kc.title')}</h1>
              <p class="page-subtitle">${t('kc.subtitle')}</p>
            </div>
          </div>
        </div>

        <!-- Example Header -->
        <div class="card" style="margin-bottom:var(--space-8);border-left:3px solid var(--color-accent);">
          <div class="card-body">
            <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:var(--space-2);">
              Example Case / 示例案例
            </div>
            <div style="font-size:var(--text-lg);font-weight:var(--weight-semibold);color:var(--color-text-primary);">
              AgSnO₂ ↔ 铜镀银 精密焊接推导链
            </div>
            <div style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-top:var(--space-2);">
              从材料定义出发，系统推导电源、机构、电极、传感器选型和工艺参数 /
              From material definition, systematically derive power, head, electrode, sensor and process parameters
            </div>
          </div>
        </div>

        <!-- Chain -->
        <div class="chain-container" style="max-width:760px;">
          ${chainHTML}
        </div>
      </div>
    `;
  }
};
