import type { ElementType } from "react";
import {
    CheckCircle,
    Clock,
    FileText,
    XCircle,
} from "lucide-react";

import type { PublicationStatus } from "@/shared/api/publications";

export const statusStyles: Record<PublicationStatus, string> = {
    draft: "bg-slate-100 text-slate-600",
    pending: "bg-yellow-50 text-yellow-700",
    published: "bg-green-50 text-green-700",
    rejected: "bg-red-50 text-red-700",
};

export const statusIcons: Record<PublicationStatus, ElementType> = {
    draft: FileText,
    pending: Clock,
    published: CheckCircle,
    rejected: XCircle,
};