import { ReactNode } from 'react';

const DEFAULT_COLOR = '#4fa94d';
const DEFAULT_WAI_ARIA_ATTRIBUTE = {
  'aria-busy': true,
  role: 'progressbar',
};
type Style = {
  [key: string]: string;
};
interface PrimaryProps {
  height?: string | number;
  width?: string | number;
  ariaLabel?: string;
  wrapperStyle?: Style;
  wrapperClass?: string;
  visible?: boolean;
}
interface BaseProps extends PrimaryProps {
  color?: string;
}
interface GridProps extends BaseProps {
  radius?: string | number;
}
interface SvgWrapperProps {
  visible: boolean;
  children: ReactNode;
}

const SvgWrapper = ({ visible, children, ...rest }: SvgWrapperProps) => {
  return (
    <div className={visible ? 'flex' : 'hidden'} {...rest}>
      {children}
    </div>
  );
};

export const LoadingDots = ({ height = 80, width = 80, radius = 12.5, color = DEFAULT_COLOR, ariaLabel = 'grid-loading', visible = true }: GridProps) => (
  <SvgWrapper visible={visible} data-testid='grid-loading' aria-label={ariaLabel} {...DEFAULT_WAI_ARIA_ATTRIBUTE}>
    <svg width={width} height={height} viewBox='0 0 105 105' fill={color} data-testid='grid-svg'>
      <circle cx='12.5' cy='12.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='0s' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='12.5' cy='52.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='100ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='52.5' cy='12.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='300ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='52.5' cy='52.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='600ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='92.5' cy='12.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='800ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='92.5' cy='52.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='400ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='12.5' cy='92.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='700ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='52.5' cy='92.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='500ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
      <circle cx='92.5' cy='92.5' r={`${radius}`}>
        <animate attributeName='fill-opacity' begin='200ms' dur='1s' values='1;.2;1' calcMode='linear' repeatCount='indefinite' />
      </circle>
    </svg>
  </SvgWrapper>
);
