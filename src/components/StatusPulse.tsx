import React from 'react';
import {withAlpha} from '../theme';

type Props = {
	x: number;
	y: number;
	d: number;
	color: string;
	frame: number;
	// 0 = pas d'onde, 1 = ondes normales.
	waves?: number;
	// Période des ondes en images.
	period?: number;
	// Cercle « onde » fixe, concentrique, comme sur le logo (0,36 S / 0,23 S).
	halo?: number;
	scale?: number;
	opacity?: number;
	// Expansion maximale des ondes (multiple du diamètre).
	spread?: number;
};

// Pastille d'état du logo : disque plein + onde concentrique.
export const StatusPulse: React.FC<Props> = ({
	x,
	y,
	d,
	color,
	frame,
	waves = 1,
	period = 48,
	halo = 1,
	scale = 1,
	opacity = 1,
	spread = 1.9,
}) => {
	const rings = [0, 1, 2].map((i) => {
		const t = (((frame + (i * period) / 3) % period) + period) % period / period;
		return {s: 1 + t * spread, o: (1 - t) * 0.55 * waves};
	});

	const circle = (size: number): React.CSSProperties => ({
		position: 'absolute',
		left: -size / 2,
		top: -size / 2,
		width: size,
		height: size,
		borderRadius: '50%',
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width: 0,
				height: 0,
				opacity,
				transform: `scale(${scale})`,
			}}
		>
			{rings.map((r, i) => (
				<div
					key={i}
					style={{
						...circle(d),
						border: `${Math.max(1.5, d * 0.035)}px solid ${color}`,
						transform: `scale(${r.s})`,
						opacity: r.o,
					}}
				/>
			))}
			<div
				style={{
					...circle(d * 1.565),
					border: `${Math.max(1.5, d * 0.03)}px solid ${withAlpha(color, 0.55)}`,
					opacity: halo,
				}}
			/>
			<div
				style={{
					...circle(d),
					background: color,
					boxShadow: `0 0 ${d * 0.5}px ${withAlpha(color, 0.55)}, 0 0 ${d * 1.2}px ${withAlpha(color, 0.25)}`,
				}}
			/>
		</div>
	);
};
