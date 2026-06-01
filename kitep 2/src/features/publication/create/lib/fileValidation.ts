export const allowedDocumentExtensions = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];
export const allowedImageExtensions = [".jpg", ".jpeg", ".png"];

export const getFileExtension = (file: File) => {
    const parts = file.name.split(".");
    return parts.length > 1 ? `.${parts.pop()?.toLowerCase()}` : "";
};

export const getReadableFileFormat = (file: File | null) => {
    if (!file) return "";

    const extension = getFileExtension(file).replace(".", "").toUpperCase();

    return extension || "FILE";
};

export const isAllowedDocumentFile = (file: File) => {
    return allowedDocumentExtensions.includes(getFileExtension(file));
};

export const isAllowedImageFile = (file: File) => {
    return allowedImageExtensions.includes(getFileExtension(file));
};

export const isPdfFile = (file: File | null) => {
    if (!file) return false;

    return getFileExtension(file) === ".pdf";
};