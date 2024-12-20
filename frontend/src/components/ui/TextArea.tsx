import { InputHTMLAttributes } from 'react';

export default function TextArea(props: InputHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  return (
    <textarea
      className={`rounded p-1 text-sm bg-primary text-secondary h-full ${className || ''}`}
      rows={6}
      {...rest}
    />
  );
}