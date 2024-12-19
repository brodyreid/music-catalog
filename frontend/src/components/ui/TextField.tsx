import { InputHTMLAttributes } from 'react';

export default function TextField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <input type='text' className={`rounded p-2 bg-primary text-secondary ${className}`} {...rest} />
  );
}