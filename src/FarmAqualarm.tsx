import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Background} from './components/Background';
import {Header} from './components/Header';
import {SafeZones} from './components/SafeZones';
import {SceneZone} from './components/SceneZone';
import {Soundtrack} from './components/Soundtrack';
import {StatusPulse} from './components/StatusPulse';
import {Title} from './components/Title';
import {getLayout} from './layout';
import {pastilleAt} from './pastille';
import {FeaturesScene} from './scenes/FeaturesScene';
import {GaugesScene} from './scenes/GaugesScene';
import {MonitorScene} from './scenes/MonitorScene';
import {OfflineScene} from './scenes/OfflineScene';
import {OutroScene} from './scenes/OutroScene';
import type {FarmAqualarmProps} from './schema';
import {BrandProvider, FONTS} from './theme';
import {clamp, KEY, o2At, O2_CRIT, SCENES, TITLES} from './timeline';

// Pastille d'état : motif central, présente d'un bout à l'autre.
const Pastille: React.FC<{props: FarmAqualarmProps}> = ({props}) => {
	const frame = useCurrentFrame();
	const L = getLayout(props.format, props.logo);
	const p = pastilleAt(frame, L, props.colors);
	const critical = o2At(frame) < O2_CRIT && frame < KEY.flight[0];
	// Petit rebond à l'atterrissage, puis fondu : la pastille du logo prend le relais.
	const bump = interpolate(frame, [KEY.landing, KEY.landing + 5, KEY.landing + 12], [1, 1.18, 1], clamp);
	const fadeOut = interpolate(frame, [KEY.landing + 12, KEY.landing + 22], [1, 0], clamp);

	return (
		<StatusPulse
			x={p.x}
			y={p.y}
			d={p.d}
			color={p.color}
			frame={frame}
			period={critical ? 26 : 48}
			waves={1 - p.flight}
			halo={1 - p.flight}
			scale={bump}
			spread={1.25}
			opacity={fadeOut}
		/>
	);
};

export const FarmAqualarm: React.FC<FarmAqualarmProps> = (props) => {
	const {texts, colors, logo, format, showSafeZones, music} = props;
	const layout = useMemo(() => getLayout(format, logo), [format, logo]);
	const brand = useMemo(() => ({texts, colors, logo, layout}), [texts, colors, logo, layout]);

	return (
		<BrandProvider value={brand}>
			<AbsoluteFill style={{backgroundColor: colors.night, fontFamily: FONTS.sans, color: colors.textMain}}>
				<Background />

				<Sequence name="Supervision + chute O2" from={SCENES.monitor.from} durationInFrames={SCENES.monitor.duration}>
					<SceneZone duration={SCENES.monitor.duration} enter={false}>
						<MonitorScene from={SCENES.monitor.from} />
					</SceneZone>
				</Sequence>
				<Sequence name="Jauges" from={SCENES.gauges.from} durationInFrames={SCENES.gauges.duration}>
					<SceneZone duration={SCENES.gauges.duration}>
						<GaugesScene from={SCENES.gauges.from} />
					</SceneZone>
				</Sequence>
				<Sequence name="Hors ligne + secours" from={SCENES.offline.from} durationInFrames={SCENES.offline.duration}>
					<SceneZone duration={SCENES.offline.duration}>
						<OfflineScene from={SCENES.offline.from} />
					</SceneZone>
				</Sequence>
				<Sequence name="Points forts" from={SCENES.features.from} durationInFrames={SCENES.features.duration}>
					<SceneZone duration={SCENES.features.duration}>
						<FeaturesScene />
					</SceneZone>
				</Sequence>

				<Sequence name="Titre chute" from={TITLES.drop.from} durationInFrames={TITLES.drop.duration}>
					<Title text={texts.titleDrop} duration={TITLES.drop.duration} />
				</Sequence>
				<Sequence name="Titre jauges" from={TITLES.gauges.from} durationInFrames={TITLES.gauges.duration}>
					<Title text={texts.titleGauges} duration={TITLES.gauges.duration} />
				</Sequence>
				<Sequence name="Titre hors ligne" from={TITLES.offline.from} durationInFrames={TITLES.offline.duration}>
					<Title text={texts.titleOffline} duration={TITLES.offline.duration} />
				</Sequence>

				<Sequence name="En-tête" durationInFrames={KEY.headerOut[1]}>
					<Header />
				</Sequence>
				<Sequence name="Plan final" from={SCENES.outro.from} durationInFrames={SCENES.outro.duration}>
					<OutroScene from={SCENES.outro.from} />
				</Sequence>

				{music.src ? <Soundtrack src={music.src} volume={music.volume} /> : null}

				<Pastille props={props} />
				{showSafeZones ? <SafeZones /> : null}
			</AbsoluteFill>
		</BrandProvider>
	);
};
