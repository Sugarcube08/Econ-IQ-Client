export const typography = {
  fonts: {
    sans: "var(--font-sans)",
    headline: "var(--font-headline)",
  },
  sizes: {
    display: 'text-[40px] font-black font-headline tracking-tight leading-tight',
    h1: 'text-[32px] font-extrabold font-headline tracking-tight leading-snug',
    h2: 'text-[24px] font-bold font-headline tracking-tight leading-normal',
    h3: 'text-[20px] font-bold font-headline leading-normal',
    h4: 'text-[18px] font-semibold font-headline leading-normal',
    body: 'text-[16px] font-normal font-sans leading-relaxed',
    bodySmall: 'text-[14px] font-normal font-sans leading-relaxed',
    label: 'text-[14px] font-bold font-sans uppercase tracking-wider',
    caption: 'text-[12px] font-medium font-sans text-neutral-500 uppercase tracking-widest',
  }
} as const;

export type TypographyStyles = typeof typography.sizes;
export type TypographyStyleKey = keyof TypographyStyles;
