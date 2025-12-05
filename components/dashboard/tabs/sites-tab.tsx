"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, EditIcon, TrashIcon, AlertTriangleIcon, Loader2, Upload, X } from "lucide-react"
import { createSite, updateSite, deleteSite, updateSiteStatus,uploadSiteImages } from "@/lib/api/sites-service"
// import {  } from "@/lib/api/sites-service"
import { toast } from "sonner"

interface SitesTabProps {
  sites: any[]
  onRefresh?: () => void
}

export function SitesTab({ sites: initialSites, onRefresh }: SitesTabProps) {
  const [sites, setSites] = useState(initialSites)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    country: "Côte d'Ivoire",
    price: "",
    maxCapacity: "",
    openHours: "08:00 - 18:00",
    tags: "",
    latitude: "",
    longitude: "",
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      city: "",
      country: "Côte d'Ivoire",
      price: "",
      maxCapacity: "",
      openHours: "08:00 - 18:00",
      tags: "",
      latitude: "",
      longitude: "",
    })
    setImageFiles([])
    setImagePreviews([])
  }

  // Gérer l'upload d'images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (files.length + imageFiles.length > 5) {
      toast.error("Maximum 5 images autorisées")
      return
    }

    setImageFiles([...imageFiles, ...files])

    files.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  // Upload des images vers le serveur
  const uploadImages = async (files: File[]): Promise<string[]> => {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))

    const token = localStorage.getItem('auth_token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'upload des images')
    }

    const data = await response.json()
    return data.urls
  }

  // Créer un site
  const handleAddSite = async () => {
    if (!formData.name || !formData.description || !formData.city || !formData.price || !formData.maxCapacity) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    if (imageFiles.length === 0) {
      toast.error("Veuillez ajouter au moins une image")
      return
    }

    try {
      setIsSubmitting(true)

      // Upload des images
      const uploadedImageUrls = await uploadImages(imageFiles)

      const siteData = {
        name: formData.name,
        description: formData.description,
        location: formData.location || `${formData.city}, ${formData.country}`,
        city: formData.city,
        country: formData.country,
        price: parseFloat(formData.price),
        maxCapacity: parseInt(formData.maxCapacity),
        openHours: formData.openHours,
        image: uploadedImageUrls[0],
        images: uploadedImageUrls,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
      }

      await createSite(siteData)

      toast.success("Site créé avec succès ✅")
      resetForm()
      setIsAddDialogOpen(false)
      
      if (onRefresh) onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création du site")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Modifier un site
  const handleEditSite = async () => {
    if (!selectedSite) return

    try {
      setIsSubmitting(true)

      let uploadedImageUrls = selectedSite.images || []
      
      // Si de nouvelles images sont ajoutées
      if (imageFiles.length > 0) {
        uploadedImageUrls = await uploadImages(imageFiles)
      }

      const siteData = {
        name: formData.name,
        description: formData.description,
        location: formData.location || `${formData.city}, ${formData.country}`,
        city: formData.city,
        country: formData.country,
        price: parseFloat(formData.price),
        maxCapacity: parseInt(formData.maxCapacity),
        openHours: formData.openHours,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        ...(imageFiles.length > 0 && {
          image: uploadedImageUrls[0],
          images: uploadedImageUrls,
        }),
      }

      await updateSite(selectedSite.id, siteData)

      toast.success("Site mis à jour avec succès ✅")
      setIsEditDialogOpen(false)
      setSelectedSite(null)
      resetForm()
      
      if (onRefresh) onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Supprimer un site
  const handleDeleteSite = async () => {
    if (!selectedSite) return

    try {
      setIsSubmitting(true)
      await deleteSite(selectedSite.id)
      
      toast.success("Site supprimé avec succès ✅")
      setIsDeleteDialogOpen(false)
      setSelectedSite(null)
      
      if (onRefresh) onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Changer le statut d'un site
  const handleToggleStatus = async (site: any) => {
    try {
      await updateSiteStatus(site.id, !site.isActive)
      
      toast.success(site.isActive ? "Site désactivé" : "Site activé")
      
      if (onRefresh) onRefresh()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du changement de statut")
    }
  }

  // Ouvrir le dialogue d'édition
  const openEditDialog = (site: any) => {
    setSelectedSite(site)
    setFormData({
      name: site.name,
      description: site.description || "",
      location: site.location || "",
      city: site.city,
      country: site.country,
      price: site.price.toString(),
      maxCapacity: site.maxCapacity.toString(),
      openHours: site.openHours || "08:00 - 18:00",
      tags: site.tags?.join(', ') || "",
      latitude: site.latitude?.toString() || "",
      longitude: site.longitude?.toString() || "",
    })
    setIsEditDialogOpen(true)
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? "text-green-600 bg-green-50" 
      : "text-red-600 bg-red-50"
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Sites</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter un Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau site écotouristique</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Informations de base */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informations de base</h3>
                
                <div>
                  <Label htmlFor="name">Nom du site *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Bini Sassandra"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Littoral tropical avec plages de sable blanc et kayak en lagon..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="ex: Sassandra"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Localisation complète</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ex: Sassandra, Région du Gboklè, Littoral"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour auto-générer : "Ville, Pays"
                  </p>
                </div>
              </div>

              {/* Capacité et tarification */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Capacité & Tarification</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Prix (CFA) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="15000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxCapacity">Capacité max *</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                      placeholder="130"
                    />
                  </div>
                  <div>
                    <Label htmlFor="openHours">Horaires</Label>
                    <Input
                      id="openHours"
                      value={formData.openHours}
                      onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                      placeholder="08:00 - 18:00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="plage, kayak, nature, famille"
                  />
                </div>
              </div>

              {/* Coordonnées GPS */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Coordonnées GPS (optionnel)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="5.123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="-4.123456"
                    />
                  </div>
                </div>
              </div>

              {/* Upload d'images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Images du site *</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={imageFiles.length >= 5}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm text-gray-600 mb-1">
                      Cliquez pour ajouter des images
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG jusqu'à 5MB (max 5 images)
                    </p>
                  </label>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                            Principale
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button 
                onClick={handleAddSite} 
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Créer le site
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sites Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom du Site</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Prix (CFA)</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.city}</TableCell>
                  <TableCell>
                    {site.manager 
                      ? `${site.manager.firstName} ${site.manager.lastName}` 
                      : <span className="text-gray-400 italic">Non assigné</span>}
                  </TableCell>
                  <TableCell>{site.price?.toLocaleString('fr-FR')} CFA</TableCell>
                  <TableCell>{site.maxCapacity}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(site.isActive)}`}>
                      {site.isActive ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(site)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedSite(site)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(site)}
                      className="text-orange-600 hover:text-orange-700"
                      title={site.isActive ? "Désactiver" : "Activer"}
                    >
                      <AlertTriangleIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog - Même structure que Add */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Éditer le site</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Même structure que le formulaire d'ajout */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nom du site *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-city">Ville *</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-country">Pays</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-price">Prix (CFA) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxCapacity">Capacité max *</Label>
                  <Input
                    id="edit-maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-openHours">Horaires</Label>
                  <Input
                    id="edit-openHours"
                    value={formData.openHours}
                    onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleEditSite} 
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 h-12"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Supprimer le site?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer {selectedSite?.name}? Cette action est irréversible et supprimera toutes les réservations associées.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel disabled={isSubmitting}>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSite} 
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmitting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
