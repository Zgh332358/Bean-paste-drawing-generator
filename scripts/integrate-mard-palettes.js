/**
 * MARD色卡集成脚本
 * 将mard-palettes.json合并到主色卡文件palettes.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  console.log('🔄 开始集成MARD色卡数据...\n');
  
  // 读取现有色卡
  const palettesPath = path.join(__dirname, '../src/data/palettes.json');
  const palettes = JSON.parse(fs.readFileSync(palettesPath, 'utf-8'));
  
  console.log(`📖 读取现有色卡: ${palettes.palettes.length}个`);
  
  // 读取MARD色卡
  const mardPath = path.join(__dirname, '../src/data/mard-palettes.json');
  const mardData = JSON.parse(fs.readFileSync(mardPath, 'utf-8'));
  
  console.log(`📖 读取MARD色卡: ${mardData.palettes.length}个`);
  
  // 检查是否已经包含MARD色卡
  const hasMARD = palettes.palettes.some(p => p.id.startsWith('mard-'));
  
  if (hasMARD) {
    console.log('⚠️  检测到已存在MARD色卡，将替换...');
    // 移除现有的MARD色卡
    palettes.palettes = palettes.palettes.filter(p => !p.id.startsWith('mard-'));
  }
  
  // 合并（MARD色卡放在前面）
  palettes.palettes = [
    ...mardData.palettes,
    ...palettes.palettes
  ];
  
  // 更新版本信息
  palettes.version = "1.1";
  palettes.lastUpdated = new Date().toISOString().split('T')[0];
  
  // 写回
  fs.writeFileSync(palettesPath, JSON.stringify(palettes, null, 2), 'utf-8');
  
  console.log('\n✅ MARD色卡已成功集成到palettes.json');
  console.log(`📊 当前总色卡数: ${palettes.palettes.length}个`);
  console.log(`   - MARD色卡: ${mardData.palettes.length}个`);
  console.log(`   - 其他色卡: ${palettes.palettes.length - mardData.palettes.length}个`);
  
  // 显示色卡列表
  console.log('\n📋 色卡列表:');
  palettes.palettes.forEach((p, index) => {
    const region = p.region ? `[${p.region}]` : '';
    const compat = p.colors[0]?.compatibility ? `(兼容性${p.colors[0].compatibility}%)` : '';
    console.log(`   ${index + 1}. ${region} ${p.name} - ${p.colorCount}色 ${compat}`);
  });
  
  console.log('\n✨ 集成完成！');
}

// 运行
main();

export default main;
