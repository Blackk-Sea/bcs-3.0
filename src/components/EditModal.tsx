'use client';

import React, { useState, useEffect } from 'react';
import { EditModalState, ResourceType } from '@/types/library';
import { sanitizeUrl } from '@/utils/security';
import { X, Youtube, HardDrive, Send, ShieldAlert } from 'lucide-react';

interface EditModalProps {
  state: EditModalState | null;
  onClose: () => void;
  onSave: (updated: { title: string; url?: string; type?: ResourceType }) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ state, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState<ResourceType>('yt');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (state) {
      setTitle(state.initialTitle || '');
      setUrl(state.initialUrl || '');
      setType(state.initialResourceType || 'yt');
      setError(null);
    }
  }, [state]);

  if (!state) return null;

  const isResource = state.type === 'resource';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('শিরোনাম ফাঁকা হতে পারে না');
      return;
    }

    if (isResource) {
      const sanitized = sanitizeUrl(url);
      if (!sanitized.isValid) {
        setError(sanitized.error || 'অনিরাপদ লিংক বা ভুল URL');
        return;
      }
      onSave({ title: trimmedTitle, url: sanitized.url, type });
    } else {
      onSave({ title: trimmedTitle });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-panel border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <h3 className="text-lg font-bold text-ink">
            {state.type === 'course' && 'কোর্স সম্পাদনা'}
            {state.type === 'subject' && 'বিষয় সম্পাদনা'}
            {state.type === 'chapter' && 'চ্যাপ্টার সম্পাদনা'}
            {state.type === 'resource' && 'রিসোর্স সম্পাদনা'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-panel-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isResource && (
            <div className="inline-flex gap-1 p-1 bg-card-bg rounded-md">
              <button
                type="button"
                onClick={() => setType('yt')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all ${
                  type === 'yt'
                    ? 'bg-panel text-yt shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Youtube className="w-4 h-4" /> YouTube
              </button>
              <button
                type="button"
                onClick={() => setType('drive')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all ${
                  type === 'drive'
                    ? 'bg-panel text-dr shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <HardDrive className="w-4 h-4" /> Drive
              </button>
              <button
                type="button"
                onClick={() => setType('tg')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all ${
                  type === 'tg'
                    ? 'bg-panel text-tg shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Send className="w-4 h-4" /> Telegram
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs text-ink-muted mb-1 font-medium">
              {isResource ? 'রিসোর্সের শিরোনাম' : 'নাম'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              className="w-full bg-card-bg border border-border focus:border-spotify/50 rounded-md px-3.5 py-2.5 text-sm text-ink placeholder-ink-muted outline-none transition-all"
              placeholder="শিরোনাম লিখুন..."
              autoFocus
              required
            />
          </div>

          {isResource && (
            <div>
              <label className="block text-xs text-ink-muted mb-1 font-medium">
                ওয়েব লিংক (URL)
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                className="w-full bg-card-bg border border-border focus:border-spotify/50 rounded-md px-3.5 py-2.5 text-sm text-ink placeholder-ink-muted outline-none transition-all"
                placeholder="https://..."
                required
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-2.5 rounded bg-danger-bg text-danger text-xs font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-border text-xs font-bold text-ink-muted hover:text-ink transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-spotify text-black text-xs font-extrabold hover:bg-spotify-hover transition-all"
            >
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
