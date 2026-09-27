// The remote's public entry: loading this module registers <admin-app>.
import { defineRemote } from 'svelte-microfrontend-router';
import App from './App.svelte';

defineRemote('admin-app', App);
