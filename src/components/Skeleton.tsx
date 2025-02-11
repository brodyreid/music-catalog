import React, { CSSProperties, PropsWithChildren, ReactElement } from 'react';

interface SkeletonStyleProps {
  baseColor?: string;
  highlightColor?: string;

  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  inline?: boolean;

  duration?: number;
  direction?: 'ltr' | 'rtl';
  enableAnimation?: boolean;

  customHighlightBackground?: string;
}

const defaultEnableAnimation = true;

// For performance & cleanliness, don't add any inline styles unless we have to
function styleOptionsToCssProperties({
  baseColor,
  highlightColor,

  width,
  height,
  borderRadius,
  circle,

  direction,
  duration,
  enableAnimation = defaultEnableAnimation,

  customHighlightBackground,
}: SkeletonStyleProps & { circle: boolean }): CSSProperties &
  Record<`--${string}`, string> {
  const style: ReturnType<typeof styleOptionsToCssProperties> = {};

  if (direction === 'rtl') style['--animation-direction'] = 'reverse';
  if (typeof duration === 'number') style['--animation-duration'] = `${duration}s`;
  if (!enableAnimation) style['--pseudo-element-display'] = 'none';

  if (typeof width === 'string' || typeof width === 'number') style.width = width;
  if (typeof height === 'string' || typeof height === 'number') style.height = height;

  if (typeof borderRadius === 'string' || typeof borderRadius === 'number')
    style.borderRadius = borderRadius;

  if (circle) style.borderRadius = '50%';

  if (typeof baseColor !== 'undefined') style['--base-color'] = baseColor;
  if (typeof highlightColor !== 'undefined') style['--highlight-color'] = highlightColor;

  if (typeof customHighlightBackground === 'string')
    style['--custom-highlight-background'] = customHighlightBackground;

  return style;
}

export interface SkeletonProps extends SkeletonStyleProps {
  count?: number;
  wrapper?: React.FunctionComponent<PropsWithChildren<unknown>>;

  className?: string;
  containerClassName?: string;
  containerTestId?: string;

  circle?: boolean;
  style?: CSSProperties;
}

export function Skeleton({
  count = 1,
  wrapper: Wrapper,

  className: customClassName,
  containerClassName,
  containerTestId,

  circle = false,

  style: styleProp,
  ...originalPropsStyleOptions
}: SkeletonProps): ReactElement {
  const propsStyleOptions = { ...originalPropsStyleOptions };

  for (const [key, value] of Object.entries(originalPropsStyleOptions)) {
    if (typeof value === 'undefined') {
      delete propsStyleOptions[key as keyof typeof propsStyleOptions];
    }
  }

  const styleOptions = {
    ...propsStyleOptions,
    circle,
  };

  const style = {
    ...styleProp,
    ...styleOptionsToCssProperties(styleOptions),
  };

  let className = 'react-loading-skeleton';
  if (customClassName) className += ` ${customClassName}`;

  const elements: ReactElement[] = [];

  const countCeil = Math.ceil(count);

  for (let i = 0; i < countCeil; i++) {
    let thisStyle = style;

    if (countCeil > count && i === countCeil - 1) {
      const width = thisStyle.width ?? '100%';

      const fractionalPart = count % 1;

      const fractionalWidth =
        typeof width === 'number'
          ? width * fractionalPart
          : `calc(${width} * ${fractionalPart})`;

      thisStyle = { ...thisStyle, width: fractionalWidth };
    }

    const skeletonSpan = (
      <span className={className} style={thisStyle} key={i}>
        &zwnj;
      </span>
    );

    elements.push(
      <React.Fragment key={i}>
        {skeletonSpan}
        <br />
      </React.Fragment>,
    );
  }

  return (
    <span
      className={containerClassName}
      data-testid={containerTestId}
      aria-live='polite'
      aria-busy={defaultEnableAnimation}>
      {Wrapper ? elements.map((el, i) => <Wrapper key={i}>{el}</Wrapper>) : elements}
    </span>
  );
}
