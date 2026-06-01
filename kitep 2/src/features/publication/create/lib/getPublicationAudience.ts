export type PublicationAgreementAudience = "author" | "organization";

export const getPublicationAudience = (
    role?: string | null,
): PublicationAgreementAudience | null => {
    if (role === "author") return "author";
    if (role === "organization") return "organization";

    return null;
};