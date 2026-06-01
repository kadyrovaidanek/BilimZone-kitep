import { isOfficeFile } from "./fileHelpers";

export const getOfficePreviewText = (fileName?: string | null) => {
    const lowerFileName = String(fileName || "").toLowerCase();

    if (lowerFileName.endsWith(".doc") || lowerFileName.endsWith(".docx")) {
        return "publication.preview.wordHint";
    }

    if (lowerFileName.endsWith(".ppt") || lowerFileName.endsWith(".pptx")) {
        return "publication.preview.powerPointHint";
    }

    if (isOfficeFile(fileName)) {
        return "publication.preview.officeHint";
    }

    return "publication.preview.selected";
};