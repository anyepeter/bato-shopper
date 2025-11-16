import { AlertCircle, Clock, CheckCircle, MessageSquare } from "lucide-react";

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
};

export const formatWaitingTime = (minutes: number) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'var(--error-red)';
    case 'medium': return 'var(--warning-yellow)';
    case 'low': return 'var(--success-light-green)';
    default: return 'var(--medium-gray)';
  }
};

export const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high': return AlertCircle;
    case 'medium': return Clock;
    case 'low': return CheckCircle;
    default: return MessageSquare;
  }
};