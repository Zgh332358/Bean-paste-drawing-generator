/**
 * 颜色转换算法测试
 */

import { rgbToLab, deltaE76 } from '../colorConversion';

describe('颜色转换算法', () => {
  test('白色 RGB 转 LAB', () => {
    const [L, a, b] = rgbToLab(255, 255, 255);
    expect(L).toBeCloseTo(100, 0);
    expect(a).toBeCloseTo(0, 0);
    expect(b).toBeCloseTo(0, 0);
  });
  
  test('黑色 RGB 转 LAB', () => {
    const [L, a, b] = rgbToLab(0, 0, 0);
    expect(L).toBeCloseTo(0, 0);
    expect(a).toBeCloseTo(0, 0);
    expect(b).toBeCloseTo(0, 0);
  });
  
  test('红色 RGB 转 LAB', () => {
    const [L, a, b] = rgbToLab(255, 0, 0);
    expect(L).toBeCloseTo(53.2, 0);
    expect(a).toBeCloseTo(80.1, 0);
    expect(b).toBeCloseTo(67.2, 0);
  });
  
  test('Delta E 计算 - 相同颜色', () => {
    const lab1: [number, number, number] = [50, 0, 0];
    const lab2: [number, number, number] = [50, 0, 0];
    const deltaE = deltaE76(lab1, lab2);
    expect(deltaE).toBe(0);
  });
  
  test('Delta E 计算 - 不同颜色', () => {
    const lab1: [number, number, number] = [50, 0, 0];
    const lab2: [number, number, number] = [60, 10, 10];
    const deltaE = deltaE76(lab1, lab2);
    expect(deltaE).toBeGreaterThan(0);
    expect(deltaE).toBeCloseTo(17.32, 1);
  });
});
