# 拼豆图纸生成器 (Pixel Bead Pattern Generator)

一个基于Web的图像处理应用，可以将任意图像转换为可物理搭建的拼豆图纸，并提供精确的材料清单。

## ✨ 功能特性

- 📤 **图像上传**: 支持拖拽或点击上传 JPG/PNG 图像
- 🎨 **色卡选择**: 支持 Artkal S-Series 等多个拼豆品牌
- 📏 **尺寸控制**: 自定义图纸尺寸（10-200豆子），保持宽高比
- 🎯 **精确匹配**: 使用 CIELAB Delta E 色差算法进行颜色匹配
- 🌈 **颜色抖动**: 可选的 Floyd-Steinberg 抖动算法模拟渐变
- 👁️ **实时预览**: 网格化图纸预览，可显示/隐藏网格线和色号
- 📊 **材料清单**: 自动统计每种色号所需颗数
- 💾 **本地处理**: 所有处理在浏览器端完成，保护隐私

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

## 📖 使用方法

1. **上传图像**: 拖拽或点击上传区域选择图像文件
2. **配置参数**:
   - 选择色卡品牌（如 Artkal S-Series）
   - 设置图纸尺寸（宽度或高度）
   - 可选：启用颜色抖动
3. **生成图纸**: 点击"生成图纸"按钮
4. **查看结果**:
   - 预览网格化的拼豆图纸
   - 查看材料清单和所需颗数
   - 可切换显示网格线和色号

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图像处理**: Canvas API
- **颜色处理**: 自定义 CIELAB 实现
- **状态管理**: React Context + useReducer

## 📐 核心算法

### CIELAB 色差算法

使用 CIELAB 色彩空间和 Delta E CIE76 公式计算颜色差异，确保匹配结果符合人眼视觉感知：

1. RGB → XYZ 转换（含 Gamma 校正）
2. XYZ → LAB 转换（D65 标准光源）
3. Delta E 色差计算

### Floyd-Steinberg 抖动

通过误差扩散算法模拟渐变色和中间色：

```
        X   7/16
3/16  5/16  1/16
```

## 📁 项目结构

```
src/
├── components/       # React 组件
│   ├── ImageUploader.tsx
│   ├── ConfigPanel.tsx
│   ├── PatternViewer.tsx
│   └── MaterialList.tsx
├── contexts/         # 状态管理
│   └── AppContext.tsx
├── hooks/           # 自定义 Hooks
│   ├── useImageUpload.ts
│   └── usePatternGeneration.ts
├── utils/           # 工具函数
│   ├── colorConversion.ts
│   ├── colorMatching.ts
│   ├── imageProcessing.ts
│   └── materialCalculation.ts
├── types/           # TypeScript 类型定义
│   └── index.ts
├── data/            # 色卡数据
│   └── palettes.json
└── App.tsx          # 主应用组件
```

## 🎨 色卡数据

当前支持的色卡：
- **Artkal S-Series (5mm)**: 30种常用颜色

色卡数据包含：
- 色号 (Code)
- 中英文名称
- RGB 值
- LAB 值（预计算）

## 🔧 配置选项

### 图纸尺寸

- 最小: 10×10 豆子
- 最大: 200×200 豆子
- 快捷尺寸: 29×29, 58×58, 50×50

### 颜色抖动

- 关闭: 每个像素匹配到单一颜色
- 启用: 使用抖动算法模拟渐变

## 🌐 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 开发任务

查看 `.kiro/specs/pixel-bead-pattern-generator/tasks.md` 了解详细的开发任务清单。

## 🎯 未来计划

- [ ] 添加更多色卡品牌（Perler, Hama, Artkal C-Series）
- [ ] 支持导出为 PNG/PDF
- [ ] 颜色数量限制功能
- [ ] 图像预处理（亮度、对比度调整）
- [ ] 历史记录功能
- [ ] 3D 预览效果

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**拼豆图纸生成器** - 让创意变为现实 ✨
