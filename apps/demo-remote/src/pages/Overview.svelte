<script lang="ts">
  import { Link } from 'svelte-microfrontend-router';
  import { roles, users } from '../users.js';
</script>

<h1>Overview</h1>
<p>{users.length} users across {roles.length} roles.</p>
<ul>
  {#each roles as role (role)}
    <li>
      <Link to="/users?role={role}">{users.filter((user) => user.role === role).length} {role}s</Link>
    </li>
  {/each}
</ul>
