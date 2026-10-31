<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEvents } from "@/composables/useEvents";
import AppIcon from "@/components/ui/AppIcon.vue";
import EventCard from "@/components/event/EventCard.vue";
import SearchBar from "@/components/event/SearchBar.vue";
import CategoryFilter from "@/components/event/CategoryFilter.vue";
import CommunityFeed from "@/components/api/CommunityFeed.vue";
import AppButton from "@/components/ui/AppButton.vue";
const route = useRoute();
const router = useRouter();
const { activeEvents, isUserRegistered, loading, error, fetchEvents } =
  useEvents();
const activeTab = ref("local");
const categories = [
  "All",
  "Workshop",
  "Meetup",
  "Competition",
  "Seminar",
  "Conference",
];
const searchQuery = ref("");
const selectedCategory = ref("All");
const sort = ref("newest");
const eventTimestamp = (date) => {
  const timestamp = Date.parse(date.replace(/\s*•\s*/, " "));
  return Number.isNaN(timestamp) ? Number.MAX_SAFE_INTEGER : timestamp;
};
watch(
  () => route.query,
  (query) => {
    searchQuery.value = typeof query.q === "string" ? query.q : "";
    selectedCategory.value = categories.includes(query.category)
      ? query.category
      : "All";
  },
  { immediate: true },
);
const filteredEvents = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const result = activeEvents.value.filter(
    (event) =>
      (event.title.toLowerCase().includes(q) ||
        event.loc.toLowerCase().includes(q)) &&
      (selectedCategory.value === "All" ||
        event.cat === selectedCategory.value),
  );
  if (sort.value === "title")
    return [...result].sort((a, b) => a.title.localeCompare(b.title));
  if (sort.value === "date")
    return [...result].sort(
      (a, b) => eventTimestamp(a.date) - eventTimestamp(b.date),
    );
  return [...result].sort((a, b) => b.id - a.id);
});
const hasFilters = computed(
  () => !!searchQuery.value.trim() || selectedCategory.value !== "All",
);
const resetFilters = () => {
  searchQuery.value = "";
  selectedCategory.value = "All";
};

onMounted(() => {
  fetchEvents();
});
</script>
<template>
  <div class="event-list-page">
    <header class="catalog-header">
      <div>
        <span class="eyebrow">MAKE TIME FOR SOMETHING GOOD</span>
        <h1>Find your next <span>“I was there.”</span></h1>
        <p>Workshops, meetups, and moments that bring us a little closer.</p>
      </div>
      <router-link to="/browse/your-events" class="button-secondary"
        ><AppIcon name="ticket" :size="17" />Your tickets</router-link
      >
    </header>
    <div class="catalog-tabs" role="group" aria-label="Choose event catalog">
      <button
        :class="{ active: activeTab === 'local' }"
        :aria-pressed="activeTab === 'local'"
        @click="activeTab = 'local'"
      >
        <AppIcon name="calendar" :size="17" />Gatherly events
        <span class="tab-count">{{ activeEvents.length }}</span>
      </button>
      <button
        :class="{ active: activeTab === 'api' }"
        :aria-pressed="activeTab === 'api'"
        @click="activeTab = 'api'"
      >
        <AppIcon name="globe" :size="17" />Global community
        <AppIcon name="diagonal" :size="12" />
      </button>
    </div>
    <section v-if="activeTab === 'local'" aria-label="Gatherly events">
      <div class="catalog-filters">
        <div class="search-row">
          <SearchBar v-model="searchQuery" /><label class="sort-select"
            ><span>Sort by</span
            ><select v-model="sort" aria-label="Sort events">
              <option value="newest">Recently added</option>
              <option value="date">Event date</option>
              <option value="title">Event name</option>
            </select></label
          >
        </div>
        <CategoryFilter :categories="categories" v-model="selectedCategory" />
      </div>

      <div
        v-if="loading"
        class="event-grid"
        role="status"
        aria-label="Loading events from the server"
      >
        <div v-for="item in 6" :key="item" class="event-skeleton-card" aria-hidden="true">
          <div class="event-skeleton-meta">
            <div class="event-skeleton-line event-skeleton-date"></div>
            <div class="event-skeleton-pill"></div>
          </div>
          <div class="event-skeleton-line event-skeleton-title"></div>
          <div class="event-skeleton-line event-skeleton-location"></div>
          <div class="event-skeleton-line event-skeleton-description"></div>
          <div class="event-skeleton-line event-skeleton-description short"></div>
        </div>
      </div>

      <div v-else-if="error" class="network-error-state" role="alert">
        <div class="network-error-badge">NETWORK ERROR</div>
        <h2>We couldn’t load the events.</h2>
        <p>{{ error }}</p>
        <div class="network-error-action">
          <AppButton variant="primary" @click="fetchEvents">
            Try loading again
          </AppButton>
        </div>
      </div>

      <template v-else>
      <div class="catalog-results" role="status">
        <span
          ><strong>{{ filteredEvents.length }}</strong>
          {{ filteredEvents.length === 1 ? "event" : "events" }} to
          explore</span
        ><button v-if="hasFilters" class="reset-link" @click="resetFilters">
          Clear filters <AppIcon name="close" :size="13" /></button
        ><span v-else class="results-hint"
          >A new experience starts with a little curiosity.</span
        >
      </div>
      <div v-if="filteredEvents.length" class="event-grid">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          :is-registered="isUserRegistered(event.id)"
          @view-detail="(id) => router.push('/browse/events/' + id)"
        />
      </div>
      <div v-else class="empty-state">
        <div class="empty-art" aria-hidden="true">
          <span class="empty-art-back"></span
          ><span class="empty-art-front"
            ><AppIcon
              :name="hasFilters ? 'search' : 'calendar'"
              :size="40" /></span
          ><span class="art-star">✦</span>
        </div>
        <span class="eyebrow">{{
          hasFilters ? "KEEP EXPLORING" : "THE POSSIBILITIES ARE OPEN"
        }}</span>
        <h2>
          {{
            hasFilters
              ? "A different search might do it."
              : "Great gatherings start with you."
          }}
        </h2>
        <p>
          {{
            hasFilters
              ? "We couldn’t find an event with these filters. Try another keyword or explore all categories."
              : "There are no published events just yet. Start a gathering of your own, or find inspiration in the global community."
          }}
        </p>
        <div class="empty-actions">
          <button
            v-if="hasFilters"
            class="button-primary"
            @click="resetFilters"
          >
            Clear filters <AppIcon name="arrow" :size="16" /></button
          ><router-link v-else to="/dashboard/events" class="button-primary"
            >Create an event <AppIcon name="diagonal" :size="16" /></router-link
          ><button class="text-link" @click="activeTab = 'api'">
            Explore the community <AppIcon name="arrow" :size="16" />
          </button>
        </div>
      </div>
      <div class="host-note">
        <span class="host-note-icon"><AppIcon name="users" :size="23" /></span>
        <div>
          <strong>Have something worth gathering for?</strong>
          <p>Bring your idea to life and find your community.</p>
        </div>
        <router-link to="/dashboard/events" class="text-link"
          >Become a host <AppIcon name="arrow" :size="16"
        /></router-link>
      </div>
      </template>
    </section>
    <CommunityFeed v-else />
  </div>
</template>
<style scoped>
.catalog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin: 8px 0 34px;
}
.catalog-header h1 {
  font-size: clamp(28px, 3.5vw, 43px);
  font-weight: 800;
  margin: 10px 0 13px;
  letter-spacing: -0.05em;
}
.catalog-header h1 span {
  color: var(--primary);
}
.catalog-header p {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0;
}
.catalog-header > .button-secondary {
  white-space: nowrap;
  font-size: 12px;
}
.catalog-tabs {
  display: flex;
  gap: 26px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 26px;
}
.catalog-tabs > button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  background: none;
  border: 0;
  padding: 14px 1px 18px;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
}
.catalog-tabs > button.active {
  color: var(--primary);
  font-weight: 700;
}
.catalog-tabs > button.active::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  bottom: -1px;
  border-radius: 3px;
  background: var(--primary);
}
.tab-count {
  font-size: 10px;
  min-width: 22px;
  height: 20px;
  padding: 0 6px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: var(--primary-soft);
}
.catalog-filters {
  padding: 22px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  margin-bottom: 24px;
}
.search-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 18px;
}
.search-row > .search-bar {
  flex: 1;
}
.sort-select {
  display: flex;
  align-items: center;
  gap: 11px;
  white-space: nowrap;
}
.sort-select > span {
  color: var(--text-muted);
  font-size: 11px;
}
.sort-select select {
  font-size: 12px;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  padding: 13px 12px;
  background: #fff;
  color: var(--text-main);
}
.catalog-results {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 21px;
}
.catalog-results strong {
  color: var(--text-main);
}
.results-hint {
  font-size: 10px;
}
.reset-link {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 0;
  background: none;
  color: var(--primary);
  font-size: 11px;
}
.event-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 23px;
}
.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 43px 24px 48px;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 18px;
}
.empty-art {
  width: 125px;
  height: 110px;
  position: relative;
  margin-bottom: 23px;
}
.empty-art-back {
  position: absolute;
  width: 75px;
  height: 83px;
  left: 12px;
  top: 6px;
  background: #ece7f8;
  border: 1px solid #dcd4f0;
  border-radius: 13px;
  transform: rotate(-15deg);
}
.empty-art-front {
  position: absolute;
  display: grid;
  place-items: center;
  left: 33px;
  top: 18px;
  width: 75px;
  height: 83px;
  border-radius: 13px;
  background: #faf8ff;
  border: 1px solid #dbd3ef;
  color: #9b86d6;
  transform: rotate(8deg);
  box-shadow: 0 6px 14px rgb(65 43 115 / 5%);
}
.art-star {
  position: absolute;
  right: 0;
  top: 0;
  color: #b39fdf;
  font-size: 24px;
}
.empty-state > .eyebrow {
  font-size: 9px;
}
.empty-state h2 {
  font-size: 26px;
  margin: 12px 0;
}
.empty-state p {
  font-size: 13px;
  line-height: 1.8;
  color: var(--text-muted);
  max-width: 420px;
  margin-bottom: 24px;
}
.empty-actions {
  display: flex;
  align-items: center;
  gap: 23px;
}
.empty-actions > button.text-link {
  border: 0;
  background: none;
  padding: 10px 0;
  font-size: 12px;
}
.host-note {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px 25px;
  background: #f0edf8;
  border-radius: 13px;
  margin-top: 25px;
}
.host-note-icon {
  color: var(--primary);
  display: grid;
  place-items: center;
  width: 45px;
  height: 45px;
  background: #e7e0f5;
  border-radius: 12px;
}
.host-note strong {
  font-size: 13px;
}
.host-note p {
  font-size: 11px;
  margin: 3px 0 0;
  color: var(--text-muted);
}
.host-note > .text-link {
  margin-left: auto;
  font-size: 11px;
}
@media (max-width: 1000px) {
  .event-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 650px) {
  .catalog-header {
    margin-bottom: 23px;
  }
  .catalog-header > .button-secondary {
    display: none;
  }
  .catalog-header p {
    font-size: 13px;
  }
  .catalog-tabs {
    gap: 20px;
  }
  .catalog-tabs > button {
    font-size: 11px;
    gap: 6px;
  }
  .catalog-filters {
    padding: 15px;
  }
  .search-row {
    flex-wrap: wrap;
    gap: 12px;
  }
  .search-row > .search-bar {
    flex: auto;
  }
  .sort-select {
    width: 100%;
    justify-content: space-between;
  }
  .sort-select select {
    padding: 8px 10px;
  }
  .results-hint {
    display: none;
  }
  .event-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .empty-state {
    padding: 33px 20px;
  }
  .empty-state h2 {
    font-size: 24px;
  }
  .empty-actions {
    flex-direction: column;
    gap: 9px;
  }
  .host-note {
    padding: 19px;
    flex-wrap: wrap;
  }
  .host-note-icon {
    display: none;
  }
  .host-note > .text-link {
    margin-left: 0;
  }
  .catalog-header h1 {
    font-size: 32px;
  }
}
</style>
