<script setup>
import { useRoute } from "vue-router";
import Navbar from "@/components/app/Navbar.vue";
import Breadcrumb from "@/components/app/Breadcrumb.vue";
const route = useRoute();
</script>
<template>
  <div class="app-layout">
    <a href="#main-content" class="skip-link">Skip to content</a><Navbar />
    <main id="main-content" class="main-content" tabindex="-1">
      <Breadcrumb v-if="route.name !== 'home'" /><router-view />
    </main>
    <footer class="site-footer">
      <div class="footer-inner">
        <router-link to="/" class="footer-brand"
          >gatherly<span>.</span></router-link
        >
        <p>Good things happen when we get together.</p>
        <div>
          <router-link to="/about">About</router-link
          ><router-link to="/contact">Get in touch</router-link
          ><span>© {{ new Date().getFullYear() }} Gatherly</span>
        </div>
      </div>
    </footer>
  </div>
</template>
<style scoped>
.app-layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.main-content {
  flex: 1;
  width: 100%;
  max-width: 1280px;
  padding: 30px 40px 64px;
  margin-inline: auto;
}
.main-content:focus {
  outline: none;
}
.skip-link {
  position: fixed;
  top: -60px;
  left: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  background: var(--primary);
  color: #fff;
  z-index: 40;
}
.skip-link:focus {
  top: 12px;
}
.site-footer {
  border-top: 1px solid var(--border-color);
  background: #fff;
}
.footer-inner {
  max-width: 1280px;
  padding: 28px 40px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 25px;
}
.footer-brand {
  font-family: "Manrope", sans-serif;
  font-size: 21px;
  letter-spacing: -0.8px;
  font-weight: 800;
  color: var(--text-main);
  text-decoration: none;
}
.footer-brand span {
  color: var(--primary);
}
.footer-inner p {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
}
.footer-inner > div {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 23px;
  font-size: 11px;
  color: var(--text-muted);
}
.footer-inner > div a {
  text-decoration: none;
  color: var(--text-muted);
}
.footer-inner > div a:hover {
  color: var(--primary);
}
@media (max-width: 900px) {
  .main-content {
    padding: 24px 24px 48px;
  }
  .footer-inner {
    padding-inline: 24px;
    flex-wrap: wrap;
    gap: 12px 20px;
  }
  .footer-inner > div {
    width: 100%;
    margin: 5px 0 0;
  }
}
@media (max-width: 480px) {
  .main-content {
    padding-inline: 18px;
  }
  .footer-inner {
    padding-inline: 18px;
  }
}
</style>
