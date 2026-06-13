export const typography = {
  fonts: {
    sans: "var(--font-sans)",
    headline: "var(--font-headline)",
  },
  sizes: {
    display: 'text-4xl lg:text-5xl font-black font-headline tracking-tight',
    h1: 'text-3xl lg:text-4xl font-extrabold font-headline tracking-tight',
    h2: 'text-2xl font-bold font-headline tracking-tight',
    h3: 'text-xl font-bold font-headline',
    h4: 'text-base font-semibold font-headline',
    body: 'text-sm font-normal font-sans leading-relaxed',
    bodySmall: 'text-xs font-normal font-sans leading-relaxed',
    label: 'text-xs font-bold font-sans uppercase tracking-wider',
    caption: 'text-[10px] font-medium font-sans text-neutral-500 uppercase tracking-widest',
  }
} as const;

export type TypographyStyles = typeof typography.sizes;
export type TypographyStyleKey = keyof TypographyStyles;
