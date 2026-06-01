import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

import { usePublicationDetail } from "./hooks/usePublicationDetail";

import { CollectionAgreementModal } from "./ui/CollectionAgreementModal";
import { InsufficientBalanceModal } from "./ui/InsufficientBalanceModal";
import { PublicationCoverPanel } from "./ui/PublicationCoverPanel";
import { PublicationFileViewer } from "./ui/PublicationFileViewer";
import { PublicationInfoPanel } from "./ui/PublicationInfoPanel";
import { PurchaseConfirmModal } from "./ui/PurchaseConfirmModal";
import { PurchaseReceiptModal } from "./ui/PurchaseReceiptModal";
import { ReviewsSection } from "./reviews/ui/ReviewsSection";

export const PublicationDetailPage = () => {
    const { t } = useTranslation();

    const {
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
        closeCollectionAgreement,

        handleConfirmPurchase,
        closePurchaseConfirm,

        closeInsufficientBalanceModal,
        goToWallet,

        closePurchaseReceipt,
    } = usePublicationDetail();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                    {t("publication.detail.loading")}
                </div>
            </div>
        );
    }

    if (!publication) {
        return (
            <div className="min-h-screen bg-slate-50 px-4 py-10">
                <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 text-center">
                    <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />

                    <h1 className="text-2xl font-black text-slate-900">
                        {t("publication.detail.notFound")}
                    </h1>

                    <Link
                        to="/catalog"
                        className="mt-5 inline-flex rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white"
                    >
                        {t("publication.detail.backToCatalog")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
                <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                >
                    <ArrowLeft size={18} />
                    {t("publication.detail.backToCatalog")}
                </Link>

                <div className="grid gap-5 lg:grid-cols-[380px_1fr] lg:gap-6">
                    <PublicationCoverPanel
                        publication={publication}
                        isOwner={isOwner}
                        isBought={isBought}
                        isPaid={isPaid}
                        buying={buying}
                        cartAdded={cartAdded}
                        favorite={favorite}
                        readableFileUrl={readableFileUrl}
                        onBuy={handleBuy}
                        onAddToCart={handleAddToCart}
                        onToggleFavorite={handleToggleFavorite}
                    />

                    <div className="space-y-5 sm:space-y-6">
                        <PublicationInfoPanel publication={publication} />

                        <PublicationFileViewer
                            title={publication.title}
                            isBought={isBought}
                            isPaid={isPaid}
                            isOwner={isOwner}
                            readableFileUrl={readableFileUrl}
                        />

                        <ReviewsSection
                            publicationId={publication.id}
                            initialAverageRating={publication.average_rating || 0}
                            initialReviewsCount={publication.reviews_count || 0}
                        />
                    </div>
                </div>
            </div>

            <CollectionAgreementModal
                open={collectionAgreementOpen}
                isPaid={isPaid}
                processing={buying}
                onClose={closeCollectionAgreement}
                onConfirm={handleAcceptCollectionAgreement}
            />

            <InsufficientBalanceModal
                open={Boolean(insufficientBalanceData)}
                data={insufficientBalanceData}
                onClose={closeInsufficientBalanceModal}
                onGoWallet={goToWallet}
            />

            <PurchaseConfirmModal
                open={purchaseConfirmOpen}
                title={publication.title}
                price={publication.price}
                isPaid={isPaid}
                processing={buying}
                onClose={closePurchaseConfirm}
                onConfirm={handleConfirmPurchase}
            />

            <PurchaseReceiptModal
                open={Boolean(purchaseReceipt)}
                receipt={purchaseReceipt}
                onClose={closePurchaseReceipt}
            />
        </main>
    );
};

export default PublicationDetailPage;