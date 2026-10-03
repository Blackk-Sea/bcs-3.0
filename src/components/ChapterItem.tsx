'use client';

import React, { useState } from 'react';
import { Chapter, Resource, ResourceType } from '@/types/library';
import { ResourceItem } from './ResourceItem';
import { sanitizeUrl } from '@/utils/security';
import { toBn } from '@/utils/bengali';
import {
  GripVertical,
  Plus,
  Edit2,
  Trash2,
  CheckSquare,
  Youtube,
  HardDrive,
  Send,
  ShieldAlert,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
  filterMode: 'all' | 'incomplete' | 'completed';
  onToggleCollapseChapter: (chapterId: string) => void;
  onAddResource: (chapterId: string, title: string, url: string, type: ResourceType) => void;
  onToggleComplete: (chapterId: string, resourceId: string) => void;
  onToggleAllChapterComplete: (chapterId: string) => void;
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapterId: string) => void;
  onEditResource: (resource: Resource, chapterId: string) => void;
  onDeleteResource: (chapterId: string, resourceId: string) => void;
  onDragStart: (
    e: React.DragEvent,
    type: 'chapter' | 'resource',
    id: string,
    chapterId?: string
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropChapter: (e: React.DragEvent, targetChapterId: string) => void;
  onDropResource: (e: React.DragEvent, targetResourceId: string, targetChapterId: string) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  index,
  filterMode,
  onToggleCollapseChapter,
  onAddResource,
  onToggleComplete,
  onToggleAllChapterComplete,
  onEditChapter,
  onDeleteChapter,
  onEditResource,
  onDeleteResource,
  onDragStart,
  onDragOver,
  onDropChapter,
  onDropResource,
}) => {
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [resTitle, setResTitle] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resType, setResType] = useState<ResourceType>('yt');
  const [formError, setFormError] = useState<string | null>(null);

  const isCollapsed = Boolean(chapter.isCollapsed);

  const totalRes = chapter.resources.length;
  const completedRes = chapter.resources.filter((r) => r.completed).length;
  const isAllComplete = totalRes > 0 && completedRes === totalRes;

  const filteredResources = chapter.resources.filter((r) => {
    if (filterMode === 'completed') return r.completed;
    if (filterMode === 'incomplete') return !r.completed;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = resTitle.trim();
    if (!trimmedTitle) {
      setFormError('রিসোর্সের শিরোনাম দিন');
      return;
    }

    const sanitized = sanitizeUrl(resUrl);
    if (!sanitized.isValid) {
      setFormError(sanitized.error || 'অনিরাপদ লিংক বা ভুল URL');
      return;
    }

    onAddResource(chapter.id, trimmedTitle, sanitized.url, resType);
    setResTitle('');
    setResUrl('');
    setFormError(null);
    setIsAddingResource(false);
  };

  return (
    <section
      draggable
      onDragStart={(e) => onDragStart(e, 'chapter', chapter.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDropChapter(e, chapter.id)}
      className="mb-4 bg-panel border border-border/40 rounded-xl overflow-hidden shadow-lg transition-all duration-200 hover:border-border"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Collapsible Chapter Header */}
      <div className="flex items-center justify-between gap-3 p-4 bg-[#181818] border-b border-border/40 select-none">
        {/* Left: Collapse Chevron, Drag Handle & Title */}
        <div
          onClick={() => onToggleCollapseChapter(chapter.id)}
          className="flex items-center gap-3 flex-1 cursor-pointer min-w-[200px]"
        >
          {/* Chevron Collapse/Expand Indicator */}
          <button
            type="button"
            className="p-1 rounded-full text-ink-muted hover:text-white hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'এক্সপ্যান্ড করুন' : 'মিনিমাইজ করুন'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-spotify" />
            ) : (
              <ChevronDown className="w-5 h-5 text-spotify" />
            )}
          </button>

          {/* Drag Handle */}
          <span
            className="cursor-grab active:cursor-grabbing text-faint hover:text-ink-muted transition-colors p-0.5"
            title="চ্যাপ্টার ড্র্যাগ করুন"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </span>

          <h3 className="text-base font-bold text-white tracking-tight flex-1">
            {chapter.name}
          </h3>
        </div>

        {/* Right: Stats Badge & Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Completion Badge Pill */}
          <button
            onClick={() => onToggleAllChapterComplete(chapter.id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              isAllComplete
                ? 'bg-spotify/15 text-spotify border-spotify/30'
                : 'bg-[#242424] text-ink-muted border-border hover:text-white'
            }`}
            title="চ্যাপ্টারের সব স্ট্যাটাস টগল করুন"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>
              {toBn(completedRes)}/{toBn(totalRes)} সম্পন্ন
            </span>
          </button>

          {/* Add Resource Button */}
          <button
            onClick={() => {
              if (isCollapsed) onToggleCollapseChapter(chapter.id);
              setIsAddingResource(!isAddingResource);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#282828] hover:bg-[#333333] border border-border text-xs font-semibold text-white transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> রিসোর্স
          </button>

          {/* Edit Chapter */}
          <button
            onClick={() => onEditChapter(chapter)}
            className="p-1.5 rounded-full text-ink-muted hover:text-white hover:bg-white/10 transition-colors"
            title="চ্যাপ্টার সম্পাদনা করুন"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Delete Chapter */}
          <button
            onClick={() => onDeleteChapter(chapter.id)}
            className="p-1.5 rounded-full text-ink-muted hover:text-danger hover:bg-danger-bg transition-colors"
            title="চ্যাপ্টার মুছুন"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Accordion Content Body */}
      {!isCollapsed && (
        <div className="p-4 bg-panel animate-fadeIn">
          {/* Resource List (Spotify Tracklist format) */}
          {filteredResources.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {filteredResources.map((res) => (
                <ResourceItem
                  key={res.id}
                  resource={res}
                  chapterId={chapter.id}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditResource}
                  onDelete={onDeleteResource}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDropResource}
                />
              ))}
            </ul>
          ) : (
            <p className="text-xs text-ink-muted py-3 px-2 italic">
              {filterMode !== 'all'
                ? 'এই ফিল্টারে কোনো রিসোর্স মেলেনি।'
                : 'কোনো রিসোর্স যুক্ত করা হয়নি। "+ রিসোর্স" বোতামে চাপ দিন।'}
            </p>
          )}

          {/* Add Resource Inline Form */}
          {isAddingResource && (
            <form
              onSubmit={handleAddSubmit}
              className="mt-4 p-4 bg-[#181818] border border-border/50 rounded-lg animate-slideDown flex flex-col gap-3"
            >
              <div className="flex gap-1 p-1 bg-[#242424] rounded-md self-start">
                <button
                  type="button"
                  onClick={() => setResType('yt')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all ${
                    resType === 'yt'
                      ? 'bg-panel text-yt shadow-sm'
                      : 'text-ink-muted hover:text-white'
                  }`}
                >
                  <Youtube className="w-3.5 h-3.5" /> YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setResType('drive')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all ${
                    resType === 'drive'
                      ? 'bg-panel text-dr shadow-sm'
                      : 'text-ink-muted hover:text-white'
                  }`}
                >
                  <HardDrive className="w-3.5 h-3.5" /> Drive
                </button>
                <button
                  type="button"
                  onClick={() => setResType('tg')}
                  className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded transition-all ${
                    resType === 'tg'
                      ? 'bg-panel text-tg shadow-sm'
                      : 'text-ink-muted hover:text-white'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" /> Telegram
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="রিসোর্সের শিরোনাম"
                  value={resTitle}
                  onChange={(e) => {
                    setResTitle(e.target.value);
                    setFormError(null);
                  }}
                  className="w-full bg-[#242424] border border-transparent focus:border-spotify/50 rounded-md px-3.5 py-2 text-sm text-white placeholder-ink-muted outline-none transition-all"
                  required
                />
                <input
                  type="text"
                  placeholder="লিংক (https://...)"
                  value={resUrl}
                  onChange={(e) => {
                    setResUrl(e.target.value);
                    setFormError(null);
                  }}
                  className="w-full bg-[#242424] border border-transparent focus:border-spotify/50 rounded-md px-3.5 py-2 text-sm text-white placeholder-ink-muted outline-none transition-all"
                  required
                />
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-2 rounded bg-danger-bg text-danger text-xs font-medium">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingResource(false)}
                  className="px-4 py-1.5 text-xs font-bold rounded-full border border-border text-ink-muted hover:text-white transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 text-xs font-bold rounded-full bg-spotify text-black hover:bg-spotify-hover transition-all"
                >
                  যুক্ত করুন
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};
