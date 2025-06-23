'use client';
import React from 'react';
import { Button } from "@/components/ui/Button";

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
    <footer className="bg-card border-t border-border pt-16 pb-8 mt-16 shadow-inner relative overflow-hidden">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/30 via-secondary/20 to-background opacity-60 z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-10">
          {/* Brand & Social */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-primary mb-4 tracking-tight">
                {APP_NAME}
              </h2>
              <p className="text-muted-foreground mb-6 text-base">
                Providing secure, accessible, fast, and efficient healthcare services to improve lives through technology and compassionate care.
              </p>
              <div className="flex gap-3 mb-6">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg bg-muted shadow hover:bg-primary/10 hover:scale-110 active:scale-95 duration-150"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <a
                  href="mailto:contact@safemedical.com"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg hover:underline"
                >
                  contact@safemedical.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                <a
                  href="tel:+1234567890"
                  className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-lg hover:underline"
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
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {quickLinks.slice(0, Math.ceil(quickLinks.length / 2)).map((link) => (
                  <div key={link.name} className="mb-3">
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-1 py-0.5 hover:underline hover:scale-105 duration-150"
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
                      className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-1 py-0.5 hover:underline hover:scale-105 duration-150"
                    >
                      {link.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Legal & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">Legal</h3>
            {legalLinks.map((link) => (
              <div key={link.name} className="mb-3">
                <a
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-1 py-0.5 hover:underline hover:scale-105 duration-150"
                >
                  {link.name}
                </a>
              </div>
            ))}
            <div className="mt-8">
              <p className="text-muted-foreground mb-2 font-medium">Subscribe to our newsletter</p>
              <form className="flex rounded-lg overflow-hidden shadow border border-border bg-background/70 backdrop-blur-md">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  aria-label="Email address"
                />
                <Button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
        <div className="border-t border-border my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-muted-foreground text-sm">
          <span>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Designed with <span className="text-destructive">❤️</span> for better healthcare
          </span>
        </div>
      </div>
    </footer>
  );
};
export default Footer; 