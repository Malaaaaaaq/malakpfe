import './Footer.css';
import { MapPin, Mail, Phone, ArrowRight } from 'lucide-react';

const Footer = ({ lang = 'FR' }) => {
  const t = {
    FR: {
      tagline: "Rendre le stationnement simple, rapide et abordable pour tous. Trouvez et réservez votre place en quelques secondes.",
      location: "Casablanca, Maroc",
      aboutTitle: "À propos",
      aboutLinks: ["À propos de nous", "Carrières", "Presse", "Blog"],
      supportTitle: "Assistance",
      supportLinks: ["Centre d'aide", "Contactez-nous", "Sécurité", "Conditions d'utilisation"],
      partnerTitle: "Partenaires",
      partnerLinks: ["Listez votre parking", "Solutions entreprises", "Programme d'affiliation", "Accès API"],
      newsletterTitle: "Restez informé",
      newsletterSub: "Recevez les meilleures offres directement dans votre boîte mail.",
      emailPlaceholder: "Votre adresse e-mail...",
      subscribe: "S'abonner",
      copy: "© 2026 ParLak. Tous droits réservés.",
      privacy: "Politique de confidentialité",
      terms: "Conditions générales",
      cookies: "Cookies"
    },
    EN: {
      tagline: "Making parking simple, fast, and affordable for everyone. Find and book your spot in seconds.",
      location: "Casablanca, Morocco",
      aboutTitle: "About",
      aboutLinks: ["About Us", "Careers", "Press", "Blog"],
      supportTitle: "Support",
      supportLinks: ["Help Center", "Contact Us", "Security", "Terms of Use"],
      partnerTitle: "Partners",
      partnerLinks: ["List your parking", "Enterprise solutions", "Affiliate program", "API access"],
      newsletterTitle: "Stay Informed",
      newsletterSub: "Receive the best offers and updates directly in your inbox.",
      emailPlaceholder: "Your email address...",
      subscribe: "Subscribe",
      copy: "© 2026 ParLak. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      cookies: "Cookies"
    }
  }[lang];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">ParLak</h2>
            <p className="footer-tagline">{t.tagline}</p>
            <div className="footer-contact">
              <span><MapPin size={15} /> {t.location}</span>
              <span><Mail size={15} /> contact@parlak.ma</span>
              <span><Phone size={15} /> +212 6 00 00 00 00</span>
            </div>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h3 className="footer-col-title">{t.aboutTitle}</h3>
              <ul>
                {t.aboutLinks.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}
              </ul>
            </div>
            <div className="footer-col">
              <h3 className="footer-col-title">{t.supportTitle}</h3>
              <ul>
                {t.supportLinks.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}
              </ul>
            </div>
            <div className="footer-col">
              <h3 className="footer-col-title">{t.partnerTitle}</h3>
              <ul>
                {t.partnerLinks.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h4>{t.newsletterTitle}</h4>
            <p>{t.newsletterSub}</p>
          </div>
          <div className="newsletter-form">
            <input type="email" placeholder={t.emailPlaceholder} />
            <button type="button">
              {t.subscribe} <ArrowRight size={16} />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">{t.copy}</span>
          <div className="footer-legal">
            <a href="#">{t.privacy}</a>
            <span>·</span>
            <a href="#">{t.terms}</a>
            <span>·</span>
            <a href="#">{t.cookies}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
