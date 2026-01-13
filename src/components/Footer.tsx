import { Compass, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: ["Features", "Pricing", "Download App", "Changelog"],
    Company: ["About Us", "Careers", "Press", "Contact"],
    Resources: ["Blog", "Help Center", "Community", "Partners"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  const socialLinks = [
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Youtube, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-sunset flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold">Traverly</span>
            </a>
            <p className="text-background/60 text-sm mb-6 max-w-xs">
              The single platform for discovery, booking, and sharing your
              Indian travel adventures.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-background/60 hover:text-background transition-colors duration-200 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 text-sm">
            © 2026 Traverly. All rights reserved.
          </p>
          <p className="text-background/50 text-sm">
            Made with ❤️ for Indian Travelers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
