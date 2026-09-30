import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Value} from '../components/Value';
import {cardStyle, FONTS, monoLabel, useBrand, withAlpha} from '../theme';
import {clamp, clockAt, fr, KEY, o2At, o2Color} from '../timeline';

const PlugIcon: React.FC<{color: string}> = ({color}) => (
	<svg width={64} height={64} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
		<path d="M24 8v12M40 8v12" />
		<path d="M16 20h32v10a16 16 0 0 1-32 0z" />
		<path d="M32 46v12" />
	</svg>
);

const CloudIcon: React.FC<{color: string}> = ({color}) => (
	<svg width={64} height={64} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 48h28a11 11 0 0 0 1-22 16 16 0 0 0-30-3A12.5 12.5 0 0 0 18 48z" />
	</svg>
);

const ChipIcon: React.FC<{color: string}> = ({color}) => (
	<svg width={56} height={56} viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth={4} strokeLinecap="round">
		<rect x={16} y={16} width={32} height={32} rx={5} />
		<rect x={26} y={26} width={12} height={12} rx={2} fill={color} />
		{[24, 32, 40].map((v) => (
			<React.Fragment key={v}>
				<path d={`M${v} 8v8M${v} 48v8M8 ${v}h8M48 ${v}h8`} />
			</React.Fragment>
		))}
	</svg>
);

// Pompe : carter + turbine qui accélère.
const Pump: React.FC<{angle: number; color: string; ring: string}> = ({angle, color, ring}) => (
	<svg width={170} height={170} viewBox="0 0 170 170">
		<circle cx={85} cy={85} r={76} fill="none" stroke={ring} strokeWidth={6} />
		<circle cx={85} cy={85} r={62} fill={withAlpha(color, 0.08)} />
		<g transform={`rotate(${angle} 85 85)`}>
			{[0, 72, 144, 216, 288].map((a) => (
				<path
					key={a}
					transform={`rotate(${a} 85 85)`}
					d="M85 85 C 92 62, 110 52, 122 58 C 112 64, 100 74, 85 85 Z"
					fill={color}
				/>
			))}
		</g>
		<circle cx={85} cy={85} r={11} fill={color} />
	</svg>
);

// 10–14 s : coupure secteur / Internet, le contrôleur applique ses règles seul.
export const OfflineScene: React.FC<{from: number}> = ({from}) => {
	const local = useCurrentFrame();
	const frame = local + from;
	const {fps} = useVideoConfig();
	const {texts: t, colors: c} = useBrand();

	const pop = (at: number) => spring({frame: local - at, fps, config: {damping: 200}, durationInFrames: 16});
	const strike = interpolate(local, [8, 20], [0, 1], clamp);
	const ctrlOn = pop(22);

	const pumpLocal = KEY.pumpStart - from;
	const tp = local - pumpLocal;
	const angle = tp <= 0 ? 0 : tp < 20 ? (22 * tp * tp) / 40 : 22 * 10 + 22 * (tp - 20);
	const pumpOn = interpolate(tp, [0, 12], [0, 1], clamp);
	const o2 = o2At(frame);

	const offline = [
		{Icon: PlugIcon, label: t.offlinePower, state: t.offlinePowerState},
		{Icon: CloudIcon, label: t.offlineNetwork, state: t.offlineNetworkState},
	];

	return (
		<div style={{position: 'absolute', inset: 0}}>
			{/* Liaisons coupées */}
			<div style={{display: 'flex', gap: 20}}>
				{offline.map(({Icon, label, state}, i) => (
					<div
						key={label}
						style={{
							...cardStyle(c),
							flex: 1,
							height: 150,
							display: 'flex',
							alignItems: 'center',
							gap: 24,
							padding: '0 28px',
							opacity: pop(i * 4),
							borderColor: withAlpha(c.crit, 0.5 * strike),
						}}
					>
						<div style={{position: 'relative', width: 64, height: 64, opacity: 1 - strike * 0.45}}>
							<Icon color={c.textBody} />
							<svg width={80} height={80} style={{position: 'absolute', left: -8, top: -8}}>
								<line x1={8} y1={72} x2={8 + 64 * strike} y2={72 - 64 * strike} stroke={c.crit} strokeWidth={6} strokeLinecap="round" />
							</svg>
						</div>
						<div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
							<span style={{...monoLabel(19), color: c.textMain}}>{label}</span>
							<span style={{...monoLabel(19), color: c.crit, opacity: strike}}>{state}</span>
						</div>
					</div>
				))}
			</div>

			{/* Contrôleur local */}
			<div
				style={{
					...cardStyle(c),
					position: 'absolute',
					left: 0,
					top: 176,
					width: 940,
					height: 120,
					display: 'flex',
					alignItems: 'center',
					gap: 24,
					padding: '0 30px',
					opacity: 0.3 + 0.7 * ctrlOn,
					borderColor: withAlpha(c.accent, 0.14 + 0.6 * ctrlOn),
					boxShadow: `0 0 ${50 * ctrlOn}px ${withAlpha(c.accent, 0.22)}`,
				}}
			>
				<ChipIcon color={c.accent} />
				<span style={{fontFamily: FONTS.sans, fontWeight: 600, fontSize: 36, letterSpacing: '-0.02em', color: c.textMain, flex: 1}}>
					{t.controller}
				</span>
				<span style={{...monoLabel(19), color: c.accent, display: 'flex', alignItems: 'center', gap: 12}}>
					<span
						style={{
							width: 12,
							height: 12,
							borderRadius: 6,
							background: c.accent,
							opacity: ctrlOn * (0.5 + 0.5 * Math.round((Math.sin(local / 4) + 1) / 2)),
						}}
					/>
					{t.controllerState}
				</span>
			</div>

			{/* Règles exécutées */}
			<div
				style={{
					...cardStyle(c),
					position: 'absolute',
					left: 0,
					top: 320,
					width: 540,
					height: 320,
					padding: '30px 30px',
					display: 'flex',
					flexDirection: 'column',
					gap: 20,
				}}
			>
				{t.rules.map((rule, i) => {
					const at = 32 + i * 9;
					const chars = Math.floor(interpolate(local, [at, at + 12], [0, rule.length], clamp));
					const isLast = i === t.rules.length - 1;
					return (
						<div
							key={rule}
							style={{
								fontFamily: FONTS.mono,
								fontSize: 22,
								fontWeight: i === 0 ? 700 : 500,
								letterSpacing: '0.08em',
								whiteSpace: 'nowrap',
								color: i === 0 ? c.accent : c.textMain,
								opacity: local >= at ? 1 : 0,
							}}
						>
							{rule.slice(0, chars)}
							{isLast && chars === rule.length ? (
								<span style={{color: c.textBody}}>{`  ${clockAt(KEY.pumpStart)}`}</span>
							) : null}
						</div>
					);
				})}
			</div>

			{/* Pompe de secours */}
			<div
				style={{
					...cardStyle(c),
					position: 'absolute',
					left: 560,
					top: 320,
					width: 380,
					height: 320,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					paddingTop: 22,
					overflow: 'hidden',
					borderColor: withAlpha(c.ok, 0.14 + 0.5 * pumpOn),
				}}
			>
				{Array.from({length: 10}).map((_, i) => {
					const speed = 3 + random(`b${i}`) * 3;
					const y = 330 - ((Math.max(0, tp) * speed + random(`o${i}`) * 330) % 360);
					const size = 8 + random(`s${i}`) * 12;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: 24 + random(`x${i}`) * 330,
								top: y,
								width: size,
								height: size,
								borderRadius: '50%',
								border: `2px solid ${withAlpha(c.accent, 0.5)}`,
								opacity: pumpOn * 0.8,
							}}
						/>
					);
				})}
				<Pump angle={angle} color={pumpOn > 0 ? c.ok : c.textBody} ring={withAlpha(pumpOn > 0 ? c.ok : c.textBody, 0.35)} />
				<span style={{...monoLabel(17), color: c.textMain, marginTop: 14}}>{t.pumpLabel}</span>
				<div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 10}}>
					<span style={{...monoLabel(17), color: pumpOn > 0 ? c.ok : c.textBody}}>{pumpOn > 0 ? t.pumpState : '—'}</span>
					<Value value={`O2 ${fr(o2)}`} unit="mg/L" size={30} color={o2Color(o2, c)} unitColor={c.textBody} />
				</div>
			</div>
		</div>
	);
};
