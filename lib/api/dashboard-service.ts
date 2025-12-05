const API_URL = 'http://localhost:5000/api/v1';

// Helper pour ajouter le token aux requêtes
function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

// Récupérer tous les sites
export async function fetchDashboardSites() {
  const response = await fetch(`${API_URL}/sites`, {
    headers: getAuthHeaders(),
  });
  // console.log( awaitresponse.json());
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des sites');
  }

  return response.json();
}

// Récupérer tous les employés (users)
export async function fetchEmployees() {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des employés');
  }

  return response.json();
}

// Récupérer tous les avis
export async function fetchDashboardReviews(status?: string) {
  const url = status 
    ? `${API_URL}/reviews?status=${status}`
    : `${API_URL}/reviews`;

  const response = await fetch(url, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des avis');
  }

  return response.json();
}

// Récupérer les statistiques
export async function fetchDashboardStats() {
  const response = await fetch(`${API_URL}/stats`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des statistiques');
  }

  return response.json();
}

// Récupérer les réservations
export async function fetchBookings() {
  const response = await fetch(`${API_URL}/bookings`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des réservations');
  }

  return response.json();
}
