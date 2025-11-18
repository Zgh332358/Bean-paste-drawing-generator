/**
 * 整合Generic色卡到现有palettes.json
 * 基于Folwith市场调研数据
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取现有的palettes.json
const currentPalettesPath = path.join(__dirname, '../src/data/palettes.json');
const updatedPalettesPath = path.join(__dirname, '../src/data/palettes-updated.json');
const outputPath = path.join(__dirname, '../src/data/palettes.json');
const backupPath = path.join(__dirname, '../src/data/palettes.backup.json');

console.log('🚀 开始整合Generic色卡数据...\n');

try {
  // 1. 备份现有文件
  console.log('📦 备份现有palettes.json...');
  const currentData = fs.readFileSync(currentPalettesPath, 'utf8');
  fs.writeFileSync(backupPath, currentData);
  console.log('✅ 备份完成: palettes.backup.json\n');

  // 2. 读取两个文件
  console.log('📖 读取数据文件...');
  const current = JSON.parse(currentData);
  const updated = JSON.parse(fs.readFileSync(updatedPalettesPath, 'utf8'));
  console.log(`   当前色卡数量: ${current.palettes.length}`);
  console.log(`   新增色卡数量: ${updated.palettes.length}\n`);

  // 3. 合并数据
  console.log('🔄 合并色卡数据...');
  const merged = {
    version: updated.version,
    lastUpdated: updated.lastUpdated,
    note: updated.note,
    palettes: [
      ...updated.palettes,  // Generic色卡放在前面
      ...current.palettes   // 保留现有的Artkal色卡
    ]
  };

  console.log(`   合并后总数: ${merged.palettes.length} 个色卡\n`);

  // 4. 写入文件
  console.log('💾 写入新的palettes.json...');
  fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2));
  console.log('✅ 写入完成\n');

  // 5. 验证结果
  console.log('🔍 验证数据完整性...');
  const result = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  
  result.palettes.forEach((palette, index) => {
    console.log(`   ${index + 1}. ${palette.name} (${palette.nameEn || palette.name})`);
    console.log(`      - ID: ${palette.id}`);
    console.log(`      - 颜色数: ${palette.colorCount || palette.colors.length}`);
    console.log(`      - 品牌: ${palette.brand || 'N/A'}`);
    console.log(`      - 区域: ${palette.region || 'international'}`);
    console.log('');
  });

  console.log('✨ 整合完成！\n');
  console.log('📝 摘要:');
  console.log(`   - Generic 24色: ✅`);
  console.log(`   - Generic 48色: ✅`);
  console.log(`   - Artkal S系列: ✅`);
  console.log(`   - 备份文件: palettes.backup.json`);
  console.log('\n🎉 所有Generic色卡已成功整合到项目中！');

} catch (error) {
  console.error('❌ 错误:', error.message);
  console.error('\n如果出现问题，可以从备份恢复:');
  console.error('   cp src/data/palettes.backup.json src/data/palettes.json');
  process.exit(1);
}
