/**
 * 图像处理引擎
 * 负责图像缩放、颜色匹配和抖动处理
 */

import type { ColorPalette, PatternCell, ProcessingConfig } from '../types';
import { findClosestBeadColor } from './colorMatching';

/**
 * 缩放图像到目标尺寸
 * @param image 原始图像
 * @param targetWidth 目标宽度
 * @param targetHeight 目标高度
 * @returns 缩放后的ImageData
 */
export function resizeImage(
  image: HTMLImageElement,
  targetWidth: number,
  targetHeight: number
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('无法创建Canvas上下文');
  }
  
  // 使用最近邻插值以保持像素艺术风格
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
  
  return ctx.getImageData(0, 0, targetWidth, targetHeight);
}

/**
 * 计算保持宽高比的目标尺寸
 * @param originalWidth 原始宽度
 * @param originalHeight 原始高度
 * @param targetWidth 目标宽度（可选）
 * @param targetHeight 目标高度（可选）
 * @returns 计算后的宽度和高度
 */
export function calculateTargetSize(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight };
  }
  
  const aspectRatio = originalWidth / originalHeight;
  
  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio)
    };
  }
  
  if (targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight
    };
  }
  
  // 默认使用50x50
  return { width: 50, height: 50 };
}

/**
 * Floyd-Steinberg抖动算法
 * @param imageData 图像数据
 * @param palette 色卡
 * @returns 抖动后的ImageData
 */
export function applyDithering(
  imageData: ImageData,
  palette: ColorPalette
): ImageData {
  const { width, height, data } = imageData;
  const output = new ImageData(
    new Uint8ClampedArray(data),
    width,
    height
  );
  
  /**
   * 分散误差到相邻像素
   */
  const distributeError = (
    x: number,
    y: number,
    errR: number,
    errG: number,
    errB: number,
    factor: number
  ): void => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    
    const idx = (y * width + x) * 4;
    output.data[idx] = Math.max(0, Math.min(255, output.data[idx] + errR * factor));
    output.data[idx + 1] = Math.max(0, Math.min(255, output.data[idx + 1] + errG * factor));
    output.data[idx + 2] = Math.max(0, Math.min(255, output.data[idx + 2] + errB * factor));
  };
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      
      // 获取当前像素颜色
      const oldR = output.data[idx];
      const oldG = output.data[idx + 1];
      const oldB = output.data[idx + 2];
      
      // 找到最接近的拼豆颜色
      const newColor = findClosestBeadColor([oldR, oldG, oldB], palette);
      const [newR, newG, newB] = newColor.rgb;
      
      // 设置新颜色
      output.data[idx] = newR;
      output.data[idx + 1] = newG;
      output.data[idx + 2] = newB;
      
      // 计算误差
      const errR = oldR - newR;
      const errG = oldG - newG;
      const errB = oldB - newB;
      
      // 按Floyd-Steinberg矩阵分散误差
      distributeError(x + 1, y, errR, errG, errB, 7/16);
      distributeError(x - 1, y + 1, errR, errG, errB, 3/16);
      distributeError(x, y + 1, errR, errG, errB, 5/16);
      distributeError(x + 1, y + 1, errR, errG, errB, 1/16);
    }
  }
  
  return output;
}

/**
 * 处理图像并生成图纸
 * @param image 原始图像
 * @param config 处理配置
 * @param palette 色卡
 * @param onProgress 进度回调
 * @returns 图纸单元格二维数组
 */
export function processImage(
  image: HTMLImageElement,
  config: ProcessingConfig,
  palette: ColorPalette,
  onProgress?: (progress: number) => void
): PatternCell[][] {
  // 计算目标尺寸
  const { width, height } = calculateTargetSize(
    image.width,
    image.height,
    config.targetWidth,
    config.targetHeight
  );
  
  // 缩放图像
  let imageData = resizeImage(image, width, height);
  
  // 应用抖动（如果启用）
  if (config.enableDithering) {
    imageData = applyDithering(imageData, palette);
  }
  
  // 生成图纸
  const cells: PatternCell[][] = [];
  const { data } = imageData;
  
  for (let y = 0; y < height; y++) {
    const row: PatternCell[] = [];
    
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      // 找到最接近的拼豆颜色
      const color = findClosestBeadColor([r, g, b], palette);
      
      row.push({ x, y, color });
    }
    
    cells.push(row);
    
    // 报告进度
    if (onProgress) {
      onProgress(((y + 1) / height) * 100);
    }
  }
  
  return cells;
}
