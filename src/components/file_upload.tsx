'use client'

import { uploadToS3 } from '@/lib/s3';
import { Inbox } from 'lucide-react';
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { convertToObject } from 'typescript';

const FileUpload = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,

    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        alert('File is too large. Please upload a file less than 10MB.');
        return;
      }

      try {
        const data = await uploadToS3(file);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }
  });

  return (
    <div className='p-2 bg-white rounded-xl'>
      <div {...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-rose-100/30 py-8 flex flex-col justify-center items-center'
      })}>
        <input {...getInputProps()} />

        <>
          <Inbox className='w-10 h-10 text-blue-500' />
          <p className='mt-2 text-sm font-medium text-slate-400'> Drop PDF here.</p>
        </>
      </div>
    </div>
  )
}

export default FileUpload
