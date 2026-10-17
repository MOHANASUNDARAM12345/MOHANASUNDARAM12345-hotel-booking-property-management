const PRODUCTION_API_BASE_URL =
  'https://mohanasundaram12345-hotel-booking-v844.onrender.com/api';

const rawBaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? '/api' : PRODUCTION_API_BASE_URL);

const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

const NETWORK_ERROR_MESSAGE =
  'Unable to reach the server. Please check your internet connection and try again.';

const TIMEOUT_ERROR_MESSAGE =
  'The server took too long to respond. It may be waking up from an idle state — please try again in a moment.';

// Bound how long any request can hang. Defaults to 60s so the first request
// after a host cold start (e.g. Render free tier) still has a chance to
// succeed, while a genuinely stalled connection can never leave the UI
// spinning forever. Override with VITE_API_TIMEOUT_MS at build time.
const DEFAULT_TIMEOUT_MS = 60000;
const parsedTimeout = Number.parseInt(
  import.meta.env.VITE_API_TIMEOUT_MS,
  10
);
const REQUEST_TIMEOUT_MS =
  Number.isFinite(parsedTimeout) && parsedTimeout > 0
    ? parsedTimeout
    : DEFAULT_TIMEOUT_MS;

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// A Fetch Response body can only be consumed once. We therefore read it as
// text exactly once, then decide how to interpret it. Reading it twice (e.g.
// response.json() followed by response.text()) throws
// "Failed to execute 'text' on 'Response': body stream already read".
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  let rawBody = '';
  try {
    rawBody = await response.text();
  } catch {
    rawBody = '';
  }

  let data = null;
  let isJson = false;
  if (rawBody.length > 0) {
    try {
      data = JSON.parse(rawBody);
      isJson = true;
    } catch {
      isJson = false;
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }

    let errorMessage = '';
    if (isJson && data && typeof data === 'object') {
      errorMessage =
        data.message ||
        data.error ||
        (data.fieldErrors ? JSON.stringify(data.fieldErrors) : '') ||
        JSON.stringify(data);
    } else if (rawBody) {
      errorMessage = rawBody;
    }

    if (!errorMessage) {
      errorMessage =
        response.status === 403
          ? 'You are not authorized to perform this action. Please sign in and try again.'
          : `HTTP ${response.status}: ${response.statusText || 'Request failed'}`;
    }

    throw new Error(errorMessage);
  }

  if (isJson) {
    return data;
  }

  if (contentType.includes('application/json') || contentType.includes('+json')) {
    return null;
  }

  return rawBody;
};

const safeFetch = async (url, options = {}) => {
  const { signal: externalSignal, ...rest } = options;
  const controller = new AbortController();
  let timedOut = false;

  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener(
        'abort',
        () => controller.abort(),
        { once: true }
      );
    }
  }

  try {
    return await fetch(url, { ...rest, signal: controller.signal });
  } catch (err) {
    if (timedOut || (err && err.name === 'AbortError')) {
      throw new Error(TIMEOUT_ERROR_MESSAGE);
    }
    throw new Error(NETWORK_ERROR_MESSAGE);
  } finally {
    clearTimeout(timeoutId);
  }
};

// Dedupe identical concurrent GET requests (React StrictMode double-mounts
// components in development, which otherwise fires two identical requests).
const inFlightGets = new Map();
const dedupedGet = (url, options) => {
  if (inFlightGets.has(url)) {
    return inFlightGets.get(url);
  }
  const promise = safeFetch(url, options)
    .then(handleResponse)
    .finally(() => {
      inFlightGets.delete(url);
    });
  inFlightGets.set(url, promise);
  return promise;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await safeFetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  getUserByEmail: async (email) => {
    const res = await safeFetch(`${API_BASE_URL}/users/email/${email}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Public Hotels & Rooms
  getHotels: async () => dedupedGet(`${API_BASE_URL}/hotels`),
  getHotelById: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/hotels/${id}`);
    return handleResponse(res);
  },
  getRoomsByHotel: async (hotelId) =>
    dedupedGet(`${API_BASE_URL}/hotels/${hotelId}/rooms`),
  getRooms: async () => dedupedGet(`${API_BASE_URL}/rooms`),
  getAvailableRooms: async (hotelId, checkIn, checkOut, guests) => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', guests);
    const qs = params.toString();
    return dedupedGet(
      `${API_BASE_URL}/hotels/${hotelId}/available-rooms${qs ? `?${qs}` : ''}`
    );
  },

  // Bookings
  createBooking: async (bookingData) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(res);
  },
  getBookingsByUser: async (userId) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getBookingById: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  updateBooking: async (id, bookingData) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(res);
  },
  cancelBooking: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  checkoutBooking: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings/${id}/checkout`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Payments & Invoices
  createPayment: async (paymentData) => {
    const res = await safeFetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },
  getPaymentsByBooking: async (bookingId) => {
    const res = await safeFetch(`${API_BASE_URL}/payments/booking/${bookingId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getInvoiceByPayment: async (paymentId) => {
    const res = await safeFetch(`${API_BASE_URL}/invoices/payment/${paymentId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Favorites
  addFavorite: async (favData) => {
    const res = await safeFetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(favData),
    });
    return handleResponse(res);
  },
  getFavoritesByUser: async (userId) => {
    const res = await safeFetch(`${API_BASE_URL}/favorites/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  removeFavorite: async (userId, hotelId) => {
    const res = await safeFetch(`${API_BASE_URL}/favorites/user/${userId}/hotel/${hotelId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Notifications
  getNotificationsByUser: async (userId) => {
    const res = await safeFetch(`${API_BASE_URL}/notifications/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  markNotificationRead: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Reviews
  addReview: async (reviewData) => {
    const res = await safeFetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(res);
  },
  getReviewsByHotel: async (hotelId) => {
    const res = await safeFetch(`${API_BASE_URL}/reviews/hotel/${hotelId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Coupons & Services
  getCoupons: async () => {
    const res = await safeFetch(`${API_BASE_URL}/coupons`);
    return handleResponse(res);
  },
  getCouponByCode: async (code) => {
    const res = await safeFetch(`${API_BASE_URL}/coupons/code/${code}`);
    return handleResponse(res);
  },
  getServicesByHotel: async (hotelId) => {
    const res = await safeFetch(`${API_BASE_URL}/services/hotel/${hotelId}`);
    return handleResponse(res);
  },

  // Owner APIs
  getProperties: async () => {
    const res = await safeFetch(`${API_BASE_URL}/owner/properties`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createProperty: async (data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/properties`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateProperty: async (id, data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/properties/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteProperty: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/properties/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createHotel: async (data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/hotels`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateHotel: async (id, data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/hotels/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteHotel: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/hotels/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createRoom: async (data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateRoom: async (id, data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/rooms/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteRoom: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/rooms/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createStaff: async (data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/staff`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  getAllStaff: async () => {
    const res = await safeFetch(`${API_BASE_URL}/owner/staff`, { headers: getHeaders() });
    return handleResponse(res);
  },
  getStaffByHotel: async (hotelId) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/staff/hotel/${hotelId}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  deleteStaff: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/staff/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createCoupon: async (data) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/coupons`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteCoupon: async (id) => {
    const res = await safeFetch(`${API_BASE_URL}/owner/coupons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Smart Features & AI Differentiating Engines
  getSmartStayRecommendations: async (requestData) => {
    const res = await safeFetch(`${API_BASE_URL}/smart-stay/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData),
    });
    return handleResponse(res);
  },

  askGuestAssistant: async (queryData) => {
    const res = await safeFetch(`${API_BASE_URL}/assistant/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(queryData),
    });
    return handleResponse(res);
  },

  getOwnerAnalytics: async (ownerId) => {
    const url = ownerId ? `${API_BASE_URL}/owner/analytics?ownerId=${ownerId}` : `${API_BASE_URL}/owner/analytics`;
    const res = await safeFetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  getCancellationRefundEstimate: async (bookingId) => {
    const res = await safeFetch(`${API_BASE_URL}/bookings/${bookingId}/cancellation-refund-estimate`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};

