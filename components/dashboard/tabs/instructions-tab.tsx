"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ClipboardListIcon, SendIcon, CheckIcon, TrashIcon, CopyIcon } from "lucide-react"

interface Instruction {
  id: string
  siteIds: string[] // changed to array to support multiple sites
  siteNames: string[]
  managers: string[]
  title: string
  content: string
  priority: "urgent" | "normal" | "info"
  status: "nouveau" | "lu" | "exécuté"
  createdAt: Date
  dueDate?: Date
  createdBy: string
}

interface InstructionsTabProps {
  sites: any[]
  employees: any[]
}

export function InstructionsTab({ sites, employees }: InstructionsTabProps) {
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [selectedSites, setSelectedSites] = useState<string[]>([sites[0]?.id || ""]) // array to support multiple
  const [sendToAll, setSendToAll] = useState(false) // toggle to send to all sites
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [priority, setPriority] = useState<"normal" | "urgent" | "info">("normal")
  const [showForm, setShowForm] = useState(false)

  const handleCreateInstruction = () => {
    if (!title.trim() || !content.trim()) {
      alert("Veuillez remplir tous les champs")
      return
    }

    const targetSites = sendToAll ? sites : sites.filter((s: any) => selectedSites.includes(s.id))

    if (targetSites.length === 0) {
      alert("Veuillez sélectionner au moins un site")
      return
    }

    const newInstruction: Instruction = {
      id: `instr-${Date.now()}`,
      siteIds: targetSites.map((s: any) => s.id),
      siteNames: targetSites.map((s: any) => s.name),
      managers: targetSites.map((s: any) => s.manager),
      title,
      content,
      priority,
      status: "nouveau",
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdBy: "PDG",
    }

    setInstructions((prev) => [newInstruction, ...prev])
    setTitle("")
    setContent("")
    setPriority("normal")
    setSelectedSites([sites[0]?.id || ""])
    setSendToAll(false)
    setShowForm(false)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-300"
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "exécuté":
        return <CheckIcon className="w-5 h-5 text-green-600" />
      case "lu":
        return <CheckIcon className="w-5 h-5 text-blue-600" />
      default:
        return <ClipboardListIcon className="w-5 h-5 text-orange-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Form to Create Instruction */}
      {showForm ? (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base">Créer une Instruction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sendToAll"
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="sendToAll" className="text-sm font-medium text-gray-700">
                Envoyer à TOUS les sites
              </label>
            </div>

            {!sendToAll && (
              <div>
                <label className="text-sm font-medium text-gray-700">Sites destinataires</label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {sites.map((site: any) => (
                    <label
                      key={site.id}
                      className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-green-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSites([...selectedSites, site.id])
                          } else {
                            setSelectedSites(selectedSites.filter((id) => id !== site.id))
                          }
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{site.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                placeholder="Ex: Maintenance équipements..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Instructions détaillées</label>
              <Textarea
                placeholder="Détaillez les instructions à exécuter..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 min-h-24"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Priorité</label>
              <div className="flex gap-2 mt-2">
                {(["normal", "urgent", "info"] as const).map((p) => (
                  <Button
                    key={p}
                    onClick={() => setPriority(p)}
                    variant={priority === p ? "default" : "outline"}
                    className={priority === p ? "bg-green-600" : ""}
                  >
                    {p === "urgent" ? "🔴" : p === "normal" ? "🟡" : "🔵"} {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateInstruction} className="flex-1 bg-green-600 hover:bg-green-700">
                <SendIcon className="w-4 h-4 mr-2" />
                Envoyer l'instruction
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700 w-full">
          <ClipboardListIcon className="w-4 h-4 mr-2" />
          Créer une Instruction
        </Button>
      )}

      {/* Instructions List */}
      <div className="space-y-3">
        {instructions.length > 0 ? (
          instructions.map((instr) => (
            <Card key={instr.id} className="border-l-4 border-l-orange-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(instr.status)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{instr.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {instr.siteNames.length === sites.length ? "Tous les sites" : instr.siteNames.join(", ")}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">Managers: {instr.managers.join(", ")}</p>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(instr.priority)}>{instr.priority}</Badge>
                </div>

                <p className="text-sm text-gray-700 mb-3 p-3 bg-gray-50 rounded">{instr.content}</p>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    Créé: {instr.createdAt.toLocaleDateString("fr-CI")} • À faire avant:{" "}
                    {instr.dueDate?.toLocaleDateString("fr-CI")}
                  </span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <CopyIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="pt-6 text-center">
              <ClipboardListIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Aucune instruction créée</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
