import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCalculator } from '../../contexts/CalculatorContext';
import { extractSectorDataFromImage, SectorData } from '../../services/openai';

interface SectorImageUploadProps {
  onSectorDataExtracted: (data: SectorData) => void;
}

const SectorImageUpload: React.FC<SectorImageUploadProps> = ({ onSectorDataExtracted }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      setError('Please upload an image file');
      return;
    }

    // Read the file and set the image preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        // Set preview image
        setImage(e.target.result as string);
        
        // Extract base64 data
        const base64Data = (e.target.result as string).split(',')[1];
        
        // Process with GPT-4 Vision
        await processSectorImage(base64Data);
      }
    };
    reader.readAsDataURL(file);
  };

  const processSectorImage = async (base64Data: string) => {
    setIsProcessing(true);
    setError(null);
    
    // Show information about environment in console
    console.log('API Key available:', !!import.meta.env.VITE_OPENAI_API_KEY);
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      console.log('API Key length:', import.meta.env.VITE_OPENAI_API_KEY.length);
      // Only show first 5 chars for security
      console.log('API Key starts with:', import.meta.env.VITE_OPENAI_API_KEY.substring(0, 5));
    }
    
    try {
      console.log('Sending image for processing, data length:', base64Data.length);
      
      const sectorData = await extractSectorDataFromImage(base64Data);
      
      if (sectorData) {
        console.log('Successfully extracted sector data:', sectorData);
        // Call the callback with the extracted data
        onSectorDataExtracted(sectorData);
      } else {
        console.error('Failed to extract sector data - null response');
        setError('Could not extract sector data from the image. Please check console for details.');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error processing image: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {!import.meta.env.VITE_OPENAI_API_KEY && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-md">
          <strong>Warning:</strong> OpenAI API key is not configured. Image upload will not work without a valid API key.
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700 hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
        
        {isProcessing ? (
          <div className="py-6 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Processing image with AI...</p>
          </div>
        ) : image ? (
          <div className="relative">
            <img src={image} alt="Sector screenshot" className="max-h-48 mx-auto rounded" />
            <button 
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                resetUpload();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="py-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400">
              Drag & drop your sector screenshot here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supports JPG, PNG, etc.
            </p>
          </div>
        )}
      </div>
      
      {error && (
        <motion.div 
          className="mt-3 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-medium">Error:</p>
          <p>{error}</p>
          <p className="mt-2 text-xs">If this problem persists, check the console for detailed information and verify your OpenAI API key is valid.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SectorImageUpload;
