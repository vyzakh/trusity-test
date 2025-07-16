type SvgColorProps = { src: string } & React.HTMLAttributes<HTMLSpanElement>;

export default function SvgColor({ src, style, ...other }: SvgColorProps) {
  return (
    <span
      style={{
        width: style?.width,
        flexShrink: 0,
        height: style?.height ?? style?.width,
        display: "inline-flex",
        backgroundColor: "currentColor",
        mask: `url(${src}) no-repeat center / contain`,
        WebkitMask: `url(${src}) no-repeat center / contain`,
        ...style,
      }}
      {...other}
    />
  );
}
