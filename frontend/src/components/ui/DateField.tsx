import { InputHTMLAttributes } from 'react';

export default function DateField(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <input type='date' className={`rounded-sm p-2 bg-primary text-secondary ${className || ''}`} {...rest} />
  );
}