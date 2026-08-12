import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  userName: string;
  tourTitle: string;
  guestCount: number;
  totalAmount: number;
}

const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer> => {
  try {
    return await new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 50,
        size: "A4",
      });

      const buffer: Buffer[] = [];

      doc.on("data", (chunk: Buffer) => {
        buffer.push(chunk);
      });

      doc.on("end", () => {
        resolve(Buffer.concat(buffer));
      });

      doc.on("error", (err) => {
        reject(err);
      });

      // =====================================================
      // COLORS
      // =====================================================

      const primaryColor = "#F97316";
      const lightOrange = "#FFF7ED";
      const darkColor = "#0F172A";
      const grayColor = "#64748B";
      const borderColor = "#E2E8F0";

      // =====================================================
      // HEADER
      // =====================================================

      doc
        .fillColor(primaryColor)
        .fontSize(28)
        .font("Helvetica-Bold")
        .text("ExploreBangla", {
          align: "center",
        });

      doc.moveDown(0.4);

      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor(grayColor)
        .text("Tour Booking Invoice", {
          align: "center",
        });

      doc.moveDown(0.4);

      doc
        .fontSize(10)
        .fillColor("#94A3B8")
        .text("Explore Bangladesh. Discover unforgettable journeys.", {
          align: "center",
        });

      doc.moveDown(2);

      // =====================================================
      // COMPANY INFO
      // =====================================================

      doc
        .font("Helvetica-Bold")
        .fontSize(17)
        .fillColor(darkColor)
        .text("ExploreBangla");

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(grayColor)
        .text("Bangladesh")
        .text("support@explorebangla.com");

      // =====================================================
      // INVOICE DETAILS BOX
      // =====================================================

      const invoiceBoxTop = doc.y + 25;

      doc
        .roundedRect(50, invoiceBoxTop, 495, 135, 10)
        .fillAndStroke(lightOrange, borderColor);

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(darkColor)
        .text("Invoice Details", 70, invoiceBoxTop + 20);

      const formattedDate = new Date(
        invoiceData.bookingDate,
      ).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Transaction ID
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor(darkColor)
        .text("Transaction ID:", 70, invoiceBoxTop + 55);

      doc
        .font("Helvetica")
        .fillColor(grayColor)
        .text(invoiceData.transactionId, 190, invoiceBoxTop + 55);

      // Booking Date
      doc
        .font("Helvetica-Bold")
        .fillColor(darkColor)
        .text("Booking Date:", 70, invoiceBoxTop + 80);

      doc
        .font("Helvetica")
        .fillColor(grayColor)
        .text(formattedDate, 190, invoiceBoxTop + 80);

      // Customer Name
      doc
        .font("Helvetica-Bold")
        .fillColor(darkColor)
        .text("Customer Name:", 70, invoiceBoxTop + 105);

      doc
        .font("Helvetica")
        .fillColor(grayColor)
        .text(invoiceData.userName, 190, invoiceBoxTop + 105);

      // =====================================================
      // TOUR DETAILS
      // =====================================================

      const tableTop = invoiceBoxTop + 175;

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .fillColor(darkColor)
        .text("Tour Details", 50, tableTop);

      const headerTop = tableTop + 28;

      // Table Header
      doc.rect(50, headerTop, 495, 32).fill(primaryColor);

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("white")
        .text("Tour Package", 65, headerTop + 10, {
          width: 250,
        })
        .text("Guests", 330, headerTop + 10, {
          width: 60,
          align: "center",
        })
        .text("Amount", 420, headerTop + 10, {
          width: 100,
          align: "right",
        });

      // Table Row
      const rowTop = headerTop + 32;

      doc.rect(50, rowTop, 495, 45).fillAndStroke("#FFFFFF", borderColor);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(darkColor)
        .text(invoiceData.tourTitle, 65, rowTop + 15, {
          width: 250,
        })
        .text(invoiceData.guestCount.toString(), 330, rowTop + 15, {
          width: 60,
          align: "center",
        })
        .text(
          `Tk ${invoiceData.totalAmount.toLocaleString("en-BD")}`,
          420,
          rowTop + 15,
          {
            width: 100,
            align: "right",
          },
        );

      // =====================================================
      // TOTAL
      // =====================================================

      const totalTop = rowTop + 75;

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor(darkColor)
        .text("Total Amount Paid", 300, totalTop, {
          width: 130,
          align: "right",
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(17)
        .fillColor(primaryColor)
        .text(
          `Tk ${invoiceData.totalAmount.toLocaleString("en-BD")}`,
          430,
          totalTop,
          {
            width: 115,
            align: "right",
          },
        );

      // =====================================================
      // PAYMENT STATUS
      // =====================================================

      const statusTop = totalTop + 45;

      doc.roundedRect(50, statusTop, 495, 40, 8).fill("#F0FDF4");

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#166534")
        .text("Payment Successful", 50, statusTop + 13, {
          width: 495,
          align: "center",
        });

      // =====================================================
      // FOOTER
      // =====================================================

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor("#94A3B8")
        .text("This is a computer-generated invoice.", 50, 750, {
          width: 495,
          align: "center",
        });

      doc.text("Thank you for choosing ExploreBangla!", 50, 765, {
        width: 495,
        align: "center",
      });

      doc.end();
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("PDF creation error:", err);

      throw new AppError(500, `PDF creation error: ${err.message}`);
    }

    throw new AppError(500, "PDF creation error");
  }
};

export default generatePdf;
