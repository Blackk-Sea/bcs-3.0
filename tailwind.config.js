/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#000000',
        panel: '#121212',
        'panel-hover': '#1a1a1a',
        'card-bg': '#181818',
        'card-hover': '#282828',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-hover': 'rgba(255, 255, 255, 0.18)',
        
        // Spotify Palette
        spotify: '#1DB954',
        'spotify-hover': '#1ed760',
        'spotify-light': 'rgba(29, 185, 84, 0.15)',
        
        ink: '#ffffff',
        'ink-muted': '#b3b3b3',
        faint: '#535353',
        
        danger: '#f15e6c',
        'danger-bg': 'rgba(241, 94, 108, 0.15)',
        
        yt: '#ff0000',
        dr: '#0071e3',
        tg: '#34aadf',
      },
      borderRadius: {
        xl: '16px',
        lg: '12px',
        md: '8px',
        sm: '4px',
      },
    },
  },
  plugins: [],
}
