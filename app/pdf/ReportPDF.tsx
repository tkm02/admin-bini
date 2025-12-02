"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const ACCENT_COLOR = "#fe9a00";
const TEXT_COLOR = "#333333";
const LIGHT_GREY = "#F4F4F8";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    padding: 30,
    flexDirection: "column",
  },
  header: {
    backgroundColor: ACCENT_COLOR,
    color: "#FFFFFF",
    padding: 16,
    borderRadius: 4,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 9,
    color: "#FDEFD4",
    marginTop: 2,
  },
  badge: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  metaRow: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 12,
  },
  contentCard: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    padding: 14,
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: ACCENT_COLOR,
    marginTop: 8,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    color: TEXT_COLOR,
    marginBottom: 4,
    lineHeight: 1.4,
  },
  bullet: {
    fontSize: 10,
    color: TEXT_COLOR,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  table: {
    marginTop: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: LIGHT_GREY,
    borderRadius: 3,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: LIGHT_GREY,
  },
  tableHeaderCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    color: TEXT_COLOR,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 4,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },
  tableCellText: {
    fontSize: 9,
    color: TEXT_COLOR,
  },
  footer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: LIGHT_GREY,
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
  },
  footerHighlight: {
    color: ACCENT_COLOR,
    fontWeight: "bold",
  },
});

interface ReportPDFProps {
  title: string;
  type: string;
  generatedAt: Date;
  content: string;
  logoUrl?: string;
}

type Block =
  | { kind: "heading"; level: number; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "bullet"; text: string }
  | { kind: "table"; headers: string[]; rows: string[][] };

// Supprime le markdown inline dans le texte rendu
function stripInlineMarkdown(s: string): string {
  if (!s) return "";
  let res = s;

  // **bold** ou __bold__
  res = res.replace(/(\*\*|__)(.*?)\1/g, "$2");
  // *italic* ou _italic_
  res = res.replace(/(\*|_)(.*?)\1/g, "$2");
  // `code`
  res = res.replace(/`([^`]+)`/g, "$1");
  // [texte](url) -> texte
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");

  return res;
}

// Parser markdown simplifié -> blocs structurés
function parseMarkdownToBlocks(content: string): Block[] {
  const lines = content.split("\n");
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i].trim();

    // ignorer lignes vides ou --- / ***
    if (!raw || /^-{3,}$/.test(raw) || /^\*{3,}$/.test(raw)) {
      i++;
      continue;
    }

    // TABLE markdown (tolérant sur le dernier "|")
    if (raw.startsWith("|")) {
      const headerLine = raw.endsWith("|") ? raw : raw + "|";
      const alignLine = (lines[i + 1] ?? "").trim();

      const headerCells = headerLine
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      const alignIsSeparator = /^[:\-|\s]+$/.test(alignLine);

      if (alignIsSeparator && headerCells.length > 0) {
        i += 2;
        const rows: string[][] = [];

        while (i < lines.length && lines[i].trim().startsWith("|")) {
          const rowLineRaw = lines[i].trim();
          const rowLine = rowLineRaw.endsWith("|")
            ? rowLineRaw
            : rowLineRaw + "|";

          const rowCells = rowLine
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());

          rows.push(rowCells);
          i++;
        }

        blocks.push({ kind: "table", headers: headerCells, rows });
        continue;
      }
    }

    // Heading #
    const headingMatch = raw.match(/^(#+)\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      blocks.push({ kind: "heading", level, text });
      i++;
      continue;
    }

    // Bullet list (- ou *)
    const bulletMatch = raw.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      blocks.push({ kind: "bullet", text: bulletMatch[1].trim() });
      i++;
      continue;
    }

    // Paragraphe normal
    blocks.push({ kind: "paragraph", text: raw });
    i++;
  }

  return blocks;
}

export const ReportPDF: React.FC<ReportPDFProps> = ({
  title,
  type,
  generatedAt,
  content,
  logoUrl,
}) => {
  const blocks = parseMarkdownToBlocks(content);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header} fixed>
          <View style={styles.headerLeft}>
            {logoUrl && <Image src={logoUrl} style={styles.logo} />}
            <View>
              <Text style={styles.headerTitle}>{title}</Text>
              <Text style={styles.headerSubtitle}>
                Rapport IA – {type.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Généré le {generatedAt.toLocaleString("fr-CI")}
            </Text>
          </View>
        </View>

        {/* META */}
        <Text style={styles.metaRow}>
          Ce rapport a été généré automatiquement à partir de vos données (sites,
          équipes, avis) et d&apos;une analyse IA stratégique.
        </Text>

        {/* CONTENU STRUCTURÉ */}
        <View style={styles.contentCard}>
          {blocks.map((block, idx) => {
            if (block.kind === "heading") {
              return (
                <Text key={idx} style={styles.sectionTitle}>
                  {stripInlineMarkdown(block.text)}
                </Text>
              );
            }

            if (block.kind === "paragraph") {
              return (
                <Text key={idx} style={styles.paragraph}>
                  {stripInlineMarkdown(block.text)}
                </Text>
              );
            }

            if (block.kind === "bullet") {
              return (
                <Text key={idx} style={styles.bullet}>
                  • {stripInlineMarkdown(block.text)}
                </Text>
              );
            }

            if (block.kind === "table") {
              return (
                <View key={idx} style={styles.table}>
                  {/* Header */}
                  <View style={styles.tableHeaderRow}>
                    {block.headers.map((h, i) => (
                      <View
                        key={i}
                        style={[
                          styles.tableHeaderCell,
                          i === block.headers.length - 1 && {
                            borderRightWidth: 0,
                          },
                        ]}
                      >
                        <Text style={styles.tableHeaderText}>
                          {stripInlineMarkdown(h)}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {/* Rows */}
                  {block.rows.map((row, rIdx) => (
                    <View key={rIdx} style={styles.tableRow}>
                      {block.headers.map((_, cIdx) => (
                        <View
                          key={cIdx}
                          style={[
                            styles.tableCell,
                            cIdx === block.headers.length - 1 && {
                              borderRightWidth: 0,
                            },
                          ]}
                        >
                          <Text style={styles.tableCellText}>
                            {stripInlineMarkdown(row[cIdx] ?? "")}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              );
            }

            return null;
          })}
        </View>

        {/* FOOTER */}
        <Text style={styles.footer} fixed>
          <Text style={styles.footerHighlight}>PDG Dashboard</Text> • Rapports IA
          écotourisme • {generatedAt.toLocaleDateString("fr-CI")}
        </Text>
      </Page>
    </Document>
  );
};
