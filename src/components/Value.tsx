import React from 'react';
import {FONTS} from '../theme';

// Valeur de mesure : chiffre en Poppins SemiBold, unité plus petite en gris.
export const Value: React.FC<{
	value: string;
	unit?: string;
	size: number;
	color: string;
	unitColor: string;
}> = ({value, unit, size, color, unitColor}) => (
	<div style={{display: 'flex', alignItems: 'baseline', gap: size * 0.14, whiteSpace: 'nowrap'}}>
		<span
			style={{
				fontFamily: FONTS.sans,
				fontWeight: 600,
				fontSize: size,
				letterSpacing: '-0.03em',
				color,
				fontVariantNumeric: 'tabular-nums',
				lineHeight: 1,
			}}
		>
			{value}
		</span>
		{unit ? (
			<span style={{fontFamily: FONTS.sans, fontWeight: 500, fontSize: size * 0.4, color: unitColor, lineHeight: 1}}>
				{unit}
			</span>
		) : null}
	</div>
);
