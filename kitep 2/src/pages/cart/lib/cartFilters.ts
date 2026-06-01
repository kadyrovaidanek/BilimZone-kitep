import type { CartItem } from "./cartStorage";

export const filterCartItems = (items: CartItem[], search: string) => {
    const query = search.trim().toLowerCase();

    if (!query) {
        return items;
    }

    return items.filter((item) => {
        const title = item.title.toLowerCase();
        const author = item.author.toLowerCase();

        return title.includes(query) || author.includes(query);
    });
};

export const calculateCartTotal = (items: CartItem[]) => {
    return items.reduce((sum, item) => sum + Number(item.price || 0), 0);
};