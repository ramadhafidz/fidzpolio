import type { NextConfig } from 'next';

// Work cards render CSS-only placeholders, so no SVGs are served through the
// image optimizer at present. Revisit when real screenshots land.
const config: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
  // Dev-only: the app is reached over the LAN IP as well as localhost, and
  // Next blocks cross-origin requests to dev assets (HMR) from any origin it
  // was not started with. Entries are hostnames only — no scheme, no port.
  allowedDevOrigins: ['192.168.1.212'],
};

export default config;