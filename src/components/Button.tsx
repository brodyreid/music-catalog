import { HtmlHTMLAttributes } from 'react';

export default function Button(props: HtmlHTMLAttributes<HTMLButtonElement>) {
  const { className, children, ...rest } = props;

  return (
    <button type='button' className={`text-sm bg-green-700 px-2 py-1 rounded-md hover ${className || ''}`} {...rest}>
      {children}
    </button>
  );
}
