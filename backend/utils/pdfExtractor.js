import pdf from "pdf-parse";

/*
  FUNCTION: extractTextFromPDF

  Converts uploaded PDF resume → plain text
*/
export const extractTextFromPDF = async (fileBuffer) => {
  try {
    const data = await pdf(fileBuffer);

    // Return extracted text
    return data.text;

  } catch (error) {
    console.error("PDF extraction failed:", error);
    return "";
  }
};