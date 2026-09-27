import type { DetailedHTMLProps, HTMLAttributes } from 'react'

/** Payload of the `mfe-navigate` event <admin-app> sends when it wants to navigate. */
export interface MfeNavigateDetail {
  href: string
  replace: boolean
}

// Lets JSX render the remote's custom element: its two attributes and its navigation event.
// React 19 attaches `on<event>` props on custom elements as native event listeners.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'admin-app': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        'base-path'?: string
        url?: string
        'onmfe-navigate'?: (event: CustomEvent<MfeNavigateDetail>) => void
      }
    }
  }
}
