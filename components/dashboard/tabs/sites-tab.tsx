"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { PlusIcon, EditIcon, TrashIcon, AlertTriangleIcon } from "lucide-react"

interface SitesTabProps {
  sites: any[]
}

export function SitesTab({ sites: initialSites }: SitesTabProps) {
  const [sites, setSites] = useState(initialSites)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedSite, setSelectedSite] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    region: "",
    manager: "",
    capacity: 0,
    status: "active",
  })

  const handleAddSite = () => {
    if (!formData.name || !formData.region || !formData.manager || formData.capacity === 0) {
      alert("Veuillez remplir tous les champs")
      return
    }

    const newSite = {
      id: `site-${Date.now()}`,
      ...formData,
      currentVisitors: 0,
      revenue: 0,
      rating: 4.0,
      openingDate: new Date().toISOString().split("T")[0],
      latitude: 0,
      longitude: 0,
    }

    setSites([...sites, newSite])
    setFormData({ name: "", region: "", manager: "", capacity: 0, status: "active" })
    setIsAddDialogOpen(false)
  }

  const handleEditSite = () => {
    if (!selectedSite) return
    setSites(sites.map((s) => (s.id === selectedSite.id ? { ...s, ...formData } : s)))
    setIsEditDialogOpen(false)
    setSelectedSite(null)
  }

  const handleDeleteSite = () => {
    if (!selectedSite) return
    setSites(sites.filter((s) => s.id !== selectedSite.id))
    setIsDeleteDialogOpen(false)
    setSelectedSite(null)
  }

  const handleCloseSite = (site: any) => {
    setSites(sites.map((s) => (s.id === site.id ? { ...s, status: "closed" } : s)))
  }

  const openEditDialog = (site: any) => {
    setSelectedSite(site)
    setFormData({
      name: site.name,
      region: site.region,
      manager: site.manager,
      capacity: site.capacity,
      status: site.status,
    })
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "maintenance":
        return "text-yellow-600 bg-yellow-50"
      case "closed":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau site</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nom du site</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Bini Nouvelle Forêt"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Région</label>
                <Input
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="ex: Yamoussoukro"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Responsable</label>
                <Input
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  placeholder="ex: Pierre Dupont"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Capacité</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
                  placeholder="ex: 150"
                />
              </div>
              <Button onClick={handleAddSite} className="w-full bg-green-600 hover:bg-green-700">
                Créer le site
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
                <TableHead>Région</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Capacité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{site.region}</TableCell>
                  <TableCell>{site.manager}</TableCell>
                  <TableCell>{site.capacity}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(site.status)}`}>
                      {site.status === "active" ? "Actif" : site.status === "maintenance" ? "Maintenance" : "Fermé"}
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
                    {site.status === "active" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCloseSite(site)}
                        className="text-orange-600 hover:text-orange-700"
                        title="Fermer le site pour événement spécial"
                      >
                        <AlertTriangleIcon className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Éditer le site</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nom du site</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Région</label>
              <Input value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Responsable</label>
              <Input value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Capacité</label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
              />
            </div>
            <Button onClick={handleEditSite} className="w-full bg-green-600 hover:bg-green-700">
              Enregistrer les modifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Supprimer le site?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer {selectedSite?.name}? Cette action est irréversible.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSite} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
