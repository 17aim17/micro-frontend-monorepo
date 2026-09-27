<script lang="ts">
  import { getRouter, Link } from 'svelte-microfrontend-router';
  import { roles, users } from '../users.js';

  const router = getRouter();
  const role = $derived(router.query.get('role'));
  const visible = $derived(role ? users.filter((user) => user.role === role) : users);
</script>

<h1>Users</h1>

<div class="filters" role="group" aria-label="Filter by role">
  <button type="button" aria-pressed={!role} data-testid="role-all" onclick={() => router.setQuery({ role: null })}>
    All
  </button>
  {#each roles as option (option)}
    <button
      type="button"
      aria-pressed={role === option}
      data-testid="role-{option}"
      onclick={() => router.setQuery({ role: option })}
    >
      {option}
    </button>
  {/each}
</div>

<ul data-testid="user-list">
  {#each visible as user (user.id)}
    <li><Link to="/users/{user.id}">{user.name}</Link> <span class="role">{user.role}</span></li>
  {/each}
</ul>

<style>
  .filters {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }

  .filters button {
    font: inherit;
    padding: 2px 10px;
    border: 1px solid #c3c8d0;
    border-radius: 999px;
    background: white;
    cursor: pointer;
  }

  .filters button[aria-pressed='true'] {
    background: #5b3cc4;
    border-color: #5b3cc4;
    color: white;
  }

  ul :global(a) {
    color: #5b3cc4;
  }

  .role {
    color: #6b7280;
    font-size: 0.875em;
  }
</style>
