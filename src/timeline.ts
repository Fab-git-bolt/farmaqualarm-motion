import {Easing, interpolate, interpolateColors} from 'remotion';
import type {Colors} from './schema';

export const FPS = 30;
export const DURATION = 20 * FPS;

// Découpage du storyboard, en images (30 i/s).
export const SCENES = {
	monitor: {from: 0, duration: 180}, // 0–6 s : supervision + chute d'O2
	gauges: {from: 180, duration: 120}, // 6–10 s
	offline: {from: 300, duration: 120}, // 10–14 s
	features: {from: 420, duration: 90}, // 14–17 s
	outro: {from: 510, duration: 90}, // 17–20 s
} as const;

export const TITLES = {
	drop: {from: 66, duration: 114},
	gauges: {from: 190, duration: 110},
	offline: {from: 312, duration: 108},
} as const;

// Instants clés (images, temps global).
export const KEY = {
	dropStart: 66,
	pumpStart: 340,
	pastilleShrink: [176, 198] as const,
	headerOut: [504, 520] as const,
	flight: [514, 546] as const,
	landing: 546,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);

const noise = (f: number, amp: number, seed: number) =>
	amp * (Math.sin(f / 7 + seed) * 0.7 + Math.sin(f / 2.9 + seed * 2) * 0.3);

// Oxygène dissous (mg/L) : stable, chute, plateau critique, remontée après la pompe.
export const o2At = (f: number) =>
	interpolate(
		f,
		[0, KEY.dropStart, 170, 300, KEY.pumpStart + 5, 410, DURATION],
		[7.8, 7.8, 3.4, 3.2, 3.2, 6.6, 6.8],
		{...clamp, easing: ease},
	) + noise(f, 0.05, 1);

export const tempAt = (f: number) => 18.4 + noise(f, 0.05, 4);
export const phAt = (f: number) => 7.2 + noise(f, 0.02, 9);

export const O2_WARN = 5.0;
export const O2_CRIT = 4.0;

export type StateId = 'normal' | 'warn' | 'crit';

export const stateOfO2 = (o2: number): StateId =>
	o2 >= O2_WARN ? 'normal' : o2 >= O2_CRIT ? 'warn' : 'crit';

export const stateColor = (state: StateId, c: Colors) =>
	state === 'normal' ? c.ok : state === 'warn' ? c.warn : c.crit;

// Couleur continue (fondu court autour des seuils) pour la pastille.
export const o2Color = (o2: number, c: Colors) =>
	interpolateColors(
		o2,
		[O2_CRIT - 0.1, O2_CRIT + 0.1, O2_WARN - 0.1, O2_WARN + 0.1],
		[c.crit, c.warn, c.warn, c.ok],
	);

// Première image où l'O2 passe sous un seuil.
const firstBelow = (threshold: number) => {
	for (let f = 0; f < DURATION; f++) {
		if (o2At(f) < threshold) return f;
	}
	return DURATION;
};
export const WARN_FRAME = firstBelow(O2_WARN);
export const CRIT_FRAME = firstBelow(O2_CRIT);

// Horloge fictive : 1 image = 1 seconde réelle, départ 03:00:00.
export const clockAt = (f: number) => {
	const s = 3 * 3600 + Math.floor(f);
	const hh = String(Math.floor(s / 3600)).padStart(2, '0');
	const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
	const ss = String(s % 60).padStart(2, '0');
	return `${hh}:${mm}:${ss}`;
};

// Nombre à la française : 7,8
export const fr = (v: number, digits = 1) => v.toFixed(digits).replace('.', ',');

export {clamp, ease};
