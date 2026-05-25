/* ============================================================
   PRWP Failure Library Data — P0 Priority Failures
   ============================================================ */

const FAILURES_DATA = [
  {
    id: 'FAIL-001',
    nameZh: '飞溅',
    nameEn: 'Weld Splash / Expulsion',
    icon: '💥',
    iconBg: 'var(--color-danger-light)',
    priority: 'P0',
    physical_mechanism: {
      zh: '熔核内部液态金属压力超过固态壳层约束力，液态金属从界面喷出。根本原因是热量输入过快（di/dt过高）或压力不足以约束熔池。',
      en: 'Internal pressure of liquid metal nugget exceeds the containment force of the solid shell, causing liquid metal to expel from the interface. Root cause is excessive heat input rate (high di/dt) or insufficient pressure to contain the melt pool.'
    },
    waveform_signature: {
      zh: '动态电阻曲线出现突然下降（熔核形成后失去固相约束）；电流曲线出现尖刺或突变；位移曲线突然增大。',
      en: 'Dynamic resistance curve shows sudden drop (loss of solid-phase constraint after nugget formation); current curve shows spikes or sudden changes; displacement curve shows sudden increase.'
    },
    mechanical_signature: {
      zh: '焊接区域周围可见金属颗粒飞溅痕迹；焊点表面凹陷或出现火山口形态；接触面出现熔化喷出凹坑。',
      en: 'Metal particle splash marks visible around welding area; weld surface shows depression or crater morphology; contact surface shows melt-expulsion pits.'
    },
    root_causes: {
      zh: ['电流上升率(di/dt)过高', '初始压力不足', '焊头随动响应慢', '材料表面氧化严重（局部高阻引爆）', '电极接触面积不均'],
      en: ['Excessive current rise rate (di/dt)', 'Insufficient initial pressure', 'Slow follow-up response of welding head', 'Severe surface oxidation (localized high-R ignition)', 'Uneven electrode contact area']
    },
    corrective_actions: {
      zh: ['降低di/dt（减缓电流上升）', '增大初始加压力', '改善焊头随动机构', '清洁工件表面', '优化电极端面几何'],
      en: ['Reduce di/dt (slow current rise)', 'Increase initial force', 'Improve head follow-up mechanism', 'Clean workpiece surface', 'Optimize electrode face geometry']
    }
  },
  {
    id: 'FAIL-002',
    nameZh: '虚焊',
    nameEn: 'Weak Weld / Cold Weld',
    icon: '❄️',
    iconBg: 'var(--color-info-light)',
    priority: 'P0',
    physical_mechanism: {
      zh: '界面处未达到足够的热量使金属充分熔融和相互扩散，形成的连接强度远低于母材。可能是固相连接或局部微焊点。',
      en: 'Interface does not reach sufficient heat for adequate metal melting and interdiffusion, resulting in bond strength far below base material. May be solid-state bond or partial micro-welds.'
    },
    waveform_signature: {
      zh: '动态电阻曲线未出现明显下降（熔核未充分形成）；电流峰值偏低；总能量输入不足。',
      en: 'Dynamic resistance curve shows no significant drop (nugget not fully formed); current peak too low; insufficient total energy input.'
    },
    mechanical_signature: {
      zh: '拉力测试低于规格；断口在界面处剥离（界面失效而非母材断裂）；断面无银白色熔融痕迹。',
      en: 'Pull force below specification; fracture separates at interface (interface failure not base material); no silver-white melt marks on fracture surface.'
    },
    root_causes: {
      zh: ['电流或电压不足', '焊接时间过短', '接触电阻过低（导热快、热量散失）', '压力过大（增大接触面积，降低电流密度）', '电极冷却过强'],
      en: ['Insufficient current or voltage', 'Weld time too short', 'Contact resistance too low (fast conduction, heat loss)', 'Excessive force (increases contact area, reduces current density)', 'Over-cooling of electrodes']
    },
    corrective_actions: {
      zh: ['增大电流或延长焊接时间', '优化接触电阻（改善界面清洁度）', '减小电极压力', '减弱电极冷却', '使用多段预热脉冲'],
      en: ['Increase current or extend weld time', 'Optimize contact resistance (improve interface cleanliness)', 'Reduce electrode force', 'Reduce electrode cooling', 'Use multi-stage pre-heat pulse']
    }
  },
  {
    id: 'FAIL-003',
    nameZh: '粘电极',
    nameEn: 'Electrode Sticking',
    icon: '🔒',
    iconBg: 'var(--color-warning-light)',
    priority: 'P0',
    physical_mechanism: {
      zh: '电极与工件界面处发生局部熔融和合金化，导致电极与工件粘连无法分离。高温+压力使电极材料与工件材料互相扩散。',
      en: 'Localized melting and alloying at electrode-workpiece interface causes electrode to bond to workpiece. High temperature + pressure causes interdiffusion of electrode and workpiece materials.'
    },
    waveform_signature: {
      zh: '焊接结束阶段电阻突然升高（局部过热区）；压力信号在开模阶段出现异常波动；声音异常。',
      en: 'Resistance suddenly increases at end of weld (local overheating zone); pressure signal shows abnormal fluctuation during electrode release; abnormal sound.'
    },
    mechanical_signature: {
      zh: '电极离开工件时需要额外拔出力；工件表面出现电极材料转移痕迹；电极端面出现凹坑或粘着物。',
      en: 'Extra extraction force required when electrode leaves workpiece; electrode material transfer marks on workpiece surface; pits or adhering material on electrode face.'
    },
    root_causes: {
      zh: ['电极温度过高（冷却不足）', '电流密度过高（电极面积过小）', '电极材料选择不当（对被焊材料亲和性高）', '保压时间不足（高温下开模）', '电极表面氧化'],
      en: ['Electrode temperature too high (insufficient cooling)', 'Current density too high (electrode area too small)', 'Incorrect electrode material (high affinity to workpiece)', 'Insufficient hold time (opening under high temperature)', 'Electrode surface oxidation']
    },
    corrective_actions: {
      zh: ['增强电极冷却（水冷流量）', '增大电极接触面积', '更换电极材料（CuCrZr+W镶件）', '延长保压时间', '定期研磨电极端面', '减小电流密度'],
      en: ['Enhance electrode cooling (water flow)', 'Increase electrode contact area', 'Change electrode material (CuCrZr+W insert)', 'Extend hold time', 'Regularly dress electrode face', 'Reduce current density']
    }
  },
  {
    id: 'FAIL-004',
    nameZh: '过焊',
    nameEn: 'Over Weld / Burn-Through',
    icon: '🔴',
    iconBg: 'var(--color-danger-light)',
    priority: 'P0',
    physical_mechanism: {
      zh: '输入能量远超形成合格熔核所需，导致过度熔化、材料损失和结构破坏。热量失控导致整个焊接区域熔融贯穿。',
      en: 'Input energy far exceeds what is needed for adequate nugget formation, causing excessive melting, material loss and structural damage. Uncontrolled heat causes complete melt-through of weld zone.'
    },
    waveform_signature: {
      zh: '动态电阻持续下降至极低值（完全熔化）；位移信号显示严重塌陷；电流随时间升高（电阻降低后电流增大正反馈）。',
      en: 'Dynamic resistance continuously drops to extremely low value (complete melting); displacement signal shows severe collapse; current increases over time (positive feedback as resistance drops).'
    },
    mechanical_signature: {
      zh: '工件明显变形或烧穿；焊点周围大面积氧化变色；材料严重缺失；工件可能报废。',
      en: 'Workpiece visibly deformed or burned through; large area oxidation discoloration around weld; severe material loss; workpiece may be scrapped.'
    },
    root_causes: {
      zh: ['焊接电流远高于工艺窗口', '焊接时间过长', '缺少动态电阻监控和截止逻辑', '工件定位偏差导致有效面积减小', '电阻异常高（引发过热）'],
      en: ['Weld current far above process window', 'Weld time too long', 'Lack of dynamic resistance monitoring and cutoff logic', 'Workpiece positioning error reduces effective area', 'Abnormally high resistance causes overheating']
    },
    corrective_actions: {
      zh: ['建立动态电阻截止保护', '严格参数窗口限制', '增加位移报警（塌陷量超限自动截止）', '优化工件定位夹具', '设置最大能量限制'],
      en: ['Establish dynamic resistance cutoff protection', 'Strict parameter window limits', 'Add displacement alarm (auto-cutoff when collapse exceeds limit)', 'Optimize workpiece positioning fixture', 'Set maximum energy limit']
    }
  },
];
