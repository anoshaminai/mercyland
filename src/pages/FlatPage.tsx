import { BayouHero } from '../components/flat/bayou-hero';
import { LetterSection } from '../components/flat/letter-section';
import { InfluencesBlock } from '../components/flat/influences-block';
import { ParkingLotWideRun } from '../components/flat/parking-lot-wide-run';
import { LaOverlay } from '../components/flat/la-overlay';
import { TermitesSection } from '../components/flat/termites-section';
import { PressDrop } from '../components/flat/press-drop';
import { EmailSignupSection } from '../components/flat/email-signup-section';
import { SocialFooter } from '../components/flat/social-footer';

export const FlatPage = () => (
  <>
    <BayouHero />
    <LetterSection />
    <TermitesSection />
    <LaOverlay />
    <ParkingLotWideRun />
    <InfluencesBlock />
    <PressDrop />
    <EmailSignupSection />
    <SocialFooter />
  </>
);
