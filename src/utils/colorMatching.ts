/**
 * 颜色匹配引擎
 * 负责将RGB颜色匹配到最接近的拼豆颜色
 */

import type { BeadColor, ColorPalette } from '../types';
import { rgbToLab, deltaE76 } from './colorConversion';

/**
 * LRU缓存类，用于缓存颜色匹配结果
 */
export class ColorMatchCache {
  private cache = new Map<string, BeadColor>();
  private maxSize: number;
  
  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }
  
  /**
   * 获取缓存的颜色
   */
  get(rgb: [number, number, number]): BeadColor | undefined {
    const key = rgb.join(',');
    const value = this.cache.get(key);
    
    // LRU: 将访问的项移到最后
    if (value) {
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    
    return value;
  }
  
  /**
   * 设置缓存
   */
  set(rgb: [number, number, number], color: BeadColor): void {
    const key = rgb.join(',');
    
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // 如果缓存已满，删除最早的条目
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, color);
  }
  
  /**
   * 清空缓存
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * 获取缓存大小
   */
  size(): number {
    return this.cache.size;
  }
}

// 全局缓存实例
const globalCache = new ColorMatchCache();

/**
 * 查找最接近的拼豆颜色
 * @param rgb RGB颜色值
 * @param palette 色卡
 * @param useCache 是否使用缓存
 * @returns 最接近的拼豆颜色
 */
export function findClosestBeadColor(
  rgb: [number, number, number],
  palette: ColorPalette,
  useCache: boolean = true
): BeadColor {
  // 检查缓存
  if (useCache) {
    const cached = globalCache.get(rgb);
    if (cached) {
      return cached;
    }
  }
  
  // 转换目标颜色到LAB
  const targetLab = rgbToLab(...rgb);
  
  let minDistance = Infinity;
  let closestColor: BeadColor = palette.colors[0];
  
  // 遍历色卡中的所有颜色
  for (const beadColor of palette.colors) {
    const distance = deltaE76(targetLab, beadColor.lab);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestColor = beadColor;
    }
  }
  
  // 缓存结果
  if (useCache) {
    globalCache.set(rgb, closestColor);
  }
  
  return closestColor;
}

/**
 * 清空颜色匹配缓存
 */
export function clearColorMatchCache(): void {
  globalCache.clear();
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats(): { size: number; maxSize: number } {
  return {
    size: globalCache.size(),
    maxSize: 1000
  };
}
