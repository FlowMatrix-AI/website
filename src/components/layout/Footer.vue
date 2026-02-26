<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer-wrap">
    <div class="container footer-grid">
      <div class="footer-brand-block">
        <img src="/flowmatrix-logo.webp" alt="FlowMatrix AI" width="160" height="40" />
        <p class="footer-description">
          Practical AI systems for real operators.
        </p>
        <a class="footer-email" href="mailto:info@flowmatrixai.com">info@flowmatrixai.com</a>
      </div>

      <div class="footer-links-block">
        <p class="footer-heading">Explore</p>
        <a href="/">Home</a>
        <a href="/free">Free Templates</a>
        <a href="/terms">Terms</a>
        <a href="/privacy">Privacy</a>
      </div>

      <div class="footer-links-block">
        <p class="footer-heading">Connect</p>
        <a href="https://www.linkedin.com/company/flowmatrix-ai/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      </div>
    </div>

    <div class="container footer-bottom">
      <small>&copy; {{ year }} FlowMatrix AI. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
.footer-wrap {
  position: relative;
  z-index: 1;
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-10);
  padding-top: var(--space-10);
  padding-bottom: var(--space-8);
  background: linear-gradient(to top, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--space-8);
}

.footer-brand-block img {
  width: 150px;
  margin-bottom: var(--space-4);
}

.footer-description {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
  max-width: 34ch;
}

.footer-email {
  color: var(--color-text-muted);
  text-decoration: none;
}

.footer-email:hover {
  color: var(--color-gold-soft);
}

.footer-heading {
  margin: 0 0 var(--space-3);
  font-weight: 600;
  color: var(--color-text);
}

.footer-links-block {
  display: grid;
  gap: var(--space-2);
}

.footer-links-block a {
  color: var(--color-text-muted);
  text-decoration: none;
}

.footer-links-block a:hover {
  color: var(--color-text);
}

.footer-bottom {
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-8);
  padding-top: var(--space-4);
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}
</style>
