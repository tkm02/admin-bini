"use client"
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "@/app/pdf/ReportPDF";

interface ReportData {
  type: string
  title: string
  content: string
  generatedAt: Date
  metrics?: Record<string, any>
}

export function PDFDownloadButton({ data }: { data: ReportData }) {
  const { type, title, content, generatedAt } = data;
  return (
    <PDFDownloadLink
      document={
        <ReportPDF
        title={title}
        type={type}
        content={content}
        generatedAt={new Date(generatedAt)}
        />
      }
      fileName={`${type}-${Date.now()}.pdf`}
      className="px-3 py-2 text-xs bg-blue-600 text-white rounded"
    >
      Télécharger PDF
    </PDFDownloadLink>
  );
}
