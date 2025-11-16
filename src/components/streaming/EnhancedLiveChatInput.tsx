import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, Paperclip, Image, Camera, Mic, X, File, Heart, ThumbsUp, Laugh, Angry, Zap, Frown } from 'lucide-react';
import { ModernEmojiPicker } from '../ModernEmojiPicker';
import { BootstrapIcon } from '../BootstrapIcon';
import { ProductQuestionButton } from './ProductQuestionButton';

interface EnhancedLiveChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onFileAttach?: (file: File) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  onProductQuestionClick?: () => void;
  hasActiveProducts?: boolean;
}

interface AttachedFile {
  id: string;
  file: File;
  type: 'image' | 'video' | 'audio' | 'document';
  preview?: string;
}

const QUICK_REACTIONS = [
  { emoji: '❤️', icon: Heart, color: '#e91e63' },
  { emoji: '👍', icon: ThumbsUp, color: '#2196f3' },
  { emoji: '😂', icon: Laugh, color: '#ff9800' },
  { emoji: '⚡', icon: Zap, color: '#9c27b0' },
  { emoji: '😢', icon: Frown, color: '#607d8b' },
  { emoji: '😡', icon: Angry, color: '#f44336' },
];

export function EnhancedLiveChatInput({
  value,
  onChange,
  onSend,
  onFileAttach,
  disabled = false,
  placeholder = "Type your message...",
  className = "",
  onProductQuestionClick,
  hasActiveProducts = false
}: EnhancedLiveChatInputProps) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [showQuickReactions, setShowQuickReactions] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout>();

  const handleEmojiSelect = useCallback((emoji: string) => {
    const newValue = value + emoji;
    onChange(newValue);
    inputRef.current?.focus();
  }, [value, onChange]);

  const handleQuickReaction = useCallback((emoji: string) => {
    const newValue = value + emoji;
    onChange(newValue);
    setShowQuickReactions(false);
    inputRef.current?.focus();
  }, [value, onChange]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || attachedFiles.length > 0) {
        onSend();
        setAttachedFiles([]);
      }
    }
  }, [value, attachedFiles, onSend]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image' | 'video') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const attachedFile: AttachedFile = {
      id: Date.now().toString(),
      file,
      type: type === 'document' ? 'document' : file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document'
    };

    // Create preview for images
    if (attachedFile.type === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        attachedFile.preview = e.target?.result as string;
        setAttachedFiles(prev => [...prev, attachedFile]);
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedFiles(prev => [...prev, attachedFile]);
    }

    onFileAttach?.(file);
    setShowAttachMenu(false);
    
    // Reset input
    event.target.value = '';
  }, [onFileAttach]);

  const removeAttachedFile = useCallback((id: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const startVoiceRecording = useCallback(() => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setShowAttachMenu(false);
  }, []);

  const stopVoiceRecording = useCallback(() => {
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-full ${className}`} style={{ minHeight: '60px' }}>
      {/* Attached Files Preview */}
      <AnimatePresence>
        {attachedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 flex flex-wrap gap-2"
          >
            {attachedFiles.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="relative p-2 bg-white/10 rounded-lg border border-white/20 flex items-center gap-2">
                  {file.type === 'image' && file.preview ? (
                    <img src={file.preview} alt="Preview" className="w-8 h-8 object-cover rounded" />
                  ) : (
                    <BootstrapIcon name="file-earmark" className="w-4 h-4 text-white" />
                  )}
                  <span className="text-white text-xs font-body max-w-20 truncate">
                    {file.file.name}
                  </span>
                  <motion.button
                    onClick={() => removeAttachedFile(file.id)}
                    className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={12} color="white" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recording UI */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-3 h-3 bg-red-500 rounded-full"
            />
            <span className="text-white font-body text-sm">Recording...</span>
            <span className="text-white/80 font-body text-xs">{formatRecordingTime(recordingTime)}</span>
            <motion.button
              onClick={stopVoiceRecording}
              className="ml-auto px-3 py-1 bg-red-500 text-white rounded-full text-xs font-body"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Stop
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Area */}
      <div className="relative flex items-end gap-2 w-full" style={{ minHeight: '48px' }}>
        {/* Quick Reactions Button */}
        <div className="relative">
          <motion.button
            onClick={() => setShowQuickReactions(!showQuickReactions)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={disabled}
          >
            <Heart size={16} color="white" />
          </motion.button>

          {/* Quick Reactions Popup */}
          <AnimatePresence>
            {showQuickReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-full mb-2 left-0 p-2 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 flex gap-1"
              >
                {QUICK_REACTIONS.map((reaction, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickReaction(reaction.emoji)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    style={{ color: reaction.color }}
                  >
                    {reaction.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Field Container */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="w-full px-4 py-3 pr-20 bg-white/10 text-white placeholder-white/60 border border-white/20 focus:border-[#2b2bf7] focus:outline-none font-body rounded-lg"
            style={{ 
              fontSize: '16px',
              minHeight: '48px',
              WebkitAppearance: 'none',
              borderRadius: '8px'
            }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Emoji and Attachment Buttons Inside Input */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* Attachment Menu Button */}
            <div className="relative">
              <motion.button
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={disabled}
              >
                <Paperclip size={14} color="white" />
              </motion.button>

              {/* Attachment Menu */}
              <AnimatePresence>
                {showAttachMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    className="absolute bottom-full mb-2 right-0 p-3 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 min-w-48"
                  >
                    <div className="space-y-2">
                      <motion.button
                        onClick={() => imageInputRef.current?.click()}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                        whileHover={{ x: 2 }}
                      >
                        <Image size={16} color="#4ade80" />
                        <span className="text-white font-body text-sm">Photo</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                        whileHover={{ x: 2 }}
                      >
                        <Camera size={16} color="#f59e0b" />
                        <span className="text-white font-body text-sm">Video</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={startVoiceRecording}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                        whileHover={{ x: 2 }}
                      >
                        <Mic size={16} color="#ef4444" />
                        <span className="text-white font-body text-sm">Voice Message</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                        whileHover={{ x: 2 }}
                      >
                        <File size={16} color="#8b5cf6" />
                        <span className="text-white font-body text-sm">Document</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Emoji Button */}
            <motion.button
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={disabled}
            >
              <Smile size={14} color="white" />
            </motion.button>
          </div>
        </div>

        {/* Product Question Button */}
        <ProductQuestionButton
          onClick={() => onProductQuestionClick?.()}
          hasActiveProducts={hasActiveProducts}
        />

        {/* Send Button */}
        <motion.button
          onClick={() => {
            if (value.trim() || attachedFiles.length > 0) {
              onSend();
              setAttachedFiles([]);
            }
          }}
          className="w-12 h-12 rounded-full flex items-center justify-center font-body font-medium"
          style={{ 
            background: 'linear-gradient(135deg, #2b2bf7, #4040f8)',
            minWidth: '48px'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={disabled || (!value.trim() && attachedFiles.length === 0)}
        >
          <Send size={16} color="white" />
        </motion.button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.xlsx,.ppt,.pptx"
        onChange={(e) => handleFileSelect(e, 'document')}
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'image')}
      />
      <input
        ref={videoInputRef}
        type="file"
        className="hidden"
        accept="video/*"
        onChange={(e) => handleFileSelect(e, 'video')}
      />

      {/* Emoji Picker */}
      <ModernEmojiPicker
        isOpen={isEmojiPickerOpen}
        onClose={() => setIsEmojiPickerOpen(false)}
        onEmojiSelect={handleEmojiSelect}
        position="top"
        className="absolute bottom-full right-0 mb-2"
      />
    </div>
  );
}