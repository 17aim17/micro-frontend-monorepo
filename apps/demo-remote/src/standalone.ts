// Dev entry for running the admin app with no host.
//   pnpm dev        -> <admin-app> element with no url attribute (self-managed)
//   pnpm dev:plain  -> the same App as a plain Svelte app, using <Router> directly
import { mount } from 'svelte';
import App from './App.svelte';
import './register.js';

const target = document.getElementById('app')!;

if (import.meta.env.VITE_PLAIN === '1') {
  mount(App, { target });
} else {
  const element = document.createElement('admin-app');
  element.setAttribute('base-path', '/');
  target.append(element);
}
