import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {heading, useBrand} from '../theme';
import {clamp} from '../timeline';
import {RichWord, splitRich} from './RichText';

// Texte incrusté (sous-titre) en bas de la zone sûre, mot par mot.
export const Title: React.FC<{text: string; duration: number}> = ({text, duration}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const {colors: c, layout: L} = useBrand();
	const words = splitRich(text);

	const out = interpolate(frame, [duration - 10, duration], [1, 0], {
		...clamp,
		easing: Easing.in(Easing.cubic),
	});

	return (
		<div
			style={{
				position: 'absolute',
				left: L.safe.x,
				right: L.safe.x,
				top: L.titleTop,
				height: L.titleHeight,
				display: 'flex',
				alignItems: 'flex-start',
				opacity: out,
				transform: `translateY(${(1 - out) * -16}px)`,
			}}
		>
			<div style={{...heading(L.titleSize), color: c.textMain, width: '100%'}}>
				{words.map((w, i) => {
					const s = spring({frame: frame - i * 2, fps, config: {damping: 200}, durationInFrames: 18});
					return (
						<React.Fragment key={i}>
							<RichWord
								word={w.word}
								em={w.em}
								emColor={c.accent}
								style={{opacity: s, transform: `translateY(${(1 - s) * 28}px)`}}
							/>
							{i < words.length - 1 ? ' ' : null}
						</React.Fragment>
					);
				})}
			</div>
		</div>
	);
};
