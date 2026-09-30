import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {StatusPulse} from '../components/StatusPulse';
import {cardStyle, FONTS, monoLabel, useBrand, withAlpha} from '../theme';

// 14–17 s : labels mono des points forts.
export const FeaturesScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {texts: t, colors: c} = useBrand();
	const n = t.features.length;
	const gap = 20;
	const rowH = Math.min(124, (640 - gap * (n - 1)) / n);
	const top = (640 - (rowH * n + gap * (n - 1))) / 2;

	return (
		<div style={{position: 'absolute', inset: 0}}>
			{t.features.map((label, i) => {
				const s = spring({frame: frame - 4 - i * 7, fps, config: {damping: 18, mass: 0.8}});
				return (
					<div
						key={label}
						style={{
							...cardStyle(c),
							position: 'absolute',
							left: 0,
							width: 940,
							top: top + i * (rowH + gap),
							height: rowH,
							display: 'flex',
							alignItems: 'center',
							padding: '0 40px',
							gap: 30,
							opacity: Math.min(1, s * 1.4),
							transform: `translateX(${(1 - s) * -80}px)`,
							borderLeft: `4px solid ${c.accent}`,
						}}
					>
						<span style={{fontFamily: FONTS.mono, fontSize: 22, fontWeight: 500, color: withAlpha(c.accent, 0.8)}}>
							{String(i + 1).padStart(2, '0')}
						</span>
						<span style={{...monoLabel(38), fontWeight: 700, color: c.textMain, flex: 1, whiteSpace: 'nowrap'}}>{label}</span>
						<div style={{position: 'relative', width: 24, height: 24}}>
							<StatusPulse x={12} y={12} d={20} color={c.ok} frame={frame - i * 7} period={40} halo={0} />
						</div>
					</div>
				);
			})}
		</div>
	);
};
