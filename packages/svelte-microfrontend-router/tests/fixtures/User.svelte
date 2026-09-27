<script lang="ts">
  let { params }: { params: Record<string, string> } = $props();
</script>

<h1>User {params.id}</h1>
