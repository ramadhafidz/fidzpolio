import type { NextConfig } from 'next';

// Placeholders are generated SVGs; the image optimizer blocks SVG
// unless this is set. Revisit when real screenshots land.
const config: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default config;