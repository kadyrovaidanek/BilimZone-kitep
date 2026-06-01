import { allowedDocumentExtensions } from "../model/constants";

export const hasAllowedExtension = (fileName: string) => {
    const lowerFileName = fileName.toLowerCase();

    return allowedDocumentExtensions.some((extension) =>
        lowerFileName.endsWith(extension),
    );
};

export const getFileExtension = (fileName?: string | null) => {
    if (!fileName) {
        return "";
    }

    const lastDotIndex = fileName.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return fileName.slice(lastDotIndex).toLowerCase();
};

export const getFileFormat = (fileName?: string | null) => {
    const extension = getFileExtension(fileName);

    if (!extension) {
        return "";
    }

    return extension.replace(".", "").toUpperCase();
};

export const isPdfFile = (fileName?: string | null) => {
    return getFileExtension(fileName) === ".pdf";
};

export const isOfficeFile = (fileName?: string | null) => {
    const extension = getFileExtension(fileName);

    return [".doc", ".docx", ".ppt", ".pptx"].includes(extension);
};