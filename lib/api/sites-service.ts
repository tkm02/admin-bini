const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Créer un site avec upload d'images
export const createSite = async (siteData: any, images: File[]) => {
  try {
    const formData = new FormData();

    // Ajouter les champs texte
    formData.append('name', siteData.name);
    formData.append('description', siteData.description);
    formData.append('location', siteData.location);
    formData.append('city', siteData.city);
    formData.append('country', siteData.country);
    formData.append('price', siteData.price.toString());
    formData.append('maxCapacity', siteData.maxCapacity.toString());
    formData.append('openHours', siteData.openHours);

    // Ajouter les tags (array)
    if (siteData.tags && siteData.tags.length > 0) {
      siteData.tags.forEach((tag: string) => {
        formData.append('tags', tag);
      });
    }

    // Ajouter les coordonnées GPS si présentes
    if (siteData.latitude) formData.append('latitude', siteData.latitude.toString());
    if (siteData.longitude) formData.append('longitude', siteData.longitude.toString());

    // Ajouter les fichiers images
    images.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/sites`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // ❌ NE PAS mettre 'Content-Type': 'multipart/form-data'
        // Le navigateur le fait automatiquement avec la bonne boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du site');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erreur createSite:', error);
    throw error;
  }
};

// Mettre à jour un site
export const updateSite = async (siteId: string, siteData: any, images?: File[]) => {
  try {
    const formData = new FormData();

    // Ajouter les champs texte
    Object.keys(siteData).forEach((key) => {
      if (siteData[key] !== undefined && siteData[key] !== null) {
        if (key === 'tags' && Array.isArray(siteData[key])) {
          siteData[key].forEach((tag: string) => {
            formData.append('tags', tag);
          });
        } else if (key !== 'image' && key !== 'images') {
          formData.append(key, siteData[key].toString());
        }
      }
    });

    // Ajouter les nouvelles images si présentes
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/sites/${siteId}`, {
      method: 'PUT',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Erreur updateSite:', error);
    throw error;
  }
};

// Les autres fonctions restent identiques
export const deleteSite = async (siteId: string) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}/sites/${siteId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors de la suppression');
  }

  return await response.json();
};

export const updateSiteStatus = async (siteId: string, isActive: boolean) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`${API_URL}/sites/${siteId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur lors du changement de statut');
  }

  return await response.json();
};
