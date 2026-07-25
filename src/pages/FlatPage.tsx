import { BayouHero } from '../components/flat/bayou-hero';
import { LetterSection } from '../components/flat/letter-section';
import { ParkingLotWideRun } from '../components/flat/parking-lot-wide-run';
import { TermitesSection } from '../components/flat/termites-section';
import { EmailSignupSection } from '../components/flat/email-signup-section';
import { SocialFooter } from '../components/flat/social-footer';

export const FlatPage = () => (
  <>
    <BayouHero />
    <LetterSection />
    <TermitesSection />
    <ParkingLotWideRun />
    <EmailSignupSection />
    <SocialFooter />
  </>
);
