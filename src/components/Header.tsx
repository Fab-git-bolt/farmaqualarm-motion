import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {pastilleAt} from '../pastille';
import {FONTS, monoLabel, useBrand, withAlpha} from '../theme';
import {clamp, clockAt, KEY, o2At, stateColor, stateOfO2} from '../timeline';

// En-tête supervision : surtitre, nom du bassin, état, horloge.
// La pastille elle-même est dessinée par <FarmAqualarm> (elle quitte l'en-tête au plan final).
export const Header: React.FC = () => {
	const frame = useCurrentFrame();
	const {texts: t, colors: c, layout: L} = useBrand();
	const p = pastilleAt(frame, L, c);
	const state = stateOfO2(o2At(frame));
	const label = state === 'normal' ? t.stateNormal : state === 'warn' ? t.stateWarn : t.stateCrit;

	const opacity = interpolate(frame, [...KEY.headerOut], [1, 0], clamp);
	const textLeft = L.safe.x + p.d * 1.565 + 26;

	return (
		<div style={{position: 'absolute', inset: 0, opacity}}>
			<div
				style={{
					position: 'absolute',
					left: L.safe.x,
					right: L.safe.x,
					top: L.surtitleTop,
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<span style={{...monoLabel(24), color: c.accent}}>{t.surtitle}</span>
				<span style={{...monoLabel(24), letterSpacing: '0.08em', color: c.textBody, fontVariantNumeric: 'tabular-nums'}}>
					{clockAt(frame)}
				</span>
			</div>
			<div
				style={{
					position: 'absolute',
					left: textLeft,
					top: L.statusCenterY,
					transform: 'translateY(-50%)',
					display: 'flex',
					flexDirection: 'column',
					gap: 8,
				}}
			>
				<span
					style={{
						fontFamily: FONTS.sans,
						fontWeight: 600,
						fontSize: 40,
						letterSpacing: '-0.02em',
						color: c.textMain,
						lineHeight: 1.1,
					}}
				>
					{t.pondName}
				</span>
				<span
					style={{
						...monoLabel(22),
						color: stateColor(state, c),
						display: 'inline-flex',
						alignSelf: 'flex-start',
						padding: '6px 14px',
						borderRadius: 8,
						background: withAlpha(stateColor(state, c), 0.12),
					}}
				>
					{label}
				</span>
			</div>
		</div>
	);
};
