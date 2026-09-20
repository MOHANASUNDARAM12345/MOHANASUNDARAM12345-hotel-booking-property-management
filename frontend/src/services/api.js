const API_BASE_URL = 'http://localhost:8080/api';

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

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || JSON.stringify(errorData);
    } catch {
      const text = await response.text();
      errorMessage = text || `HTTP ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },
  register: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },
  getUserByEmail: async (email) => {
    const res = await fetch(`${API_BASE_URL}/users/email/${email}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Public Hotels & Rooms
  getHotels: async () => {
    const res = await fetch(`${API_BASE_URL}/hotels`);
    return handleResponse(res);
  },
  getHotelById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/hotels/${id}`);
    return handleResponse(res);
  },
  getRoomsByHotel: async (hotelId) => {
    const res = await fetch(`${API_BASE_URL}/hotels/${hotelId}/rooms`);
    return handleResponse(res);
  },
  getRooms: async () => {
    const res = await fetch(`${API_BASE_URL}/rooms`);
    return handleResponse(res);
  },

  // Bookings
  createBooking: async (bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(res);
  },
  getBookingsByUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getBookingById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  updateBooking: async (id, bookingData) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(res);
  },
  cancelBooking: async (id) => {
    const res = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'CANCELLED' }),
    });
    return handleResponse(res);
  },

  // Payments & Invoices
  createPayment: async (paymentData) => {
    const res = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },
  getPaymentsByBooking: async (bookingId) => {
    const res = await fetch(`${API_BASE_URL}/payments/booking/${bookingId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  getInvoiceByPayment: async (paymentId) => {
    const res = await fetch(`${API_BASE_URL}/invoices/payment/${paymentId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Favorites
  addFavorite: async (favData) => {
    const res = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(favData),
    });
    return handleResponse(res);
  },
  getFavoritesByUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/favorites/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  removeFavorite: async (userId, hotelId) => {
    const res = await fetch(`${API_BASE_URL}/favorites/user/${userId}/hotel/${hotelId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Notifications
  getNotificationsByUser: async (userId) => {
    const res = await fetch(`${API_BASE_URL}/notifications/user/${userId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
  markNotificationRead: async (id) => {
    const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Reviews
  addReview: async (reviewData) => {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });
    return handleResponse(res);
  },
  getReviewsByHotel: async (hotelId) => {
    const res = await fetch(`${API_BASE_URL}/reviews/hotel/${hotelId}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Coupons & Services
  getCoupons: async () => {
    const res = await fetch(`${API_BASE_URL}/coupons`);
    return handleResponse(res);
  },
  getCouponByCode: async (code) => {
    const res = await fetch(`${API_BASE_URL}/coupons/code/${code}`);
    return handleResponse(res);
  },
  getServicesByHotel: async (hotelId) => {
    const res = await fetch(`${API_BASE_URL}/services/hotel/${hotelId}`);
    return handleResponse(res);
  },

  // Owner APIs
  getProperties: async () => {
    const res = await fetch(`${API_BASE_URL}/owner/properties`, { headers: getHeaders() });
    return handleResponse(res);
  },
  createProperty: async (data) => {
    const res = await fetch(`${API_BASE_URL}/owner/properties`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateProperty: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/owner/properties/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteProperty: async (id) => {
    const res = await fetch(`${API_BASE_URL}/owner/properties/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createHotel: async (data) => {
    const res = await fetch(`${API_BASE_URL}/owner/hotels`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateHotel: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/owner/hotels/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteHotel: async (id) => {
    const res = await fetch(`${API_BASE_URL}/owner/hotels/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createRoom: async (data) => {
    const res = await fetch(`${API_BASE_URL}/owner/rooms`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  updateRoom: async (id, data) => {
    const res = await fetch(`${API_BASE_URL}/owner/rooms/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteRoom: async (id) => {
    const res = await fetch(`${API_BASE_URL}/owner/rooms/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createStaff: async (data) => {
    const res = await fetch(`${API_BASE_URL}/owner/staff`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  getStaffByHotel: async (hotelId) => {
    const res = await fetch(`${API_BASE_URL}/owner/staff/hotel/${hotelId}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  deleteStaff: async (id) => {
    const res = await fetch(`${API_BASE_URL}/owner/staff/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createCoupon: async (data) => {
    const res = await fetch(`${API_BASE_URL}/owner/coupons`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteCoupon: async (id) => {
    const res = await fetch(`${API_BASE_URL}/owner/coupons/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  createService: async (data) => {
    const res = await fetch(`${API_BASE_URL}/owner/services`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
  deleteService: async (id) => {
    const res = await fetch(`${API_BASE_URL}/owner/services/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
