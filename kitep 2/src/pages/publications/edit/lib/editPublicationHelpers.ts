import * as mammoth from "mammoth";

import type { CurrentUserLike } from "./editPublicationTypes";

export const allowedDocumentExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
];

export const allowedImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
];

export const hasAllowedExtension = (
    fileName: string,
    extensions: string[],
) => {
    const lowerName = fileName.toLowerCase();

    return extensions.some((extension) => lowerName.endsWith(extension));
};

export const getFileFormat = (fileName: string) => {
    const cleanName = String(fileName || "").split("?")[0];
    const parts = cleanName.split(".");

    return parts.length > 1 ? parts.pop()?.toUpperCase() || "FILE" : "FILE";
};

export const getFileNameFromUrl = (url?: string | null) => {
    if (!url) {
        return "";
    }

    try {
        const cleanValue = String(url).split("?")[0];
        const parts = cleanValue.split("/");

        return decodeURIComponent(parts[parts.length - 1] || "publication");
    } catch {
        return "publication";
    }
};

export const isPdfUrl = (url?: string | null) => {
    if (!url) {
        return false;
    }

    return String(url).split("?")[0].toLowerCase().endsWith(".pdf");
};

export const isOfficeFileName = (fileName?: string | null) => {
    const lowerName = String(fileName || "").toLowerCase();

    return (
        lowerName.endsWith(".doc") ||
        lowerName.endsWith(".docx") ||
        lowerName.endsWith(".ppt") ||
        lowerName.endsWith(".pptx")
    );
};

export const readUserFromStorage = (): CurrentUserLike | null => {
    const keys = [
        "user",
        "authUser",
        "currentUser",
        "bilimzone_user",
        "auth_user",
    ];

    for (const key of keys) {
        const raw = localStorage.getItem(key);

        if (!raw) {
            continue;
        }

        try {
            const parsed = JSON.parse(raw);

            if (parsed && typeof parsed === "object") {
                return parsed;
            }
        } catch {
            continue;
        }
    }

    return null;
};

export const getCurrentUserId = (
    user: CurrentUserLike | null | undefined,
) => {
    const storageUser = readUserFromStorage();

    const id =
        user?.id ||
        user?.user_id ||
        user?.pk ||
        storageUser?.id ||
        storageUser?.user_id ||
        storageUser?.pk;

    return id ? String(id) : "";
};

export const getOfficePreviewText = async (file: File) => {
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".docx")) {
        try {
            const arrayBuffer = await file.arrayBuffer();

            const result = await mammoth.extractRawText({
                arrayBuffer,
            });

            const text = result.value.trim();

            if (!text) {
                return "publication_edit.preview.docxEmpty";
            }

            return text.length > 3000 ? `${text.slice(0, 3000)}...` : text;
        } catch (error) {
            console.log("DOCX PREVIEW ERROR:", error);
            return "publication_edit.preview.docxError";
        }
    }

    if (lowerName.endsWith(".doc")) {
        return "publication_edit.preview.docOldFormat";
    }

    if (lowerName.endsWith(".ppt") || lowerName.endsWith(".pptx")) {
        return "publication_edit.preview.presentationText";
    }

    if (file.type.startsWith("text/") || lowerName.endsWith(".txt")) {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();

            reader.onload = () => {
                resolve(String(reader.result || "").slice(0, 5000));
            };

            reader.onerror = () => {
                resolve("");
            };

            reader.readAsText(file);
        });
    }

    return "";
}; 