import {loadFont} from '@remotion/fonts';
import React, {createContext, useContext} from 'react';
import {staticFile} from 'remotion';
import type {Layout} from './layout';
import type {Colors, LogoSpec, Texts} from './schema';

// Polices embarquées dans /public/fonts (Google Fonts, licence OFL) :
// le rendu ne dépend pas du réseau.
const POPPINS = 'Poppins';
const MONO = 'JetBrains Mono';

for (const weight of ['400', '500', '600', '700']) {
	loadFont({family: POPPINS, weight, url: staticFile(`fonts/poppins-latin-${weight}-normal.woff2`)});
}
for (const weight of ['400', '500', '700']) {
	loadFont({family: MONO, weight, url: staticFile(`fonts/jetbrains-mono-latin-${weight}-normal.woff2`)});
}

export const FONTS = {
	sans: `'${POPPINS}', sans-serif`,
	mono: `'${MONO}', monospace`,
};

// Labels et surtitres : JetBrains Mono, capitales, tracking large.
export const monoLabel = (size: number): React.CSSProperties => ({
	fontFamily: FONTS.mono,
	fontSize: size,
	fontWeight: 500,
	letterSpacing: '0.18em',
	textTransform: 'uppercase',
	lineHeight: 1.2,
});

// Titres : Poppins SemiBold, approche serrée.
export const heading = (size: number): React.CSSProperties => ({
	fontFamily: FONTS.sans,
	fontSize: size,
	fontWeight: 600,
	letterSpacing: '-0.025em',
	lineHeight: 1.14,
	textWrap: 'balance',
});

// Ajoute de la transparence à une couleur #rgb, #rrggbb ou rgb()/rgba().
export const withAlpha = (color: string, alpha: number) => {
	const c = color.trim();
	if (c.startsWith('#')) {
		const hex =
			c.length === 4
				? c
						.slice(1)
						.split('')
						.map((ch) => ch + ch)
						.join('')
				: c.slice(1, 7);
		const n = parseInt(hex, 16);
		return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
	}
	const m = c.match(/rgba?\(([^)]+)\)/);
	if (m) {
		const [r, g, b] = m[1].split(',').map((p) => p.trim());
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}
	return c;
};

type Brand = {texts: Texts; colors: Colors; logo: LogoSpec; layout: Layout};

const BrandContext = createContext<Brand | null>(null);

export const BrandProvider: React.FC<{value: Brand; children: React.ReactNode}> = ({
	value,
	children,
}) => <BrandContext.Provider value={value}>{children}</BrandContext.Provider>;

export const useBrand = () => {
	const ctx = useContext(BrandContext);
	if (!ctx) throw new Error('useBrand() doit être utilisé dans <BrandProvider>');
	return ctx;
};

export const cardStyle = (c: Colors): React.CSSProperties => ({
	background: c.card,
	border: `1.5px solid ${withAlpha(c.accent, 0.14)}`,
	borderRadius: 24,
	boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
});
