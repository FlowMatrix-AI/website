<template>
  <div class="app-shell">
    <header class="site-header">
      <a class="brand" href="/">FlowMatrix AI</a>
      <nav>
        <a href="/free">Free Templates</a>
        <a href="/free/dummy-template">Dummy Template</a>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.5rem;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.brand {
  color: #d4a84b;
  font-weight: 700;
  text-decoration: none;
}

nav {
  display: flex;
  gap: 1rem;
}

nav a {
  color: #fff;
  text-decoration: none;
}

main {
  padding-top: 1.5rem;
}
</style>
