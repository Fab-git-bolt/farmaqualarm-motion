import React from 'react';

// Découpe « texte *mis en valeur* » en mots, avec un drapeau d'emphase.
export const splitRich = (text: string) => {
	const words: {word: string; em: boolean}[] = [];
	text.split('*').forEach((part, i) => {
		part
			.split(/\s+/)
			.filter(Boolean)
			.forEach((word) => words.push({word, em: i % 2 === 1}));
	});
	return words;
};

export const RichWord: React.FC<{
	word: string;
	em: boolean;
	emColor: string;
	style?: React.CSSProperties;
}> = ({word, em, emColor, style}) => (
	<span style={{display: 'inline-block', whiteSpace: 'pre', color: em ? emColor : undefined, ...style}}>
		{word}
	</span>
);
