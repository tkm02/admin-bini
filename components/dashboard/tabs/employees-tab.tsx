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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusIcon, EditIcon, TrashIcon } from "lucide-react"

interface EmployeesTabProps {
  employees: any[]
  sites: any[]
}

export function EmployeesTab({ employees: initialEmployees, sites }: EmployeesTabProps) {
  const [employees, setEmployees] = useState(initialEmployees)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "Guide",
    siteId: "",
    email: "",
    phone: "",
    salary: 0,
    status: "active",
  })

  const handleAddEmployee = () => {
    if (!formData.firstName || !formData.lastName || !formData.siteId) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    const newEmployee = {
      id: `emp-${Date.now()}`,
      ...formData,
      hireDate: new Date().toISOString().split("T")[0],
    }

    setEmployees([...employees, newEmployee])
    setFormData({
      firstName: "",
      lastName: "",
      role: "Guide",
      siteId: "",
      email: "",
      phone: "",
      salary: 0,
      status: "active",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditEmployee = () => {
    if (!selectedEmployee) return
    setEmployees(employees.map((e) => (e.id === selectedEmployee.id ? { ...e, ...formData } : e)))
    setIsEditDialogOpen(false)
    setSelectedEmployee(null)
  }

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return
    setEmployees(employees.filter((e) => e.id !== selectedEmployee.id))
    setIsDeleteDialogOpen(false)
    setSelectedEmployee(null)
  }

  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee)
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      role: employee.role,
      siteId: employee.siteId,
      email: employee.email,
      phone: employee.phone,
      salary: employee.salary,
      status: employee.status,
    })
    setIsEditDialogOpen(true)
  }

  const getSiteName = (siteId: string) => {
    return sites.find((s) => s.id === siteId)?.name || "N/A"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50"
      case "on_leave":
        return "text-yellow-600 bg-yellow-50"
      case "inactive":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Employés</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <PlusIcon className="w-4 h-4 mr-2" />
              Ajouter un Employé
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouvel employé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Prénom</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="ex: Jean"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Nom</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="ex: Dupont"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Poste</label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Guide">Guide</SelectItem>
                    <SelectItem value="Accueil">Accueil</SelectItem>
                    <SelectItem value="Technique">Technique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Site</label>
                <Select value={formData.siteId} onValueChange={(value) => setFormData({ ...formData, siteId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ex: jean@domainebini.ci"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Téléphone</label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="ex: +225 07 12 34 56 78"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Salaire mensuel</label>
                <Input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number.parseInt(e.target.value) })}
                  placeholder="ex: 200000"
                />
              </div>
              <Button onClick={handleAddEmployee} className="w-full bg-green-600 hover:bg-green-700">
                Créer l'employé
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Salaire</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{getSiteName(employee.siteId)}</TableCell>
                  <TableCell className="text-sm">{employee.email}</TableCell>
                  <TableCell>{(employee.salary / 1000).toFixed(0)}K CFA</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(employee.status)}`}>
                      {employee.status === "active" ? "Actif" : employee.status === "on_leave" ? "Congé" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(employee)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedEmployee(employee)
                        setIsDeleteDialogOpen(true)
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Éditer l'employé</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Prénom</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Nom</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Poste</label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="Accueil">Accueil</SelectItem>
                  <SelectItem value="Technique">Technique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Site</label>
              <Select value={formData.siteId} onValueChange={(value) => setFormData({ ...formData, siteId: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sites.map((site) => (
                    <SelectItem key={site.id} value={site.id}>
                      {site.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Téléphone</label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Salaire mensuel</label>
              <Input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: Number.parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="on_leave">Congé</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleEditEmployee} className="w-full bg-green-600 hover:bg-green-700">
              Enregistrer les modifications
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Supprimer l'employé?</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer {selectedEmployee?.firstName} {selectedEmployee?.lastName}? Cette action
            est irréversible.
          </AlertDialogDescription>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
