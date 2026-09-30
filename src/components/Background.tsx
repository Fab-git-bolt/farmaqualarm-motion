import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {useBrand, withAlpha} from '../theme';
import {clamp, CRIT_FRAME, KEY, o2At, O2_CRIT} from '../timeline';

// Fond « supervision » : dégradé nuit, grille discrète, balayage lent.
// Au plan final, fondu vers la couleur de fond du logo.
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {colors: c, logo, layout} = useBrand();

	const scanY = ((frame * 4) % (layout.H + 400)) - 200;
	// Lueur rouge très légère tant que l'O2 est critique.
	const critGlow =
		frame >= CRIT_FRAME && o2At(frame) < O2_CRIT
			? interpolate(frame, [CRIT_FRAME, CRIT_FRAME + 20], [0, 0.16], clamp)
			: 0;
	const outro = interpolate(frame, [KEY.headerOut[0], KEY.flight[0] + 14], [0, 1], clamp);

	return (
		<AbsoluteFill>
			<AbsoluteFill
				style={{
					background: `radial-gradient(120% 70% at 50% 0%, ${c.surface} 0%, ${c.night} 70%)`,
				}}
			/>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(${withAlpha(c.accent, 0.045)} 1.5px, transparent 1.5px), linear-gradient(90deg, ${withAlpha(c.accent, 0.045)} 1.5px, transparent 1.5px)`,
					backgroundSize: '60px 60px',
					backgroundPosition: 'center center',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: scanY,
					height: 200,
					background: `linear-gradient(180deg, transparent, ${withAlpha(c.accent, 0.04)}, transparent)`,
				}}
			/>
			<AbsoluteFill
				style={{
					opacity: critGlow,
					background: `radial-gradient(90% 60% at 50% 50%, transparent 55%, ${c.crit} 140%)`,
				}}
			/>
			<AbsoluteFill style={{background: logo.background, opacity: outro}} />
		</AbsoluteFill>
	);
};
