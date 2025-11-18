/**
 * 图纸生成Hook
 */

import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { processImage } from '../utils/imageProcessing';
import { calculateMaterials } from '../utils/materialCalculation';
import { ErrorType } from '../types';

export function usePatternGeneration() {
  const { state, dispatch } = useAppContext();
  
  const generatePattern = useCallback(async () => {
    const { originalImage, config, availablePalettes } = state;
    
    if (!originalImage) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          type: ErrorType.PROCESSING_FAILED,
          message: '请先上传图像',
        },
      });
      return;
    }
    
    const palette = availablePalettes.find(p => p.id === config.paletteId);
    if (!palette) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          type: ErrorType.PROCESSING_FAILED,
          message: '未找到选择的色卡',
        },
      });
      return;
    }
    
    dispatch({ type: 'SET_PROCESSING', payload: true });
    
    try {
      // 使用setTimeout让UI有机会更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 处理图像
      const cells = processImage(originalImage, config, palette);
      
      // 计算材料
      const materials = calculateMaterials(cells);
      
      // 设置结果
      dispatch({
        type: 'SET_PATTERN_RESULT',
        payload: {
          width: cells[0]?.length || 0,
          height: cells.length,
          cells,
          materials,
          config,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          type: ErrorType.PROCESSING_FAILED,
          message: '图像处理失败',
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }, [state, dispatch]);
  
  return { generatePattern };
}
