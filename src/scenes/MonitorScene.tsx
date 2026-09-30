import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Value} from '../components/Value';
import {cardStyle, FONTS, monoLabel, useBrand, withAlpha} from '../theme';
import {
	clamp,
	clockAt,
	CRIT_FRAME,
	fr,
	o2At,
	O2_WARN,
	phAt,
	stateColor,
	stateOfO2,
	tempAt,
	WARN_FRAME,
} from '../timeline';

const CHART = {w: 876, h: 196, min: 2, max: 9, window: 240};
const LOG_LINE = 34;
const LOG_EVERY = 12;

// 0–6 s : écran de supervision nocturne, puis chute de l'oxygène.
export const MonitorScene: React.FC<{from: number}> = ({from}) => {
	const frame = useCurrentFrame() + from;
	const {texts: t, colors: c} = useBrand();

	const o2 = o2At(frame);
	const state = stateOfO2(o2);
	const sc = stateColor(state, c);

	const tiles = [
		{label: 'O2 DISSOUS', value: fr(o2), unit: 'mg/L', color: state === 'normal' ? c.textMain : sc, border: state === 'normal' ? undefined : sc},
		{label: 'TEMPÉRATURE', value: fr(tempAt(frame)), unit: '°C', color: c.textMain},
		{label: 'PH', value: fr(phAt(frame)), unit: '', color: c.textMain},
	];

	// Courbe O2 défilante sur les CHART.window dernières images.
	const yOf = (v: number) => CHART.h - ((v - CHART.min) / (CHART.max - CHART.min)) * CHART.h;
	const pts: string[] = [];
	for (let i = 0; i <= CHART.window; i += 3) {
		const f = frame - CHART.window + i;
		pts.push(`${((i / CHART.window) * CHART.w).toFixed(1)},${yOf(o2At(f)).toFixed(1)}`);
	}
	const line = `M${pts.join(' L')}`;
	const area = `${line} L${CHART.w},${CHART.h} L0,${CHART.h} Z`;
	const headY = yOf(o2);

	// Journal : relevés réguliers + événements d'alerte.
	type Entry = {f: number; text: string; color: string};
	const entries: Entry[] = [];
	for (let f = -LOG_EVERY * 4; f <= frame; f += LOG_EVERY) {
		entries.push({
			f,
			text: `${clockAt(f)}   O2 ${fr(o2At(f))} mg/L   ${fr(tempAt(f))} °C   pH ${fr(phAt(f))}`,
			color: c.textBody,
		});
	}
	if (frame >= WARN_FRAME) {
		entries.push({f: WARN_FRAME, text: `${clockAt(WARN_FRAME)}   ${t.stateWarn} · O2 < ${fr(O2_WARN)} mg/L`, color: c.warn});
	}
	if (frame >= CRIT_FRAME) {
		entries.push({f: CRIT_FRAME, text: `${clockAt(CRIT_FRAME)}   ${t.stateCrit} · ALERTE ÉMISE · ACQUITTEMENT ATTENDU`, color: c.crit});
	}
	entries.sort((a, b) => a.f - b.f);
	const visible = entries.slice(-5);
	const newest = visible[visible.length - 1];
	const slide = interpolate(frame, [newest.f, newest.f + 6], [1, 0], clamp);

	return (
		<div style={{position: 'absolute', inset: 0}}>
			{/* Valeurs instantanées */}
			<div style={{position: 'absolute', left: 0, top: 0, width: 940, height: 170, display: 'flex', gap: 20}}>
				{tiles.map((tile) => (
					<div
						key={tile.label}
						style={{
							...cardStyle(c),
							flex: 1,
							padding: '26px 28px',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'space-between',
							borderColor: tile.border ?? withAlpha(c.accent, 0.14),
							boxShadow: tile.border ? `0 0 40px ${withAlpha(tile.border, 0.25)}` : cardStyle(c).boxShadow,
						}}
					>
						<span style={{...monoLabel(18), color: c.textBody}}>{tile.label}</span>
						<Value value={tile.value} unit={tile.unit} size={66} color={tile.color} unitColor={c.textBody} />
					</div>
				))}
			</div>

			{/* Courbe */}
			<div style={{...cardStyle(c), position: 'absolute', left: 0, top: 190, width: 940, height: 272, padding: '22px 32px'}}>
				<div style={{display: 'flex', justifyContent: 'space-between'}}>
					<span style={{...monoLabel(16), color: c.textBody}}>O2 DISSOUS · mg/L · 4 DERNIÈRES MIN</span>
					<span style={{...monoLabel(16), color: c.warn}}>SEUIL {fr(O2_WARN)}</span>
				</div>
				<svg width={CHART.w} height={CHART.h} style={{position: 'absolute', left: 32, top: 58, overflow: 'visible'}}>
					<defs>
						<linearGradient id="o2fill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor={sc} stopOpacity={0.28} />
							<stop offset="100%" stopColor={sc} stopOpacity={0} />
						</linearGradient>
					</defs>
					{[3, 5, 7, 9].map((v) => (
						<line key={v} x1={0} x2={CHART.w} y1={yOf(v)} y2={yOf(v)} stroke={withAlpha(c.accent, 0.08)} strokeWidth={1.5} />
					))}
					<line
						x1={0}
						x2={CHART.w}
						y1={yOf(O2_WARN)}
						y2={yOf(O2_WARN)}
						stroke={c.warn}
						strokeWidth={2}
						strokeDasharray="10 10"
						opacity={0.8}
					/>
					<path d={area} fill="url(#o2fill)" />
					<path d={line} fill="none" stroke={sc} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
					<circle cx={CHART.w} cy={headY} r={16} fill={withAlpha(sc, 0.25)} />
					<circle cx={CHART.w} cy={headY} r={8} fill={sc} />
				</svg>
			</div>

			{/* Journal défilant */}
			<div
				style={{
					...cardStyle(c),
					position: 'absolute',
					left: 0,
					top: 482,
					width: 940,
					height: 158,
					padding: '0 32px',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: 32,
						right: 32,
						bottom: 16,
						transform: `translateY(${slide * LOG_LINE}px)`,
					}}
				>
					{visible.map((e, i) => (
						<div
							key={`${e.f}-${e.text}`}
							style={{
								fontFamily: FONTS.mono,
								fontSize: 19,
								letterSpacing: '0.04em',
								height: LOG_LINE,
								lineHeight: `${LOG_LINE}px`,
								whiteSpace: 'pre',
								color: e.color,
								opacity: 0.35 + (0.65 * (i + 1)) / visible.length,
								fontWeight: e.color === c.textBody ? 400 : 700,
							}}
						>
							{e.text}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
