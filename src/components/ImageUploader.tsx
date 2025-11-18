/**
 * 图像上传组件
 */

import React, { useRef, useState } from 'react';
import { useImageUpload } from '../hooks/useImageUpload';
import { useAppContext } from '../contexts/AppContext';

export function ImageUploader() {
  const { state } = useAppContext();
  const { uploadImage, clearImage } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (file: File) => {
    uploadImage(file);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="w-full">
      {!state.imageDataUrl ? (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            拖拽图像到此处，或点击选择文件
          </p>
          <p className="mt-1 text-xs text-gray-500">
            支持 JPG、PNG 格式，最大 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative">
          <img
            src={state.imageDataUrl}
            alt="上传的图像"
            className="w-full h-auto rounded-lg shadow-md"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors"
          >
            清除
          </button>
        </div>
      )}
    </div>
  );
}
