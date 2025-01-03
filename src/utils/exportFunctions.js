import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { Chart } from "chart.js";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import { formatDate } from "./formateDate";

// Function to export data as CSV
export const exportToCSV = (data, headers, filename = "expenses_data.csv") => {
  // Prepare the data with serial number
  const formattedData = data.map((expense, index) => ({
    "Serial No": index + 1, // Adding Serial Number
    "Amount": expense.amount.toFixed(2),
    "Category": expense.category,
    "Description": expense.description,
    "Date": formatDate(expense.date),
  }));

  // Set the headers for CSV
  const csvHeaders = ["Serial No", "Amount", "Category", "Description", "Date"];

  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData, { header: csvHeaders });

  // Create a workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Expenses");

  // Write the file
  XLSX.writeFile(wb, filename);
};

// Function to export data as PDF
export const exportToPDF = async (data, filename = "Expense_Report.pdf") => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  let currentY = 20;

  // Title Section
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Expense Report", pageWidth / 2, currentY, { align: "center" });
  currentY += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "italic");
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, currentY, { align: "center" });
  currentY += 20;

  // Insights Section
  const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
  const categoryWise = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {});
  const maxCategory = Object.keys(categoryWise).reduce((a, b) =>
    categoryWise[a] > categoryWise[b] ? a : b
  );

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Insights", 14, currentY);
  currentY += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Total Expenses: ${totalExpenses}`, 14, currentY);
  currentY += 8;
  doc.text(`Category with Highest Spending: ${maxCategory}`, 14, currentY);
  currentY += 20;

  // Pie Chart (Expenses by Category)
  const canvasPie = document.createElement("canvas");
  canvasPie.width = 200; // Set width of the canvas
  canvasPie.height = 200; // Set height of the canvas
  const ctxPie = canvasPie.getContext("2d");
  document.body.appendChild(canvasPie);

  const chartPie = new Chart(ctxPie, {
    type: "pie",
    data: {
      labels: Object.keys(categoryWise),
      datasets: [
        {
          data: Object.values(categoryWise),
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        },
      ],
    },
  });

  // Ensure the chart is fully rendered before capturing it
  const chartImage = await new Promise((resolve) => {
    chartPie.options.animation.onComplete = function () {
      html2canvas(canvasPie).then((canvas) => {
        const chartImage = canvas.toDataURL("image/png");
        resolve(chartImage);
      });
    };
  });

  document.body.removeChild(canvasPie);
  doc.addImage(chartImage, "PNG", 14, currentY, pageWidth - 28, 80);
  currentY += 100;

  // Line Chart (Expenses Over Time)
  const timeData = data.reduce((acc, { amount, date }) => {
    const dateKey = new Date(date).toLocaleDateString();
    acc[dateKey] = acc[dateKey] ? acc[dateKey] + amount : amount;
    return acc;
  }, {});

  const canvasLine = document.createElement("canvas");
  canvasLine.width = 400; // Set width of the canvas
  canvasLine.height = 200; // Set height of the canvas
  const ctxLine = canvasLine.getContext("2d");
  document.body.appendChild(canvasLine);

  const chartLine = new Chart(ctxLine, {
    type: "line",
    data: {
      labels: Object.keys(timeData),
      datasets: [
        {
          label: "Expenses Over Time",
          data: Object.values(timeData),
          fill: false,
          borderColor: "#36A2EB",
          tension: 0.1,
        },
      ],
    },
  });

  const chartLineImage = await new Promise((resolve) => {
    chartLine.options.animation.onComplete = function () {
      html2canvas(canvasLine).then((canvas) => {
        const chartLineImage = canvas.toDataURL("image/png");
        resolve(chartLineImage);
      });
    };
  });

  document.body.removeChild(canvasLine);
  doc.addImage(chartLineImage, "PNG", 14, currentY, pageWidth - 28, 80);
  currentY += 100;


  // Detailed Data Table Section
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Detailed Data", 14, 20);

  doc.autoTable({
    startY: 30,
    head: [["Serial No", "Amount", "Category", "Description", "Date"]],
    body: data.map((item, index) => [
      index + 1,
      item.amount.toFixed(2),
      item.category,
      item.description,
      item.date,
    ]),
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [241, 241, 241] },
  });

  // Suggestions Section
  doc.addPage();
  currentY = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Suggestions", 14, currentY);
  currentY += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("- Focus on reducing spending in the highest category.", 14, currentY);
  currentY += 8;
  doc.text("- Set monthly budgets for significant expenditure categories.", 14, currentY);
  currentY += 8;
  doc.text("- Regularly review and optimize your spending habits.", 14, currentY);

  // Footer with Page Numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, { align: "right" });
  }

  // Save the PDF
  doc.save(filename);
};
