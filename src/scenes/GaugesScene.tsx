import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Value} from '../components/Value';
import {cardStyle, monoLabel, useBrand, withAlpha} from '../theme';
import {fr, o2At, phAt, stateColor, stateOfO2, tempAt, type StateId} from '../timeline';

const R = 112;
const STROKE = 18;
const SWEEP = 240;

const polar = (cx: number, cy: number, r: number, deg: number) => {
	const a = ((deg - 90) * Math.PI) / 180;
	return {x: cx + r * Math.cos(a), y: cy + r * Math.sin(a)};
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
	const p0 = polar(cx, cy, r, a0);
	const p1 = polar(cx, cy, r, a1);
	return `M${p0.x} ${p0.y} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${p1.x} ${p1.y}`;
};

const Gauge: React.FC<{
	label: string;
	value: number;
	unit: string;
	min: number;
	max: number;
	state: StateId;
	progress: number;
}> = ({label, value, unit, min, max, state, progress}) => {
	const {texts: t, colors: c} = useBrand();
	const color = stateColor(state, c);
	const size = 2 * R + STROKE + 8;
	const cx = size / 2;
	const cy = size / 2;
	const a0 = -SWEEP / 2;
	const ratio = Math.min(1, Math.max(0, (value - min) / (max - min))) * progress;
	const a1 = a0 + Math.max(0.5, SWEEP * ratio);
	const shown = min + (value - min) * progress;
	const stateLabel = state === 'normal' ? t.stateNormal : state === 'warn' ? t.stateWarn : t.stateCrit;

	return (
		<div
			style={{
				...cardStyle(c),
				width: 300,
				height: 350,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				paddingTop: 28,
				position: 'relative',
				borderColor: state === 'normal' ? withAlpha(c.accent, 0.14) : withAlpha(color, 0.7),
			}}
		>
			<svg width={size} height={size}>
				{Array.from({length: 25}).map((_, i) => {
					const a = a0 + (SWEEP * i) / 24;
					const p0 = polar(cx, cy, R - STROKE, a);
					const p1 = polar(cx, cy, R - STROKE - (i % 6 === 0 ? 14 : 7), a);
					return <line key={i} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke={withAlpha(c.textBody, 0.35)} strokeWidth={2} />;
				})}
				<path d={arc(cx, cy, R, a0, a0 + SWEEP)} fill="none" stroke={withAlpha(c.accent, 0.1)} strokeWidth={STROKE} strokeLinecap="round" />
				<path
					d={arc(cx, cy, R, a0, a1)}
					fill="none"
					stroke={color}
					strokeWidth={STROKE}
					strokeLinecap="round"
					style={{filter: `drop-shadow(0 0 10px ${withAlpha(color, 0.6)})`}}
				/>
			</svg>
			<div style={{position: 'absolute', top: 28 + cy - 34, width: '100%', display: 'flex', justifyContent: 'center'}}>
				<Value value={fr(shown)} unit={unit} size={60} color={c.textMain} unitColor={c.textBody} />
			</div>
			<span style={{...monoLabel(18), color: c.textBody, marginTop: -44}}>{label}</span>
			<span
				style={{
					...monoLabel(17),
					color,
					marginTop: 16,
					padding: '5px 12px',
					borderRadius: 8,
					background: withAlpha(color, 0.12),
				}}
			>
				{stateLabel}
			</span>
		</div>
	);
};

// 6–10 s : trois jauges animées (O2, température, pH).
export const GaugesScene: React.FC<{from: number}> = ({from}) => {
	const local = useCurrentFrame();
	const frame = local + from;
	const {fps} = useVideoConfig();
	const {texts: t, colors: c} = useBrand();

	const prog = (i: number) => spring({frame: local - 6 - i * 6, fps, config: {damping: 16, mass: 0.9}});
	const o2 = o2At(frame);
	const gauges = [
		{label: 'O2 DISSOUS', value: o2, unit: 'mg/L', min: 0, max: 12, state: stateOfO2(o2)},
		{label: 'TEMPÉRATURE', value: tempAt(frame), unit: '°C', min: 0, max: 30, state: 'normal' as const},
		{label: 'PH', value: phAt(frame), unit: '', min: 4, max: 10, state: 'normal' as const},
	];

	return (
		<div style={{position: 'absolute', inset: 0}}>
			<div style={{display: 'flex', gap: 20}}>
				{gauges.map((g, i) => (
					<Gauge key={g.label} {...g} progress={prog(i)} />
				))}
			</div>
			<div style={{position: 'absolute', left: 0, right: 0, top: 384, display: 'flex', gap: 14, flexWrap: 'wrap'}}>
				{t.extraMeasures.map((m, i) => {
					const s = spring({frame: local - 24 - i * 5, fps, config: {damping: 200}});
					return (
						<span
							key={m}
							style={{
								...monoLabel(18),
								color: c.textMain,
								padding: '12px 20px',
								borderRadius: 12,
								border: `1.5px solid ${withAlpha(c.accentSecondary, 0.6)}`,
								background: withAlpha(c.accentSecondary, 0.12),
								opacity: s,
								transform: `translateY(${(1 - s) * 16}px)`,
							}}
						>
							{m}
						</span>
					);
				})}
			</div>
			<div
				style={{
					...monoLabel(20),
					position: 'absolute',
					left: 0,
					top: 480,
					color: c.accent,
					opacity: spring({frame: local - 40, fps, config: {damping: 200}}),
				}}
			>
				{t.measuresNote}
			</div>
		</div>
	);
};
