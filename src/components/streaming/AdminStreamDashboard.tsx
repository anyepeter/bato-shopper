import React, { useState } from 'react';
import { useApp } from '../AppProvider';
import { BootstrapIcon } from '../BootstrapIcon';
import { MOCK_STREAMS, STREAM_CATEGORY_LABELS } from '../../constants/streamingData';
import { Stream } from '../../types';

export function AdminStreamDashboard() {
  const { state, actions } = useApp();
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const liveStreams = MOCK_STREAMS.filter(stream => stream.isLive);
  const upcomingStreams = MOCK_STREAMS.filter(stream => !stream.isLive);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (stream: Stream) => {
    if (stream.isLive) return 'text-green-600 bg-green-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getStatusText = (stream: Stream) => {
    if (stream.isLive) return 'LIVE';
    return 'SCHEDULED';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl text-black mb-2">Stream Management</h1>
          <p className="font-body text-medium-gray">
            Manage live streams and product showcases
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-moema-primary px-6 py-3 font-body text-sm"
          style={{ borderRadius: 'var(--radius-lg)' }}
        >
          <BootstrapIcon name="plus" className="w-4 h-4 mr-2" />
          Create Stream
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-medium-gray mb-1">Live Streams</p>
              <p className="font-heading text-2xl text-black">{liveStreams.length}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <BootstrapIcon name="broadcast" className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-medium-gray mb-1">Scheduled</p>
              <p className="font-heading text-2xl text-black">{upcomingStreams.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BootstrapIcon name="calendar-event" className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-medium-gray mb-1">Total Viewers</p>
              <p className="font-heading text-2xl text-black">
                {MOCK_STREAMS.reduce((sum, stream) => sum + stream.viewerCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BootstrapIcon name="eye" className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-medium-gray mb-1">Products Featured</p>
              <p className="font-heading text-2xl text-black">
                {MOCK_STREAMS.reduce((sum, stream) => sum + stream.products.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-extra-light-blue rounded-lg flex items-center justify-center">
              <BootstrapIcon name="bag" className="w-6 h-6 text-primary-blue" />
            </div>
          </div>
        </div>
      </div>

      {/* Live Streams Section */}
      {liveStreams.length > 0 && (
        <div className="bg-white rounded-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h2 className="font-heading text-xl text-black">Live Streams</h2>
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                {liveStreams.length}
              </span>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {liveStreams.map((stream) => (
                <div
                  key={stream.id}
                  className="flex items-center gap-4 p-4 border border-light-gray rounded-lg hover:bg-light-gray transition-colors"
                >
                  <img
                    src={stream.thumbnailImage}
                    alt={stream.title}
                    className="w-20 h-16 object-cover rounded"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-heading text-base text-black line-clamp-1">
                        {stream.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(stream)}`}>
                        {getStatusText(stream)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-medium-gray">
                      <span className="flex items-center gap-1">
                        <BootstrapIcon name="person" className="w-4 h-4" />
                        {stream.streamerName}
                      </span>
                      <span className="flex items-center gap-1">
                        <BootstrapIcon name="eye" className="w-4 h-4" />
                        {stream.viewerCount} viewers
                      </span>
                      <span className="flex items-center gap-1">
                        <BootstrapIcon name="bag" className="w-4 h-4" />
                        {stream.products.length} products
                      </span>
                      <span className="flex items-center gap-1">
                        <BootstrapIcon name="clock" className="w-4 h-4" />
                        {formatDate(stream.startTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStream(stream)}
                      className="btn-moema-secondary px-3 py-2 font-body text-sm"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      Manage
                    </button>
                    <button
                      onClick={() => {
                        actions.setCurrentStream(stream);
                        actions.navigateToPage('live-streams');
                      }}
                      className="btn-moema-outline px-3 py-2 font-body text-sm"
                      style={{ borderRadius: 'var(--radius-sm)' }}
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scheduled Streams Section */}
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <BootstrapIcon name="calendar-event" className="w-5 h-5 text-blue-600" />
            <h2 className="font-heading text-xl text-black">Scheduled Streams</h2>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              {upcomingStreams.length}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {upcomingStreams.map((stream) => (
              <div
                key={stream.id}
                className="flex items-center gap-4 p-4 border border-light-gray rounded-lg hover:bg-light-gray transition-colors"
              >
                <img
                  src={stream.thumbnailImage}
                  alt={stream.title}
                  className="w-20 h-16 object-cover rounded"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading text-base text-black line-clamp-1">
                      {stream.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(stream)}`}>
                      {getStatusText(stream)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-medium-gray">
                    <span className="flex items-center gap-1">
                      <BootstrapIcon name="person" className="w-4 h-4" />
                      {stream.streamerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <BootstrapIcon name="tag" className="w-4 h-4" />
                      {STREAM_CATEGORY_LABELS[stream.category as keyof typeof STREAM_CATEGORY_LABELS]}
                    </span>
                    <span className="flex items-center gap-1">
                      <BootstrapIcon name="bag" className="w-4 h-4" />
                      {stream.products.length} products
                    </span>
                    <span className="flex items-center gap-1">
                      <BootstrapIcon name="clock" className="w-4 h-4" />
                      {formatDate(stream.startTime)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedStream(stream)}
                    className="btn-moema-secondary px-3 py-2 font-body text-sm"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-moema-success px-3 py-2 font-body text-sm"
                    style={{ borderRadius: 'var(--radius-sm)' }}
                  >
                    Go Live
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Stream Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg text-black">Create New Stream</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 hover:bg-light-gray rounded"
              >
                <BootstrapIcon name="x" className="w-4 h-4 text-medium-gray" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block font-body text-sm text-black mb-2">Stream Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-light-gray rounded font-body"
                  placeholder="Enter stream title..."
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              
              <div>
                <label className="block font-body text-sm text-black mb-2">Category</label>
                <select
                  className="w-full px-3 py-2 border border-light-gray rounded font-body"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  <option value="">Select category</option>
                  {Object.entries(STREAM_CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-body text-sm text-black mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-light-gray rounded font-body"
                  placeholder="Enter stream description..."
                  style={{ borderRadius: 'var(--radius-sm)' }}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 btn-moema-outline py-2 font-body text-sm"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    // Handle stream creation
                  }}
                  className="flex-1 btn-moema-primary py-2 font-body text-sm"
                  style={{ borderRadius: 'var(--radius-sm)' }}
                >
                  Create Stream
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}