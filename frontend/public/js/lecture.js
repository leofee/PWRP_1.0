function initChapterNavigation() {
  const tocItems = document.querySelectorAll('.toc-item');
  const sections = document.querySelectorAll('.lecture-section');
  tocItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSectionId = item.dataset.section;
      tocItems.forEach(i => i.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      item.classList.add('active');
      const targetSection = document.getElementById(targetSectionId);
      if (targetSection) targetSection.classList.add('active');
    });
  });
}

function initJouleCalculator() {
  const currentRange = document.getElementById('calcCurrentRange');
  const currentNum = document.getElementById('calcCurrentNum');
  const resistanceRange = document.getElementById('calcResistanceRange');
  const resistanceNum = document.getElementById('calcResistanceNum');
  const timeRange = document.getElementById('calcTimeRange');
  const timeNum = document.getElementById('calcTimeNum');
  const resultVal = document.getElementById('calcResultVal');
  const simNugget = document.getElementById('simNugget');

  function bindSync(rangeInput, numInput, onUpdate) {
    rangeInput.addEventListener('input', () => { numInput.value = rangeInput.value; onUpdate(); });
    numInput.addEventListener('input', () => {
      let val = parseFloat(numInput.value);
      const min = parseFloat(rangeInput.min);
      const max = parseFloat(rangeInput.max);
      if (isNaN(val)) val = min;
      if (val < min) val = min;
      if (val > max) val = max;
      rangeInput.value = val;
      onUpdate();
    });
  }

  function calculateHeat() {
    const I = parseFloat(currentNum.value) * 1000;
    const R = parseFloat(resistanceNum.value) / 1000000;
    const t = parseFloat(timeNum.value) / 1000;
    const Q = 0.24 * I * I * R * t;
    resultVal.textContent = Q.toFixed(2) + ' cal';
    if (simNugget) {
      let opacity = Math.min(Q / 45, 1);
      let radius = Math.min(10 + (Q / 45) * 14, 24);
      simNugget.setAttribute('fill', 'url(#nuggetGlow)');
      const glowStart = document.getElementById('glowStart');
      const glowEnd = document.getElementById('glowEnd');
      if (glowStart && glowEnd) {
        glowStart.setAttribute('stop-color', 'rgba(255, 75, 0, ' + opacity + ')');
        glowEnd.setAttribute('stop-color', 'rgba(255, 180, 0, 0)');
      }
      simNugget.setAttribute('r', radius);
    }
  }

  bindSync(currentRange, currentNum, calculateHeat);
  bindSync(resistanceRange, resistanceNum, calculateHeat);
  bindSync(timeRange, timeNum, calculateHeat);
  calculateHeat();
}

const WAVEFORMS = {
  ac: {
    title: '交流式 (AC) 焊接电源',
    pros: '构造简单，普及率最高，操作维护容易，价格低廉。',
    cons: '热效率一般，存在过零点，热影响区（HAZ）大，不适合精密或超细线焊接。',
    cases: '铁制工件、防盗网、钢丝网、厚壁软钢等要求不高的大型部件焊接。',
    path: 'M 30,120 Q 80,30 130,120 T 230,120 Q 280,210 330,120 T 430,120'
  },
  capacitor: {
    title: '静电储能式 (Capacitor Discharge) 焊接电源',
    pros: '瞬间释放超大电流，放电速度极快（微秒级），热量高度集中。最适合高导电率金属。',
    cons: '电流上升极陡峭，完全不可控其电流缓升（斜率），较易引起爆火（金属飞溅）。',
    cases: '铜线、铝箔、镍片与锂电池组连接片等高散热、焊接困难的微型材质。',
    path: 'M 30,120 L 40,30 L 100,118 L 430,120'
  },
  transistor: {
    title: '晶体管式 (Transistor) 焊接电源',
    pros: '可达0.01ms精度调节。电流陡升且平稳无波纹，低加压力下也能零飞溅，是超精密的代表。',
    cons: '大电流输出能力相对有限，电源制造成本及设备价格非常高昂。',
    cases: '漆包线直接焊接（热熔焊）、传感器极细线、微型端子、晶振外壳及FPC箔片。',
    path: 'M 30,120 L 40,60 L 150,60 L 152,120 L 430,120'
  },
  highfreq: {
    title: '高频逆变式 (High-Frequency Inverter) 焊接电源',
    pros: '2KHz-5KHz闭环回馈控制。电流纹波极小且恒定，焊接时间控制极好，变压器体积小，适合自动化产线集成。',
    cons: '高频变压器与控制箱成本较高。对高阻电缆要求较高。',
    cases: '电机转子挂钩焊接、继电器片、精密汽车电子线束焊接及精密五金冲压件。',
    path: 'M 30,120 L 60,50 Q 70,48 80,52 T 100,50 T 120,52 T 140,50 T 160,52 T 180,50 T 200,52 T 220,50 T 240,52 L 250,120 L 430,120'
  },
  hybrid: {
    title: '混合式 (Hybrid / Dual Pulse) 焊接电源',
    pros: '结合快速起动和双向极性切换，能有效清除表面氧化物，快速建立对称热平衡，焊接点十分美观。',
    cons: '系统电路最复杂，参数设置参数对现场技术员水平要求较高。',
    cases: '18650/26650动力电池组自动化焊接、镍氢电池、要求两侧焊点完全一致的异种金属。',
    path: 'M 30,120 L 50,70 L 90,70 L 95,120 L 120,120 L 140,170 L 180,170 L 185,120 L 430,120'
  }
};

function initWaveformViewer() {
  const tabs = document.querySelectorAll('.waveform-tab');
  const pathEl = document.getElementById('wavePath');
  const titleEl = document.getElementById('waveTitle');
  const prosEl = document.getElementById('wavePros');
  const consEl = document.getElementById('waveCons');
  const casesEl = document.getElementById('waveCases');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.wave;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const data = WAVEFORMS[type];
      if (data) {
        titleEl.textContent = data.title;
        prosEl.textContent = data.pros;
        consEl.textContent = data.cons;
        casesEl.textContent = data.cases;
        pathEl.setAttribute('d', data.path);
        pathEl.style.strokeDasharray = '1000';
        pathEl.style.strokeDashoffset = '1000';
        pathEl.getBoundingClientRect();
        pathEl.style.transition = 'stroke-dashoffset 0.6s linear, d 0.3s ease';
        pathEl.style.strokeDashoffset = '0';
      }
    });
  });
}

const DIAGNOSTICS = {
  splatter: {
    name: '爆火（金属飞溅）',
    power: '焊接电流骤升过高，或使用了不可调斜率的电源（如低级电容储能电源）。应调整起升斜率（Up-slope）或降低电流幅值。',
    head: '加压力过小或机头的追从性能差。在极高的电热熔化瞬间，机头弹簧不能迅速跟进加压维持工件接触，导致接触电阻剧增而爆火。建议选用弹簧触发的快追从性机头。',
    electrode: '电极表面被烧蚀或粘附氧化层，导致电极与工件间的接触电阻（R2/R4）过大。必须对电极端面实施定期的状态管理（打磨、更换）。'
  },
  unmelted: {
    name: '脱焊（未熔合/焊核太小）',
    power: '输入能量偏低。焊接电流过小，通电时间过短，导致总体焦耳热Q不足。可适当增加通电时间或提升焊接峰值电流。',
    head: '焊接机头设定的压力偏大，使得工件间接触电阻（R3）剧烈下降，从而使接触电阻产热比例失调。应合理降低加压力。',
    electrode: '电极端面磨损扩大，造成电流密度（I/S）严重下降。或电极材质导热过快带走了过多热量。请管理前端截面积，必要时将上电极换用导热差的钨、钼材料以聚集热量。'
  },
  sticking: {
    name: '电极与工件粘连（粘电极）',
    power: '通电结束时没有锻造冷却时间，或者电流衰减过快。可加入下坡时间（Down-slope）让电极维持压力直至接头温度下降。',
    head: '加压力在通电期间衰减。应检查夹具刚度及机头主轴结构，建议选用高精密、结构刚性优良的焊接机头，避免轴向偏斜。',
    electrode: '电极材料的软化温度过低（如普通纯铜），在焊接热量堆积下自身与工件共晶熔化。推荐使用更耐高温软化的铬铜（CuCr）或弥散铜（CuAl2O3），并在电极内部增加水冷。'
  },
  irregular: {
    name: '焊点强度不一致（不稳定）',
    power: '电源精密反馈不足。普通交流电源容易受到电网电压波动的直接干扰。应升级为具有恒电流、恒功率实时闭环反馈控制的晶体管式或高频逆变式电源。',
    head: '每次焊接时气压或机械机构触发延迟，导致实际通电时的瞬时压力不一致。建议使用精密压力传感器或弹簧定压力触发开关。',
    electrode: '电极发热累积。随着连续焊接，电极自身温升越来越高，导致电极与工件的接触面膨胀、电阻变动。必须改善冷却条件（如加入空气冷却或强制水冷循环）。'
  }
};

function initDiagnostics() {
  const options = document.querySelectorAll('.trouble-option');
  const powerEl = document.getElementById('solPower');
  const headEl = document.getElementById('solHead');
  const electrodeEl = document.getElementById('solElectrode');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const issue = opt.dataset.issue;
      options.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const sol = DIAGNOSTICS[issue];
      if (sol) {
        powerEl.textContent = sol.power;
        headEl.textContent = sol.head;
        electrodeEl.textContent = sol.electrode;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initChapterNavigation();
  initJouleCalculator();
  initWaveformViewer();
  initDiagnostics();
});