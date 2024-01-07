'use client'

import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { Inbox, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useRouter } from 'next/navigation'

import { uploadToS3 } from '@/lib/s3'

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async ({
      file_key, file_name
    }: {
      file_key: string, file_name: string
    }) => {
      const res = await axios.post('/api/create-chat', {
        file_key, file_name
      });

      return res.data;
    },
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,

    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];

      if (file.size > 10 * 1024 * 1024) {
        toast.error('Please upload a file less than 10MB');
        return;
      }

      try {
        setUploading(true);

        const data = await uploadToS3(file);

        if (!data?.file_key || !data?.file_name) {
          toast.error('Invalid file upload response');
          return;
        }

        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success('Chat created successfully');
            router.push(`/chat/${chat_id}`);
          },

          onError: (error) => {
            toast.error('Error creating chat');
            console.error(error);
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    }
  });

  return (
    <div className='p-2 bg-white rounded-xl'>
      <div {...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-rose-100/30 py-8 flex flex-col justify-center items-center'
      })}>
        <input {...getInputProps()} />

        { uploading ? (
          <>
            <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />

            <p className='mt-2 text-sm text-slate-400'>
              Spilling tea to GPT...
            </p>
          </>
        ) : (
          <>
            <Inbox className='w-10 h-10 text-blue-500' />

            <p className='mt-2 text-sm font-medium text-slate-400'>
              Drop PDF here.
            </p>
          </>
        )}

      </div>
    </div>
  )
}

export default FileUpload
