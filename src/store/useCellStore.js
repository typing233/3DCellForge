import { create } from 'zustand'

export const ORGANELLE_DATA = {
  nucleus: {
    name: '细胞核',
    nameEn: 'Nucleus',
    description: '细胞的控制中心，包含遗传物质DNA，调控基因表达和细胞分裂。',
    function: '储存和复制DNA，转录RNA，调控细胞活动',
    color: '#c62860',
    keyData: [
      { label: '直径', value: '5-10 μm' },
      { label: '基因组大小', value: '~6.4 × 10⁹ bp' },
      { label: '核孔数量', value: '~3000-4000' },
    ],
  },
  mitochondria: {
    name: '线粒体',
    nameEn: 'Mitochondria',
    description: '细胞的"能量工厂"，通过氧化磷酸化产生ATP，为细胞提供能量。',
    function: '有氧呼吸，产生ATP，参与细胞凋亡调控',
    color: '#e67e22',
    keyData: [
      { label: '长度', value: '1-10 μm' },
      { label: 'ATP产量', value: '~30-32 ATP/葡萄糖' },
      { label: '自有DNA', value: '16,569 bp（环形）' },
    ],
  },
  er: {
    name: '内质网',
    nameEn: 'Endoplasmic Reticulum',
    description: '由膜组成的管状网络，分为粗面内质网（附有核糖体）和滑面内质网，参与蛋白质合成和脂质代谢。',
    function: '蛋白质折叠与修饰，脂质合成，钙离子储存',
    color: '#5c6bc0',
    keyData: [
      { label: '膜面积', value: '占细胞总膜50%以上' },
      { label: '类型', value: '粗面ER / 滑面ER' },
      { label: '核糖体密度', value: '~13个/μm²（粗面）' },
    ],
  },
  golgi: {
    name: '高尔基体',
    nameEn: 'Golgi Apparatus',
    description: '由扁平膜囊堆叠而成，负责蛋白质的加工、分拣和运输，是细胞的"邮局"。',
    function: '蛋白质糖基化修饰，分拣，囊泡运输',
    color: '#26a69a',
    keyData: [
      { label: '膜囊数', value: '4-8层' },
      { label: '极性', value: 'cis面（接收）→ trans面（发送）' },
      { label: '囊泡直径', value: '50-100 nm' },
    ],
  },
  ribosome: {
    name: '核糖体',
    nameEn: 'Ribosome',
    description: '由rRNA和蛋白质组成的分子机器，是蛋白质合成的场所。',
    function: '翻译mRNA，合成蛋白质多肽链',
    color: '#66bb6a',
    keyData: [
      { label: '直径', value: '~25 nm' },
      { label: '沉降系数', value: '80S（真核）' },
      { label: '翻译速率', value: '~5-6 氨基酸/秒' },
    ],
  },
  lysosome: {
    name: '溶酶体',
    nameEn: 'Lysosome',
    description: '含有多种水解酶的囊泡，负责降解细胞内外的大分子物质，是细胞的"消化系统"。',
    function: '细胞内消化，自噬，病原体降解',
    color: '#ab47bc',
    keyData: [
      { label: '直径', value: '0.1-1.2 μm' },
      { label: 'pH', value: '4.5-5.0' },
      { label: '水解酶种类', value: '~60种以上' },
    ],
  },
  centrosome: {
    name: '中心体',
    nameEn: 'Centrosome',
    description: '由两个相互垂直的中心粒组成，是微管组织中心（MTOC），在细胞分裂时形成纺锤体。',
    function: '组织微管，形成纺锤体，参与细胞分裂',
    color: '#78909c',
    keyData: [
      { label: '中心粒长度', value: '~400 nm' },
      { label: '微管三联体', value: '9组（9+0结构）' },
      { label: '复制时期', value: 'S期' },
    ],
  },
}

const useCellStore = create((set) => ({
  selectedOrganelleId: null,
  panelOpen: true,
  labelsVisible: true,
  sceneReady: false,

  selectOrganelle: (id) => set({ selectedOrganelleId: id, panelOpen: true }),
  clearSelection: () => set({ selectedOrganelleId: null }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
  closePanel: () => set({ panelOpen: false }),
  toggleLabels: () => set((s) => ({ labelsVisible: !s.labelsVisible })),
  setSceneReady: () => set({ sceneReady: true }),
}))

export default useCellStore
