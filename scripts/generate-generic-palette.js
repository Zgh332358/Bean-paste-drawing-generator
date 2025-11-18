/**
 * 生成Generic色卡数据
 * 基于Artkal S系列映射创建中国市场通用色卡
 */

// 核心24色配置
const core24Colors = [
  { code: "01", nameCn: "黑色", nameEn: "Black", artkal: "S15", rgb: "#000000" },
  { code: "02", nameCn: "白色", nameEn: "White", artkal: "S01", rgb: "#FFFFFF" },
  { code: "03", nameCn: "大红", nameEn: "Red", artkal: "S10", rgb: "#DA1414" },
  { code: "04", nameCn: "橙色", nameEn: "Orange", artkal: "S12", rgb: "#FF8C00" },
  { code: "05", nameCn: "黄色", nameEn: "Yellow", artkal: "S02", rgb: "#FFD700" },
  { code: "06", nameCn: "浅黄", nameEn: "Light Yellow", artkal: "S03", rgb: "#FFEB99" },
  { code: "07", nameCn: "草绿", nameEn: "Green", artkal: "S18", rgb: "#228B22" },
  { code: "08", nameCn: "深绿", nameEn: "Dark Green", artkal: "S19", rgb: "#006400" },
  { code: "09", nameCn: "天蓝", nameEn: "Sky Blue", artkal: "S33", rgb: "#87CEEB" },
  { code: "10", nameCn: "深蓝", nameEn: "Dark Blue", artkal: "S35", rgb: "#00008B" },
  { code: "11", nameCn: "紫色", nameEn: "Purple", artkal: "S38", rgb: "#800080" },
  { code: "12", nameCn: "粉色", nameEn: "Pink", artkal: "S06", rgb: "#FFC0CB" },
  { code: "13", nameCn: "棕色", nameEn: "Brown", artkal: "S43", rgb: "#8B4513" },
  { code: "14", nameCn: "灰色", nameEn: "Gray", artkal: "S17", rgb: "#808080" },
  { code: "15", nameCn: "浅灰", nameEn: "Light Gray", artkal: "S48", rgb: "#D3D3D3" },
  { code: "16", nameCn: "米色", nameEn: "Beige", artkal: "S57", rgb: "#F5F5DC" },
  { code: "17", nameCn: "肉色", nameEn: "Peach", artkal: "S58", rgb: "#FFDAB9" },
  { code: "18", nameCn: "深红", nameEn: "Dark Red", artkal: "S11", rgb: "#8B0000" },
  { code: "19", nameCn: "浅绿", nameEn: "Light Green", artkal: "S20", rgb: "#90EE90" },
  { code: "20", nameCn: "浅蓝", nameEn: "Light Blue", artkal: "S34", rgb: "#ADD8E6" },
  { code: "21", nameCn: "浅紫", nameEn: "Light Purple", artkal: "S39", rgb: "#DDA0DD" },
  { code: "22", nameCn: "深粉", nameEn: "Hot Pink", artkal: "S07", rgb: "#FF69B4" },
  { code: "23", nameCn: "深棕", nameEn: "Dark Brown", artkal: "S44", rgb: "#654321" },
  { code: "24", nameCn: "透明", nameEn: "Clear", artkal: "S00", rgb: "#F0F0F0" }
];

// 扩展到48色
const extended48Colors = [
  ...core24Colors,
  { code: "25", nameCn: "酒红", nameEn: "Wine Red", artkal: "S13", rgb: "#722F37" },
  { code: "26", nameCn: "橘红", nameEn: "Orange Red", artkal: "S14", rgb: "#FF4500" },
  { code: "27", nameCn: "金黄", nameEn: "Golden Yellow", artkal: "S04", rgb: "#FFD700" },
  { code: "28", nameCn: "柠檬黄", nameEn: "Lemon Yellow", artkal: "S05", rgb: "#FFFACD" },
  { code: "29", nameCn: "青绿", nameEn: "Cyan Green", artkal: "S21", rgb: "#00CED1" },
  { code: "30", nameCn: "墨绿", nameEn: "Forest Green", artkal: "S22", rgb: "#228B22" },
  { code: "31", nameCn: "湖蓝", nameEn: "Lake Blue", artkal: "S36", rgb: "#4682B4" },
  { code: "32", nameCn: "宝蓝", nameEn: "Royal Blue", artkal: "S37", rgb: "#4169E1" },
  { code: "33", nameCn: "深紫", nameEn: "Dark Purple", artkal: "S40", rgb: "#4B0082" },
  { code: "34", nameCn: "玫红", nameEn: "Magenta", artkal: "S08", rgb: "#FF00FF" },
  { code: "35", nameCn: "珊瑚粉", nameEn: "Coral Pink", artkal: "S09", rgb: "#FF7F50" },
  { code: "36", nameCn: "浅棕", nameEn: "Light Brown", artkal: "S45", rgb: "#D2691E" },
  { code: "37", nameCn: "卡其", nameEn: "Khaki", artkal: "S46", rgb: "#F0E68C" },
  { code: "38", nameCn: "银灰", nameEn: "Silver Gray", artkal: "S49", rgb: "#C0C0C0" },
  { code: "39", nameCn: "炭灰", nameEn: "Charcoal", artkal: "S16", rgb: "#36454F" },
  { code: "40", nameCn: "奶白", nameEn: "Cream", artkal: "S47", rgb: "#FFFDD0" }
];

console.log(JSON.stringify({ core24Colors, extended48Colors }, null, 2));
