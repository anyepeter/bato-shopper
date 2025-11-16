import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Square, Play, Pause, Send, Trash2 } from 'lucide-react';

interface VoiceMessageInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSendVoiceMessage: (audioBlob: Blob, duration: number) => void;
  isMobile?: boolean;
}

export function VoiceMessageInterface({ 
  isOpen, 
  onClose, 
  onSendVoiceMessage, 
  isMobile = false 
}: VoiceMessageInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackCurrentTime, setPlaybackCurrentTime] = useState(0);
  const [recordingStartTime, setRecordingStartTime] = useState<number | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'pending' | 'granted' | 'denied'>('pending');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Request microphone permission on component mount
  useEffect(() => {
    if (isOpen) {
      requestMicrophonePermission();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isOpen]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus('granted');
      
      // Stop the stream immediately since we just needed permission
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      console.error('Microphone permission denied:', error);
      setPermissionStatus('denied');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        setRecordedAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
      
      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setRecordingStartTime(Date.now());
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        if (recordingStartTime) {
          setRecordingDuration(Math.floor((Date.now() - recordingStartTime) / 1000));
        }
      }, 100);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setPermissionStatus('denied');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingStartTime(null);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = () => {
    if (recordedAudio && !audioRef.current) {
      const audioUrl = URL.createObjectURL(recordedAudio);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.addEventListener('loadedmetadata', () => {
        setRecordingDuration(Math.floor(audio.duration));
      });
      
      audio.addEventListener('timeupdate', () => {
        setPlaybackCurrentTime(Math.floor(audio.currentTime));
      });
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlaybackCurrentTime(0);
      });
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setRecordedAudio(null);
    setIsPlaying(false);
    setPlaybackCurrentTime(0);
    setRecordingDuration(0);
  };

  const sendVoiceMessage = () => {
    if (recordedAudio) {
      onSendVoiceMessage(recordedAudio, recordingDuration);
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center"
        style={{
          background: isMobile 
            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)'
            : 'rgba(0, 0, 0, 0.8)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`${
            isMobile ? 'w-full h-full' : 'w-96 max-w-sm mx-4'
          } rounded-lg overflow-hidden shadow-2xl flex flex-col`}
          style={{
            backgroundColor: isMobile ? '#000000' : 'var(--pure-white)',
            border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: isMobile ? '0px' : '12px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between p-6 border-b"
            style={{
              background: isMobile 
                ? 'linear-gradient(135deg, #5825efff 0%, #5825efff 100%)'
                : 'linear-gradient(135deg, #5825efff 0%, #6e29f6 100%)',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Mic className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
              </motion.div>
              <div>
                <h3 
                  className="font-heading font-semibold"
                  style={{ color: 'var(--pure-white)' }}
                >
                  Voice Message
                </h3>
                <p 
                  className="text-sm opacity-90 font-body"
                  style={{ color: 'var(--pure-white)' }}
                >
                  Record and send audio
                </p>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <X className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
            </motion.button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center space-y-6">
            {permissionStatus === 'denied' && (
              <div className="text-center space-y-4">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
                  style={{ backgroundColor: 'rgba(231, 76, 60, 0.1)' }}
                >
                  <Mic className="h-8 w-8" style={{ color: '#e74c3c' }} />
                </div>
                <div>
                  <h4 
                    className="font-heading font-semibold mb-2"
                    style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
                  >
                    Microphone Access Required
                  </h4>
                  <p 
                    className="text-sm opacity-70 font-body"
                    style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                  >
                    Please allow microphone access to record voice messages
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestMicrophonePermission}
                  className="btn-moema btn-moema-primary px-6 py-3 rounded-lg"
                >
                  Grant Permission
                </motion.button>
              </div>
            )}

            {permissionStatus === 'granted' && (
              <>
                {/* Recording Visualizer */}
                <div className="text-center space-y-4">
                  <motion.div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center mx-auto"
                    style={{
                      background: isRecording 
                        ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                        : 'linear-gradient(135deg, #5825efff, #6e29f6)',
                      boxShadow: isRecording 
                        ? '0 0 30px rgba(231, 76, 60, 0.5)'
                        : '0 0 30px rgba(88, 37, 239, 0.3)'
                    }}
                    animate={isRecording ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 30px rgba(231, 76, 60, 0.5)',
                        '0 0 50px rgba(231, 76, 60, 0.8)',
                        '0 0 30px rgba(231, 76, 60, 0.5)'
                      ]
                    } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Mic className="h-12 w-12" style={{ color: 'var(--pure-white)' }} />
                    
                    {isRecording && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-4"
                        style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Recording Status */}
                  {isRecording ? (
                    <div className="space-y-2">
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="flex items-center justify-center gap-2"
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: '#e74c3c' }}
                        />
                        <span 
                          className="font-body font-medium"
                          style={{ color: isMobile ? 'var(--pure-white)' : '#e74c3c' }}
                        >
                          Recording...
                        </span>
                      </motion.div>
                      <p 
                        className="text-2xl font-heading font-bold"
                        style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
                      >
                        {formatTime(recordingDuration)}
                      </p>
                    </div>
                  ) : recordedAudio ? (
                    <div className="space-y-2">
                      <p 
                        className="font-body"
                        style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                      >
                        Recording ready
                      </p>
                      <p 
                        className="text-xl font-heading font-bold"
                        style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
                      >
                        {formatTime(recordingDuration)}
                      </p>
                      {isPlaying && (
                        <p 
                          className="text-sm font-body opacity-70"
                          style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                        >
                          Playing: {formatTime(playbackCurrentTime)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p 
                        className="font-body"
                        style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                      >
                        Tap to start recording
                      </p>
                      <p 
                        className="text-sm font-body opacity-70"
                        style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                      >
                        Maximum 2 minutes
                      </p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!recordedAudio ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isRecording ? stopRecording : startRecording}
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: isRecording ? '#e74c3c' : '#5825efff',
                        color: 'var(--pure-white)'
                      }}
                    >
                      {isRecording ? (
                        <Square className="h-6 w-6" />
                      ) : (
                        <Mic className="h-6 w-6" />
                      )}
                    </motion.button>
                  ) : (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={playRecording}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: '#5825efff',
                          color: 'var(--pure-white)'
                        }}
                      >
                        {isPlaying ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={deleteRecording}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: '#e74c3c',
                          color: 'var(--pure-white)'
                        }}
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={sendVoiceMessage}
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: '#0fa342',
                          color: 'var(--pure-white)'
                        }}
                      >
                        <Send className="h-5 w-5" />
                      </motion.button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}