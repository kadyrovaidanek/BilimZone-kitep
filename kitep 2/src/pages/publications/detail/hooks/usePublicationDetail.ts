import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    getPublicationById,
    type Publication,
} from "@/shared/api/publications";
import {
    getUserPurchases,
    isInsufficientBalanceError,
    purchasePublication,
    type PurchaseErrorResponse,
    type PurchaseStartResponse,
} from "@/shared/api/purchases";
import {
    addWalletReceipt,
    addWalletTransaction,
} from "@/pages/wallet/lib/walletStorage";
import { useAuth } from "@/entities/user/model/useAuth";

import {
    getCartKey,
    getFavoritesKey,
    getUserId,
    readArray,
    toPublicationCartItem,
    updateLocalWalletBalance,
    writeArray,
    type PublicationCartItem,
} from "../lib/publicationStorage";
import {
    buildLocalInsufficientBalanceData,
    getLocalWalletBalance,
} from "../lib/purchaseBalance";

type PublicationWithExtra = Publication & {
    is_purchased?: boolean;
    purchases_count?: number;
};

export const usePublicationDetail = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [publication, setPublication] = useState<PublicationWithExtra | null>(
        null,
    );

    const [loading, setLoading] = useState(false);
    const [buying, setBuying] = useState(false);

    const [cartAdded, setCartAdded] = useState(false);
    const [favorite, setFavorite] = useState(false);
    const [bought, setBought] = useState(false);

    const [collectionAgreementOpen, setCollectionAgreementOpen] =
        useState(false);

    const [insufficientBalanceData, setInsufficientBalanceData] =
        useState<PurchaseErrorResponse | null>(null);

    const [purchaseConfirmOpen, setPurchaseConfirmOpen] = useState(false);
    const [purchaseReceipt, setPurchaseReceipt] = useState<any | null>(null);

    const userId = getUserId(user);

    const isOwner = useMemo(() => {
        if (!user || !publication) {
            return false;
        }

        return String(user.id) === String(publication.author_user);
    }, [user, publication]);

    const isBought = bought || Boolean(publication?.is_purchased);
    const price = Number(publication?.price || 0);
    const isPaid = publication?.price_type === "paid" && price > 0;

    const readableFileUrl =
        publication && (isBought || !isPaid || isOwner)
            ? publication.pdf_file_url || publication.file_url
            : publication?.preview_file_url;

    const loadPublication = async () => {
        if (!id) {
            return;
        }

        try {
            setLoading(true);

            const response = await getPublicationById(id);
            const loadedPublication = response.data as PublicationWithExtra;

            setPublication(loadedPublication);

            if (!userId) {
                setBought(false);
                return;
            }

            const cart = readArray<PublicationCartItem>(getCartKey(userId));

            setCartAdded(
                cart.some(
                    (item) => String(item.id) === String(loadedPublication.id),
                ),
            );

            const favorites = readArray<PublicationCartItem>(
                getFavoritesKey(userId),
            );

            setFavorite(
                favorites.some(
                    (item) => String(item.id) === String(loadedPublication.id),
                ),
            );

            try {
                const purchasesResponse = await getUserPurchases(userId);

                const hasPurchase = purchasesResponse.data.some(
                    (purchase) =>
                        String(purchase.publication) ===
                        String(loadedPublication.id),
                );

                setBought(hasPurchase || Boolean(loadedPublication.is_purchased));
            } catch {
                setBought(Boolean(loadedPublication.is_purchased));
            }
        } catch {
            alert(t("publication.detail.loadError"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPublication();
    }, [id, user?.id]);

    const clearCartItem = (publicationId: number | string) => {
        if (!userId) {
            return;
        }

        const cartKey = getCartKey(userId);
        const cart = readArray<PublicationCartItem>(cartKey).filter(
            (item) => String(item.id) !== String(publicationId),
        );

        writeArray(cartKey, cart);
        setCartAdded(false);
    };

    const saveReceiptAndTransaction = (responseData: PurchaseStartResponse) => {
        if (!publication || !userId) {
            return;
        }

        if (!responseData.receipt) {
            return;
        }

        setPurchaseReceipt(responseData.receipt);
        addWalletReceipt(userId, responseData.receipt);

        addWalletTransaction(userId, {
            type: "purchase",
            title: t("publication.detail.walletPurchaseTitle", {
                title:
                    responseData.receipt.publication_title ||
                    responseData.receipt.material_title ||
                    publication.title,
            }),
            amount: Number(responseData.receipt.amount || 0),
            status: "completed",
        });
    };

    const finishSuccessfulPurchase = async (
        responseData: PurchaseStartResponse,
    ) => {
        if (!publication || !userId) {
            return;
        }

        const paidAmount = Number(
            responseData.amount ||
            responseData.receipt?.amount ||
            publication.price ||
            0,
        );

        if (responseData.wallet?.buyer_balance !== undefined) {
            updateLocalWalletBalance(
                userId,
                Number(responseData.wallet.buyer_balance),
            );
        } else if (paidAmount > 0) {
            const currentBalance = getLocalWalletBalance(userId);
            const nextBalance = Math.max(currentBalance - paidAmount, 0);

            updateLocalWalletBalance(userId, nextBalance);
        }

        clearCartItem(publication.id);
        setBought(true);
        setPurchaseConfirmOpen(false);
        setCollectionAgreementOpen(false);

        saveReceiptAndTransaction(responseData);

        try {
            const refreshed = await getPublicationById(publication.id);
            setPublication(refreshed.data as PublicationWithExtra);
        } catch {
            // Не критично: покупка уже выполнена.
        }
    };

    const handleAddToCart = () => {
        if (!user || !userId) {
            alert(t("publication.detail.authRequired"));
            return;
        }

        if (!publication) {
            return;
        }

        if (isBought) {
            alert(t("publication.detail.alreadyBought"));
            return;
        }

        const key = getCartKey(userId);
        const cart = readArray<PublicationCartItem>(key);

        const exists = cart.some(
            (item) => String(item.id) === String(publication.id),
        );

        if (exists) {
            setCartAdded(true);
            alert(t("publication.detail.alreadyInCart"));
            return;
        }

        writeArray(key, [toPublicationCartItem(publication), ...cart]);
        setCartAdded(true);
        alert(t("publication.detail.addedToCart"));
    };

    const handleToggleFavorite = () => {
        if (!user || !userId) {
            alert(t("publication.detail.authRequired"));
            return;
        }

        if (!publication) {
            return;
        }

        const key = getFavoritesKey(userId);
        const favorites = readArray<PublicationCartItem>(key);

        const exists = favorites.some(
            (item) => String(item.id) === String(publication.id),
        );

        if (exists) {
            writeArray(
                key,
                favorites.filter(
                    (item) => String(item.id) !== String(publication.id),
                ),
            );
            setFavorite(false);
            return;
        }

        writeArray(key, [toPublicationCartItem(publication), ...favorites]);
        setFavorite(true);
    };

    const handleBuy = () => {
        if (!user?.id) {
            alert(t("publication.detail.authRequired"));
            return;
        }

        if (!publication) {
            return;
        }

        if (isBought) {
            alert(t("publication.detail.alreadyBought"));
            return;
        }

        setCollectionAgreementOpen(true);
    };

    const executePurchase = async () => {
        if (!user?.id || !userId) {
            alert(t("publication.detail.authRequired"));
            return;
        }

        if (!publication) {
            return;
        }

        if (isBought) {
            alert(t("publication.detail.alreadyBought"));
            setPurchaseConfirmOpen(false);
            setCollectionAgreementOpen(false);
            return;
        }

        const publicationPrice = Number(publication.price || 0);
        const isPublicationPaid =
            publication.price_type === "paid" && publicationPrice > 0;

        if (isPublicationPaid) {
            const localBalance = getLocalWalletBalance(userId);

            if (localBalance < publicationPrice) {
                setPurchaseConfirmOpen(false);
                setCollectionAgreementOpen(false);

                setInsufficientBalanceData(
                    buildLocalInsufficientBalanceData({
                        price: publicationPrice,
                        balance: localBalance,
                    }),
                );

                return;
            }
        }

        try {
            setBuying(true);

            const response = await purchasePublication(publication.id, {
                user_id: user.id,
            });

            await finishSuccessfulPurchase(response.data);
        } catch (error: any) {
            const data = error?.response?.data as PurchaseErrorResponse;

            setPurchaseConfirmOpen(false);
            setCollectionAgreementOpen(false);

            if (isInsufficientBalanceError(data)) {
                setInsufficientBalanceData(data);
                return;
            }

            alert(
                data?.error ||
                data?.detail ||
                data?.bank?.error ||
                data?.bank?.detail ||
                t("publication.detail.purchaseError"),
            );
        } finally {
            setBuying(false);
        }
    };

    const handleAcceptCollectionAgreement = async () => {
        setCollectionAgreementOpen(false);

        if (isPaid) {
            setPurchaseConfirmOpen(true);
            return;
        }

        await executePurchase();
    };

    const handleConfirmPurchase = async () => {
        await executePurchase();
    };

    const closeInsufficientBalanceModal = () => {
        setInsufficientBalanceData(null);
    };

    const goToWallet = () => {
        setInsufficientBalanceData(null);
        navigate("/wallet");
    };

    return {
        publication,
        loading,
        buying,

        cartAdded,
        favorite,

        isOwner,
        isBought,
        isPaid,
        readableFileUrl,

        collectionAgreementOpen,
        insufficientBalanceData,
        purchaseConfirmOpen,
        purchaseReceipt,

        handleBuy,
        handleAddToCart,
        handleToggleFavorite,

        handleAcceptCollectionAgreement,
        closeCollectionAgreement: () => setCollectionAgreementOpen(false),

        handleConfirmPurchase,
        closePurchaseConfirm: () => setPurchaseConfirmOpen(false),

        closeInsufficientBalanceModal,
        goToWallet,

        closePurchaseReceipt: () => setPurchaseReceipt(null),
    };
};