import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {RichWord, splitRich} from '../components/RichText';
import {StatusPulse} from '../components/StatusPulse';
import {FONTS, heading, monoLabel, useBrand, withAlpha} from '../theme';
import {clamp, KEY} from '../timeline';

const resolveSrc = (src: string) => (/^(https?:|data:)/.test(src) ? src : staticFile(src));

// 17–20 s : logo, signature, appel à l'action.
// La pastille arrive en vol (dessinée par <FarmAqualarm>) et se pose sur celle du logo.
export const OutroScene: React.FC<{from: number}> = ({from}) => {
	const local = useCurrentFrame();
	const frame = local + from;
	const {fps} = useVideoConfig();
	const {texts: t, colors: c, logo, layout: L} = useBrand();
	const O = L.outro;

	const logoIn = spring({frame: frame - (KEY.flight[0] + 4), fps, config: {damping: 200}, durationInFrames: 24});
	const landed = frame >= KEY.landing;
	const words = splitRich(t.tagline);
	const [ctaMain, ...ctaRest] = t.cta.split('·').map((s) => s.trim());
	const ctaIn = spring({frame: frame - (KEY.landing + 14), fps, config: {damping: 200}});

	return (
		<div style={{position: 'absolute', inset: 0}}>
			<div
				style={{
					position: 'absolute',
					left: O.logoLeft,
					top: O.logoTop,
					width: O.logoW,
					height: O.logoH,
					opacity: logoIn,
					transform: `scale(${0.96 + 0.04 * logoIn})`,
				}}
			>
				<Img src={resolveSrc(logo.src)} style={{width: '100%', height: '100%', display: 'block'}} />
				{/* Vide l'emplacement de la pastille du logo jusqu'à ce que la pastille animée s'y pose. */}
				{!landed ? (
					<div
						style={{
							position: 'absolute',
							left: logo.pastille.x * O.logoW - logo.pastille.d * O.logoW * 0.61,
							top: logo.pastille.y * O.logoH - logo.pastille.d * O.logoW * 0.61,
							width: logo.pastille.d * O.logoW * 1.22,
							height: logo.pastille.d * O.logoW * 1.22,
							borderRadius: '50%',
							background: logo.background,
						}}
					/>
				) : null}
			</div>

			{/* Onde persistante autour de la pastille du logo (capteur actif). */}
			{landed ? (
				<StatusPulse
					x={O.pastille.x}
					y={O.pastille.y}
					d={O.pastille.d}
					color={c.amber}
					frame={frame - KEY.landing}
					period={50}
					halo={0}
					opacity={interpolate(frame, [KEY.landing, KEY.landing + 12], [1, 0.9], clamp)}
				/>
			) : null}

			<div
				style={{
					...heading(L.taglineSize),
					fontWeight: 700,
					position: 'absolute',
					left: L.safe.x,
					right: L.safe.x,
					top: O.taglineTop,
					textAlign: 'center',
					color: c.textMain,
				}}
			>
				{words.map((w, i) => {
					const s = spring({frame: frame - (KEY.landing - 4) - i * 3, fps, config: {damping: 200}, durationInFrames: 18});
					return (
						<React.Fragment key={i}>
							<RichWord
								word={w.word}
								em={w.em}
								emColor={c.accent}
								style={{opacity: s, transform: `translateY(${(1 - s) * 24}px)`}}
							/>
							{i < words.length - 1 ? ' ' : null}
						</React.Fragment>
					);
				})}
			</div>

			<div
				style={{
					position: 'absolute',
					left: L.safe.x,
					right: L.safe.x,
					top: O.ctaTop,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 18,
					opacity: ctaIn,
					transform: `translateY(${(1 - ctaIn) * 20}px)`,
				}}
			>
				<div
					style={{
						fontFamily: FONTS.sans,
						fontWeight: 600,
						fontSize: 32,
						letterSpacing: '-0.01em',
						color: c.night,
						background: c.accent,
						height: 84,
						padding: '0 44px',
						borderRadius: 42,
						display: 'flex',
						alignItems: 'center',
						boxShadow: `0 0 40px ${withAlpha(c.accent, 0.35)}`,
					}}
				>
					{ctaMain}
				</div>
				{ctaRest.length > 0 ? (
					<span style={{...monoLabel(22), color: c.textBody}}>{ctaRest.join(' · ')}</span>
				) : null}
			</div>
		</div>
	);
};
