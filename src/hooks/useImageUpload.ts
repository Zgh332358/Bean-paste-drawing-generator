/**
 * 图像上传Hook
 */

import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ErrorType } from '../types';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

export function useImageUpload() {
  const { dispatch } = useAppContext();
  
  const uploadImage = useCallback((file: File) => {
    // 验证文件类型
    if (!ALLOWED_TYPES.includes(file.type)) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          type: ErrorType.INVALID_FILE_FORMAT,
          message: '不支持的文件格式，请上传JPG或PNG图像',
        },
      });
      return;
    }
    
    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          type: ErrorType.FILE_TOO_LARGE,
          message: '文件过大，请选择小于10MB的图像',
        },
      });
      return;
    }
    
    // 读取文件
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      
      img.onload = () => {
        dispatch({
          type: 'SET_IMAGE',
          payload: { image: img, dataUrl },
        });
      };
      
      img.onerror = () => {
        dispatch({
          type: 'SET_ERROR',
          payload: {
            type: ErrorType.INVALID_FILE_FORMAT,
            message: '无法加载图像文件',
          },
        });
      };
      
      img.src = dataUrl;
    };
    
    reader.onerror = () => {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          type: ErrorType.INVALID_FILE_FORMAT,
          message: '读取文件失败',
        },
      });
    };
    
    reader.readAsDataURL(file);
  }, [dispatch]);
  
  const clearImage = useCallback(() => {
    dispatch({ type: 'CLEAR_IMAGE' });
  }, [dispatch]);
  
  return { uploadImage, clearImage };
}
