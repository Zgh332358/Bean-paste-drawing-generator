/**
 * 颜色转换工具函数
 * 实现RGB到LAB的转换和Delta E色差计算
 */

/**
 * RGB到XYZ转换
 * @param r 红色值 (0-255)
 * @param g 绿色值 (0-255)
 * @param b 蓝色值 (0-255)
 * @returns XYZ值数组
 */
export function rgbToXyz(r: number, g: number, b: number): [number, number, number] {
  // 归一化到0-1
  let rNorm = r / 255;
  let gNorm = g / 255;
  let bNorm = b / 255;
  
  // Gamma校正 (sRGB)
  rNorm = rNorm > 0.04045 ? Math.pow((rNorm + 0.055) / 1.055, 2.4) : rNorm / 12.92;
  gNorm = gNorm > 0.04045 ? Math.pow((gNorm + 0.055) / 1.055, 2.4) : gNorm / 12.92;
  bNorm = bNorm > 0.04045 ? Math.pow((bNorm + 0.055) / 1.055, 2.4) : bNorm / 12.92;
  
  // 缩放到0-100
  rNorm *= 100;
  gNorm *= 100;
  bNorm *= 100;
  
  // 使用标准转换矩阵 (D65光源)
  const x = rNorm * 0.4124 + gNorm * 0.3576 + bNorm * 0.1805;
  const y = rNorm * 0.2126 + gNorm * 0.7152 + bNorm * 0.0722;
  const z = rNorm * 0.0193 + gNorm * 0.1192 + bNorm * 0.9505;
  
  return [x, y, z];
}

/**
 * XYZ到LAB转换
 * @param x X值
 * @param y Y值
 * @param z Z值
 * @returns LAB值数组
 */
export function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  // D65标准光源参考白点
  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;
  
  // 归一化
  let xNorm = x / xn;
  let yNorm = y / yn;
  let zNorm = z / zn;
  
  // 应用f(t)函数
  const delta = 6 / 29;
  const deltaSquared = delta * delta;
  const deltaCubed = delta * delta * delta;
  
  const f = (t: number): number => {
    return t > deltaCubed 
      ? Math.pow(t, 1/3) 
      : (t / (3 * deltaSquared)) + (4 / 29);
  };
  
  xNorm = f(xNorm);
  yNorm = f(yNorm);
  zNorm = f(zNorm);
  
  // 计算LAB值
  const L = (116 * yNorm) - 16;
  const a = 500 * (xNorm - yNorm);
  const b = 200 * (yNorm - zNorm);
  
  return [L, a, b];
}

/**
 * RGB到LAB转换（组合函数）
 * @param r 红色值 (0-255)
 * @param g 绿色值 (0-255)
 * @param b 蓝色值 (0-255)
 * @returns LAB值数组
 */
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const [x, y, z] = rgbToXyz(r, g, b);
  return xyzToLab(x, y, z);
}

/**
 * Delta E CIE76色差计算
 * @param lab1 第一个LAB颜色
 * @param lab2 第二个LAB颜色
 * @returns 色差值（越小越相似）
 */
export function deltaE76(
  lab1: [number, number, number], 
  lab2: [number, number, number]
): number {
  const [L1, a1, b1] = lab1;
  const [L2, a2, b2] = lab2;
  
  return Math.sqrt(
    Math.pow(L1 - L2, 2) +
    Math.pow(a1 - a2, 2) +
    Math.pow(b1 - b2, 2)
  );
}
