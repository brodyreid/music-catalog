import { InputHTMLAttributes } from 'react';

export default function SelectField(props: InputHTMLAttributes<HTMLSelectElement>) {

  return (
    <select className='rounded p-2 text-sm bg-primary text-secondary w-full' {...props}>
      {props.children}
    </select>
  );
}

