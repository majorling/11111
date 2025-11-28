import { create } from 'zustand';

/**
 * 供应商管理全局 Store
 * 包含：用户角色、供应商列表、商品主数据、RFX寻源数据、合同数据、订单与绩效、审批日志
 */
export const useSupplierStore = create((set) => ({
  // --- State ---
  currentUserRole: '采购经理',
  
  roles: [
    '采购经理', '供应商开发专员', '品质工程师', 
    '财务专员', '供应链总监', '系统管理员'
  ],

  suppliers: [
    { 
      id: 1001, 
      name: '上海XX服饰有限公司', 
      contact: '张三', 
      status: '潜在供应商', 
      vettingStatus: '待评估',
      category: '服装',
      level: 'C'
    },
    { 
      id: 1002, 
      name: '深圳XX电子科技', 
      contact: '李四', 
      status: '合格供应商', 
      vettingStatus: '已通过',
      category: '3C数码',
      level: 'A'
    },
    { 
      id: 1003, 
      name: '苏州XX精密机械', 
      contact: '王五', 
      status: '退出中', 
      vettingStatus: '已通过',
      category: '工业品',
      level: 'D'
    },
    {
      id: 1004,
      name: '广州YY包装制品',
      contact: '赵六',
      status: '潜在供应商',
      vettingStatus: '待评估',
      category: '包材',
      level: 'B'
    },
    {
      id: 1005,
      name: '北京ZZ科技',
      contact: '孙七',
      status: '潜在供应商',
      vettingStatus: '待评估',
      category: '3C数码',
      level: 'B'
    },
    // 补充更多供应商以丰富图表
    { id: 1006, name: '义乌市悦宾服饰', contact: '周八', status: '合格供应商', vettingStatus: '已通过', category: '服装', level: 'A' },
    { id: 1007, name: '浙江雪芙蓉化妆品', contact: '吴九', status: '合格供应商', vettingStatus: '已通过', category: '美妆', level: 'A' },
    { id: 1008, name: '广州群隆玩具', contact: '郑十', status: '合格供应商', vettingStatus: '已通过', category: '玩具', level: 'A' },
    { id: 1009, name: '浙江斯琳针纺', contact: '王二', status: '合格供应商', vettingStatus: '已通过', category: '服装', level: 'A' },
    { id: 1010, name: '义乌市简艾饰品', contact: '麻子', status: '合格供应商', vettingStatus: '已通过', category: '配饰', level: 'A' },
    { id: 1011, name: '艾可思品牌管理', contact: '刘一', status: '合格供应商', vettingStatus: '已通过', category: '家居', level: 'B' },
    { id: 1012, name: '上海百臻化妆品', contact: '陈二', status: '合格供应商', vettingStatus: '已通过', category: '美妆', level: 'C' },
  ],

  // 商品主数据（原物料）
  products: [
    { 
      id: 'SKU-2024-001', 
      name: '纯棉T恤', 
      spec: '160/84A', 
      category: '服装', 
      brand: 'BasicLine',
      status: '启用',
      moq: 500,
      supplierRelations: [
        { supplierId: 1001, price: 25.5, leadTime: 15, priceValidUntil: '2024-12-31' },
        { supplierId: 1002, price: 26.0, leadTime: 12, priceValidUntil: '2024-12-31' }
      ]
    },
    { 
      id: 'SKU-2024-002', 
      name: '无线蓝牙耳机', 
      spec: 'TWS Pro', 
      category: '3C数码', 
      brand: 'TechSound',
      status: '启用',
      moq: 1000,
      supplierRelations: [
        { supplierId: 1002, price: 120.0, leadTime: 20, priceValidUntil: '2025-01-31' }
      ]
    },
    { 
      id: 'SKU-2024-003', 
      name: '智能手表', 
      spec: 'Sport Edition', 
      category: '3C数码', 
      brand: 'SmartLife',
      status: '禁用',
      moq: 200,
      supplierRelations: []
    },
  ],

  rfxs: [
    { 
        id: 'RFX-2024-001', 
        productId: 'SKU-2024-001', 
        quantity: 10000, 
        status: '已发布', 
        invitedSuppliers: [1001, 1002], 
        quotes: [
            { supplierId: 1002, price: 25.2, tco: 252500, deliveryDays: 15 }
        ] 
    }
  ],

  contracts: [
    { id: 'CT-2024-001', rfxId: 'RFX-2024-001', supplierId: 1002, productId: 'SKU-2024-001', status: '已生效', amount: 252500, startDate: '2024-01-01', endDate: '2024-12-31' }
  ],

  purchaseOrders: [
    { id: 'PO-2024-001', contractId: 'CT-2024-001', supplierId: 1002, status: '在途', syncTime: '2024-01-20 10:30:00', source: 'SAP' },
    { id: 'PO-2024-002', contractId: 'CT-2024-001', supplierId: 1002, status: '已完成', syncTime: '2024-01-19 14:20:00', source: 'SAP' }
  ],

  // 价格库 - 添加模拟数据
  priceLibrary: [
    {
      id: 'PRICE-001',
      productId: 'SKU-2024-001',
      supplierId: 1001,
      price: 25.50,
      moq: 500,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      source: 'RFX',
      rfxId: 'RFX-2024-001'
    },
    {
      id: 'PRICE-002',
      productId: 'SKU-2024-001',
      supplierId: 1002,
      price: 26.00,
      moq: 500,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      source: 'RFX',
      rfxId: 'RFX-2024-001'
    },
    {
      id: 'PRICE-003',
      productId: 'SKU-2024-002',
      supplierId: 1002,
      price: 120.00,
      moq: 1000,
      validFrom: '2024-02-01',
      validUntil: '2025-01-31',
      source: '手工录入',
      rfxId: null
    },
    {
      id: 'PRICE-004',
      productId: 'SKU-2024-001',
      supplierId: 1006,
      price: 24.80,
      moq: 1000,
      validFrom: '2024-03-01',
      validUntil: '2024-11-30',
      source: '系统导入',
      rfxId: null
    },
    {
      id: 'PRICE-005',
      productId: 'SKU-2024-002',
      supplierId: 1005,
      price: 118.50,
      moq: 800,
      validFrom: '2024-01-15',
      validUntil: '2024-07-15',
      source: 'RFX',
      rfxId: 'RFX-2024-002'
    },
    // 添加一些过期价格用于演示
    {
      id: 'PRICE-006',
      productId: 'SKU-2024-001',
      supplierId: 1001,
      price: 27.00,
      moq: 500,
      validFrom: '2023-06-01',
      validUntil: '2023-12-31',
      source: '手工录入',
      rfxId: null
    }
  ],

  auditLogs: [],

  // --- 新增：绩效考核记录 (Performance Reviews) ---
  // 对应 BI 截图的大宽表数据
  performanceReviews: [
    // 生成模拟数据
    ...Array.from({ length: 50 }).map((_, index) => {
      const supplierIds = [1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1011, 1012];
      const supplierId = supplierIds[index % supplierIds.length];
      const periods = ['2025-05', '2025-06', '2025-07'];
      const period = periods[index % 3];
      
      // 随机分数生成器
      const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
      const randFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
      
      const qualityScore = rand(35, 45); // 满分 45
      const deliveryScore = rand(15, 25); // 满分 25
      const costScore = rand(10, 15); // 满分 15
      const serviceScore = rand(10, 15); // 满分 15
      const totalScore = qualityScore + deliveryScore + costScore + serviceScore;
      
      let level = 'D';
      if (totalScore >= 90) level = 'A';
      else if (totalScore >= 80) level = 'B';
      else if (totalScore >= 70) level = 'C';

      return {
        id: `PR-${2024000 + index}`,
        period: period,
        supplierId: supplierId,
        source: '中国出口',
        projectCategory: ['服饰', '3C数码', '美妆', '玩具', '家居'][index % 5],
        level: level,
        totalScore: totalScore,
        metrics: {
          quality: {
            score: qualityScore,
            acceptanceRate: randFloat(95, 100),
            defectRate: randFloat(0, 2),
            batchQuality: 25
          },
          delivery: {
            score: deliveryScore,
            onTimeRate: randFloat(90, 100),
            leadTimeGap: rand(0, 5)
          },
          cost: {
            score: costScore,
            reductionRate: randFloat(0, 5),
            grossMargin: randFloat(10, 30)
          },
          service: {
            score: serviceScore,
            rebateScore: 5,
            paymentTermScore: 5
          }
        }
      };
    })
  ],

  // --- Actions ---
  
  setCurrentUserRole: (newRole) => set({ currentUserRole: newRole }),

  updateSupplierStatus: (supplierId, newStatus) => set((state) => ({
    suppliers: state.suppliers.map((s) => 
      s.id === supplierId ? { ...s, status: newStatus } : s
    )
  })),

  updateVettingStatus: (supplierId, newStatus) => set((state) => ({
    suppliers: state.suppliers.map((s) => 
      s.id == supplierId ? { ...s, vettingStatus: newStatus } : s
    )
  })),

  updateProductStatus: (productId, newStatus) => set((state) => ({
    products: state.products.map(p => 
      p.id === productId ? { ...p, status: newStatus } : p
    )
  })),

  updateProductSuppliers: (productId, supplierRelation) => set((state) => ({
    products: state.products.map(p => 
      p.id === productId 
        ? { ...p, supplierRelations: [...p.supplierRelations, supplierRelation] }
        : p
    )
  })),

  addRfx: (newRfx) => set((state) => ({
    rfxs: [...state.rfxs, newRfx]
  })),

  updateRfxSuppliers: (rfxId, supplierId) => set((state) => ({
    rfxs: state.rfxs.map(r => 
      r.id === rfxId 
        ? { ...r, invitedSuppliers: [...new Set([...r.invitedSuppliers, supplierId])] }
        : r
    )
  })),

  updateContractStatus: (contractId, newStatus) => set((state) => ({
    contracts: state.contracts.map(c =>
      c.id === contractId ? { ...c, status: newStatus } : c
    )
  })),

  addSupplier: (newSupplier) => set((state) => ({
    suppliers: [...state.suppliers, {
      ...newSupplier,
      id: newSupplier.id || Date.now(),
      status: '潜在供应商',
      vettingStatus: '待评估',
      category: '其他',
      level: 'N/A'
    }]
  })),

  addQuote: (rfxId, quote) => set((state) => {
    const updatedState = {
      rfxs: state.rfxs.map(r => 
        r.id === rfxId 
          ? { ...r, quotes: [...r.quotes, quote] }
          : r
      )
    };
    // 简化的价格库更新逻辑
    return updatedState;
  }),

  addPriceRecord: (priceRecord) => set((state) => ({
    priceLibrary: [...state.priceLibrary, { ...priceRecord, id: `PRICE-${Date.now()}` }]
  })),

  addContract: (newContract) => set((state) => ({
    contracts: [...state.contracts, newContract]
  })),

  addPurchaseOrder: (newPO) => set((state) => ({
    purchaseOrders: [...state.purchaseOrders, newPO]
  })),

  addAuditLog: (log) => set((state) => ({
    auditLogs: [
      ...state.auditLogs, 
      { ...log, timestamp: log.timestamp || new Date().toLocaleString('zh-CN') }
    ]
  })),
}));

