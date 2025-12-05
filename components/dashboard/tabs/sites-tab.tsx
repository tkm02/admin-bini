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
import { createSite, updateSite, deleteSite, updateSiteStatus } from "@/lib/api/sites-service"
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
    }

    // ✅ Envoyer tout en une seule fois
    await createSite(siteData, imageFiles)

    toast.success("Site créé avec succès ✅")
    resetForm()
    setIsAddDialogOpen(false)
    
    if (onRefresh) onRefresh()
  } catch (error: any) {
    console.error('Erreur création site:', error)
    toast.error(error.message || "Erreur lors de la création du site")
  } finally {
    setIsSubmitting(false)
  }
}
  // Upload des images vers le serveur
 
  // Créer un site
  const handleEditSite = async () => {
  if (!selectedSite) return

  try {
    setIsSubmitting(true)

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
    }

    // ✅ Envoyer avec les nouvelles images si présentes
    await updateSite(selectedSite.id, siteData, imageFiles.length > 0 ? imageFiles : undefined)

    toast.success("Site mis à jour avec succès ✅")
    setIsEditDialogOpen(false)
    setSelectedSite(null)
    resetForm()
    
    if (onRefresh) onRefresh()
  } catch (error: any) {
    console.error('Erreur mise à jour site:', error)
    toast.error(error.message || "Erreur lors de la mise à jour")
  } finally {
    setIsSubmitting(false)
  }
}

  // Modifier un site
  

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

  // ✅ Fonction corrigée pour le badge de statut
  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? "text-green-600 bg-green-50 border border-green-200" 
      : "text-red-600 bg-red-50 border border-red-200"
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Sites</h2>
          <p className="text-sm text-gray-600 mt-1">
            {sites.length} site{sites.length > 1 ? 's' : ''} écotouristique{sites.length > 1 ? 's' : ''}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter un Site
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Ajouter un nouveau site écotouristique</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Informations de base */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📍</span> Informations de base
                </h3>
                
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Nom du site *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ex: Bini Sassandra"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Littoral tropical avec plages de sable blanc et kayak en lagon..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">Ville *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="ex: Sassandra"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-sm font-medium">Pays</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium">Localisation complète</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="ex: Sassandra, Région du Gboklè, Littoral"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Laissez vide pour auto-générer : "Ville, Pays"
                  </p>
                </div>
              </div>

              {/* Capacité et tarification */}
              <div className="space-y-4 p-4 bg-emerald-50 rounded-lg">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">💰</span> Capacité & Tarification
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium">Prix (CFA) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="15000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxCapacity" className="text-sm font-medium">Capacité max *</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      value={formData.maxCapacity}
                      onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                      placeholder="130"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="openHours" className="text-sm font-medium">Horaires</Label>
                    <Input
                      id="openHours"
                      value={formData.openHours}
                      onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                      placeholder="08:00 - 18:00"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-medium">Tags (séparés par des virgules)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="plage, kayak, nature, famille"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Coordonnées GPS */}
              <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">🗺️</span> Coordonnées GPS (optionnel)
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude" className="text-sm font-medium">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      placeholder="5.123456"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude" className="text-sm font-medium">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      placeholder="-4.123456"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Upload d'images */}
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <span className="text-xl">📸</span> Images du site *
                </h3>
                
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors cursor-pointer bg-white">
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
                    <Upload className="w-12 h-12 mx-auto mb-3 text-purple-400" />
                    <p className="text-sm text-gray-600 mb-1 font-medium">
                      Cliquez pour ajouter des images
                    </p>
                    <p className="text-xs text-gray-500">
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
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-semibold shadow">
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
                className="w-full bg-green-600 hover:bg-green-700 h-12 text-base font-semibold shadow-md"
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
      <Card className="p-6 shadow-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Nom du Site</TableHead>
                <TableHead className="font-semibold">Ville</TableHead>
                <TableHead className="font-semibold">Responsable</TableHead>
                <TableHead className="font-semibold">Prix (CFA)</TableHead>
                <TableHead className="font-semibold">Capacité</TableHead>
                <TableHead className="font-semibold">Statut</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium text-gray-900">{site.name}</TableCell>
                  <TableCell className="text-gray-700">{site.city}</TableCell>
                  <TableCell>
                    {site.manager ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">
                          {site.manager.firstName} {site.manager.lastName}
                        </span>
                        <span className="text-xs text-gray-500">{site.manager.email}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">Non assigné</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold text-emerald-600">
                    {site.price?.toLocaleString('fr-FR')} CFA
                  </TableCell>
                  <TableCell className="text-gray-700">{site.maxCapacity}</TableCell>
                  <TableCell>
                    {/* ✅ Badge de statut corrigé */}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(site.isActive)}`}>
                      {site.isActive ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(site)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        title="Modifier"
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
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(site)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                        title={site.isActive ? "Désactiver" : "Activer"}
                      >
                        <AlertTriangleIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Éditer le site</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium">Nom du site *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-city" className="text-sm font-medium">Ville *</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-country" className="text-sm font-medium">Pays</Label>
                  <Input
                    id="edit-country"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-price" className="text-sm font-medium">Prix (CFA) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-maxCapacity" className="text-sm font-medium">Capacité max *</Label>
                  <Input
                    id="edit-maxCapacity"
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-openHours" className="text-sm font-medium">Horaires</Label>
                  <Input
                    id="edit-openHours"
                    value={formData.openHours}
                    onChange={(e) => setFormData({ ...formData, openHours: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleEditSite} 
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 h-12 font-semibold shadow-md"
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
            Êtes-vous sûr de vouloir supprimer <strong>{selectedSite?.name}</strong>? Cette action est irréversible et supprimera toutes les réservations associées.
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
