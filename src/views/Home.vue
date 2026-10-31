<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppIcon from "@/components/ui/AppIcon.vue";
const router = useRouter();
const query = ref("");
const imageFailed = ref(false);
const categories = [
  { name: "Workshops", value: "Workshop", icon: "layers", tone: "lilac" },
  { name: "Meetups", value: "Meetup", icon: "users", tone: "peach" },
  { name: "Conferences", value: "Conference", icon: "globe", tone: "blue" },
  { name: "Competitions", value: "Competition", icon: "grid", tone: "green" },
  { name: "Seminars", value: "Seminar", icon: "calendar", tone: "rose" },
];
const search = () =>
  router.push({
    path: "/browse/events",
    query: query.value.trim() ? { q: query.value.trim() } : {},
  });
</script>
<template>
  <div class="home-page">
    <section class="hero-section">
      <div class="hero-content">
        <span class="hero-eyebrow"
          ><span>✦</span> A LITTLE CURIOSITY. A LOT OF POSSIBILITY.</span
        >
        <h1>
          Your next great<br />experience<br />starts{{ " "
          }}<span>together.</span>
        </h1>
        <p>
          Find your people. Explore new ideas. Make room for the moments that
          stay with you.
        </p>
        <div class="hero-actions">
          <router-link to="/browse/events" class="button-primary"
            >Discover events <AppIcon name="arrow" :size="17" /></router-link
          ><router-link to="/browse/public-api" class="hero-community"
            >Explore the community <AppIcon name="diagonal" :size="15"
          /></router-link>
        </div>
        <div class="hero-note">
          <span><AppIcon name="users" :size="17" /></span>For curious minds and
          shared interests.
        </div>
      </div>
      <div class="hero-visual">
        <div class="photo-wrap">
          <img
            v-if="!imageFailed"
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85"
            alt="Attendees gathered for a community conference"
            fetchpriority="high"
            @error="imageFailed = true"
          />
          <div class="photo-shade"></div>
          <div class="photo-caption">
            <span>BETTER, TOGETHER</span>
            <h2>More than an event.<br />A shared experience.</h2>
            <router-link
              to="/browse/events"
              aria-label="Explore community events"
              ><AppIcon name="diagonal" :size="22"
            /></router-link>
          </div>
        </div>
        <div class="floating-note">
          <span class="floating-icon"
            ><AppIcon name="ticket" :size="25"
          /></span>
          <div>
            <strong>A place for every interest</strong
            ><span>Your next connection is out there.</span>
          </div>
          <span class="note-check"><AppIcon name="check" :size="14" /></span>
        </div>
        <div class="visual-label">New people. New perspectives.</div>
      </div>
    </section>
    <form class="discovery-search" @submit.prevent="search">
      <span class="search-circle"><AppIcon name="search" :size="21" /></span>
      <label class="search-field"
        ><span>What are you looking for?</span
        ><input
          v-model="query"
          type="search"
          placeholder="Try a workshop, meetup, or something new…"
          aria-label="Search events by title or location"
      /></label>
      <span class="search-divider"></span>
      <div class="search-caption">
        <AppIcon name="pin" :size="18" /><span>Near you &amp; online</span>
      </div>
      <button class="button-primary" type="submit">
        Find an event <AppIcon name="arrow" :size="17" />
      </button>
    </form>
    <section class="interests-section">
      <div class="section-heading">
        <div>
          <span class="eyebrow">FOLLOW YOUR CURIOSITY</span>
          <h2>What brings you here?</h2>
          <p>There’s something for every kind of curious.</p>
        </div>
        <router-link to="/browse/category" class="text-link"
          >Explore categories <AppIcon name="arrow" :size="16"
        /></router-link>
      </div>
      <div class="interest-grid">
        <router-link
          v-for="category in categories"
          :key="category.value"
          :to="{ path: '/browse/events', query: { category: category.value } }"
          class="interest-item"
          ><span class="interest-icon" :class="category.tone"
            ><AppIcon :name="category.icon" :size="24" /></span
          ><span>{{ category.name }}</span
          ><AppIcon name="diagonal" :size="15"
        /></router-link>
      </div>
    </section>
    <section class="community-section">
      <div class="community-art" aria-hidden="true">
        <div class="art-orbit"></div>
        <span class="art-letter">g.</span
        ><span class="art-label">ideas meet people</span>
      </div>
      <div class="community-copy">
        <span class="eyebrow">GO BEYOND YOUR CIRCLE</span>
        <h2>A world of ideas.<br />A community to share them.</h2>
        <p>
          Discover stories, conversations, and fresh perspectives from the
          global tech community.
        </p>
        <router-link to="/browse/public-api" class="text-link"
          >Discover the global feed <AppIcon name="arrow" :size="17"
        /></router-link>
      </div>
    </section>
  </div>
</template>
<style scoped>
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 65px;
  padding: 26px 0 52px;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.hero-eyebrow > span {
  font-size: 19px;
  color: var(--primary);
}
.hero-content h1 {
  font-size: clamp(42px, 4.7vw, 65px);
  line-height: 1.12;
  font-weight: 800;
  letter-spacing: -0.055em;
  margin: 0 0 23px;
}
.hero-content h1 > span {
  color: var(--primary);
}
.hero-content > p {
  max-width: 365px;
  font-size: 14px;
  line-height: 1.85;
  color: var(--text-muted);
  margin-bottom: 27px;
}
.hero-actions {
  display: flex;
  align-items: center;
  gap: 22px;
}
.hero-community {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--text-main);
  font-size: 11px;
  font-weight: 600;
  text-decoration: none;
}
.hero-community:hover {
  color: var(--primary);
}
.hero-note {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 30px;
}
.hero-note > span {
  display: grid;
  place-items: center;
  background: #eeebf6;
  color: var(--primary);
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.hero-visual {
  position: relative;
  padding: 10px 0 15px 20px;
  min-width: 0;
}
.photo-wrap {
  position: relative;
  height: 405px;
  border-radius: 110px 20px 20px 20px;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 70% 25%, #a599cc, transparent 60%), #66518a;
}
.photo-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 45% center;
}
.photo-shade {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 38%, rgb(24 20 39 / 82%));
}
.photo-caption {
  position: absolute;
  left: 30px;
  bottom: 25px;
  right: 25px;
  color: white;
}
.photo-caption > span {
  font-size: 9px;
  letter-spacing: 0.2em;
  font-weight: 600;
  color: #e2daf8;
}
.photo-caption h2 {
  font-size: 27px;
  line-height: 1.25;
  margin: 10px 45px 0 0;
  letter-spacing: -0.03em;
}
.photo-caption > a {
  position: absolute;
  right: 0;
  bottom: 0;
  border: 1px solid rgb(255 255 255 / 45%);
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: white;
}
.photo-caption > a:hover {
  background: rgb(255 255 255 / 15%);
}
.floating-note {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  left: -16px;
  top: 45px;
  background: white;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px rgb(40 30 80 / 10%);
  padding: 14px 17px;
  border-radius: 14px;
  transform: rotate(-4deg);
  max-width: calc(100% - 5px);
}
.floating-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  background: var(--primary-soft);
  color: var(--primary);
  border-radius: 12px;
}
.floating-note strong {
  display: block;
  font-size: 12px;
  letter-spacing: -0.02em;
}
.floating-note div > span {
  display: block;
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 2px;
}
.note-check {
  background: #eef5f0;
  color: #4c7b61;
  display: grid;
  place-items: center;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  margin-left: 12px;
}
.visual-label {
  font-size: 10px;
  color: var(--text-muted);
  text-align: right;
  margin-top: 14px;
  margin-right: 8px;
}
.discovery-search {
  display: flex;
  align-items: center;
  gap: 17px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 15px;
  box-shadow: var(--shadow);
  padding: 20px 23px;
  margin-bottom: 58px;
}
.search-circle {
  width: 43px;
  height: 43px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: var(--primary-soft);
  color: var(--primary);
}
.search-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
}
.search-field > span {
  font-size: 12px;
  font-weight: 700;
}
.search-field input {
  width: 100%;
  padding: 4px 0 0;
  border: 0;
  background: none;
  font-size: 11px;
  color: var(--text-main);
  outline-offset: 3px;
}
.search-field input::placeholder {
  color: #92909d;
}
.search-divider {
  height: 34px;
  width: 1px;
  background: var(--border-color);
  margin-inline: 10px;
}
.search-caption {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: var(--text-muted);
  margin-right: 25px;
}
.interests-section {
  padding-bottom: 55px;
}
.interest-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}
.interest-item {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 20px;
  padding: 23px 20px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 15px;
  color: var(--text-main);
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
}
.interest-item:hover {
  transform: translateY(-4px);
  border-color: #c8bfea;
  box-shadow: var(--shadow);
}
.interest-icon {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border-radius: 13px;
}
.interest-item > svg {
  position: absolute;
  right: 18px;
  bottom: 26px;
  color: #9b96aa;
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
.community-section {
  display: grid;
  grid-template-columns: 0.85fr 1fr;
  gap: 60px;
  align-items: center;
  background: #f0edf8;
  border-radius: 20px;
  overflow: hidden;
  padding: 36px 60px;
}
.community-art {
  position: relative;
  min-height: 210px;
  display: grid;
  place-items: center;
}
.art-letter {
  font-family: "Manrope", sans-serif;
  font-weight: 800;
  font-size: 140px;
  letter-spacing: -15px;
  line-height: 1;
  color: #7661bd;
  transform: rotate(-12deg);
  z-index: 1;
}
.art-orbit {
  position: absolute;
  width: 260px;
  height: 155px;
  border: 1px solid #c8bee4;
  border-radius: 50%;
  transform: rotate(-25deg);
}
.art-orbit::after {
  content: "";
  position: absolute;
  inset: -25px 25px;
  border: 1px solid #d2cae9;
  border-radius: 50%;
  transform: rotate(55deg);
}
.art-label {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) rotate(-6deg);
  background: white;
  border: 1px solid #ded7ec;
  padding: 6px 18px;
  font-size: 11px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 2;
}
.community-copy h2 {
  font-size: 31px;
  margin: 10px 0 15px;
}
.community-copy p {
  font-size: 13px;
  color: var(--text-muted);
  max-width: 370px;
  margin-bottom: 20px;
}
@media (max-width: 1100px) {
  .hero-section {
    gap: 30px;
  }
  .hero-content h1 {
    font-size: 53px;
  }
  .hero-actions {
    gap: 14px;
  }
  .hero-community {
    font-size: 10px;
  }
  .photo-wrap {
    height: 390px;
  }
  .floating-note {
    left: 0;
  }
  .interest-item {
    padding: 18px 14px;
    font-size: 11px;
  }
  .interest-item > svg {
    right: 12px;
    bottom: 22px;
  }
  .search-caption {
    margin-right: 8px;
  }
}
@media (max-width: 760px) {
  .hero-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 25px;
    padding-top: 12px;
  }
  .hero-eyebrow {
    font-size: 8px;
    margin-bottom: 18px;
  }
  .hero-content h1 {
    font-size: clamp(44px, 9vw, 64px);
  }
  .hero-content > p {
    max-width: 430px;
  }
  .hero-visual {
    padding-left: 14px;
  }
  .photo-wrap {
    height: 310px;
    border-top-left-radius: 75px;
  }
  .floating-note {
    top: 28px;
    bottom: auto;
  }
  .hero-note {
    margin-top: 20px;
  }
  .discovery-search {
    flex-wrap: wrap;
    padding: 17px;
    gap: 12px;
    margin-bottom: 40px;
  }
  .search-divider,
  .search-caption {
    display: none;
  }
  .discovery-search > .button-primary {
    width: 100%;
    margin-top: 5px;
  }
  .search-field input {
    font-size: 12px;
  }
  .interest-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .community-section {
    padding: 28px;
    gap: 25px;
    grid-template-columns: 1fr;
  }
  .community-art {
    display: none;
  }
  .community-copy h2 {
    font-size: 28px;
  }
}
@media (max-width: 430px) {
  .hero-actions {
    gap: 17px;
    flex-wrap: wrap;
  }
  .hero-content h1 {
    font-size: clamp(36px, 10.7vw, 45px);
  }
  .photo-caption h2 {
    font-size: 24px;
  }
  .interest-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .interest-item {
    font-size: 12px;
  }
  .interest-item:last-child {
    grid-column: span 2;
    flex-direction: row;
    align-items: center;
    gap: 15px;
  }
  .interest-item:last-child > svg {
    bottom: 34px;
  }
  .hero-community {
    font-size: 11px;
  }
}
</style>
