// 拼豆颜色接口
export interface BeadColor {
  brand: string;           // 品牌名称
  series: string;          // 系列名称
  code: string;            // 色号
  nameEn: string;          // 英文名称
  nameCn: string;          // 中文名称
  rgbHex: string;          // RGB十六进制
  rgb: [number, number, number];  // RGB值
  lab: [number, number, number];  // LAB值（预计算）
  standard?: string;       // 标准类型（如"MARD"）
  compatibility?: number;  // 品牌兼容性百分比（如97）
  verified?: boolean;      // 是否经过验证
}

// 色卡接口
export interface ColorPalette {
  id: string;              // 色卡ID
  name: string;            // 色卡名称
  description?: string;    // 描述
  region?: string;         // 市场区域（如"CN"、"International"）
  targetAudience?: string; // 目标用户（如"Beginner"、"Professional"）
  beadSize?: number;       // 豆子尺寸（mm）
  colorCount?: number;     // 颜色数量
  colors: BeadColor[];     // 颜色列表
}

// 处理配置接口
export interface ProcessingConfig {
  targetWidth?: number;    // 目标宽度（豆子数）
  targetHeight?: number;   // 目标高度（豆子数）
  paletteId: string;       // 选择的色卡ID
  enableDithering: boolean; // 是否启用抖动
  maintainAspectRatio: boolean; // 保持宽高比
}

// 图纸单元格接口
export interface PatternCell {
  x: number;               // X坐标
  y: number;               // Y坐标
  color: BeadColor;        // 匹配的拼豆颜色
}

// 材料项接口
export interface MaterialItem {
  color: BeadColor;        // 颜色信息
  count: number;           // 所需颗数
}

// 图纸结果接口
export interface PatternResult {
  width: number;           // 图纸宽度
  height: number;          // 图纸高度
  cells: PatternCell[][];  // 二维网格数据
  materials: MaterialItem[]; // 材料清单
  config: ProcessingConfig; // 生成配置
}

// 错误类型常量
export const ErrorType = {
  INVALID_FILE_FORMAT: 'INVALID_FILE_FORMAT',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  PROCESSING_FAILED: 'PROCESSING_FAILED',
  EXPORT_FAILED: 'EXPORT_FAILED',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

// 应用错误接口
export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
}

// 显示模式类型
export type DisplayMode = 'standard' | 'simplified';

// 应用状态接口
export interface AppState {
  // 图像相关
  originalImage: HTMLImageElement | null;
  imageDataUrl: string | null;
  
  // 配置相关
  config: ProcessingConfig;
  availablePalettes: ColorPalette[];
  
  // 结果相关
  patternResult: PatternResult | null;
  isProcessing: boolean;
  
  // UI状态
  showGrid: boolean;
  showColorCodes: boolean;
  displayMode: DisplayMode;  // 编号显示模式
  
  // 错误状态
  error: AppError | null;
}

// 色卡库数据结构
export interface PaletteLibrary {
  version: string;
  lastUpdated: string;
  palettes: ColorPalette[];
}
