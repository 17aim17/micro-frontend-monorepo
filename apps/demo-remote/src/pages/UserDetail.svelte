<script lang="ts">
  import { Link } from 'svelte-microfrontend-router';
  import { findUser } from '../users.js';

  let { params }: { params: Record<string, string> } = $props();

  const user = $derived(findUser(params.id));
</script>

{#if user}
  <h1>{user.name}</h1>
  <dl>
    <dt>Email</dt>
    <dd>{user.email}</dd>
    <dt>Role</dt>
    <dd>{user.role}</dd>
  </dl>
{:else}
  <h1>No user with id {params.id}</h1>
{/if}
<Link to="/users">Back to users</Link>

<style>
  dl {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4px 16px;
  }

  dt {
    color: #6b7280;
  }

  dd {
    margin: 0;
  }
</style>
