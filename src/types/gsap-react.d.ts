import type gsap from 'gsap';

declare module '@gsap/react' {
  interface useGSAP {
    register: (core: typeof gsap) => void;
  }
}
