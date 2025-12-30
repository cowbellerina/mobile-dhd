/**
 * Chevron Components - Barrel Export
 *
 * This file exports all chevron constellation components and provides
 * a mapping from glyph slugs to their corresponding components.
 */

import { SvgProps } from 'react-native-svg';
import ChevronAndromeda from './ChevronAndromeda';
import ChevronAquarius from './ChevronAquarius';
import ChevronAries from './ChevronAries';
import ChevronAuriga from './ChevronAuriga';
import ChevronBootes from './ChevronBootes';
import ChevronCancer from './ChevronCancer';
import ChevronCanisMinor from './ChevronCanisMinor';
import ChevronCapricorn from './ChevronCapricorn';
import ChevronCentaurus from './ChevronCentaurus';
import ChevronCetus from './ChevronCetus';
import ChevronCra from './ChevronCra';
import ChevronCrater from './ChevronCrater';
import ChevronEarth from './ChevronEarth';
import ChevronEquuleus from './ChevronEquuleus';
import ChevronEridanus from './ChevronEridanus';
import ChevronGemini from './ChevronGemini';
import ChevronHydra from './ChevronHydra';
import ChevronLeo from './ChevronLeo';
import ChevronLeoMinor from './ChevronLeoMinor';
import ChevronLibra from './ChevronLibra';
import ChevronLynx from './ChevronLynx';
import ChevronMic from './ChevronMic';
import ChevronMonoceros from './ChevronMonoceros';
import ChevronNorma from './ChevronNorma';
import ChevronOrion from './ChevronOrion';
import ChevronPegasus from './ChevronPegasus';
import ChevronPerseus from './ChevronPerseus';
import ChevronPisces from './ChevronPisces';
import ChevronPiscesAustrinius from './ChevronPiscesAustrinius';
import ChevronPlaceholder from './ChevronPlaceholder';
import ChevronSagittarius from './ChevronSagittarius';
import ChevronScorpio from './ChevronScorpio';
import ChevronSculptor from './ChevronSculptor';
import ChevronScutum from './ChevronScutum';
import ChevronSerpensCaput from './ChevronSerpensCaput';
import ChevronSextans from './ChevronSextans';
import ChevronTaurus from './ChevronTaurus';
import ChevronTriangulum from './ChevronTriangulum';
import ChevronVirgo from './ChevronVirgo';

// Re-export all components
export {
  ChevronAndromeda,
  ChevronAquarius,
  ChevronAries,
  ChevronAuriga,
  ChevronBootes,
  ChevronCancer,
  ChevronCanisMinor,
  ChevronCapricorn,
  ChevronCentaurus,
  ChevronCetus,
  ChevronCra,
  ChevronCrater,
  ChevronEarth,
  ChevronEquuleus,
  ChevronEridanus,
  ChevronGemini,
  ChevronHydra,
  ChevronLeo,
  ChevronLeoMinor,
  ChevronLibra,
  ChevronLynx,
  ChevronMic,
  ChevronMonoceros,
  ChevronNorma,
  ChevronOrion,
  ChevronPegasus,
  ChevronPerseus,
  ChevronPisces,
  ChevronPiscesAustrinius,
  ChevronPlaceholder,
  ChevronSagittarius,
  ChevronScorpio,
  ChevronSculptor,
  ChevronScutum,
  ChevronSerpensCaput,
  ChevronSextans,
  ChevronTaurus,
  ChevronTriangulum,
  ChevronVirgo,
};

/**
 * Maps glyph slugs to their corresponding chevron components
 * Used for dynamic component rendering based on glyph identifier
 */
export const GLYPH_COMPONENT_MAP: Record<string, React.FC<SvgProps>> = {
  andromeda: ChevronAndromeda,
  aquarius: ChevronAquarius,
  aries: ChevronAries,
  auriga: ChevronAuriga,
  bootes: ChevronBootes,
  cancer: ChevronCancer,
  'canis-minor': ChevronCanisMinor,
  capricorn: ChevronCapricorn,
  centaurus: ChevronCentaurus,
  cetus: ChevronCetus,
  cra: ChevronCra,
  crater: ChevronCrater,
  earth: ChevronEarth,
  equuleus: ChevronEquuleus,
  eridanus: ChevronEridanus,
  gemini: ChevronGemini,
  hydra: ChevronHydra,
  leo: ChevronLeo,
  'leo-minor': ChevronLeoMinor,
  libra: ChevronLibra,
  lynx: ChevronLynx,
  mic: ChevronMic,
  monoceros: ChevronMonoceros,
  norma: ChevronNorma,
  orion: ChevronOrion,
  pegasus: ChevronPegasus,
  perseus: ChevronPerseus,
  pisces: ChevronPisces,
  'pisces-austrinius': ChevronPiscesAustrinius,
  sagittarius: ChevronSagittarius,
  scorpio: ChevronScorpio,
  sculptor: ChevronSculptor,
  scutum: ChevronScutum,
  'serpens-caput': ChevronSerpensCaput,
  sextans: ChevronSextans,
  taurus: ChevronTaurus,
  triangulum: ChevronTriangulum,
  virgo: ChevronVirgo,
};
