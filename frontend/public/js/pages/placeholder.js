/* ============================================================
   PRWP Placeholder Page — for Coming Soon libraries
   ============================================================ */

const PlaceholderPage = {
  render(libKey) {
    const t = i18n.t.bind(i18n);
    const lang = i18n.getLang();
    const lib = PLATFORM_DATA.libraries.find(l => l.key === libKey);
    if (!lib) return '<div class="page-inner"><p>Not found</p></div>';

    const schemas = {
      power: [
        ['Power_ID','string'],['Controller','string'],['Transformer','string'],
        ['Frequency','number (Hz)'],['Max_Current','number (kA)'],['di_dt_Level','enum'],
        ['Dynamic_Response','enum'],['Cooling_Type','enum'],['Communication','text'],['Suitable_Process','FK[]→Template'],
      ],
      head: [
        ['Head_ID','string'],['Structure_Type','enum'],['Guide_Type','enum'],
        ['Actuator','enum'],['Response_Time','number (ms)'],['Compliance','text'],
        ['Max_Force','number (N)'],['Follow_Ability','enum'],['Suitable_Process','FK[]→Template'],
      ],
      electrode: [
        ['Electrode_ID','string'],['Base_Material','FK→Material'],['Insert_Material','FK→Material'],
        ['Geometry','text'],['R_Angle','number'],['Cooling','enum'],
        ['Life_Expectation','number'],['Anti_Stick_Level','enum'],['Suitable_Material','FK[]→Material'],
      ],
      sensor: [
        ['Sensor_ID','string'],['Type','enum'],['Sampling_Rate','number (kHz)'],
        ['Resolution','text'],['Signal_Type','enum'],['Purpose','text'],['Control_Usage','text'],
      ],
      waveform: [
        ['Waveform_ID','string'],['Material_Interface','FK→Interface'],['Current_Curve','data[]'],
        ['Resistance_Curve','data[]'],['Displacement_Curve','data[]'],['Pressure_Curve','data[]'],
        ['Quality_Result','enum'],['Failure_Type','FK→Failure'],
      ],
      doe: [
        ['DOE_ID','string'],['Material_Interface','FK→Interface'],['Variable_Set','text[]'],
        ['Parameter_Window','object'],['Yield','number (%)'],['CPK','number'],['Optimal_Window','object'],
      ],
      production: [
        ['Production_ID','string'],['Golden_Window','object'],['Current_Range','range'],
        ['Pressure_Range','range'],['Displacement_Range','range'],['Resistance_Window','range'],['Alarm_Threshold','object'],
      ],
      emc: [
        ['EMC_ID','string'],['Cable_Layout','text'],['Grounding','text'],
        ['Shielding','text'],['Cooling_Flow','number'],['Temperature_Control','text'],['Known_Risks','text[]'],
      ],
      software: [
        ['Module_ID','string'],['Module_Name','string'],['Version','string'],
        ['Features','text[]'],['API','text'],['Dependencies','string[]'],
      ],
      ai: [
        ['Model_ID','string'],['Input_Parameters','object'],['Output_Parameters','object'],
        ['Training_Data','FK[]'],['Accuracy','number'],['Inference_Logic','text'],
      ],
      cases: [
        ['Project_ID','string'],['Material_Set','FK[]→Material'],['Equipment_Set','text[]'],
        ['Waveforms','FK[]→Waveform'],['DOE','FK→DOE'],['Yield','number (%)'],
        ['Problems','text[]'],['Solutions','text[]'],['Final_Window','FK→Production'],
      ],
    };

    const schema = schemas[libKey] || [];

    return `
      <div class="page-inner animate-in">
        <div class="page-header">
          <div class="page-header-top">
            <div>
              <div style="font-size:var(--text-xs);color:var(--color-text-tertiary);margin-bottom:var(--space-2);font-family:var(--font-mono);">
                ${lib.id} / ${t(lib.enKey).toUpperCase()}
              </div>
              <h1 class="page-title">${t(lib.nameKey)}</h1>
              <p class="page-subtitle">${t(lib.descKey)}</p>
            </div>
            <span class="badge ${lib.status==='soon' ? 'badge-soon' : 'badge-planned'}">
              <span class="badge-dot"></span>
              ${lib.status==='soon' ? t('dash.status.soon') : t('dash.status.planned')}
            </span>
          </div>
        </div>

        <div class="placeholder-page" style="min-height:40vh;">
          <div class="placeholder-icon" style="background:${lib.color}20;">${lib.icon}</div>
          <div class="placeholder-title">${t(lib.nameKey)}</div>
          <div class="placeholder-desc">
            ${lang==='zh'
              ? `该模块正在规划开发中。数据结构已定义，后续将填充数据与交互功能。`
              : `This module is being planned and developed. Data schema is defined — content and interactions will be added in future iterations.`
            }
          </div>

          ${schema.length > 0 ? `
          <div class="placeholder-schema">
            <div class="placeholder-schema-title">${t('common.data_schema')}</div>
            <div class="schema-fields">
              ${schema.map(([name, type]) => `
                <div class="schema-field">
                  <span class="schema-field-name">${name}</span>
                  <span class="schema-field-type">${type}</span>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }
};
