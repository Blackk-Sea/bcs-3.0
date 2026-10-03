'use client';

import React from 'react';
import { ToastMessage } from '@/types/library';
import { Check, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-5 py-3.5 rounded-md border text-sm font-medium shadow-2xl backdrop-blur-md transition-all animate-toast-in ${
            toast.type === 'success'
              ? 'bg-surface-hover text-ink border-border border-l-4 border-l-success'
              : toast.type === 'error'
              ? 'bg-surface-hover text-ink border-border border-l-4 border-l-danger'
              : 'bg-surface-hover text-ink border-border border-l-4 border-l-accent'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`p-1 rounded-full ${
                toast.type === 'success'
                  ? 'bg-success-bg text-success'
                  : toast.type === 'error'
                  ? 'bg-danger-bg text-danger'
                  : 'bg-accent-glow text-accent'
              }`}
            >
              {toast.type === 'success' && <Check className="w-3.5 h-3.5" />}
              {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5" />}
              {toast.type === 'info' && <Info className="w-3.5 h-3.5" />}
            </span>
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-muted hover:text-ink transition-colors p-1"
            title="মুছুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
