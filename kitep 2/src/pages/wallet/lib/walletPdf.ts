import type { WalletReceipt } from "./walletTypes";

const RECEIPT_WIDTH = 61;

const line = () => `+${"-".repeat(RECEIPT_WIDTH)}+`;

const center = (text: string) => {
    const value = String(text || "");
    const space = Math.max(RECEIPT_WIDTH - value.length, 0);
    const left = Math.floor(space / 2);
    const right = space - left;

    return `|${" ".repeat(left)}${value}${" ".repeat(right)}|`;
};

const row = (label: string, value?: string | number | null) => {
    const left = String(label || "");
    const right = String(value ?? "—");
    const maxRight = Math.max(RECEIPT_WIDTH - left.length - 1, 0);
    const trimmedRight =
        right.length > maxRight ? `${right.slice(0, Math.max(maxRight - 3, 0))}...` : right;

    const spaces = Math.max(RECEIPT_WIDTH - left.length - trimmedRight.length, 1);

    return `| ${left}${" ".repeat(spaces - 1)}${trimmedRight} |`;
};

const textRow = (text: string) => {
    const value = String(text || "");
    const max = RECEIPT_WIDTH - 2;

    if (value.length <= max) {
        return `| ${value}${" ".repeat(max - value.length)} |`;
    }

    const rows: string[] = [];
    let current = value;

    while (current.length > 0) {
        const part = current.slice(0, max);
        rows.push(`| ${part}${" ".repeat(max - part.length)} |`);
        current = current.slice(max);
    }

    return rows.join("\n");
};

const getReceiptValue = (receipt: any, keys: string[], fallback = "—") => {
    for (const key of keys) {
        if (receipt?.[key] !== undefined && receipt?.[key] !== null && receipt?.[key] !== "") {
            return String(receipt[key]);
        }
    }

    return fallback;
};

const getStatusText = (status?: string | null) => {
    const value = String(status || "").toLowerCase();

    if (
        value === "paid" ||
        value === "completed" ||
        value === "success" ||
        value === "оплачено" ||
        value === "оплачен"
    ) {
        return "ОПЛАЧЕНО";
    }

    return "ОПЛАЧЕНО";
};

const getPaymentMethod = (receipt: any) => {
    const source = getReceiptValue(
        receipt,
        ["payment_source", "payment_method", "source"],
        "Кошелёк BilimZone",
    );

    if (source === "bilimzone_wallet") {
        return "Кошелёк BilimZone";
    }

    if (source === "free") {
        return "Бесплатный доступ";
    }

    return source;
};

const buildReceiptText = (receipt: WalletReceipt) => {
    const data = receipt as any;

    const receiptNumber = getReceiptValue(data, ["receipt_number", "number"]);
    const date = getReceiptValue(data, ["date", "created_at"]);
    const buyer = getReceiptValue(data, ["buyer", "buyer_username", "username"]);
    const buyerEmail = getReceiptValue(data, ["buyer_email", "email"], "Не указан");
    const owner = getReceiptValue(data, ["owner", "owner_username", "author"], "Автор");
    const publicationTitle = getReceiptValue(
        data,
        ["publication_title", "material_title", "title"],
        "Без названия",
    );

    const amount = getReceiptValue(data, ["amount"], "0.00");
    const currency = getReceiptValue(data, ["currency"], "сом");
    const status = getStatusText(data.status);

    return [
        line(),
        center("BilimZone"),
        center("ЭЛЕКТРОННЫЙ ФИСКАЛЬНЫЙ ЧЕК"),
        line(),
        row("Номер чека:", `№ ${receiptNumber}`),
        row("Дата и время:", date),
        row("Статус:", `[ ${status} ]`),
        line(),
        textRow("ПОКУПАТЕЛЬ:"),
        row("Пользователь:", buyer),
        row("Email:", buyerEmail),
        line(),
        textRow("НАИМЕНОВАНИЕ ТОВАРА / МАТЕРИАЛА:"),
        textRow(""),
        textRow(`1. ${publicationTitle}`),
        textRow(`   Автор: ${owner}`),
        textRow(`   Цена: ${amount} ${currency}`),
        line(),
        row("ИТОГО К ОПЛАТЕ:", `${amount} ${currency}`),
        row("Способ оплаты:", getPaymentMethod(data)),
        line(),
        center("Спасибо за покупку на BilimZone!"),
        center("По всем вопросам: support@bilimzone.kg"),
        line(),
    ].join("\n");
};

const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob(["\ufeff" + content], {
        type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(url);
};

export const downloadReceiptPdf = (receipt: WalletReceipt) => {
    const receiptNumber = getReceiptValue(receipt as any, ["receipt_number"], "receipt");
    const content = buildReceiptText(receipt);

    downloadTextFile(`bilimzone-receipt-${receiptNumber}.txt`, content);
};

export const downloadAllReceiptsPdf = (receipts: WalletReceipt[]) => {
    const content = receipts
        .map((receipt, index) => {
            return [
                `ЧЕК № ${index + 1}`,
                "",
                buildReceiptText(receipt),
            ].join("\n");
        })
        .join("\n\n\n");

    downloadTextFile("bilimzone-all-receipts.txt", content);
};