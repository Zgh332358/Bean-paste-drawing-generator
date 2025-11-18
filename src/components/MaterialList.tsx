/**
 * 材料清单组件
 */

import { useAppContext } from '../contexts/AppContext';
import { calculateTotalBeads, getColorVarietyCount } from '../utils/materialCalculation';
import { formatColorCode } from '../utils/colorFormatting';

export function MaterialList() {
  const { state } = useAppContext();
  const { patternResult, displayMode, availablePalettes, config } = state;
  
  if (!patternResult) {
    return null;
  }
  
  const { materials } = patternResult;
  const totalBeads = calculateTotalBeads(materials);
  const colorCount = getColorVarietyCount(materials);
  
  // 获取当前色卡信息
  const currentPalette = availablePalettes.find(p => p.id === config.paletteId);
  const isMARD = currentPalette?.colors[0]?.standard === 'MARD';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">材料清单</h2>
      
      {/* 色卡信息 */}
      {currentPalette && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm font-medium text-gray-700">{currentPalette.name}</p>
          {isMARD && currentPalette.colors[0]?.compatibility && (
            <p className="text-xs text-blue-600 mt-1">
              品牌兼容性: {currentPalette.colors[0].compatibility}%
            </p>
          )}
        </div>
      )}
      
      {/* 总计信息 */}
      <div className="bg-blue-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">总颗数</div>
            <div className="text-2xl font-bold text-blue-600">{totalBeads}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">颜色种类</div>
            <div className="text-2xl font-bold text-blue-600">{colorCount}</div>
          </div>
        </div>
      </div>
      
      {/* 材料列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {materials.map((item, index) => (
          <div
            key={item.color.code}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-gray-500 text-sm w-6">{index + 1}</div>
              <div
                className="w-8 h-8 rounded border border-gray-300"
                style={{ backgroundColor: item.color.rgbHex }}
              />
              <div>
                <div className="font-medium text-gray-800">
                  {formatColorCode(item.color, displayMode)}
                </div>
                <div className="text-sm text-gray-600">{item.color.nameCn}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-800">{item.count}</div>
              <div className="text-xs text-gray-500">颗</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
