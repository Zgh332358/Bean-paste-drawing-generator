/**
 * 颜色格式化工具函数
 * 用于统一处理不同色卡的显示格式
 */

import type { BeadColor, DisplayMode } from '../types';

/**
 * 格式化颜色代码显示
 * @param color 拼豆颜色对象
 * @param mode 显示模式
 * @returns 格式化后的色号字符串
 */
export function formatColorCode(color: BeadColor, mode: DisplayMode = 'standard'): string {
  if (color.standard === 'MARD') {
    if (mode === 'simplified') {
      return color.code; // 仅显示"221"
    }
    return `MARD ${color.code}`; // 显示"MARD 221"
  }
  
  // 其他品牌直接显示原始色号
  return color.code; // 如"S01"
}

/**
 * 格式化完整的颜色信息（用于材料清单）
 * @param color 拼豆颜色对象
 * @param count 数量
 * @param mode 显示模式
 * @returns 格式化后的字符串
 */
export function formatMaterialItem(
  color: BeadColor,
  count: number,
  mode: DisplayMode = 'standard'
): string {
  const code = formatColorCode(color, mode);
  return `${code} (${color.nameCn}): ${count}颗`;
}

/**
 * 格式化颜色提示信息（用于悬停提示）
 * @param color 拼豆颜色对象
 * @param mode 显示模式
 * @returns 格式化后的字符串
 */
export function formatColorTooltip(color: BeadColor, mode: DisplayMode = 'standard'): string {
  const code = formatColorCode(color, mode);
  
  if (color.standard === 'MARD') {
    return `${code} (${color.nameCn})`;
  }
  
  // 国际品牌显示中英文名称
  return `${code} (${color.nameEn}/${color.nameCn})`;
}

/**
 * 获取颜色的简短显示名称
 * @param color 拼豆颜色对象
 * @returns 颜色名称
 */
export function getColorName(color: BeadColor): string {
  return color.nameCn || color.nameEn;
}

/**
 * 检查是否为MARD色卡
 * @param color 拼豆颜色对象
 * @returns 是否为MARD标准
 */
export function isMARDColor(color: BeadColor): boolean {
  return color.standard === 'MARD';
}

/**
 * 获取颜色的兼容性信息
 * @param color 拼豆颜色对象
 * @returns 兼容性百分比或null
 */
export function getCompatibility(color: BeadColor): number | null {
  return color.compatibility || null;
}

/**
 * 格式化RGB值为十六进制
 * @param rgb RGB数组
 * @returns 十六进制颜色字符串
 */
export function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

/**
 * 格式化LAB值为字符串
 * @param lab LAB数组
 * @returns LAB值字符串
 */
export function formatLAB(lab: [number, number, number]): string {
  return `L:${lab[0].toFixed(1)} a:${lab[1].toFixed(1)} b:${lab[2].toFixed(1)}`;
}
