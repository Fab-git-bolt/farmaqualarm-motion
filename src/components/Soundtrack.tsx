import React from 'react';
import {Audio, interpolate, staticFile, useVideoConfig} from 'remotion';

// Bande-son d'ambiance : purement décorative, la vidéo reste lisible sans le son.
// En boucle si la piste est plus courte que la vidéo ; fondu d'entrée et de sortie.
export const Soundtrack: React.FC<{src: string; volume: number}> = ({src, volume}) => {
	const {fps, durationInFrames} = useVideoConfig();
	const fadeIn = Math.round(0.5 * fps);
	const fadeOut = Math.round(1 * fps);

	return (
		<Audio
			src={/^(https?:|data:)/.test(src) ? src : staticFile(src)}
			loop
			volume={(f) =>
				interpolate(
					f,
					[0, fadeIn, durationInFrames - fadeOut, durationInFrames - 1],
					[0, volume, volume, 0],
					{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
				)
			}
		/>
	);
};
