import { InputHTMLAttributes } from 'react';

export default function DateField(props: InputHTMLAttributes<HTMLInputElement>) {

  return (
    <input type='date' className='rounded p-2 bg-primary text-secondary' {...props} />
  );
}