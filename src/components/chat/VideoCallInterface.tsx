import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Camera, 
  CameraOff,
  Volume2,
  VolumeX,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';

interface VideoCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  supportAgent?: {
    name: string;
    avatar: string;
    status: 'online' | 'busy' | 'away';
  };
  isMobile?: boolean;
}

export function VideoCallInterface({ 
  isOpen, 
  onClose, 
  supportAgent = {
    name: 'Amara - Style Assistant',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    status: 'online'
  },
  isMobile = false 
}: VideoCallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended' | 'unavailable'>('connecting');
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionTime, setConnectionTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      initializeVideoCall();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      endCall();
    };
  }, [isOpen]);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setConnectionTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  const initializeVideoCall = async () => {
    try {
      // Simulate connection delay
      setTimeout(() => {
        // Check if video calling is available (simulate availability check)
        const isVideoAvailable = Math.random() > 0.3; // 70% chance of being available
        
        if (isVideoAvailable) {
          setCallStatus('connected');
          startLocalVideo();
        } else {
          setCallStatus('unavailable');
        }
      }, 2000);
    } catch (error) {
      console.error('Error initializing video call:', error);
      setCallStatus('unavailable');
    }
  };

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsVideoEnabled(false);
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoEnabled;
      });
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isAudioEnabled;
      });
    }
  };

  const endCall = () => {
    setCallStatus('ended');
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (callStatus === 'connected') {
        setShowControls(false);
      }
    }, 3000);
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
        className="fixed inset-0 z-[10000]"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)'
        }}
        onMouseMove={handleMouseMove}
        onClick={callStatus === 'connected' ? undefined : onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`${
            isFullscreen || isMobile ? 'w-full h-full' : 'w-full max-w-4xl mx-auto my-8'
          } rounded-lg overflow-hidden shadow-2xl flex flex-col relative`}
          style={{
            backgroundColor: '#000000',
            border: isFullscreen || isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: isFullscreen || isMobile ? '0px' : '12px',
            height: isFullscreen || isMobile ? '100vh' : 'calc(100vh - 4rem)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Video Areas */}
          <div className="flex-1 relative bg-black">
            {/* Remote Video (Support Agent) */}
            <div className="absolute inset-0">
              {callStatus === 'connected' ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
                  {/* Simulated remote video feed */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ 
                      background: [
                        'linear-gradient(135deg, #5825efff, #6e29f6)',
                        'linear-gradient(135deg, #6e29f6, #5825efff)',
                        'linear-gradient(135deg, #5825efff, #6e29f6)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="text-center space-y-4">
                      <motion.div
                        className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-white/30"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <img 
                          src={supportAgent.avatar}
                          alt={supportAgent.name}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      <div>
                        <h3 className="text-white text-xl font-heading font-semibold">
                          {supportAgent.name}
                        </h3>
                        <p className="text-white/80 text-sm font-body">
                          Fashion Style Expert
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Connection Quality Indicator */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <motion.div
                          key={bar}
                          className="w-1 bg-green-400 rounded-full"
                          style={{ height: `${bar * 3 + 6}px` }}
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity, 
                            delay: bar * 0.1 
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-white text-xs font-body">HD</span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                  {callStatus === 'connecting' && (
                    <div className="text-center space-y-6">
                      <motion.div
                        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(88, 37, 239, 0.2)' }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <Video className="h-12 w-12" style={{ color: '#5825efff' }} />
                      </motion.div>
                      <div>
                        <h3 className="text-white text-xl font-heading font-semibold mb-2">
                          Connecting to {supportAgent.name}...
                        </h3>
                        <motion.div className="flex justify-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ 
                                duration: 1, 
                                repeat: Infinity, 
                                delay: i * 0.3 
                              }}
                            />
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {callStatus === 'unavailable' && (
                    <div className="text-center space-y-6">
                      <div 
                        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(231, 76, 60, 0.2)' }}
                      >
                        <VideoOff className="h-12 w-12" style={{ color: '#e74c3c' }} />
                      </div>
                      <div>
                        <h3 className="text-white text-xl font-heading font-semibold mb-2">
                          Video Call Unavailable
                        </h3>
                        <p className="text-white/70 text-sm font-body mb-6">
                          Our support team is currently busy. You can try again later or continue with text chat.
                        </p>
                        <div className="flex gap-3 justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onClose}
                            className="btn-moema btn-moema-primary px-6 py-3 rounded-lg"
                          >
                            Back to Chat
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={initializeVideoCall}
                            className="btn-moema btn-moema-secondary px-6 py-3 rounded-lg"
                          >
                            Try Again
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}

                  {callStatus === 'ended' && (
                    <div className="text-center space-y-6">
                      <div 
                        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
                        style={{ backgroundColor: 'rgba(88, 37, 239, 0.2)' }}
                      >
                        <PhoneOff className="h-12 w-12" style={{ color: '#5825efff' }} />
                      </div>
                      <div>
                        <h3 className="text-white text-xl font-heading font-semibold mb-2">
                          Call Ended
                        </h3>
                        <p className="text-white/70 text-sm font-body">
                          Call duration: {formatTime(connectionTime)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Local Video (Picture-in-Picture) */}
            {callStatus === 'connected' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/30 bg-black"
                style={{ zIndex: 10 }}
              >
                {isVideoEnabled ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <CameraOff className="h-8 w-8 text-white/60" />
                  </div>
                )}
                
                {/* Local video status indicators */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {!isVideoEnabled && (
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <VideoOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                  {!isAudioEnabled && (
                    <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                      <MicOff className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <AnimatePresence>
            {(showControls || callStatus !== 'connected') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6"
              >
                {callStatus === 'connected' && (
                  <>
                    {/* Call Timer */}
                    <div className="text-center mb-4">
                      <p className="text-white text-sm font-body">
                        {formatTime(connectionTime)}
                      </p>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleAudio}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isAudioEnabled ? 'bg-white/20' : 'bg-red-500'
                        }`}
                      >
                        {isAudioEnabled ? (
                          <Mic className="h-5 w-5 text-white" />
                        ) : (
                          <MicOff className="h-5 w-5 text-white" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleVideo}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isVideoEnabled ? 'bg-white/20' : 'bg-red-500'
                        }`}
                      >
                        {isVideoEnabled ? (
                          <Video className="h-5 w-5 text-white" />
                        ) : (
                          <VideoOff className="h-5 w-5 text-white" />
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          isSpeakerEnabled ? 'bg-white/20' : 'bg-gray-600'
                        }`}
                      >
                        {isSpeakerEnabled ? (
                          <Volume2 className="h-5 w-5 text-white" />
                        ) : (
                          <VolumeX className="h-5 w-5 text-white" />
                        )}
                      </motion.button>

                      {!isMobile && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={toggleFullscreen}
                          className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
                        >
                          {isFullscreen ? (
                            <Minimize className="h-5 w-5 text-white" />
                          ) : (
                            <Maximize className="h-5 w-5 text-white" />
                          )}
                        </motion.button>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={endCall}
                        className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
                      >
                        <PhoneOff className="h-6 w-6 text-white" />
                      </motion.button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close Button (when not connected) */}
          {callStatus !== 'connected' && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              style={{ zIndex: 20 }}
            >
              <X className="h-5 w-5 text-white" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}