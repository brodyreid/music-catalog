import { HtmlHTMLAttributes } from 'react';

export default function Button(props: HtmlHTMLAttributes<HTMLButtonElement>) {
  const { className, children, ...rest } = props;

  return (
    <button type='button' className={`bg-accent px-4 py-2 rounded hover ${className || ''}`} {...rest}>
      {children}
    </button>
  );
}

