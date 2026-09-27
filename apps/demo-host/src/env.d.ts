import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  interface ImportMetaEnv {
    /** URL of the ES module that registers <admin-app>. */
    readonly VITE_ADMIN_REMOTE_URL: string
  }
}

// Lets JSX render the remote's custom element with its two attributes.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'admin-app': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        'base-path'?: string
        url?: string
      }
    }
  }
}
