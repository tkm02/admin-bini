const API_URL = 'http://localhost:5000/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export async function fetchAdvancedAnalytics() {
  const response = await fetch(`${API_URL}/analytics/advanced`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des analytics');
  }

  return response.json();
}
