# MARD色卡集成指南

## 概述

本文档说明如何将MARD标准色卡数据集成到拼豆图纸生成器中。

## MARD标准简介

**MARD** 是中国拼豆市场的品质标准体系：

- **编号格式**：三位数字编号（001-221+）
- **品牌兼容性**：97%（48个基础色号中46-47个可跨品牌通用）
- **技术规范**：
  - ✅ 纯色一体成型工艺
  - ✅ 食品级ABS材质（符合GB 6675-2014）
  - ✅ 色彩稳定性：批次间色差控制在ΔE≤2
  - ✅ 熔点控制：105℃±3℃

## 数据文件结构

### 生成的数据文件

**位置**：`src/data/mard-palettes.json`

**内容**：
- MARD 24色标准套装
- MARD 48色标准套装

### 数据结构

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-18",
  "description": "MARD标准色卡数据 - 基于中国拼豆市场调研",
  "palettes": [
    {
      "id": "mard-24-standard",
      "name": "MARD 24色标准套装",
      "description": "中国市场通用标准，品牌兼容性97%，适合Beginner用户",
      "region": "CN",
      "targetAudience": "Beginner",
      "beadSize": 5,
      "colorCount": 24,
      "colors": [
        {
          "brand": "MARD",
          "series": "Standard",
          "code": "221",
          "nameEn": "Dark Green",
          "nameCn": "墨绿色",
          "rgbHex": "#005941",
          "rgb": [0, 89, 65],
          "lab": [32.5, -28.4, 12.1],
          "standard": "MARD",
          "compatibility": 97,
          "verified": true
        }
      ]
    }
  ]
}
```

## 集成步骤

### 步骤1：更新类型定义

在 `src/types/index.ts` 中更新接口：

```typescript
export interface BeadColor {
  brand: string;
  series: string;
  code: string;
  nameEn: string;
  nameCn: string;
  rgbHex: string;
  rgb: [number, number, number];
  lab: [number, number, number];
  // 新增字段
  standard?: string;       // 标准类型（如"MARD"）
  compatibility?: number;  // 品牌兼容性百分比
  verified?: boolean;      // 是否经过验证
}

export interface ColorPalette {
  id: string;
  name: string;
  description?: string;
  region?: string;         // 市场区域（"CN"/"International"）
  targetAudience?: string; // 目标用户（"Beginner"/"Professional"）
  beadSize?: number;
  colorCount: number;
  colors: BeadColor[];
}
```

### 步骤2：合并色卡数据

**选项A：手动合并**

将 `mard-palettes.json` 的内容合并到 `palettes.json`：

```json
{
  "version": "1.1",
  "lastUpdated": "2025-11-18",
  "palettes": [
    // MARD色卡（从mard-palettes.json复制）
    {
      "id": "mard-24-standard",
      "name": "MARD 24色标准套装",
      ...
    },
    {
      "id": "mard-48-standard",
      "name": "MARD 48色标准套装",
      ...
    },
    // 现有的Artkal色卡
    {
      "id": "artkal-s-series",
      "name": "Artkal 5mm (S-Series)",
      ...
    }
  ]
}
```

**选项B：创建集成脚本**

创建 `scripts/integrate-mard-palettes.js`：

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取现有色卡
const palettesPath = path.join(__dirname, '../src/data/palettes.json');
const palettes = JSON.parse(fs.readFileSync(palettesPath, 'utf-8'));

// 读取MARD色卡
const mardPath = path.join(__dirname, '../src/data/mard-palettes.json');
const mardData = JSON.parse(fs.readFileSync(mardPath, 'utf-8'));

// 合并（MARD色卡放在前面）
palettes.palettes = [
  ...mardData.palettes,
  ...palettes.palettes
];

palettes.version = "1.1";
palettes.lastUpdated = new Date().toISOString().split('T')[0];

// 写回
fs.writeFileSync(palettesPath, JSON.stringify(palettes, null, 2), 'utf-8');

console.log('✅ MARD色卡已集成到palettes.json');
```

### 步骤3：更新色卡选择器UI

在 `src/components/ConfigPanel.tsx` 中实现分组显示：

```typescript
// 按区域分组色卡
const groupedPalettes = {
  cn: palettes.filter(p => p.region === 'CN'),
  international: palettes.filter(p => !p.region || p.region === 'International')
};

// 渲染分组选择器
<select value={selectedPaletteId} onChange={handleChange}>
  <optgroup label="中国市场 - MARD标准 ⭐推荐">
    {groupedPalettes.cn.map(palette => (
      <option key={palette.id} value={palette.id}>
        {palette.name} ({palette.colorCount}色)
      </option>
    ))}
  </optgroup>
  <optgroup label="国际标准">
    {groupedPalettes.international.map(palette => (
      <option key={palette.id} value={palette.id}>
        {palette.name}
      </option>
    ))}
  </optgroup>
</select>

// 显示色卡描述和兼容性
{selectedPalette && (
  <div className="palette-info">
    <p>{selectedPalette.description}</p>
    {selectedPalette.compatibility && (
      <p className="compatibility">
        品牌兼容性: {selectedPalette.compatibility}%
      </p>
    )}
  </div>
)}
```

### 步骤4：更新显示逻辑

**材料清单显示**：

```typescript
// src/components/MaterialList.tsx
function formatColorCode(color: BeadColor): string {
  if (color.standard === 'MARD') {
    return `MARD ${color.code}`;
  }
  return color.code;
}

// 渲染
<div className="material-item">
  <span className="color-code">{formatColorCode(color)}</span>
  <span className="color-name">({color.nameCn})</span>
  <span className="count">: {count}颗</span>
</div>
```

**图纸色号显示**：

```typescript
// src/components/PatternViewer.tsx
function getDisplayCode(color: BeadColor, mode: 'standard' | 'simplified'): string {
  if (mode === 'simplified') {
    return color.code; // 仅显示"221"
  }
  
  if (color.standard === 'MARD') {
    return `MARD ${color.code}`; // 显示"MARD 221"
  }
  
  return color.code; // Artkal等显示"S01"
}
```

### 步骤5：添加显示模式切换

在配置面板添加显示模式选项：

```typescript
const [displayMode, setDisplayMode] = useState<'standard' | 'simplified'>('standard');

<div className="display-mode-selector">
  <label>编号显示模式：</label>
  <select value={displayMode} onChange={(e) => setDisplayMode(e.target.value)}>
    <option value="standard">标准模式 (MARD 221)</option>
    <option value="simplified">简化模式 (221)</option>
  </select>
</div>
```

## 验证清单

集成完成后，请验证以下功能：

- [ ] MARD色卡出现在色卡选择器中
- [ ] 色卡按"中国市场"和"国际标准"分组
- [ ] 显示色卡描述和兼容性信息
- [ ] 选择MARD色卡后能正常生成图纸
- [ ] 材料清单正确显示MARD编号格式
- [ ] 图纸上正确显示MARD色号
- [ ] 颜色匹配算法正常工作
- [ ] LAB值计算准确（色差合理）
- [ ] 导出功能包含MARD色号信息

## 测试用例

### 测试1：基本功能

1. 选择"MARD 24色标准套装"
2. 上传测试图片
3. 设置尺寸为29x29
4. 生成图纸
5. 验证：
   - 图纸显示MARD色号（如"221"）
   - 材料清单格式正确
   - 颜色匹配合理

### 测试2：显示模式切换

1. 选择"MARD 48色标准套装"
2. 生成图纸
3. 切换显示模式（标准↔简化）
4. 验证：
   - 标准模式显示"MARD 221"
   - 简化模式显示"221"
   - 材料清单同步更新

### 测试3：色卡切换

1. 先选择"MARD 48色"生成图纸
2. 切换到"Artkal S-Series"
3. 重新生成
4. 验证：
   - 色号格式正确切换
   - 颜色匹配重新计算
   - 材料清单更新

## 常见问题

### Q1：MARD色卡和Artkal色卡的颜色差异大吗？

A：由于MARD标准基于市场通用配置，与Artkal等品牌存在一定色差。建议：
- 对于精确还原，使用实际拥有的品牌色卡
- 对于新手用户，MARD色卡提供了良好的通用性

### Q2：如何添加更多MARD色号（72色、96色等）？

A：编辑 `scripts/generate-mard-palette.js`，在 `mardColors` 对象中添加对应配置，然后重新运行脚本。

### Q3：品牌兼容性97%是什么意思？

A：表示48个基础色号中，有46-47个颜色在不同品牌间可以通用（色差在可接受范围内）。

## 下一步

- [ ] 添加MARD 72色配置
- [ ] 添加MARD 96色配置（含特效色）
- [ ] 实物验证RGB/LAB值
- [ ] 收集用户反馈优化色卡
- [ ] 添加色号对照表功能

## 参考资料

- [MARD拼豆完整颜色对应报告](../Folwith调研/MARD拼豆最终完整颜色对应报告.md)
- [Folwith调研深度分析](./folwith-research-analysis.md)
- [中国市场调研报告](./china-market-research.md)
