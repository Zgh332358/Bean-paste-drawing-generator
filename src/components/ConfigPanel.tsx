/**
 * 参数配置面板组件
 */

import { useAppContext } from '../contexts/AppContext';
import { usePatternGeneration } from '../hooks/usePatternGeneration';

export function ConfigPanel() {
  const { state, dispatch } = useAppContext();
  const { generatePattern } = usePatternGeneration();
  const { config, availablePalettes, originalImage, isProcessing } = state;
  
  const handlePaletteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: { paletteId: e.target.value },
    });
  };
  
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 允许空值（用户正在输入）
    if (value === '') {
      dispatch({
        type: 'UPDATE_CONFIG',
        payload: { targetWidth: undefined, targetHeight: undefined },
      });
      return;
    }
    
    const numValue = parseInt(value);
    
    // 只要是有效数字就更新，不限制范围（让HTML的min/max属性处理）
    if (!isNaN(numValue) && numValue > 0) {
      dispatch({
        type: 'UPDATE_CONFIG',
        payload: { targetWidth: numValue, targetHeight: undefined },
      });
    }
  };
  
  const handleWidthBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      // 失去焦点时才限制范围
      const clampedValue = Math.max(10, Math.min(200, value));
      if (clampedValue !== value) {
        dispatch({
          type: 'UPDATE_CONFIG',
          payload: { targetWidth: clampedValue, targetHeight: undefined },
        });
      }
    }
  };
  
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // 允许空值
    if (value === '') {
      dispatch({
        type: 'UPDATE_CONFIG',
        payload: { targetHeight: undefined, targetWidth: undefined },
      });
      return;
    }
    
    const numValue = parseInt(value);
    
    if (!isNaN(numValue) && numValue > 0) {
      dispatch({
        type: 'UPDATE_CONFIG',
        payload: { targetHeight: numValue, targetWidth: undefined },
      });
    }
  };
  
  const handleHeightBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const clampedValue = Math.max(10, Math.min(200, value));
      if (clampedValue !== value) {
        dispatch({
          type: 'UPDATE_CONFIG',
          payload: { targetHeight: clampedValue, targetWidth: undefined },
        });
      }
    }
  };
  
  const handleDitheringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: { enableDithering: e.target.checked },
    });
  };
  
  const handlePresetSize = (width: number, height: number) => {
    dispatch({
      type: 'UPDATE_CONFIG',
      payload: { targetWidth: width, targetHeight: height },
    });
  };
  
  const handleGenerate = () => {
    generatePattern();
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">参数配置</h2>
      
      {/* 色卡选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          色卡品牌
        </label>
        <select
          value={config.paletteId}
          onChange={handlePaletteChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {/* 中国市场 - MARD标准 */}
          {availablePalettes.filter(p => p.region === 'CN').length > 0 && (
            <optgroup label="中国市场 - MARD标准 ⭐推荐">
              {availablePalettes
                .filter(p => p.region === 'CN')
                .map(palette => (
                  <option key={palette.id} value={palette.id}>
                    {palette.name} ({palette.colorCount}色)
                  </option>
                ))}
            </optgroup>
          )}
          
          {/* 国际标准 */}
          {availablePalettes.filter(p => !p.region || p.region === 'International').length > 0 && (
            <optgroup label="国际标准">
              {availablePalettes
                .filter(p => !p.region || p.region === 'International')
                .map(palette => (
                  <option key={palette.id} value={palette.id}>
                    {palette.name}
                  </option>
                ))}
            </optgroup>
          )}
        </select>
        
        {/* 色卡描述和兼容性信息 */}
        {(() => {
          const selectedPalette = availablePalettes.find(p => p.id === config.paletteId);
          if (!selectedPalette) return null;
          
          return (
            <div className="mt-2 p-3 bg-blue-50 rounded-md">
              {selectedPalette.description && (
                <p className="text-sm text-gray-700">{selectedPalette.description}</p>
              )}
              {selectedPalette.colors[0]?.compatibility && (
                <p className="text-xs text-blue-600 mt-1">
                  ✓ 品牌兼容性: {selectedPalette.colors[0].compatibility}%
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                颜色数量: {selectedPalette.colorCount}色 | 拼豆尺寸: {selectedPalette.beadSize || 5}mm
              </p>
            </div>
          );
        })()}
      </div>
      
      {/* 显示模式选择 */}
      {(() => {
        const selectedPalette = availablePalettes.find(p => p.id === config.paletteId);
        const isMARD = selectedPalette?.colors[0]?.standard === 'MARD';
        
        if (!isMARD) return null;
        
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              编号显示模式
            </label>
            <select
              value={state.displayMode}
              onChange={(e) => dispatch({ 
                type: 'SET_DISPLAY_MODE', 
                payload: e.target.value as 'standard' | 'simplified' 
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">标准模式 (MARD 221)</option>
              <option value="simplified">简化模式 (221)</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              选择图纸和材料清单中的色号显示格式
            </p>
          </div>
        );
      })()}
      
      {/* 尺寸设置 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          图纸尺寸（豆子数）
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              宽度 <span className="text-gray-400">(10-200)</span>
            </label>
            <input
              type="number"
              min="10"
              max="200"
              step="1"
              value={config.targetWidth || ''}
              onChange={handleWidthChange}
              onBlur={handleWidthBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
              placeholder="输入宽度"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              高度 <span className="text-gray-400">(自动)</span>
            </label>
            <input
              type="number"
              min="10"
              max="200"
              step="1"
              value={config.targetHeight || ''}
              onChange={handleHeightChange}
              onBlur={handleHeightBlur}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium bg-gray-50"
              placeholder="自动计算"
              disabled={!!config.targetWidth}
            />
          </div>
        </div>
        
        {/* 快捷尺寸 */}
        <div className="mt-3">
          <p className="text-xs text-gray-600 mb-2">常用尺寸：</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePresetSize(29, 29)}
              className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200"
            >
              29×29
              <span className="text-xs text-blue-500 ml-1">(标准)</span>
            </button>
            <button
              onClick={() => handlePresetSize(58, 58)}
              className="px-4 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200"
            >
              58×58
              <span className="text-xs text-blue-500 ml-1">(大型)</span>
            </button>
            <button
              onClick={() => handlePresetSize(50, 50)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              50×50
            </button>
            <button
              onClick={() => handlePresetSize(100, 100)}
              className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              100×100
            </button>
          </div>
        </div>
        
        {/* 尺寸预览 */}
        {(config.targetWidth || config.targetHeight) && originalImage && (
          <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-200">
            <p className="text-sm text-green-800 font-medium">
              📐 预计图纸尺寸：
              {config.targetWidth && (
                <>
                  <span className="ml-2 text-lg">{config.targetWidth}</span>
                  <span className="text-gray-600"> × </span>
                  <span className="text-lg">
                    {Math.round(config.targetWidth * (originalImage.height / originalImage.width))}
                  </span>
                  <span className="text-gray-600 text-sm ml-1">豆子</span>
                </>
              )}
              {config.targetHeight && !config.targetWidth && (
                <>
                  <span className="ml-2 text-lg">
                    {Math.round(config.targetHeight * (originalImage.width / originalImage.height))}
                  </span>
                  <span className="text-gray-600"> × </span>
                  <span className="text-lg">{config.targetHeight}</span>
                  <span className="text-gray-600 text-sm ml-1">豆子</span>
                </>
              )}
            </p>
            <p className="text-xs text-green-600 mt-1">
              总计约 {config.targetWidth 
                ? config.targetWidth * Math.round(config.targetWidth * (originalImage.height / originalImage.width))
                : (config.targetHeight || 0) * Math.round((config.targetHeight || 0) * (originalImage.width / originalImage.height))
              } 颗拼豆
            </p>
          </div>
        )}
        
        {/* 尺寸说明 */}
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <p className="text-xs text-gray-600">
            💡 <strong>提示：</strong>输入宽度后，高度会根据图片比例自动计算
          </p>
          <p className="text-xs text-gray-500 mt-1">
            • 范围：10-200豆子
            • 29×29 = 标准拼豆板尺寸
            • 58×58 = 4块拼豆板拼接
          </p>
        </div>
      </div>
      
      {/* 高级选项 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          高级选项
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="dithering"
            checked={config.enableDithering}
            onChange={handleDitheringChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="dithering" className="ml-2 text-sm text-gray-700">
            启用颜色抖动
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          抖动可以模拟渐变色，但会增加图案复杂度
        </p>
      </div>
      
      {/* 生成按钮 */}
      <button
        onClick={handleGenerate}
        disabled={!originalImage || isProcessing}
        className={`
          w-full py-3 px-4 rounded-md font-medium transition-colors
          ${!originalImage || isProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {isProcessing ? '处理中...' : '生成图纸'}
      </button>
    </div>
  );
}
