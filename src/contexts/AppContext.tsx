/**
 * 应用状态管理
 * 使用React Context和useReducer管理全局状态
 */

import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { AppState, AppError, ProcessingConfig, PatternResult, ColorPalette } from '../types';

// 初始配置
const initialConfig: ProcessingConfig = {
  paletteId: 'artkal-s-series',
  enableDithering: false,
  maintainAspectRatio: true,
  targetWidth: 50,
};

// 初始状态
const initialState: AppState = {
  originalImage: null,
  imageDataUrl: null,
  config: initialConfig,
  availablePalettes: [],
  patternResult: null,
  isProcessing: false,
  showGrid: true,
  showColorCodes: false,
  displayMode: 'standard',
  error: null,
};

// Action类型
type AppAction =
  | { type: 'SET_IMAGE'; payload: { image: HTMLImageElement; dataUrl: string } }
  | { type: 'SET_PALETTES'; payload: ColorPalette[] }
  | { type: 'UPDATE_CONFIG'; payload: Partial<ProcessingConfig> }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_PATTERN_RESULT'; payload: PatternResult }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_COLOR_CODES' }
  | { type: 'SET_DISPLAY_MODE'; payload: 'standard' | 'simplified' }
  | { type: 'SET_ERROR'; payload: AppError | null }
  | { type: 'CLEAR_IMAGE' }
  | { type: 'RESET' };

// Reducer函数
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_IMAGE':
      return {
        ...state,
        originalImage: action.payload.image,
        imageDataUrl: action.payload.dataUrl,
        patternResult: null,
        error: null,
      };
      
    case 'SET_PALETTES':
      return {
        ...state,
        availablePalettes: action.payload,
      };
      
    case 'UPDATE_CONFIG':
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };
      
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
      
    case 'SET_PATTERN_RESULT':
      return {
        ...state,
        patternResult: action.payload,
        isProcessing: false,
        error: null,
      };
      
    case 'TOGGLE_GRID':
      return {
        ...state,
        showGrid: !state.showGrid,
      };
      
    case 'TOGGLE_COLOR_CODES':
      return {
        ...state,
        showColorCodes: !state.showColorCodes,
      };
      
    case 'SET_DISPLAY_MODE':
      return {
        ...state,
        displayMode: action.payload,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isProcessing: false,
      };
      
    case 'CLEAR_IMAGE':
      return {
        ...state,
        originalImage: null,
        imageDataUrl: null,
        patternResult: null,
        error: null,
      };
      
    case 'RESET':
      return initialState;
      
    default:
      return state;
  }
}

// Context类型
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// 创建Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider组件
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// 自定义Hook
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext必须在AppProvider内使用');
  }
  return context;
}
