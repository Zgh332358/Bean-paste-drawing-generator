/**
 * 图纸预览组件
 */

import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { formatColorCode, formatColorTooltip } from '../utils/colorFormatting';

export function PatternViewer() {
  const { state, dispatch } = useAppContext();
  const { patternResult, showGrid, showColorCodes, displayMode } = state;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [cellSize, setCellSize] = useState(20);
  const [zoomLevel, setZoomLevel] = useState(1); // 缩放级别
  
  useEffect(() => {
    if (!patternResult || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height, cells } = patternResult;
    
    // 计算合适的单元格大小 - 扩大显示范围
    const maxCanvasWidth = 1200;
    const maxCanvasHeight = 900;
    const baseCellSize = Math.min(
      Math.floor(maxCanvasWidth / width),
      Math.floor(maxCanvasHeight / height),
      40
    );
    
    // 应用缩放级别
    const calculatedCellSize = Math.floor(baseCellSize * zoomLevel);
    setCellSize(calculatedCellSize);
    
    // 设置画布大小
    canvas.width = width * calculatedCellSize;
    canvas.height = height * calculatedCellSize;
    
    // 绘制图纸
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = cells[y][x];
        
        // 填充颜色
        ctx.fillStyle = cell.color.rgbHex;
        ctx.fillRect(
          x * calculatedCellSize,
          y * calculatedCellSize,
          calculatedCellSize,
          calculatedCellSize
        );
        
        // 绘制网格线
        if (showGrid) {
          ctx.strokeStyle = '#00000020';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            x * calculatedCellSize,
            y * calculatedCellSize,
            calculatedCellSize,
            calculatedCellSize
          );
        }
        
        // 显示色号 - 使用格式化的色号
        if (showColorCodes && calculatedCellSize >= 12) {
          const formattedCode = formatColorCode(cell.color, displayMode);
          
          // 根据背景颜色计算文字颜色（确保可读性）
          const rgb = cell.color.rgb;
          const brightness = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
          const textColor = brightness > 128 ? '#000000' : '#FFFFFF';
          
          // 设置字体（必须在measureText之前）
          const fontSize = Math.max(7, Math.min(calculatedCellSize / 3.5, 12));
          ctx.font = `bold ${fontSize}px Arial, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // 绘制文字背景（半透明，提高可读性）
          if (calculatedCellSize >= 20) {
            const textWidth = ctx.measureText(formattedCode).width;
            const textHeight = fontSize;
            const padding = 2;
            
            ctx.fillStyle = brightness > 128 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
            ctx.fillRect(
              x * calculatedCellSize + (calculatedCellSize - textWidth) / 2 - padding,
              y * calculatedCellSize + (calculatedCellSize - textHeight) / 2 - padding,
              textWidth + padding * 2,
              textHeight + padding * 2
            );
          }
          
          // 绘制文字
          ctx.fillStyle = textColor;
          ctx.fillText(
            formattedCode,
            x * calculatedCellSize + calculatedCellSize / 2,
            y * calculatedCellSize + calculatedCellSize / 2
          );
        }
      }
    }
  }, [patternResult, showGrid, showColorCodes, displayMode, zoomLevel]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!patternResult || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < patternResult.width && y >= 0 && y < patternResult.height) {
      setHoveredCell({ x, y });
    } else {
      setHoveredCell(null);
    }
  };
  
  const handleMouseLeave = () => {
    setHoveredCell(null);
  };
  
  if (!patternResult) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
        上传图像并生成图纸后，预览将显示在这里
      </div>
    );
  }
  
  const hoveredColor = hoveredCell 
    ? patternResult.cells[hoveredCell.y][hoveredCell.x].color
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            图纸预览
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            尺寸: {patternResult.width} × {patternResult.height} 豆子 
            <span className="ml-2">|</span>
            <span className="ml-2">总计: {patternResult.width * patternResult.height} 颗</span>
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          {/* 缩放控制 */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md">
            <span className="text-sm text-gray-600 font-medium">缩放:</span>
            <button
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              disabled={zoomLevel <= 0.5}
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
              title="缩小"
            >
              −
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
              disabled={zoomLevel >= 3}
              className="px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
              title="放大"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 text-xs text-blue-700"
              title="重置缩放"
            >
              重置
            </button>
          </div>
          
          <label className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={() => dispatch({ type: 'TOGGLE_GRID' })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">显示网格</span>
          </label>
          
          <label className="flex items-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-md transition-colors">
            <input
              type="checkbox"
              checked={showColorCodes}
              onChange={() => dispatch({ type: 'TOGGLE_COLOR_CODES' })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">显示色号</span>
          </label>
        </div>
      </div>
      
      {/* 提示信息 */}
      {showColorCodes && (
        <div className="mb-3 p-2 bg-blue-50 rounded-md">
          <p className="text-xs text-blue-700">
            💡 提示：悬停在色块上可查看详细信息
          </p>
        </div>
      )}
      
      <div className="relative overflow-auto max-h-[900px] border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="border border-gray-300 rounded cursor-crosshair mx-auto shadow-sm bg-white"
        />
        
        {hoveredColor && (
          <div className="absolute top-2 left-2 bg-white border border-gray-300 rounded-md p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300"
                style={{ backgroundColor: hoveredColor.rgbHex }}
              />
              <div className="text-sm">
                <div className="font-bold text-gray-800">
                  {formatColorTooltip(hoveredColor, displayMode)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  RGB: {hoveredColor.rgbHex}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
