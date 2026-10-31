<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";
const route = useRoute();
const menuOpen = ref(false);
const browseOpen = ref(false);
const browseLinks = [
  {
    name: "Discover events",
    path: "/browse/events",
    icon: "calendar",
    desc: "Find your next experience",
  },
  {
    name: "Global community",
    path: "/browse/public-api",
    icon: "globe",
    desc: "Ideas from around the world",
  },
  {
    name: "Categories",
    path: "/browse/category",
    icon: "grid",
    desc: "Explore your interests",
  },
  {
    name: "Your tickets",
    path: "/browse/your-events",
    icon: "ticket",
    desc: "All your plans, in one place",
  },
];
watch(
  () => route.path,
  () => {
    menuOpen.value = false;
    browseOpen.value = false;
  },
);
</script>
<template>
  <header
    class="navbar"
    @keydown.esc="
      menuOpen = false;
      browseOpen = false;
    "
  >
    <nav class="navbar-container" aria-label="Main navigation">
      <router-link to="/" class="logo" aria-label="Gatherly home"
        ><span class="brand-mark">g<span></span></span
        ><span>gatherly<span class="brand-period">.</span></span></router-link
      >
      <div
        id="main-navigation"
        class="nav-content"
        :class="{ 'is-open': menuOpen }"
      >
        <div class="nav-links">
          <router-link to="/" class="nav-link" exact-active-class="active"
            >Home</router-link
          >
          <div class="browse-nav" @mouseleave="browseOpen = false">
            <button
              class="nav-link"
              :class="{ active: route.path.startsWith('/browse') }"
              :aria-expanded="browseOpen"
              aria-controls="browse-navigation"
              @click="browseOpen = !browseOpen"
            >
              Explore <AppIcon name="chevron" :size="13" />
            </button>
            <div v-if="browseOpen" id="browse-navigation" class="dropdown-menu">
              <router-link
                v-for="link in browseLinks"
                :key="link.path"
                :to="link.path"
                class="dropdown-link"
                ><span class="dropdown-icon"
                  ><AppIcon :name="link.icon" :size="19" /></span
                ><span
                  ><strong>{{ link.name }}</strong
                  ><small>{{ link.desc }}</small></span
                ><AppIcon name="arrow" :size="15"
              /></router-link>
            </div>
          </div>
          <router-link to="/about" class="nav-link" active-class="active"
            >About us</router-link
          >
          <router-link to="/contact" class="nav-link" active-class="active"
            >Contact</router-link
          >
        </div>
        <div class="nav-actions">
          <router-link to="/browse/your-events" class="my-tickets"
            ><AppIcon name="ticket" :size="18" />My tickets</router-link
          ><router-link to="/dashboard" class="button-primary organizer-link"
            >Create an event <AppIcon name="diagonal" :size="16"
          /></router-link>
        </div>
      </div>
      <button
        class="mobile-toggle"
        :aria-expanded="menuOpen"
        aria-controls="main-navigation"
        :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'"
        @click="menuOpen = !menuOpen"
      >
        <AppIcon :name="menuOpen ? 'close' : 'menu'" />
      </button>
    </nav>
  </header>
</template>
<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgb(255 255 255 / 96%);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(16px);
}
.navbar-container {
  max-width: 1280px;
  min-height: 84px;
  margin: auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  gap: 62px;
}
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text-main);
  text-decoration: none;
  font-family: "Manrope", sans-serif;
  font-size: 25px;
  letter-spacing: -1px;
  font-weight: 800;
}
.brand-period {
  color: var(--primary);
}
.brand-mark {
  position: relative;
  display: grid;
  place-items: center;
  width: 34px;
  height: 37px;
  background: var(--primary);
  color: #fff;
  border-radius: 11px 11px 11px 3px;
  font-size: 28px;
  line-height: 1;
  padding-bottom: 5px;
}
.brand-mark span {
  width: 5px;
  height: 5px;
  background: #c8bcff;
  border-radius: 50%;
  position: absolute;
  top: 7px;
  right: 6px;
}
.nav-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.nav-links,
.nav-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: 0;
  padding: 10px 0;
  color: var(--text-muted);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
}
.nav-link.active,
.nav-link:hover {
  color: var(--primary);
}
.nav-link.active {
  font-weight: 700;
}
.browse-nav {
  position: relative;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: -20px;
  width: 310px;
  background: #fff;
  border: 1px solid var(--border-color);
  box-shadow: 0 16px 48px rgb(38 35 61 / 12%);
  padding: 8px;
  border-radius: 16px;
}
.dropdown-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--text-main);
}
.dropdown-link:hover {
  background: var(--bg-gray);
}
.dropdown-icon {
  display: grid;
  place-items: center;
  width: 37px;
  height: 37px;
  border-radius: 10px;
  background: var(--primary-soft);
  color: var(--primary);
}
.dropdown-link strong {
  display: block;
  font-size: 13px;
  font-weight: 600;
}
.dropdown-link small {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
}
.dropdown-link > svg {
  margin-left: auto;
  color: var(--text-muted);
}
.my-tickets {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--text-main);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}
.my-tickets:hover {
  color: var(--primary);
}
.organizer-link {
  min-height: 40px;
  padding: 9px 15px;
  font-size: 12px;
}
.mobile-toggle {
  display: none;
  border: 1px solid var(--border-color);
  background: #fff;
  color: var(--text-main);
  width: 42px;
  height: 42px;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
}
@media (max-width: 1100px) {
  .navbar-container {
    gap: 35px;
    padding-inline: 28px;
  }
  .nav-links {
    gap: 20px;
  }
  .nav-actions {
    gap: 16px;
  }
}
@media (max-width: 900px) {
  .navbar-container {
    min-height: 72px;
    padding-inline: 22px;
    justify-content: space-between;
  }
  .mobile-toggle {
    display: flex;
  }
  .nav-content {
    display: none;
    max-height: calc(100dvh - 72px);
    overflow-y: auto;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    padding: 20px 24px 24px;
    background: #fff;
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow);
  }
  .nav-content.is-open,
  .nav-links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 7px;
  }
  .nav-links,
  .nav-actions {
    width: 100%;
  }
  .nav-link {
    width: 100%;
    min-height: 42px;
  }
  .nav-actions {
    border-top: 1px solid var(--border-color);
    padding-top: 18px;
    justify-content: space-between;
  }
  .dropdown-menu {
    position: static;
    width: 100%;
    box-shadow: none;
    background: var(--page-bg);
    margin-bottom: 8px;
  }
}
</style>
