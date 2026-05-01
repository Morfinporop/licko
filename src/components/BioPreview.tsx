import { ProfileData, LinkData, SocialLink, ThemeSettings } from '@/lib/api';
import { getSocialIcon } from '@/lib/socialIcons';

interface BioPreviewProps {
  profile: ProfileData;
  username: string;
  links: LinkData[];
  socials: SocialLink[];
  theme: ThemeSettings;
}

export function BioPreview({ profile, username, links, socials, theme }: BioPreviewProps) {
  const spacing = theme.spacing === 'compact' ? 'gap-2' : theme.spacing === 'relaxed' ? 'gap-6' : 'gap-4';
  
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

  const getCardBg = () => {
    if (theme.card_bg_type === 'image' && theme.card_bg_image) {
      return { backgroundImage: `url(${theme.card_bg_image})`, backgroundSize: 'cover', backgroundPosition: 'center' };
    }
    return { backgroundColor: theme.card_bg_color || `rgba(255,255,255,${theme.card_opacity || 0.15})` };
  };

  const getCardStyle = (): React.CSSProperties => {
    const borderRadius = theme.card_border_radius || 16;
    const blur = theme.card_blur || 12;
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
      border: `${borderWidth}px solid ${borderColor}`,
      boxShadow: combinedShadow,
      width: `${width}px`,
      maxWidth: `calc(100% - 32px)`,
      padding: `${padding}px`,
      ...getCardBg()
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
      return 'bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/15 hover:border-green-500/40';
    }
    if (theme.button_style === 'solid') {
      return 'bg-green-500 text-black hover:bg-green-400 border-green-500';
    }
    if (theme.button_style === 'outline') {
      return 'border-white/30 text-white hover:border-green-500 hover:bg-green-500/10 bg-transparent';
    }
    return 'text-gray-300 hover:text-white hover:bg-white/5 border-transparent bg-transparent';
  };

  return (
    <div className="min-h-full w-full relative bio-preview flex items-center justify-center p-4 overflow-hidden" style={getBackground()}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: theme.bg_overlay_opacity }} />
      
      {/* Custom CSS */}
      {theme.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: `.bio-preview { ${theme.custom_css} }` }} />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Main Card */}
        <div style={getCardStyle()} className="flex flex-col items-center text-center">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || username}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-white/20"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/30 to-green-700/30 border-2 border-green-500/30 flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <h1 className="text-xl font-bold text-white mb-1">
            {profile.display_name || username}
          </h1>
          
          <p className="text-sm text-gray-400 mb-3">@{username}</p>
          
          {profile.bio && (
            <p className="text-sm text-gray-300 leading-relaxed">{profile.bio}</p>
          )}

          {/* Links inside the card */}
          {links.filter(l => l.is_active).length > 0 && (
            <div className={`flex flex-col ${spacing} w-full mt-6`}>
              {links.filter(l => l.is_active).map(link => (
                <button
                  key={link.id}
                  className={`w-full text-center transition-all duration-300 cursor-pointer ${getButtonClass()}`}
                  style={getButtonStyles()}
                >
                  <div className="flex items-center justify-center gap-3">
                    {link.icon && <span className="text-lg">{link.icon}</span>}
                    <span>{link.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Socials inside the card */}
          {socials.length > 0 && (
            <div className="flex items-center justify-center gap-3 flex-wrap mt-6 pt-6 border-t border-white/10 w-full">
              {socials.map(social => (
                <div
                  key={social.id}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 hover:border-green-500/40 transition-all cursor-pointer"
                  title={social.platform}
                >
                  {getSocialIcon(social.platform)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Centered Footer below the card */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center gap-2 shadow-2xl">
            <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Просмотры</span>
          </div>
          <div className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter hover:text-green-500/50 transition-colors cursor-default">
            Made with BioLink
          </div>
        </div>
      </div>
    </div>
  );
}
