import type { DetailedHTMLProps, HTMLAttributes } from 'react'

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
