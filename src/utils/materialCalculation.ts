/**
 * 材料统计引擎
 * 负责统计图纸所需的拼豆材料
 */

import type { PatternCell, MaterialItem, BeadColor } from '../types';

/**
 * 计算材料清单
 * @param pattern 图纸单元格二维数组
 * @returns 材料清单数组
 */
export function calculateMaterials(pattern: PatternCell[][]): MaterialItem[] {
  const colorCount = new Map<string, { color: BeadColor; count: number }>();
  
  // 统计每种颜色的使用次数
  for (const row of pattern) {
    for (const cell of row) {
      const key = cell.color.code;
      
      if (colorCount.has(key)) {
        colorCount.get(key)!.count++;
      } else {
        colorCount.set(key, { color: cell.color, count: 1 });
      }
    }
  }
  
  // 转换为数组并按数量降序排序
  return Array.from(colorCount.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * 计算材料总数
 * @param materials 材料清单
 * @returns 总数量
 */
export function calculateTotalBeads(materials: MaterialItem[]): number {
  return materials.reduce((total, item) => total + item.count, 0);
}

/**
 * 按色号排序材料清单
 * @param materials 材料清单
 * @returns 排序后的材料清单
 */
export function sortMaterialsByCode(materials: MaterialItem[]): MaterialItem[] {
  return [...materials].sort((a, b) => 
    a.color.code.localeCompare(b.color.code)
  );
}

/**
 * 按数量排序材料清单
 * @param materials 材料清单
 * @returns 排序后的材料清单
 */
export function sortMaterialsByCount(materials: MaterialItem[]): MaterialItem[] {
  return [...materials].sort((a, b) => b.count - a.count);
}

/**
 * 获取使用的颜色种类数
 * @param materials 材料清单
 * @returns 颜色种类数
 */
export function getColorVarietyCount(materials: MaterialItem[]): number {
  return materials.length;
}
