import { SOCIAL_LINKS } from '../../data/links';

export const SocialFooter = () => (
  <footer className="bg-mercy-black py-16 px-6">
    <nav className="flex justify-center items-center gap-8 font-primary text-mercy-red text-sm tracking-widest uppercase">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-mercy-white transition-colors"
        >
          {link.label}
        </a>
      ))}
    </nav>
  </footer>
);
