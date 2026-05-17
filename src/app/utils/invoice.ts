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
    return new Promise<Buffer>((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 50,
      });
      const buffer: Uint8Array[] = [];

      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => {
        resolve(Buffer.concat(buffer));
      });
      doc.on("error", (err) => {
        reject(err);
      });

      // =====================================================
      // HEADER SECTION
      // =====================================================

      doc.fillColor("#0F172A").fontSize(28).text("TOUR INVOICE", {
        align: "center",
      });

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("gray")
        .text("Thank you for booking with us!", {
          align: "center",
        });

      doc.moveDown(2);

      // =====================================================
      // COMPANY INFO
      // =====================================================
      // COMPANY INFO
      doc.fillColor("#111827").fontSize(18).text("Travel Agency");

      doc
        .fontSize(12)
        .fillColor("gray")
        .text("Dhaka, Bangladesh")
        .text("support@travelagency.com")
        .text("+880123456789");

      // Dynamic Top Position
      const invoiceBoxTop = doc.y + 25;

      // INVOICE BOX
      doc
        .roundedRect(50, invoiceBoxTop, 500, 130, 10)
        .fillAndStroke("#F8FAFC", "#D1D5DB");

      doc.fillColor("#111827");

      doc.fontSize(14).text("Invoice Details", 70, invoiceBoxTop + 20);

      const formattedDate = new Date(invoiceData.bookingDate).toDateString();

      doc
        .fontSize(12)
        .fillColor("black")
        .text("Transaction ID:", 70, invoiceBoxTop + 55);

      doc
        .fillColor("gray")
        .text(invoiceData.transactionId, 200, invoiceBoxTop + 55);

      doc.fillColor("black").text("Booking Date:", 70, invoiceBoxTop + 80);

      doc.fillColor("gray").text(formattedDate, 200, invoiceBoxTop + 80);

      doc.fillColor("black").text("Customer Name:", 70, invoiceBoxTop + 105);

      doc
        .fillColor("gray")
        .text(invoiceData.userName, 200, invoiceBoxTop + 105);
      // =====================================================
      // TOUR DETAILS TABLE
      // =====================================================

      doc.moveDown(6);

      const tableTop = 370;

      // TABLE HEADER BG
      doc.rect(50, tableTop, 500, 30).fill("#2563EB");

      doc
        .fillColor("white")
        .fontSize(12)
        .text("Tour Package", 70, tableTop + 8)
        .text("Guests", 300, tableTop + 8)
        .text("Amount", 430, tableTop + 8);

      // TABLE ROW
      doc.rect(50, tableTop + 30, 500, 40).stroke("#D1D5DB");

      doc
        .fillColor("black")
        .fontSize(11)
        .text(invoiceData.tourTitle, 70, tableTop + 45)
        .text(invoiceData.guestCount.toString(), 320, tableTop + 45)
        .text(`$${invoiceData.totalAmount}`, 430, tableTop + 45);

      // =====================================================
      // TOTAL SECTION
      // =====================================================

      doc.moveDown(5);

      doc
        .fontSize(16)
        .fillColor("#111827")
        .text(`Total Amount: $${invoiceData.totalAmount}`, 350, tableTop + 100);

      // =====================================================
      // FOOTER
      // =====================================================

      doc.moveDown(6);

      doc
        .fontSize(10)
        .fillColor("gray")
        .text("This is a computer generated invoice.", {
          align: "center",
        });

      doc.text("Thank you for choosing us!", {
        align: "center",
      });

      // =====================================================
      // END PDF
      // =====================================================

      doc.end();
    });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      throw new AppError(401, `PDF creation error ${err.message}`);
    }
  }
};

export default generatePdf;
