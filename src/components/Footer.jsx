'use client';
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { APP_NAME } from '@/config/app-config';
const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];
const quickLinks = [
  { name: 'About Us', href: '#' },
  { name: 'Services', href: '#' },
  { name: 'Doctors', href: '#' },
  { name: 'Departments', href: '#' },
  { name: 'Contact Us', href: '#' },
  { name: 'FAQs', href: '#' },
];
const legalLinks = [
  { name: 'Terms of Service', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Cookie Policy', href: '#' },
  { name: 'HIPAA Compliance', href: '#' },
];
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-primary mb-4">
                {APP_NAME}
              </h2>
              <p className="text-muted-foreground mb-6">
                Providing secure, accessible, fast, and efficient healthcare services to improve lives through technology and compassionate care.
              </p>
              <div className="flex gap-2 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <a 
                  href="mailto:contact@safemedical.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  contact@safemedical.com
                </a>
              </div>
              <div className="flex items-center mb-4">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <a 
                  href="tel:+1234567890" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  (123) 456-7890
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                <p className="text-muted-foreground">
                  1234 Healthcare Blvd, <br />
                  Medical City, MC 12345
                </p>
              </div>
            </div>
          </div>
          {}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {quickLinks.slice(0, Math.ceil(quickLinks.length / 2)).map((link) => (
                  <div key={link.name} className="mb-3">
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
              <div>
                {quickLinks.slice(Math.ceil(quickLinks.length / 2)).map((link) => (
                  <div key={link.name} className="mb-3">
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {}
          <div>
            <h3 className="text-lg font-semibold mb-6">
              Legal
            </h3>
            {legalLinks.map((link) => (
              <div key={link.name} className="mb-3">
                <a 
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center"
                >
                  {link.name}
                </a>
              </div>
            ))}
            <div className="mt-8">
              <p className="text-muted-foreground mb-2">
                Subscribe to our newsletter
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2.5 bg-background border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-primary text-primary-foreground rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="border-t border-border my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Designed with ❤️ for better healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer; 