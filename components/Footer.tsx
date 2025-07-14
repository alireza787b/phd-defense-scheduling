'use client';

import { Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="text-center mt-16 pb-8 text-sm text-muted-foreground fade-in">
      <div className="mb-4">
        <p>تابستان ۱۴۰۴ | Summer 2025</p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <span>طراحی و توسعه:</span>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="link-primary font-medium inline-flex items-center gap-1 group"
        >
          علیرضا قادری
          <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </footer>
  );
}