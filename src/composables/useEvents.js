import { ref, computed, watch } from 'vue';

// STORAGE KEYS
const EVENTS_STORAGE_KEY = 'gatherly_events';
const REGISTRATIONS_STORAGE_KEY = 'gatherly_user_registrations';

// REST API CONFIGURATION
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  return envUrl ? envUrl.trim().replace(/\/+$/, '') : '';
};

const normalizeEvent = (event) => ({
  ...event,
  id: String(event.id),
  title: event.title || '',
  cat: event.cat || '',
  date: event.date || '',
  loc: event.loc || '',
  quota: Number(event.quota) || 0,
  desc: event.desc || '',
  done: event.done === true || event.done === 'true'
});

const readStoredArray = (key) => {
  try {
    const storedValue = localStorage.getItem(key);
    const parsedValue = storedValue ? JSON.parse(storedValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
};

// SINGLE SOURCE OF TRUTH (Module-Level Singleton)
const events = ref(readStoredArray(EVENTS_STORAGE_KEY).map(normalizeEvent));
const userRegistrations = ref(readStoredArray(REGISTRATIONS_STORAGE_KEY));

// ASYNCHRONOUS NETWORK STATES (MODUL 6)
const loading = ref(false);
const error = ref(null);

// WATCHERS (LocalStorage tetap dipakai sebagai cache dan penyimpanan tiket pengguna)
watch(
  events,
  (newEvents) => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(newEvents));
  },
  { deep: true }
);

watch(
  userRegistrations,
  (newRegistrations) => {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(newRegistrations));
  },
  { deep: true }
);

export function useEvents() {
  // DERIVED STATE
  const totalEvents = computed(() => events.value.length);
  const activeEvents = computed(() => events.value.filter((event) => !event.done));
  const completedEvents = computed(() => events.value.filter((event) => event.done));
  const totalRegistrations = computed(() => userRegistrations.value.length);

  // HTTP GET: mengambil seluruh data acara dari REST API.
  const fetchEvents = async () => {
    const baseUrl = getApiBaseUrl();

    // Menjaga fitur lama tetap berfungsi sebelum endpoint MockAPI diisi.
    if (!baseUrl) {
      error.value = null;
      return events.value;
    }

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${baseUrl}/events`);
      if (!response.ok) {
        throw new Error(`Failed to load events (HTTP ${response.status}).`);
      }

      const data = await response.json();
      events.value = Array.isArray(data) ? data.map(normalizeEvent) : [];
      return events.value;
    } catch (requestError) {
      error.value = requestError.message || 'Unable to connect to the event server.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // HTTP GET BY ID: mengambil detail acara saat URL detail dibuka langsung.
  const fetchEventById = async (id) => {
    if (!id) return null;

    const stringId = String(id);
    const existingEvent = events.value.find((event) => String(event.id) === stringId);
    if (existingEvent) return existingEvent;

    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return null;

    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${baseUrl}/events/${stringId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('This event was not found on the server.');
        }
        throw new Error(`Failed to load event details (HTTP ${response.status}).`);
      }

      const eventData = normalizeEvent(await response.json());
      if (!events.value.some((event) => String(event.id) === eventData.id)) {
        events.value.push(eventData);
      }
      return eventData;
    } catch (requestError) {
      error.value = requestError.message || 'Unable to load this event.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  // HTTP POST: membuat acara baru pada REST API.
  const createEvent = async (eventData) => {
    loading.value = true;
    error.value = null;

    const cleanLocation = (eventData.loc || '').replace(/^[📍\s]+/u, '').trim();
    const payload = {
      title: eventData.title.trim(),
      cat: eventData.cat,
      date: eventData.date,
      loc: cleanLocation,
      quota: Number(eventData.quota) || 100,
      price: eventData.price || 'Free',
      desc: eventData.desc.trim(),
      done: false
    };

    const baseUrl = getApiBaseUrl();

    try {
      if (baseUrl) {
        const response = await fetch(`${baseUrl}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Failed to publish the event (HTTP ${response.status}).`);
        }

        const createdEvent = normalizeEvent(await response.json());
        events.value.unshift(createdEvent);
        return createdEvent;
      }

      // Fallback lokal mempertahankan perilaku project sebelum endpoint dikonfigurasi.
      const localEvent = normalizeEvent({ ...payload, id: Date.now() });
      events.value.unshift(localEvent);
      return localEvent;
    } catch (requestError) {
      error.value = requestError.message || 'Unable to publish the event.';
      throw requestError;
    } finally {
      loading.value = false;
    }
  };

  // HTTP DELETE: menghapus acara dari server dan tiket lokal yang terkait.
  const deleteEvent = async (id) => {
    const stringId = String(id);
    const baseUrl = getApiBaseUrl();
    loading.value = true;
    error.value = null;

    try {
      if (baseUrl) {
        const response = await fetch(`${baseUrl}/events/${stringId}`, {
          method: 'DELETE'
        });

        if (!response.ok && response.status !== 404) {
          throw new Error(`Failed to delete the event (HTTP ${response.status}).`);
        }
      }

      events.value = events.value.filter((event) => String(event.id) !== stringId);
      userRegistrations.value = userRegistrations.value.filter(
        (registration) => String(registration.eventId) !== stringId
      );
      return true;
    } catch (requestError) {
      error.value = requestError.message || 'Unable to delete the event.';
      throw requestError;
    } finally {
      loading.value = false;
    }
  };

  // HTTP PUT: menandai acara selesai pada server tanpa mengubah alur UI lama.
  const completeEvent = async (id) => {
    const stringId = String(id);
    const target = events.value.find((event) => String(event.id) === stringId);
    if (!target) return null;

    const baseUrl = getApiBaseUrl();
    loading.value = true;
    error.value = null;

    try {
      if (baseUrl) {
        const response = await fetch(`${baseUrl}/events/${stringId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ done: true })
        });

        if (!response.ok) {
          throw new Error(`Failed to complete the event (HTTP ${response.status}).`);
        }
      }

      target.done = true;
      return target;
    } catch (requestError) {
      error.value = requestError.message || 'Unable to update the event.';
      throw requestError;
    } finally {
      loading.value = false;
    }
  };

  // PENCARIAN DATA BERDASARKAN ID
  const getEventById = (id) => {
    return events.value.find((event) => String(event.id) === String(id));
  };

  // MUTASI STATE: PENDAFTARAN PESERTA (tetap lokal sesuai fitur sebelumnya)
  const registerAttendee = (eventId, participantData) => {
    const stringId = String(eventId);
    const event = events.value.find((item) => String(item.id) === stringId);
    if (!event || event.quota <= 0) return null;

    const bookingCode = 'GTH-' + Date.now().toString().slice(-4);
    const registrationRecord = {
      id: Date.now(),
      eventId: stringId,
      eventTitle: event.title,
      eventCat: event.cat,
      eventDate: event.date,
      eventLoc: event.loc,
      bookingCode,
      registeredAt: new Date().toISOString(),
      fullName: participantData.fullName.trim(),
      email: participantData.email.trim(),
      phone: participantData.phone.trim(),
      dob: participantData.dob,
      reason: participantData.reason.trim()
    };

    event.quota = Math.max(0, event.quota - 1);
    userRegistrations.value.unshift(registrationRecord);
    return registrationRecord;
  };

  const isUserRegistered = (eventId) => {
    const stringId = String(eventId);
    const eventExists = events.value.some((event) => String(event.id) === stringId);
    if (!eventExists) return false;
    return userRegistrations.value.some(
      (registration) => String(registration.eventId) === stringId
    );
  };

  const getRegistrationByEventId = (eventId) => {
    return userRegistrations.value.find(
      (registration) => String(registration.eventId) === String(eventId)
    );
  };

  const cancelRegistration = (eventId) => {
    const stringId = String(eventId);
    const registrationIndex = userRegistrations.value.findIndex(
      (registration) => String(registration.eventId) === stringId
    );

    if (registrationIndex === -1) return false;

    userRegistrations.value.splice(registrationIndex, 1);
    const event = events.value.find((item) => String(item.id) === stringId);
    if (event) event.quota += 1;
    return true;
  };

  const clearAllEvents = () => {
    events.value = [];
    localStorage.removeItem(EVENTS_STORAGE_KEY);
  };

  const clearAllRegistrations = () => {
    userRegistrations.value = [];
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
  };

  return {
    events,
    loading,
    error,
    totalEvents,
    activeEvents,
    completedEvents,
    userRegistrations,
    totalRegistrations,
    fetchEvents,
    fetchEventById,
    createEvent,
    deleteEvent,
    completeEvent,
    getEventById,
    registerAttendee,
    isUserRegistered,
    getRegistrationByEventId,
    cancelRegistration,
    clearAllEvents,
    clearAllRegistrations
  };
}
