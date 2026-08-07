'use client';

import { OverlayPanel } from './OverlayPanel';
import { SplitText } from '../ui/SplitText';

/**
 * 7. THE STAIRS — the palette moment.
 *
 * Almost no content on purpose. The stairwell is where night turns to dawn, and
 * a wall of text would compete with the one thing this beat exists to do. One
 * line, centred, gone by the top.
 */
export function StairsOverlay() {
  return (
    <OverlayPanel section="stairs" place="center" edge={0.24}>
      <SplitText
        as="p"
        section="stairs"
        text="Almost morning."
        window={[0.1, 0.55]}
        className="block font-display font-bold tracking-[-0.02em] text-bone"
        charClassName="text-[clamp(1.75rem,6vw,4rem)]"
      />
      <p data-reveal className="label mt-5 text-[0.5625rem]">
        One more floor
      </p>
    </OverlayPanel>
  );
}
