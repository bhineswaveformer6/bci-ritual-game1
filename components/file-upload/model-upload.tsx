
'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ModelUploadProps {
  onUpload: (file: File) => Promise<void>;
  maxSize?: number; // in bytes
  className?: string;
}

const ACCEPTED_FORMATS = {
  'model/gltf+json': ['.gltf'],
  'model/gltf-binary': ['.glb'],
  'application/object': ['.obj'],
  'application/fbx': ['.fbx'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function ModelUpload({ 
  onUpload, 
  maxSize = MAX_FILE_SIZE,
  className 
}: ModelUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploadStatus('uploading');
    setUploadError('');

    try {
      await onUpload(file);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      setUploadStatus('error');
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
    maxSize: maxSize,
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader2 className="h-8 w-8 text-cyan-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-400" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-400" />;
      default:
        return <Upload className="h-8 w-8 text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Uploading model...';
      case 'success':
        return 'Model uploaded successfully!';
      case 'error':
        return uploadError || 'Upload failed';
      default:
        return isDragActive 
          ? 'Drop the 3D model here...'
          : 'Drag & drop a 3D model, or click to select';
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'text-cyan-400';
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      default:
        return isDragActive ? 'text-cyan-400' : 'text-gray-400';
    }
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive 
            ? 'border-cyan-400 bg-cyan-400/5' 
            : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/20',
          uploadStatus === 'success' && 'border-green-400 bg-green-400/5',
          uploadStatus === 'error' && 'border-red-400 bg-red-400/5'
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {getStatusIcon()}
          
          <div>
            <p className={cn('text-lg font-medium', getStatusColor())}>
              {getStatusMessage()}
            </p>
            
            {uploadStatus === 'idle' && (
              <p className="text-sm text-gray-500 mt-2">
                Supports .GLTF, .GLB, .OBJ, .FBX files up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            )}
          </div>
          
          {uploadStatus === 'idle' && (
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <FileType className="h-4 w-4 mr-2" />
              Select File
            </Button>
          )}
        </div>
      </div>

      {/* File rejection errors */}
      {fileRejections.length > 0 && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <h4 className="text-red-400 font-medium mb-2">Upload Errors:</h4>
          <ul className="space-y-1">
            {fileRejections.map(({ file, errors }, index) => (
              <li key={index} className="text-sm text-red-300">
                {file.name}: {errors.map(e => e.message).join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
