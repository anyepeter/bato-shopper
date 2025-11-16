import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MessageCircle,
  User,
  Clock,
  Star
} from 'lucide-react';

interface PhoneCallInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  supportAgent?: {
    name: string;
    avatar: string;
    status: 'online' | 'busy' | 'away';
    phone: string;
    department: string;
  };
  isMobile?: boolean;
}

export function PhoneCallInterface({ 
  isOpen, 
  onClose, 
  supportAgent = {
    name: 'Amara Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0OTcxN3wwfDF8c2VhcmNofDF8fGFmcmljYW4lMjB3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTY5OTM2NTczOXww&ixlib=rb-4.1.0&q=80&w=150',
    status: 'online',
    phone: '+1 (800) BATO-HELP',
    department: 'Customer Support'
  },
  isMobile = false 
}: PhoneCallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<'dialing' | 'ringing' | 'connected' | 'ended' | 'busy' | 'unavailable'>('dialing');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      initiateCall();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (callStatus === 'ringing') {
      timerRef.current = setInterval(() => {
        setWaitTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  const initiateCall = () => {
    // Simulate call progression
    setCallStatus('dialing');
    
    setTimeout(() => {
      setCallStatus('ringing');
    }, 1500);
    
    setTimeout(() => {
      // Simulate availability check
      const isAvailable = Math.random() > 0.2; // 80% chance of being available
      const isBusy = Math.random() > 0.7; // 30% chance of being busy when available
      
      if (!isAvailable) {
        setCallStatus('unavailable');
      } else if (isBusy) {
        setCallStatus('busy');
      } else {
        setCallStatus('connected');
        setWaitTime(0);
      }
    }, 4000);
  };

  const endCall = () => {
    setCallStatus('ended');
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleSpeaker = () => {
    setIsSpeakerEnabled(!isSpeakerEnabled);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = () => {
    switch (callStatus) {
      case 'connected': return '#0fa342';
      case 'dialing': case 'ringing': return '#5825efff';
      case 'busy': case 'unavailable': return '#e74c3c';
      case 'ended': return '#868686';
      default: return '#868686';
    }
  };

  const getStatusText = () => {
    switch (callStatus) {
      case 'dialing': return 'Dialing...';
      case 'ringing': return `Ringing... (${formatTime(waitTime)})`;
      case 'connected': return 'Connected';
      case 'busy': return 'Line Busy';
      case 'unavailable': return 'Unavailable';
      case 'ended': return 'Call Ended';
      default: return '';
    }
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
        onClick={callStatus === 'connected' ? undefined : onClose}
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
            borderRadius: isMobile ? '0px' : '12px',
            height: isMobile ? '100vh' : 'auto'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div 
            className="p-6 text-center relative overflow-hidden"
            style={{
              background: isMobile 
                ? 'linear-gradient(135deg, #5825efff 0%, #5825efff 100%)'
                : 'linear-gradient(135deg, #5825efff 0%, #6e29f6 100%)',
              minHeight: isMobile ? '200px' : '150px'
            }}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>

            <div className="relative z-10">
              <h3 
                className="font-heading font-semibold text-lg mb-2"
                style={{ color: 'var(--pure-white)' }}
              >
                {callStatus === 'unavailable' ? 'Support Unavailable' : 'Phone Support'}
              </h3>
              <p 
                className="text-sm opacity-90 font-body"
                style={{ color: 'var(--pure-white)' }}
              >
                {supportAgent.phone}
              </p>
            </div>

            {/* Close Button */}
            {callStatus !== 'connected' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <X className="h-5 w-5" style={{ color: 'var(--pure-white)' }} />
              </motion.button>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 flex flex-col items-center justify-center space-y-8">
            {/* Agent Avatar */}
            <motion.div
              className="relative"
              animate={callStatus === 'ringing' ? {
                scale: [1, 1.05, 1]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div 
                className="w-32 h-32 rounded-full overflow-hidden border-4 mx-auto"
                style={{ 
                  borderColor: getStatusColor(),
                  backgroundColor: 'var(--light-gray)'
                }}
              >
                <img 
                  src={supportAgent.avatar}
                  alt={supportAgent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Status Indicator */}
              <motion.div
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-4"
                style={{ 
                  backgroundColor: getStatusColor(),
                  borderColor: isMobile ? '#000000' : 'var(--pure-white)'
                }}
                animate={callStatus === 'ringing' ? {
                  scale: [1, 1.2, 1]
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {callStatus === 'connected' && (
                  <Phone className="h-4 w-4 text-white" />
                )}
                {(callStatus === 'dialing' || callStatus === 'ringing') && (
                  <motion.div
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                {(callStatus === 'busy' || callStatus === 'unavailable') && (
                  <PhoneOff className="h-4 w-4 text-white" />
                )}
              </motion.div>
            </motion.div>

            {/* Agent Info */}
            <div className="text-center space-y-2">
              <h4 
                className="font-heading font-semibold text-xl"
                style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
              >
                {supportAgent.name}
              </h4>
              <p 
                className="font-body text-sm opacity-70"
                style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
              >
                {supportAgent.department}
              </p>
              
              {/* Call Status */}
              <motion.div
                className="flex items-center justify-center gap-2 mt-4"
                animate={callStatus === 'ringing' ? {
                  opacity: [1, 0.6, 1]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStatusColor() }}
                />
                <span 
                  className="font-body font-medium"
                  style={{ color: isMobile ? 'var(--pure-white)' : getStatusColor() }}
                >
                  {getStatusText()}
                </span>
              </motion.div>

              {/* Call Duration */}
              {callStatus === 'connected' && (
                <div className="mt-4">
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }} />
                    <span 
                      className="font-body text-lg font-semibold"
                      style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
                    >
                      {formatTime(callDuration)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Info for Unavailable/Busy Status */}
            {(callStatus === 'unavailable' || callStatus === 'busy') && (
              <div className="text-center space-y-4 mt-6">
                <p 
                  className="font-body text-sm"
                  style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                >
                  {callStatus === 'busy' 
                    ? 'All our support agents are currently busy. You can try again later or continue with text chat.'
                    : 'Phone support is currently unavailable. You can continue with text chat or try calling later.'
                  }
                </p>
                
                <div className="space-y-3">
                  <p 
                    className="font-body text-xs font-semibold"
                    style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
                  >
                    Support Hours:
                  </p>
                  <div 
                    className="text-xs font-body space-y-1"
                    style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                  >
                    <p>Monday - Friday: 8:00 AM - 8:00 PM EST</p>
                    <p>Saturday: 9:00 AM - 6:00 PM EST</p>
                    <p>Sunday: 10:00 AM - 4:00 PM EST</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="btn-moema btn-moema-primary px-6 py-3 rounded-lg flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Continue Chat
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={initiateCall}
                    className="btn-moema btn-moema-secondary px-6 py-3 rounded-lg"
                  >
                    Try Again
                  </motion.button>
                </div>
              </div>
            )}

            {/* Call Ended Info */}
            {callStatus === 'ended' && (
              <div className="text-center space-y-4">
                <p 
                  className="font-body text-sm"
                  style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                >
                  Call duration: {formatTime(callDuration)}
                </p>
                <p 
                  className="font-body text-sm"
                  style={{ color: isMobile ? 'var(--pure-white)' : 'var(--medium-gray)' }}
                >
                  Thank you for contacting Bato support!
                </p>
                
                {/* Rate Experience */}
                <div className="mt-6 space-y-3">
                  <p 
                    className="font-body text-sm font-semibold"
                    style={{ color: isMobile ? 'var(--pure-white)' : 'var(--black)' }}
                  >
                    How was your experience?
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1"
                      >
                        <Star 
                          className="h-6 w-6"
                          style={{ color: '#FFE087' }}
                          fill="none"
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          {callStatus === 'connected' && (
            <div className="p-6 border-t" style={{ borderColor: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'var(--border)' }}>
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleAudio}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isAudioEnabled ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  title={isAudioEnabled ? 'Mute' : 'Unmute'}
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
                  onClick={toggleSpeaker}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isSpeakerEnabled ? 'bg-blue-500' : 'bg-gray-500'
                  }`}
                  title={isSpeakerEnabled ? 'Speaker On' : 'Speaker Off'}
                >
                  {isSpeakerEnabled ? (
                    <Volume2 className="h-5 w-5 text-white" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-white" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={endCall}
                  className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
                  title="End Call"
                >
                  <PhoneOff className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </div>
          )}

          {/* Quick Actions for Dialing/Ringing */}
          {(callStatus === 'dialing' || callStatus === 'ringing') && (
            <div className="p-6 border-t" style={{ borderColor: isMobile ? 'rgba(255, 255, 255, 0.1)' : 'var(--border)' }}>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={endCall}
                  className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center"
                  title="Cancel Call"
                >
                  <PhoneOff className="h-6 w-6 text-white" />
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}