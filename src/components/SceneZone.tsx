import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {SCENE_BOX} from '../layout';
import {useBrand} from '../theme';
import {clamp} from '../timeline';

// Place une scène (dessinée en 940 × 640) dans la zone visuelle du format,
// avec entrée / sortie en fondu.
export const SceneZone: React.FC<{
	duration: number;
	enter?: boolean;
	exit?: boolean;
	children: React.ReactNode;
}> = ({duration, enter = true, exit = true, children}) => {
	const frame = useCurrentFrame();
	const {layout: L} = useBrand();
	const s = L.zoneScale;

	const inP = enter ? interpolate(frame, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 1;
	const outP = exit ? interpolate(frame, [duration - 10, duration], [1, 0], {...clamp, easing: Easing.in(Easing.cubic)}) : 1;

	return (
		<div
			style={{
				position: 'absolute',
				left: L.zone.x + (L.zone.w - SCENE_BOX.w * s) / 2,
				top: L.zone.y + (L.zone.h - SCENE_BOX.h * s) / 2,
				width: SCENE_BOX.w,
				height: SCENE_BOX.h,
				transformOrigin: 'top left',
				transform: `scale(${s}) translateY(${(1 - inP) * 30 + (1 - outP) * -20}px)`,
				opacity: Math.min(inP, outP),
			}}
		>
			{children}
		</div>
	);
};
