<script setup>
import { useEvents } from "@/composables/useEvents";
import AppIcon from "@/components/ui/AppIcon.vue";
const { activeEvents } = useEvents();
const categories = [
  {
    name: "Workshops",
    value: "Workshop",
    icon: "layers",
    desc: "Learn something new, one hands-on session at a time.",
    tone: "lilac",
  },
  {
    name: "Meetups",
    value: "Meetup",
    icon: "users",
    desc: "Meet the people who share your kind of curiosity.",
    tone: "peach",
  },
  {
    name: "Conferences",
    value: "Conference",
    icon: "globe",
    desc: "Big ideas and fresh perspectives in one place.",
    tone: "blue",
  },
  {
    name: "Competitions",
    value: "Competition",
    icon: "grid",
    desc: "Put your skills to work and enjoy the challenge.",
    tone: "green",
  },
  {
    name: "Seminars",
    value: "Seminar",
    icon: "calendar",
    desc: "Make space for a new way of thinking.",
    tone: "rose",
  },
];
</script>
<template>
  <section class="category-page">
    <header>
      <span class="eyebrow">A PLACE FOR EVERY INTEREST</span>
      <h1>Follow your curiosity.</h1>
      <p>Start with what you love. See where it takes you.</p>
    </header>
    <div class="category-grid">
      <router-link
        v-for="cat in categories"
        :key="cat.value"
        :to="{ path: '/browse/events', query: { category: cat.value } }"
        class="category-card"
        ><span class="category-icon" :class="cat.tone"
          ><AppIcon :name="cat.icon" :size="30"
        /></span>
        <h2>{{ cat.name }}</h2>
        <p>{{ cat.desc }}</p>
        <div>
          <span
            >{{
              activeEvents.filter((event) => event.cat === cat.value).length
            }}
            events</span
          ><AppIcon name="diagonal" :size="18" /></div
      ></router-link>
    </div>
  </section>
</template>
<style scoped>
header {
  margin: 8px 0 32px;
}
h1 {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.05em;
  margin: 10px 0 12px;
}
header p {
  color: var(--text-muted);
  font-size: 14px;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}
.category-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  border: 1px solid var(--border-color);
  border-radius: 17px;
  background: white;
  color: var(--text-main);
  text-decoration: none;
}
.category-card:hover {
  transform: translateY(-4px);
  border-color: #cfc5ea;
  box-shadow: var(--shadow);
}
.category-icon {
  display: grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 17px;
  margin-bottom: 24px;
}
.category-card h2 {
  font-size: 22px;
  margin-bottom: 12px;
}
.category-card p {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 250px;
  flex: 1;
  margin-bottom: 25px;
}
.category-card > div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--primary);
  font-size: 11px;
  padding-top: 17px;
  border-top: 1px solid var(--border-color);
}
.lilac {
  background: #efebfa;
  color: #7860bc;
}
.peach {
  background: #faf0e6;
  color: #b4804c;
}
.blue {
  background: #eaf0f9;
  color: #6483b8;
}
.green {
  background: #eaf3ed;
  color: #658d73;
}
.rose {
  background: #faedf0;
  color: #b9758d;
}
@media (max-width: 850px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 500px) {
  .category-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 15px;
  }
  .category-card {
    padding: 23px;
  }
  .category-icon {
    margin-bottom: 18px;
  }
}
</style>
