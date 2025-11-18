/**
 * 主应用组件
 */

import { useEffect } from 'react';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ImageUploader } from './components/ImageUploader';
import { ConfigPanel } from './components/ConfigPanel';
import { PatternViewer } from './components/PatternViewer';
import { MaterialList } from './components/MaterialList';
import type { ColorPalette } from './types';
import palettesData from './data/palettes.json';

function AppContent() {
  const { state, dispatch } = useAppContext();
  
  // 加载色卡数据
  useEffect(() => {
    dispatch({
      type: 'SET_PALETTES',
      payload: palettesData.palettes as ColorPalette[],
    });
  }, [dispatch]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* 标题 */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            拼豆图纸生成器
          </h1>
          <p className="text-gray-600">
            将任意图像转换为可物理搭建的拼豆图纸
          </p>
        </header>
        
        {/* 错误提示 */}
        {state.error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-400 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {state.error.message}
                </h3>
                {state.error.details && (
                  <p className="mt-1 text-sm text-red-700">
                    {state.error.details}
                  </p>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* 左侧：上传和配置 */}
          <div className="lg:col-span-1 space-y-6">
            <ImageUploader />
            <ConfigPanel />
          </div>
          
          {/* 右侧：预览和材料清单 */}
          <div className="lg:col-span-2 space-y-6">
            <PatternViewer />
            <MaterialList />
          </div>
        </div>
        
        {/* 页脚 */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>拼豆图纸生成器 v1.0 - 基于CIELAB色差算法的精确颜色匹配</p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
