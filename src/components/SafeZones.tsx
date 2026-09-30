import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useBrand} from '../theme';

// Repères de mise en page (activer showSafeZones dans les props).
export const SafeZones: React.FC = () => {
	const {layout: L} = useBrand();
	const box = (x: number, y: number, w: number, h: number, color: string): React.CSSProperties => ({
		position: 'absolute',
		left: x,
		top: y,
		width: w,
		height: h,
		border: `2px dashed ${color}`,
	});
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div style={box(L.safe.x, L.safe.top, L.W - 2 * L.safe.x, L.H - L.safe.top - L.safe.bottom, '#ff00ff')} />
			<div style={box(L.zone.x, L.zone.y, L.zone.w, L.zone.h, '#00ffff')} />
			<div style={box(L.safe.x, L.titleTop, L.W - 2 * L.safe.x, L.titleHeight, '#ffff00')} />
		</AbsoluteFill>
	);
};
