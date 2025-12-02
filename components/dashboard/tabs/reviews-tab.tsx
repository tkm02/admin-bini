"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SparklesIcon, AlertCircleIcon, CheckCircleIcon, AlertTriangleIcon, StarIcon, Loader2 } from "lucide-react"
import { AIReviewAnalyzer } from "../ai/ai-review-analyzer"

interface ReviewsTabProps {
  reviews: any[]
  sites: any[]
}

export function ReviewsTab({ reviews: initialReviews, sites }: ReviewsTabProps) {
  const [selectedSiteId, setSelectedSiteId] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false)
  const [analysisMode, setAnalysisMode] = useState<"single" | "batch">("single")
  const [aiAnalysis, setAIAnalysis] = useState<any>(null)
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const filteredReviews = useMemo(() => {
    if (selectedSiteId === "all") return initialReviews
    return initialReviews.filter((r) => r.siteId === selectedSiteId)
  }, [initialReviews, selectedSiteId])

  const handleAnalyzeWithAI = async (review: any) => {
    setSelectedReview(review)
    setAnalysisMode("single")
    setIsAnalysisDialogOpen(true)
    setIsLoadingAnalysis(true)
    setAnalysisError(null)
    setAIAnalysis(null)

    try {
      const siteName = sites.find((s) => s.id === review.siteId)?.name || "N/A"
      
      const response = await fetch("/api/ai/analyze-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: review.comment || "",
          title: review.title || "", 
          rating: review.rating || 0,
          siteName: siteName,
        }),
      })      

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      if (data.error) {
        setAnalysisError(data.error)
      } else {
        setAIAnalysis(data)
      }
    } catch (error) {
      console.error("Error analyzing review:", error)
      setAnalysisError(
        error instanceof Error ? error.message : "Erreur lors de l'analyse"
      )
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const handleBatchAnalysis = async () => {
    setAnalysisMode("batch")
    setIsAnalysisDialogOpen(true)
    setIsLoadingAnalysis(true)
    setAnalysisError(null)
    setAIAnalysis(null)

    try {
      const response = await fetch("/api/ai/analyze-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchAnalysis: true,
          reviews: filteredReviews.map((r) => ({
            comment: r.comment || "",
            title: r.title || "",
            rating: r.rating || 0,
            siteName: sites.find((s) => s.id === r.siteId)?.name || "N/A",
          })),
          filterSite:
            selectedSiteId === "all"
              ? "Tous les sites"
              : sites.find((s) => s.id === selectedSiteId)?.name || "N/A",
        }),
      })

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.error) {
        setAnalysisError(data.error)
      } else {
        setAIAnalysis(data)
      }
    } catch (error) {
      console.error("Error analyzing reviews:", error)
      setAnalysisError(
        error instanceof Error ? error.message : "Erreur lors de l'analyse groupée"
      )
    } finally {
      setIsLoadingAnalysis(false)
    }
  }

  const getSiteName = (siteId: string) => {
    return sites.find((s) => s.id === siteId)?.name || "N/A"
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case "negative":
        return <AlertCircleIcon className="w-5 h-5 text-red-600" />
      default:
        return <AlertTriangleIcon className="w-5 h-5 text-yellow-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-50"
      case "negative":
        return "bg-red-50"
      default:
        return "bg-yellow-50"
    }
  }

  // Analytics Summary
  const totalReviews = filteredReviews.length
  const averageRating =
    totalReviews > 0
      ? (
          filteredReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          totalReviews
        ).toFixed(1)
      : "0"
  const positiveReviews = filteredReviews.filter(
    (r) => r.sentiment === "positive"
  ).length
  const negativeReviews = filteredReviews.filter(
    (r) => r.sentiment === "negative"
  ).length
  const satisfactionRate =
    totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Site Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-full sm:w-auto">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Filtrer par site
          </label>
          <Select value={selectedSiteId} onValueChange={setSelectedSiteId}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les sites</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-auto pt-0 sm:pt-8">
          <Button
            onClick={handleBatchAnalysis}
            disabled={isLoadingAnalysis}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {isLoadingAnalysis ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <SparklesIcon className="w-4 h-4 mr-2" />
                Analyser{" "}
                {selectedSiteId === "all"
                  ? "tous les avis"
                  : "avis du site"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
            Total Avis
          </p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2">
            {totalReviews}
          </p>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-white">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
            Note Moyenne
          </p>
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xl sm:text-2xl font-bold text-purple-600">
              {averageRating}/5
            </p>
            <StarIcon className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-white">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
            Avis Positifs
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">
            {positiveReviews}
          </p>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
            Satisfaction
          </p>
          <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-2">
            {satisfactionRate}%
          </p>
        </Card>
      </div>

      {/* Reviews Table */}
      <Card className="p-4 sm:p-6">
        <h3 className="font-semibold text-gray-900 mb-4 text-sm sm:text-base">
          Avis{" "}
          {selectedSiteId === "all"
            ? "- Tous les sites"
            : `- ${getSiteName(selectedSiteId)}`}
        </h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs sm:text-sm">Client</TableHead>
                <TableHead className="text-xs sm:text-sm hidden sm:table-cell">
                  Site
                </TableHead>
                <TableHead className="text-xs sm:text-sm">Note</TableHead>
                <TableHead className="text-xs sm:text-sm">Titre</TableHead>
                <TableHead className="text-xs sm:text-sm hidden md:table-cell">
                  Sentiment
                </TableHead>
                <TableHead className="text-xs sm:text-sm text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className={getSentimentColor(review.sentiment)}
                  >
                    <TableCell className="font-medium text-xs sm:text-sm">
                      {review.visitorName}
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm hidden sm:table-cell">
                      {getSiteName(review.siteId)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate text-xs sm:text-sm">
                      {review.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {getSentimentIcon(review.sentiment)}
                        <Badge
                          className={
                            review.sentiment === "positive"
                              ? "bg-green-100 text-green-800 text-xs"
                              : review.sentiment === "negative"
                                ? "bg-red-100 text-red-800 text-xs"
                                : "bg-yellow-100 text-yellow-800 text-xs"
                          }
                        >
                          {review.sentiment === "positive"
                            ? "Positif"
                            : review.sentiment === "negative"
                              ? "Négatif"
                              : "Neutre"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAnalyzeWithAI(review)}
                        disabled={isLoadingAnalysis}
                        className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm disabled:opacity-50"
                      >
                        <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span className="hidden sm:inline">Analyser</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Aucun avis trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* AI Analysis Dialog */}
      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl w-[95vw] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {analysisMode === "single"
                ? "Analyse IA - Avis Client"
                : "Analyse Groupée - Avis Clients"}
            </DialogTitle>
          </DialogHeader>

          {analysisMode === "single" && selectedReview ? (
            <div className="space-y-6">
              {/* Review Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                  Avis Original
                </h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <p>
                    <strong>Client:</strong> {selectedReview.visitorName}
                  </p>
                  <p>
                    <strong>Site:</strong> {getSiteName(selectedReview.siteId)}
                  </p>
                  <p>
                    <strong>Note:</strong> {selectedReview.rating}/5
                  </p>
                  <p>
                    <strong>Titre:</strong> {selectedReview.title}
                  </p>
                  <p className="mt-3">
                    <strong>Commentaire:</strong>
                  </p>
                  <p className="italic text-gray-700">
                    "{selectedReview.comment}"
                  </p>
                </div>
              </div>

              {/* AI Analysis */}
              {isLoadingAnalysis ? (
                <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-xs sm:text-sm text-blue-700">
                    Analyse en cours...
                  </p>
                </div>
              ) : analysisError ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-xs sm:text-sm text-red-700">
                    <strong>Erreur:</strong> {analysisError}
                  </p>
                </div>
              ) : aiAnalysis ? (
                <AIReviewAnalyzer analysis={aiAnalysis} />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Analyse indisponible
                  </p>
                </div>
              )}
            </div>
          ) : analysisMode === "batch" ? (
            <div className="space-y-6">
              {/* Batch Analysis Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Analyse Groupée -{" "}
                  {selectedSiteId === "all"
                    ? "Tous les sites"
                    : getSiteName(selectedSiteId)}
                </h4>
                <p className="text-xs sm:text-sm text-gray-700">
                  {filteredReviews.length} avis analysés
                </p>
              </div>

              {/* AI Analysis */}
              {isLoadingAnalysis ? (
                <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <p className="text-xs sm:text-sm text-blue-700">
                    Analyse en cours...
                  </p>
                </div>
              ) : analysisError ? (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-xs sm:text-sm text-red-700">
                    <strong>Erreur:</strong> {analysisError}
                  </p>
                </div>
              ) : aiAnalysis ? (
                <AIReviewAnalyzer analysis={aiAnalysis} />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Analyse indisponible
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
