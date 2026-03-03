import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AnalysisIssue, PositionResult, TopTwoPerPositionResponse } from "@/types/top-two-per-position";

const POLLING_INTERVAL = 300_000;

const formatTimestamp = (date: Date): string => {
	return new Intl.DateTimeFormat("id-ID", {
		dateStyle: "full",
		timeStyle: "medium",
	}).format(date);
};

export const ucwords = (str: string): string => {
	return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

export function useTopTwoPerPosition(eventId: number) {
	const [positions, setPositions] = useState<PositionResult[]>([]);
	const [analisa, setAnalisa] = useState<AnalysisIssue[]>([]);
	const [lastUpdated, setLastUpdated] = useState("");
	const [loading, setLoading] = useState(false);
	const controllerRef = useRef<AbortController | null>(null);

	const fetchData = useCallback(() => {
		controllerRef.current?.abort();

		const controller = new AbortController();
		controllerRef.current = controller;
		setLoading(true);

		fetch(`/api/top-2-per-position/${eventId}/`, { signal: controller.signal })
			.then((res) => res.json())
			.then((data: TopTwoPerPositionResponse) => {
				setPositions(data.positions);
				setAnalisa(data.Analisa ?? []);
				setLastUpdated(formatTimestamp(new Date()));
			})
			.catch((error) => {
				if ((error as Error).name !== "AbortError") {
					console.error("Failed to fetch top two per position:", error);
				}
			})
			.finally(() => setLoading(false));
	}, [eventId]);

	useEffect(() => {
		fetchData();

		const interval = setInterval(fetchData, POLLING_INTERVAL);

		return () => {
			clearInterval(interval);
			controllerRef.current?.abort();
		};
	}, [fetchData]);

	const exportPdf = useCallback(() => {
		if (positions.length === 0) {
			return;
		}

		const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
		const pageWidth = doc.internal.pageSize.getWidth();

		// Title
		doc.setFontSize(14);
		doc.text("Hasil Penjaringan Per Posisi", pageWidth / 2, 15, { align: "center" });

		// Timestamp
		doc.setFontSize(9);
		doc.setTextColor(100);
		doc.text(`Data per: ${lastUpdated || formatTimestamp(new Date())}`, pageWidth / 2, 22, { align: "center" });
		doc.setTextColor(0);

		let startY = 28;

		// Analisa section
		if (analisa.length > 0) {
			doc.setFontSize(10);
			doc.setFont("helvetica", "bold");
			doc.text("Analisa Data:", 14, startY);
			doc.setFont("helvetica", "normal");
			doc.setFontSize(9);

			analisa.forEach((item, i) => {
				startY += 5;
				const text = `${i + 1}. ${item.issue.description}`;
				const lines = doc.splitTextToSize(text, pageWidth - 28);
				doc.text(lines, 14, startY);
				startY += (lines.length - 1) * 4;
			});

			startY += 6;
		}

		// Position tables
		positions.forEach((pos) => {
			const filteredCandidates = pos.candidates.filter((c) => c.total_votes > 0);

			if (filteredCandidates.length === 0) {
				return;
			}

			// Check if we need a new page
			if (startY > doc.internal.pageSize.getHeight() - 40) {
				doc.addPage();
				startY = 15;
			}

			doc.setFontSize(11);
			doc.setFont("helvetica", "bold");
			doc.text(`Posisi: ${pos.position}`, 14, startY);
			doc.setFont("helvetica", "normal");
			startY += 2;

			const tableBody = filteredCandidates.map((c, index) => [
				String(index + 1),
				ucwords(c.nama),
				`${c.persentase}%`,
				String(c.total_votes),
				c.filled_rejections === 0 ? "Berkenan" : "Tidak",
			]);

			const totalPersentase = Math.round(filteredCandidates.reduce((acc, c) => acc + c.persentase, 0));
			const totalVotes = filteredCandidates.reduce((acc, c) => acc + c.total_votes, 0);

			tableBody.push(["", "Total", `${totalPersentase}%`, String(totalVotes), ""]);

			autoTable(doc, {
				startY,
				head: [["No", "Nama", "%", "Pemilih", "Status"]],
				body: tableBody,
				theme: "grid",
				headStyles: { fillColor: [229, 231, 235], textColor: [31, 41, 55], fontStyle: "bold", fontSize: 8 },
				bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
				columnStyles: {
					0: { cellWidth: 10, halign: "center" },
					1: { cellWidth: "auto" },
					2: { cellWidth: 15, halign: "right" },
					3: { cellWidth: 20, halign: "right" },
					4: { cellWidth: 22, halign: "center" },
				},
				margin: { left: 14, right: 14 },
				didParseCell: (data) => {
					// Highlight top 2
					if (data.section === "body" && data.row.index < 2) {
						data.cell.styles.fillColor = [239, 246, 255];
						data.cell.styles.fontStyle = "bold";
					}
					// Total row
					if (data.section === "body" && data.row.index === tableBody.length - 1) {
						data.cell.styles.fillColor = [229, 231, 235];
						data.cell.styles.fontStyle = "bold";
					}
				},
			});

			startY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;
		});

		doc.save(`hasil-penjaringan-${eventId}-${Date.now()}.pdf`);
	}, [positions, analisa, lastUpdated, eventId]);

	return {
		positions,
		analisa,
		lastUpdated,
		loading,
		refresh: fetchData,
		exportPdf,
	};
}
