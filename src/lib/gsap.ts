import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './utils';

let registered = false;

/**
 * Registers GSAP plugins exactly once (module guard protects HMR and any
 * SSR path from double-registration) and returns the shared handles.
 *
 * Also injects our gsap instance into @gsap/react via useGSAP.register().
 * That is required: @gsap/react calls require('gsap') internally and holds
 * its own instance for the context that runs our animation callbacks.
 * Without the injection, the context's instance would lack ScrollTrigger
 * and every scroll animation would throw at runtime.
 */
export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registerReactGsap();
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Inject our gsap into @gsap/react. Call once from lib/gsap.ts only. */
export function registerReactGsap() {
  // `register` exists at runtime but is missing from the .d.ts shipped
  // with @gsap/react@2.1.2, so it needs an ambient declaration
  // (src/types/gsap-react.d.ts). Call it with the instance, not empty.
  (useGSAP as unknown as { register: (core: typeof gsap) => void }).register(
    gsap,
  );
}

/** Spec transition tokens. */
export const EASE = { outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)' } as const;

export const DURATION = { fast: 0.3, normal: 0.6, slow: 1.2 } as const;

/** When true, hooks should set end states and skip motion. */
export const reducedMotion = prefersReducedMotion;
