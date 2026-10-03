'use client';

import React from 'react';
import { Resource } from '@/types/library';
import { sanitizeUrl } from '@/utils/security';
import {
  Youtube,
  HardDrive,
  Send,
  ExternalLink,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
  GripVertical,
  Play,
} from 'lucide-react';

interface ResourceItemProps {
  resource: Resource;
  chapterId: string;
  onToggleComplete: (chapterId: string, resourceId: string) => void;
  onEdit: (resource: Resource, chapterId: string) => void;
  onDelete: (chapterId: string, resourceId: string) => void;
  onDragStart: (e: React.DragEvent, type: 'resource', id: string, chapterId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetResourceId: string, chapterId: string) => void;
}

export const ResourceItem: React.FC<ResourceItemProps> = ({
  resource,
  chapterId,
  onToggleComplete,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  const sanitized = sanitizeUrl(resource.url);
  const safeUrl = sanitized.isValid ? sanitized.url : '#unsafe-link';

  const renderBadge = () => {
    switch (resource.type) {
      case 'yt':
        return <Youtube className="w-4 h-4 text-yt" />;
      case 'drive':
        return <HardDrive className="w-4 h-4 text-dr" />;
      case 'tg':
        return <Send className="w-4 h-4 text-tg" />;
      default:
        return <Youtube className="w-4 h-4 text-yt" />;
    }
  };

  return (
    <li
      draggable
      onDragStart={(e) => onDragStart(e, 'resource', resource.id, chapterId)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, resource.id, chapterId)}
      className={`group flex items-center gap-3 p-2.5 rounded-md hover:bg-[#2a2a2a] transition-all duration-150 ${
        resource.completed ? 'opacity-70' : ''
      }`}
    >
      {/* Drag Handle */}
      <span
        className="cursor-grab active:cursor-grabbing text-faint group-hover:text-ink-muted transition-colors p-0.5"
        title="ড্র্যাগ করে সাজান"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </span>

      {/* Completion Toggle */}
      <button
        onClick={() => onToggleComplete(chapterId, resource.id)}
        className="text-ink-muted hover:text-spotify transition-colors p-0.5 shrink-0"
        title={resource.completed ? 'অসম্পূর্ণ হিসেবে চিহ্নিত করুন' : 'সম্পন্ন হিসেবে চিহ্নিত করুন'}
      >
        {resource.completed ? (
          <CheckCircle2 className="w-5 h-5 text-spotify fill-spotify/20" />
        ) : (
          <Circle className="w-5 h-5 text-faint group-hover:text-ink-muted" />
        )}
      </button>

      {/* Resource Icon Badge */}
      <div className="flex items-center justify-center w-7 h-7 rounded bg-[#242424] shrink-0 border border-border/30">
        {renderBadge()}
      </div>

      {/* Resource Title & Link */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`text-sm font-semibold truncate transition-colors ${
            resource.completed
              ? 'line-through text-ink-muted hover:text-white'
              : 'text-white hover:text-spotify hover:underline'
          }`}
          onClick={(e) => {
            if (!sanitized.isValid) {
              e.preventDefault();
              alert(sanitized.error || 'অনিরাপদ লিংক!');
            }
          }}
        >
          {resource.title}
        </a>
      </div>

      {/* Action Buttons & Spotify Play Button */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onEdit(resource, chapterId)}
          className="p-1.5 rounded-full text-ink-muted hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
          title="সম্পাদনা করুন"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(chapterId, resource.id)}
          className="p-1.5 rounded-full text-ink-muted hover:text-danger hover:bg-danger-bg opacity-0 group-hover:opacity-100 transition-all"
          title="রিসোর্স মুছুন"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        {/* Play / Open External Link */}
        <a
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-7 h-7 rounded-full bg-spotify hover:bg-spotify-hover text-black flex items-center justify-center shadow-md hover:scale-105 transition-all"
          title="নতুন ট্যাবে রিসোর্সটি দেখুন"
          onClick={(e) => {
            if (!sanitized.isValid) {
              e.preventDefault();
              alert(sanitized.error || 'অনিরাপদ লিংক!');
            }
          }}
        >
          <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
        </a>
      </div>
    </li>
  );
};
