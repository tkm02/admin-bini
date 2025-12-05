const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

function getAuthHeadersMultipart() {
  const token = localStorage.getItem('auth_token');
  return {
    ...(token && { 'Authorization': `Bearer ${token}` }),
    // Ne pas définir Content-Type pour multipart/form-data
  };
}

export interface SiteFormData {
  name: string;
  description: string;
  location?: string;
  city: string;
  country?: string;
  price: number;
  maxCapacity: number;
  image?: string;
  images?: string[];
  tags?: string[];
  openHours?: string;
  latitude?: number;
  longitude?: number;
  activities?: any[];
  managerId?: string;
}

// Créer un site
export async function createSite(data: SiteFormData) {
  const response = await fetch(`${API_URL}/sites`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la création du site');
  }

  return response.json();
}

// Mettre à jour un site
export async function updateSite(id: string, data: Partial<SiteFormData>) {
  const response = await fetch(`${API_URL}/sites/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la mise à jour du site');
  }

  return response.json();
}

// Supprimer un site
export async function deleteSite(id: string) {
  const response = await fetch(`${API_URL}/sites/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la suppression du site');
  }

  return response.json();
}

// Changer le statut d'un site (actif/inactif)
export async function updateSiteStatus(id: string, isActive: boolean) {
  const response = await fetch(`${API_URL}/sites/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors du changement de statut');
  }

  return response.json();
}

// Upload d'images (pour les sites)
export async function uploadSiteImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach(file => formData.append('images', file));

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: getAuthHeadersMultipart(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de l\'upload des images');
  }

  const data = await response.json();
  return data.urls;
}

// Récupérer tous les sites (pour le dashboard)
export async function fetchAllSites() {
  const response = await fetch(`${API_URL}/sites`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des sites');
  }

  return response.json();
}

// Récupérer un site par ID
export async function fetchSiteById(id: string) {
  const response = await fetch(`${API_URL}/sites/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération du site');
  }

  return response.json();
}

// Assigner un manager à un site
export async function assignSiteManager(siteId: string, managerId: string) {
  const response = await fetch(`${API_URL}/sites/${siteId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ managerId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de l\'assignation du manager');
  }

  return response.json();
}

// Mettre à jour les dates indisponibles
export async function updateUnavailableDates(siteId: string, dates: string[]) {
  const response = await fetch(`${API_URL}/sites/${siteId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ unavailableDates: dates }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la mise à jour des dates');
  }

  return response.json();
}
