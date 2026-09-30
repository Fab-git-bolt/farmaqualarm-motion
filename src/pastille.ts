import {Easing, interpolate, interpolateColors} from 'remotion';
import {PASTILLE_HERO, PASTILLE_SMALL, type Layout} from './layout';
import type {Colors} from './schema';
import {clamp, ease, KEY, o2At, o2Color} from './timeline';

// Position, taille et couleur de la pastille d'état à l'image `frame` :
// en-tête (grande puis réduite), puis vol jusqu'à la pastille du logo.
export const pastilleAt = (frame: number, L: Layout, c: Colors) => {
	const d = interpolate(frame, [...KEY.pastilleShrink], [PASTILLE_HERO, PASTILLE_SMALL], {
		...clamp,
		easing: ease,
	});
	// Le cercle d'onde fixe (1,565 × d) s'aligne sur le bord de la zone sûre.
	const header = {x: L.safe.x + (d * 1.565) / 2, y: L.statusCenterY, d};
	const stateColor = o2Color(o2At(frame), c);

	const [f0, f1] = KEY.flight;
	if (frame < f0) {
		return {...header, color: stateColor, flight: 0};
	}

	const t = interpolate(frame, [f0, f1], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const target = L.outro.pastille;
	// Courbe de Bézier quadratique : léger arc au-dessus de la trajectoire.
	const cx = target.x + 40;
	const cy = Math.min(header.y, target.y) - 60;
	const x = (1 - t) ** 2 * header.x + 2 * (1 - t) * t * cx + t ** 2 * target.x;
	const y = (1 - t) ** 2 * header.y + 2 * (1 - t) * t * cy + t ** 2 * target.y;
	return {
		x,
		y,
		d: interpolate(t, [0, 1], [header.d, target.d]),
		// Hors application, la pastille du logo reste ambre (charte 1.6).
		color: interpolateColors(t, [0.3, 1], [stateColor, c.amber]),
		flight: t,
	};
};
