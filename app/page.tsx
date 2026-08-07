import { JourneyExperience } from '@/components/JourneyExperience';

/**
 * The whole site is one page.
 *
 * JourneyExperience decides which of two presentations to mount — the 3D journey
 * or the plain layout — and owns the accessible document that goes with each. It
 * must not be rendered here as well: the static layout *is* the semantic
 * document, and shipping both would make a screen reader read the entire
 * portfolio twice.
 */
export default function Page() {
  return (
    <main>
      <JourneyExperience />
    </main>
  );
}
