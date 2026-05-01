import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { publicApi, PublicProfile } from '@/lib/api';
import { getSocialIcon } from '@/lib/socialIcons';

export function PublicBioPage() {
  const { username } = useParams<{ username: string }>();
  const [data, setData] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [showVolume, setShowVolume] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      try {
        const res = await publicApi.getProfile(username);
        setData(res.data);
        
        // Autoplay if enabled
        if (res.data.theme.music_autoplay && res.data.playlist?.length > 0) {
          setTimeout(() => {
            audioRef.current?.play();
            setIsPlaying(true);
          }, 500);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const handleLinkClick = async (linkId: string, url: string) => {
    if (username) {
      publicApi.trackClick(username, linkId).catch(() => {});
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const playNext = () => {
    if (!data?.playlist || data.playlist.length === 0) return;
    const nextIndex = (currentTrack + 1) % data.playlist.length;
    setCurrentTrack(nextIndex);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!data?.playlist || data.playlist.length === 0) return;
    const prevIndex = currentTrack === 0 ? data.playlist.length - 1 : currentTrack - 1;
    setCurrentTrack(prevIndex);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current && data?.playlist?.[currentTrack]) {
      audioRef.current.src = data.playlist[currentTrack].file_url;
      const savedVolume = data.theme.music_volume || 0.5;
      setVolume(savedVolume);
      audioRef.current.volume = savedVolume;
      audioRef.current.loop = !data.theme.music_loop && data.playlist.length === 1;
      
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, data, isPlaying]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-6">This bio page doesn't exist or has been removed.</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const { profile, links, socials, theme, playlist, role, vip_status } = data;
  const spacing = theme.spacing === 'compact' ? 'gap-2' : theme.spacing === 'relaxed' ? 'gap-6' : 'gap-4';
  const isOwner = role === 'owner';
  const isVip = vip_status === 1 || isOwner;
  const showWatermark = !isOwner && (theme.show_watermark === undefined || theme.show_watermark === 1);
  
  const getBackground = () => {
    if (theme.bg_custom_image) {
      return { backgroundImage: `url(${theme.bg_custom_image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (theme.bg_type === 'image' && theme.bg_image_url) {
      return { backgroundImage: `url(${theme.bg_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    if (theme.bg_type === 'gradient') return { background: theme.bg_gradient };
    return { backgroundColor: theme.bg_color };
  };

  const getCardStyle = (): React.CSSProperties => {
    const borderRadius = theme.card_border_radius || 16;
    const blur = theme.card_blur || 12;
    const opacity = theme.card_opacity || 0.15;
    const width = theme.card_width || 500;
    const maxWidth = theme.card_max_width || 1200;
    const padding = theme.card_padding || 32;
    const borderWidth = theme.card_border_width || 1;
    const borderColor = theme.card_border_color || 'rgba(255,255,255,0.1)';
    
    const shadow = theme.card_shadow === 'none' ? 'none' : 
                   theme.card_shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                   theme.card_shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' :
                   theme.card_shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.3)' :
                   '0 20px 25px -5px rgb(0 0 0 / 0.5)';
    
    const glowShadow = theme.card_glow ? '0 0 30px rgba(34,197,94,0.15)' : '';
    const combinedShadow = glowShadow ? `${shadow}, ${glowShadow}` : shadow;
    
    return {
      borderRadius: `${borderRadius}px`,
      backdropFilter: `blur(${blur}px)`,
      backgroundColor: `rgba(255,255,255,${opacity})`,
      border: `${borderWidth}px solid ${borderColor}`,
      boxShadow: combinedShadow,
      width: `${width}px`,
      maxWidth: `${maxWidth}px`,
      padding: `${padding}px`,
      position: 'relative'
    };
  };

  const getButtonStyles = (): React.CSSProperties => {
    const paddingY = theme.button_padding_y || 14;
    const paddingX = theme.button_padding_x || 24;
    const fontSize = theme.button_font_size || 16;
    const fontWeight = theme.button_font_weight || 500;
    const borderWidth = theme.button_border_width || 1;
    const radius = theme.button_radius || 12;
    
    return {
      paddingTop: `${paddingY}px`,
      paddingBottom: `${paddingY}px`,
      paddingLeft: `${paddingX}px`,
      paddingRight: `${paddingX}px`,
      fontSize: `${fontSize}px`,
      fontWeight,
      borderRadius: `${radius}px`,
      borderWidth: `${borderWidth}px`
    };
  };

  const getButtonClass = () => {
    if (theme.button_style === 'glass') {
      return 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 hover:border-green-500/40 hover:scale-[1.02] active:scale-[0.98]';
    }
    if (theme.button_style === 'solid') {
      return 'bg-green-500 text-black hover:bg-green-400 border-green-500 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,197,94,0.3)]';
    }
    if (theme.button_style === 'outline') {
      return 'border-white/30 text-white hover:border-green-500 hover:bg-green-500/10 bg-transparent hover:scale-[1.02] active:scale-[0.98]';
    }
    return 'text-gray-300 hover:text-white hover:bg-white/5 border-transparent bg-transparent';
  };

  const marginTop = theme.card_margin_top || 48;
  const marginBottom = theme.card_margin_bottom || 48;

  return (
    <div className="min-h-screen w-full relative bio-page overflow-x-hidden flex items-center justify-center" style={getBackground()}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: theme.bg_overlay_opacity }} />
      
      {/* Custom CSS */}
      {theme.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: `.bio-page { ${theme.custom_css} }` }} />
      )}

      {/* Music Player */}
      {playlist && playlist.length > 0 && (
        <>
          <audio
            ref={audioRef}
            onEnded={playNext}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          />
          
          <div className="fixed bottom-6 left-6 z-50">
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl w-96">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/30 to-green-700/30 flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{playlist[currentTrack]?.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Трек {currentTrack + 1} из {playlist.length}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    const time = parseFloat(e.target.value);
                    setCurrentTime(time);
                    if (audioRef.current) audioRef.current.currentTime = time;
                  }}
                  className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                  <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}</span>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <button onClick={playPrevious} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-black transition-all shadow-[0_0_25px_rgba(34,197,94,0.5)] hover:scale-110">
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
                
                <button onClick={playNext} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all hover:scale-110">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="relative flex justify-end">
                <div
                  className="relative"
                  onMouseEnter={() => setShowVolume(true)}
                  onMouseLeave={() => setShowVolume(false)}
                >
                  {showVolume && (
                    <div className="absolute bottom-10 right-0 w-36 p-2 rounded-lg bg-black/90 border border-white/10">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => {
                          const vol = parseFloat(e.target.value);
                          setVolume(vol);
                          if (audioRef.current) audioRef.current.volume = vol;
                        }}
                        className="w-full h-1.5 rounded-full bg-white/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                      />
                    </div>
                  )}
                  <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Content */}
      <div 
        className={`relative z-10 w-full px-6 flex flex-col items-center ${spacing}`}
        style={{ 
          paddingTop: `${marginTop}px`, 
          paddingBottom: `${marginBottom}px`,
          maxWidth: `${theme.card_max_width || 1200}px`
        }}
      >
        {/* Avatar & Info */}
        <div style={getCardStyle()} className="flex flex-col items-center text-center mx-auto w-full">
          {/* Badge */}
          {(isOwner || isVip) && (
            <div className="absolute top-4 right-4 transform rotate-12">
              {isOwner ? (
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 backdrop-blur-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-yellow-400 text-xs font-bold">OWNER</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 backdrop-blur-sm flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  <span className="text-green-400 text-xs font-bold">VIP</span>
                </div>
              )}
            </div>
          )}

          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || username}
              className="w-28 h-28 rounded-full object-cover mb-5 border-2 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/30 border-2 border-green-500/30 flex items-center justify-center mb-5 shadow-lg">
              <svg className="w-14 h-14 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <h1 className="text-2xl font-bold text-white mb-2">
            {profile.display_name || username}
          </h1>
          
          <p className="text-sm text-gray-400 mb-4">@{username}</p>
          
          {profile.bio && (
            <p className="text-sm text-gray-300 leading-relaxed">{profile.bio}</p>
          )}
        </div>

        {/* Links */}
        {links.length > 0 && (
          <div className={`flex flex-col ${spacing} w-full`}>
            {links.map((link, index) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id, link.url)}
                className={`w-full text-center transition-all duration-300 cursor-pointer ${getButtonClass()} ${theme.animation !== 'none' ? 'animate-slideUp' : ''}`}
                style={{
                  ...getButtonStyles(),
                  animationDelay: theme.animation !== 'none' ? `${index * 0.05}s` : '0s'
                }}
              >
                <div className="flex items-center justify-center gap-3">
                  {link.icon && <span className="text-xl">{link.icon}</span>}
                  <span>{link.title}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div style={getCardStyle()} className="mx-auto w-full">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {socials.map(social => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-green-500/40 hover:scale-110 transition-all"
                  title={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {showWatermark && (
          <div className="text-center mt-6" style={{ width: `${Math.min(theme.card_width || 500, theme.card_max_width || 1200)}px`, maxWidth: '100%' }}>
            <p className="text-xs text-gray-600">
              Made with <a href="/" className="text-green-500 hover:text-green-400 transition-colors">BioLink</a>
            </p>
          </div>
        )}

        {/* View Counter */}
        <div className="text-center mt-1" style={{ width: `${Math.min(theme.card_width || 500, theme.card_max_width || 1200)}px`, maxWidth: '100%' }}>
          <p className="text-xs text-gray-700 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {profile.views.toLocaleString()} просмотров
          </p>
        </div>
      </div>

      {/* Mobile Responsive Preview Badge */}
      <div className="fixed top-4 left-4 z-40 md:hidden">
        <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 text-xs text-gray-400">
          <svg className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Mobile View
        </div>
      </div>
    </div>
  );
}
