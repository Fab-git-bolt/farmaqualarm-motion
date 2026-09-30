import {zColor} from '@remotion/zod-types';
import {z} from 'zod';

export const formatSchema = z.enum(['1:1', '4:5', '9:16']);
export type FormatId = z.infer<typeof formatSchema>;

// Tous les textes affichés. Dans les titres, un passage entre *astérisques*
// est mis en valeur dans la couleur d'accent.
export const textsSchema = z.object({
	surtitle: z.string(),
	pondName: z.string(),
	stateNormal: z.string(),
	stateWarn: z.string(),
	stateCrit: z.string(),
	titleDrop: z.string(),
	titleGauges: z.string(),
	titleOffline: z.string(),
	measuresNote: z.string(),
	extraMeasures: z.array(z.string()).max(4),
	offlinePower: z.string(),
	offlineNetwork: z.string(),
	offlinePowerState: z.string(),
	offlineNetworkState: z.string(),
	controller: z.string(),
	controllerState: z.string(),
	rules: z.array(z.string()).min(1).max(5),
	pumpLabel: z.string(),
	pumpState: z.string(),
	features: z.array(z.string()).min(1).max(5),
	tagline: z.string(),
	// « Action · précision » : la partie avant le « · » devient le bouton.
	cta: z.string(),
});

export const colorsSchema = z.object({
	night: zColor(),
	surface: zColor(),
	card: zColor(),
	accent: zColor(),
	accentSecondary: zColor(),
	brandBlue: zColor(),
	brandTeal: zColor(),
	textMain: zColor(),
	textBody: zColor(),
	ok: zColor(),
	warn: zColor(),
	crit: zColor(),
	amber: zColor(),
});

export const logoSchema = z.object({
	// Chemin dans /public (staticFile) ou URL absolue.
	src: z.string(),
	// Ratio largeur / hauteur de l'image.
	aspectRatio: z.number().positive(),
	// Couleur de fond de l'image : le plan final s'y fond pour masquer la découpe.
	background: zColor(),
	// Pastille du logo, en fraction de la largeur (x, diamètre) et de la hauteur (y) de l'image.
	pastille: z.object({
		x: z.number(),
		y: z.number(),
		d: z.number(),
	}),
	// Zone verticale réellement occupée par le dessin (fractions de la hauteur).
	contentTop: z.number(),
	contentBottom: z.number(),
});

export const farmAqualarmSchema = z.object({
	format: formatSchema,
	showSafeZones: z.boolean(),
	texts: textsSchema,
	colors: colorsSchema,
	logo: logoSchema,
});

export type FarmAqualarmProps = z.infer<typeof farmAqualarmSchema>;
export type Texts = z.infer<typeof textsSchema>;
export type Colors = z.infer<typeof colorsSchema>;
export type LogoSpec = z.infer<typeof logoSchema>;

export const defaultTexts: Texts = {
	surtitle: '03:00 · SURVEILLANCE ACTIVE',
	pondName: 'Bassin 03',
	stateNormal: 'NORMAL',
	stateWarn: 'ATTENTION',
	stateCrit: 'CRITIQUE',
	titleDrop: 'La nuit, une baisse d’oxygène suffit à *perdre un bassin.*',
	titleGauges: 'Oxygène, température, pH : *mesurés en continu.*',
	titleOffline: 'Même sans Internet ni serveur, *le secours se déclenche seul.*',
	measuresNote: '11 GRANDEURS · MESURE EN CONTINU',
	extraMeasures: ['NIVEAU', 'DÉBIT', '+ 6 GRANDEURS'],
	offlinePower: 'SECTEUR',
	offlineNetwork: 'INTERNET · SERVEUR',
	offlinePowerState: 'COUPURE',
	offlineNetworkState: 'HORS LIGNE',
	controller: 'Contrôleur local',
	controllerState: 'RÈGLES ACTIVES',
	rules: [
		'SI O2 < 4,0 mg/L',
		'› AIR : ACTIVÉ',
		'› NOURRISSAGE : DÉSACTIVÉ',
		'› ALERTE HORODATÉE',
	],
	pumpLabel: 'POMPE DE SECOURS',
	pumpState: 'EN MARCHE',
	features: ['8 SORTIES', 'ALERTES FIABLES', 'ÉTALONNAGE 30 S', 'RÉCAP DU MATIN'],
	tagline: 'La sécurité du cheptel, avant tout.',
	cta: 'Demandez votre étude · Belgique et alentours',
};

export const defaultColors: Colors = {
	night: '#04101A',
	surface: '#06202B',
	card: 'rgba(9, 24, 32, 0.75)',
	accent: '#2FD8C0',
	accentSecondary: '#2E6FD8',
	brandBlue: '#17406B',
	brandTeal: '#2FA39B',
	textMain: '#F2FBF9',
	textBody: '#9FBDC2',
	ok: '#3FE0A0',
	warn: '#F2A93B',
	crit: '#E0544A',
	amber: '#F2A93B',
};

// Mesures relevées sur public/Farmaqualarm-lockup-fond-profond.png (2560 × 960).
export const defaultLogo: LogoSpec = {
	src: 'Farmaqualarm-lockup-fond-profond.png',
	aspectRatio: 2560 / 960,
	background: '#0F3D57',
	pastille: {x: 0.3014, y: 0.2958, d: 0.0515},
	contentTop: 0.19,
	contentBottom: 0.81,
};

export const makeDefaultProps = (format: FormatId): FarmAqualarmProps => ({
	format,
	showSafeZones: false,
	texts: defaultTexts,
	colors: defaultColors,
	logo: defaultLogo,
});
