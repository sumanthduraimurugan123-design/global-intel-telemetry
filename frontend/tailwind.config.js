/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'Consolas', 'monospace'],
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Preserve existing wire tokens (used by accessibility modes)
        wire: {
          base:    '#0F0E0C',
          surface: '#161513',
          raised:  '#1E1C19',
          border:  '#2C2A26',
          muted:   '#403D38',
          fg:      '#D4CFCB',
          subtle:  '#8C8580',
          amber:   '#C9A24A',
          red:     '#B83030',
          green:   '#4A8A5C',
          blue:    '#3A6FA8',
        },
        // NEW: Premium AI neon color system
        neon: {
          purple: '#8B5CF6',
          violet: '#7C3AED',
          pink:   '#EC4899',
          rose:   '#F43F5E',
          cyan:   '#06B6D4',
          sky:    '#0EA5E9',
          green:  '#10B981',
          emerald:'#059669',
          orange: '#F59E0B',
          amber:  '#D97706',
          red:    '#EF4444',
          crimson:'#DC2626',
        },
        // Glass UI surface tokens
        glass: {
          bg:     'rgba(10, 10, 30, 0.65)',
          border: 'rgba(139, 92, 246, 0.2)',
          hover:  'rgba(139, 92, 246, 0.08)',
          card:   'rgba(13, 15, 43, 0.7)',
          surface:'rgba(20, 20, 50, 0.5)',
        },
        // Dark navy base (new)
        navy: {
          950: '#030712',
          900: '#0d0f2b',
          800: '#111330',
          700: '#1a1d3e',
          600: '#252850',
        },
      },
      backgroundImage: {
        'gradient-primary':   'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        'gradient-success':   'linear-gradient(135deg, #10B981 0%, #06B6D4 100%)',
        'gradient-danger':    'linear-gradient(135deg, #EF4444 0%, #F43F5E 100%)',
        'gradient-warning':   'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
        'gradient-dark':      'linear-gradient(180deg, #030712 0%, #0d0f2b 100%)',
        'gradient-card':      'linear-gradient(135deg, rgba(20,20,50,0.8) 0%, rgba(10,10,30,0.95) 100%)',
        'gradient-nav':       'linear-gradient(90deg, rgba(139,92,246,0.1) 0%, rgba(10,10,30,0.95) 100%)',
      },
      animation: {
        'pulse-slow':    'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':       'fadeIn 0.4s ease-out forwards',
        'fade-in-up':    'fadeInUp 0.5s ease-out forwards',
        'slide-up':      'slideUp 0.4s ease-out forwards',
        'glow-pulse':    'glowPulse 2s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s infinite',
        'float':         'float 3s ease-in-out infinite',
        'spin-slow':     'spin 4s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(139, 92, 246, 0.8), 0 0 48px rgba(236, 72, 153, 0.3)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)',
        'glow-pink':   '0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(236, 72, 153, 0.15)',
        'glow-cyan':   '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(6, 182, 212, 0.15)',
        'glow-green':  '0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.15)',
        'glow-red':    '0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.2)',
        'glow-orange': '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.15)',
        'glass':       '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        'glass-lg':    '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        'card':        '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(139,92,246,0.1)',
      },
    },
  },
  plugins: [],
}
