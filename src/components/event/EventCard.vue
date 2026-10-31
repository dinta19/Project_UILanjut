<script setup>
import AppIcon from "@/components/ui/AppIcon.vue";
defineProps({
  event: { type: Object, required: true },
  isRegistered: { type: Boolean, default: false },
});
defineEmits(["view-detail"]);
const icons = {
  Workshop: "layers",
  Meetup: "users",
  Conference: "globe",
  Competition: "grid",
  Seminar: "calendar",
};
</script>
<template>
  <article class="event-card">
    <div class="event-art" :class="event.cat.toLowerCase()">
      <span class="art-ring"></span
      ><AppIcon :name="icons[event.cat] || 'calendar'" :size="65" /><span
        class="event-category"
        >{{ event.cat }}</span
      ><span v-if="isRegistered" class="badge-registered"
        ><AppIcon name="check" :size="12" />Registered</span
      >
    </div>
    <div class="event-body">
      <span class="event-date"
        ><AppIcon name="calendar" :size="14" />{{ event.date }}</span
      >
      <h3>{{ event.title }}</h3>
      <p class="event-loc"><AppIcon name="pin" :size="14" />{{ event.loc }}</p>
      <p class="event-desc">{{ event.desc }}</p>
      <div class="card-footer">
        <span>{{
          event.quota > 0 ? event.quota + " spots available" : "Fully booked"
        }}</span
        ><button @click="$emit('view-detail', event.id)">
          View event <AppIcon name="arrow" :size="16" />
        </button>
      </div>
    </div>
  </article>
</template>
<style scoped>
.event-card {
  min-width: 0;
  background: #fff;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}
.event-art {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1.9;
  background: #ede8f7;
  color: #9a82ce;
  overflow: hidden;
}
.meetup {
  background: #f7ede4;
  color: #bf9b7d;
}
.conference {
  background: #e8eef7;
  color: #88a0c4;
}
.competition {
  background: #e9f2ed;
  color: #8aa794;
}
.seminar {
  background: #f7eaf0;
  color: #bd92a7;
}
.art-ring {
  position: absolute;
  width: 70%;
  height: 85%;
  border: 1px solid currentColor;
  border-radius: 50%;
  transform: rotate(-30deg);
  opacity: 0.25;
}
.event-category {
  position: absolute;
  top: 15px;
  left: 15px;
  background: #fff;
  color: var(--text-main);
  padding: 4px 10px;
  font-size: 10px;
  border-radius: 5px;
}
.badge-registered {
  position: absolute;
  right: 15px;
  top: 15px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f2fbf4;
  color: #4c7b61;
  font-size: 9px;
  padding: 4px 7px;
  border-radius: 5px;
}
.event-body {
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 22px;
}
.event-date {
  display: flex;
  align-items: center;
  gap: 7px;
  color: var(--primary);
  font-size: 11px;
  margin-bottom: 12px;
}
h3 {
  font-size: 20px;
  margin: 0 0 11px;
  overflow-wrap: anywhere;
}
.event-loc {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-muted);
  margin: 0 0 13px;
}
.event-desc {
  font-size: 12px;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 22px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
  margin-top: auto;
}
.card-footer > span {
  font-size: 10px;
  color: var(--text-muted);
}
.card-footer button {
  display: flex;
  align-items: center;
  gap: 7px;
  background: none;
  border: 0;
  padding: 0;
  color: var(--primary);
  font-size: 12px;
  font-weight: 600;
}
</style>
