import React, { useState, useRef } from 'react';
import { Upload, X, FileText, Image, AlertCircle } from 'lucide-react';
import { uploadApi } from '../services/api';

interface FileUploadProps {
  onFileUploaded: (fileUrl: string, fileType: 'image' | 'pdf') => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUploaded,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    url: string;
    type: 'image' | 'pdf';
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);
    
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    const isValidType = acceptedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type === 'application/pdf') return file.type === 'application/pdf';
      return file.type === type;
    });

    if (!isValidType) {
      setError('Please select a valid image or PDF file');
      return;
    }

    setUploading(true);
    
    try {
      const result = await uploadApi.uploadFile(file);
      
      if (result.success) {
        const fileInfo = {
          name: result.file.originalName,
          url: result.file.url,
          type: result.file.type
        };
        
        setUploadedFile(fileInfo);
        onFileUploaded(result.file.url, result.file.type);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!uploadedFile ? (
        <div
          className={`
            border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={!uploading ? openFileDialog : undefined}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes.join(',')}
            onChange={handleInputChange}
            className="hidden"
            disabled={uploading}
          />
          
          <div className="flex flex-col items-center space-y-3">
            {uploading ? (
              <div className="loading-spinner w-8 h-8 text-blue-500"></div>
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            
            <div>
              <p className="text-lg font-medium text-gray-700">
                {uploading ? 'Uploading...' : 'Upload file'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Images and PDFs up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {uploadedFile.type === 'image' ? (
                <Image className="w-6 h-6 text-green-600" />
              ) : (
                <FileText className="w-6 h-6 text-green-600" />
              )}
              <div>
                <p className="font-medium text-green-800 truncate max-w-xs">
                  {uploadedFile.name}
                </p>
                <p className="text-sm text-green-600">
                  File uploaded successfully
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
