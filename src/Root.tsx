import React from 'react';
import {Composition, type CalculateMetadataFunction} from 'remotion';
import {FarmAqualarm} from './FarmAqualarm';
import {FORMATS} from './layout';
import {farmAqualarmSchema, makeDefaultProps, type FarmAqualarmProps, type FormatId} from './schema';
import {DURATION, FPS} from './timeline';

// Les dimensions suivent la prop `format` : on peut changer de format via --props sans retravail.
const calculateMetadata: CalculateMetadataFunction<FarmAqualarmProps> = ({props}) => ({
	width: FORMATS[props.format].width,
	height: FORMATS[props.format].height,
});

const COMPOSITIONS: {id: string; format: FormatId}[] = [
	{id: 'FarmAqualarm-4x5', format: '4:5'},
	{id: 'FarmAqualarm-1x1', format: '1:1'},
	{id: 'FarmAqualarm-9x16', format: '9:16'},
];

export const RemotionRoot: React.FC = () => (
	<>
		{COMPOSITIONS.map(({id, format}) => (
			<Composition
				key={id}
				id={id}
				component={FarmAqualarm}
				schema={farmAqualarmSchema}
				defaultProps={makeDefaultProps(format)}
				calculateMetadata={calculateMetadata}
				durationInFrames={DURATION}
				fps={FPS}
				width={FORMATS[format].width}
				height={FORMATS[format].height}
			/>
		))}
	</>
);
