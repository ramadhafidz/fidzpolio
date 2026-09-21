import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

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

/**
 * Spec transition tokens.
 *
 * `outExpo` is the GSAP spelling of the spec's `cubic-bezier(0.16, 1, 0.3, 1)`.
 * GSAP cannot parse the CSS `cubic-bezier(...)` string — `parseEase` returns
 * undefined and the tween silently falls back to the default ease — so the
 * JS token must use GSAP syntax. The CSS token in globals.css keeps the CSS
 * spelling; both express the same curve.
 */
export const EASE = { outExpo: 'expo.out' } as const;

export const DURATION = { fast: 0.3, normal: 0.6, slow: 1.2 } as const;
