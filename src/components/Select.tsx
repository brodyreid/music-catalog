import { Contributor } from '@/types/index.ts';
import { ChevronDown, Minus, X } from 'lucide-react';
import { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { SelectInstance } from 'react-select';
import CreatableSelect from 'react-select/creatable';

type SelectProps = {
  contributors: Contributor[];
} & ControllerRenderProps;

const CustomClearIndicator = ({
  innerProps,
}: {
  innerProps: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}) => (
  <div
    {...innerProps}
    className='rounded-sm p-1 hover:bg-text-muted/20 duration-300 hover:cursor-pointer'
    onClick={(e) => {
      e.stopPropagation();
      innerProps.onClick?.(e);
    }}
    onMouseDown={(e) => {
      e.stopPropagation();
      innerProps.onMouseDown?.(e);
    }}>
    <X strokeWidth={1.5} size={16} />
  </div>
);

const Select = forwardRef<SelectInstance<Contributor, true>, SelectProps>(
  ({ contributors, ...field }, ref) => {
    return (
      <CreatableSelect
        ref={ref}
        {...field}
        isMulti
        options={contributors}
        getOptionValue={(option) => option.id?.toString()}
        getOptionLabel={(option) => option.artist_name}
        getNewOptionData={(inputValue, _optionLabel) => ({
          artist_name: inputValue,
        })}
        formatCreateLabel={(inputValue) => `Create new contributor "${inputValue}"`}
        onChange={(value) => field.onChange(value)}
        unstyled
        closeMenuOnSelect={true}
        classNamePrefix='rs'
        components={{
          DropdownIndicator: () => <ChevronDown strokeWidth={1.5} size={20} />,
          ClearIndicator: ({ innerProps }) => (
            <CustomClearIndicator innerProps={innerProps} />
          ),
          IndicatorSeparator: () => (
            <Minus strokeWidth={0.75} className='rotate-90 -ml-1 -mr-1.5' />
          ),
          CrossIcon: () => <Minus />,
        }}
      />
    );
  },
);

export default Select;
