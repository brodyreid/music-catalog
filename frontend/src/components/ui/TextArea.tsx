import { InputHTMLAttributes } from 'react';

export default function TextArea(props: InputHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className='rounded p-1 text-sm bg-primary text-secondary h-full'
      rows={6}
      {...props}
    />
  );
}