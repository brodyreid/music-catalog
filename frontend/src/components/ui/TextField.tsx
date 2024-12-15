import { InputHTMLAttributes } from 'react';

export default function TextField(props: InputHTMLAttributes<HTMLInputElement>) {

  return (
    <input type='text' className='rounded p-2 bg-primary text-secondary' {...props} />
  );
}