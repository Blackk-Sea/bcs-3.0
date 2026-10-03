'use client';

import React, { useRef } from 'react';
import { Download, Upload, Shield } from 'lucide-react';

interface FooterProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export const Footer: React.FC<FooterProps> = ({ onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <footer className="mt-auto border-t border-border py-8 bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
        <span className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-accent" /> সব ডেটা আপনার ব্রাউজারেই লোকালি সুরক্ষিত থাকে।
        </span>

        <div className="flex items-center gap-4">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5" /> ডেটা এক্সপোর্ট (JSON)
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-muted hover:text-ink transition-colors font-medium"
          >
            <Upload className="w-3.5 h-3.5" /> ইমপোর্ট
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleFileChange}
            hidden
          />
        </div>
      </div>
    </footer>
  );
};
