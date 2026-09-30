import type {FormatId, LogoSpec} from './schema';

type FormatSpec = {
	width: number;
	height: number;
	// Marges tenues à l'écart de l'interface des réseaux (profil, légende, boutons).
	safe: {top: number; bottom: number; x: number};
	titleSize: number;
	titleHeight: number;
	taglineSize: number;
};

export const FORMATS: Record<FormatId, FormatSpec> = {
	'1:1': {
		width: 1080,
		height: 1080,
		safe: {top: 70, bottom: 80, x: 80},
		titleSize: 50,
		titleHeight: 190,
		taglineSize: 48,
	},
	'4:5': {
		width: 1080,
		height: 1350,
		safe: {top: 100, bottom: 130, x: 80},
		titleSize: 60,
		titleHeight: 240,
		taglineSize: 54,
	},
	'9:16': {
		width: 1080,
		height: 1920,
		// Reels / TikTok / Shorts : en-tête en haut, légende et boutons en bas.
		safe: {top: 250, bottom: 420, x: 90},
		titleSize: 62,
		titleHeight: 260,
		taglineSize: 56,
	},
};

// Les scènes sont dessinées dans une boîte de référence, mise à l'échelle
// dans la zone visuelle disponible selon le format.
export const SCENE_BOX = {w: 940, h: 640};

export const PASTILLE_HERO = 112;
export const PASTILLE_SMALL = 72;

export const getLayout = (format: FormatId, logo: LogoSpec) => {
	const f = FORMATS[format];
	const {width: W, height: H, safe} = f;

	const surtitleTop = safe.top;
	const statusTop = surtitleTop + 96;
	const statusCenterY = statusTop + PASTILLE_HERO / 2;
	const headerBottom = statusTop + PASTILLE_HERO;

	const titleBottom = H - safe.bottom;
	const titleTop = titleBottom - f.titleHeight;

	const zone = {
		x: safe.x,
		y: headerBottom + 40,
		w: W - 2 * safe.x,
		h: titleTop - 24 - (headerBottom + 40),
	};
	const zoneScale = Math.min(zone.w / SCENE_BOX.w, zone.h / SCENE_BOX.h, 1.15);

	// Plan final : logo + signature + appel à l'action, centrés dans la zone sûre.
	// Le dessin occupe ~80 % de la largeur de l'image : on garde une marge dans la zone sûre.
	const logoW = Math.min(W, (W - 2 * safe.x) / 0.86);
	const logoH = logoW / logo.aspectRatio;
	const logoVisibleH = (logo.contentBottom - logo.contentTop) * logoH;
	const taglineBlock = f.taglineSize * 1.2 * 2;
	const stackH = logoVisibleH + 36 + taglineBlock + 40 + 84 + 18 + 32;
	const stackTop = safe.top + (H - safe.top - safe.bottom - stackH) / 2;
	const logoTop = stackTop - logo.contentTop * logoH;
	const logoLeft = (W - logoW) / 2;
	const taglineTop = stackTop + logoVisibleH + 36;
	const ctaTop = taglineTop + taglineBlock + 40;

	return {
		...f,
		W,
		H,
		surtitleTop,
		statusTop,
		statusCenterY,
		titleTop,
		titleBottom,
		zone,
		zoneScale,
		outro: {
			logoLeft,
			logoTop,
			logoW,
			logoH,
			taglineTop,
			ctaTop,
			pastille: {
				x: logoLeft + logo.pastille.x * logoW,
				y: logoTop + logo.pastille.y * logoH,
				d: logo.pastille.d * logoW,
			},
		},
	};
};

export type Layout = ReturnType<typeof getLayout>;
