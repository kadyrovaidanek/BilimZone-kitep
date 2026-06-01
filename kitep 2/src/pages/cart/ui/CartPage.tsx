import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/entities/user/model/useAuth";
import {
  isInsufficientBalanceError,
  purchasePublication,
  type PurchaseErrorResponse,
} from "@/shared/api/purchases";

import {
  readCart,
  updateLocalWalletBalance,
  writeCart,
  type CartItem,
} from "../lib/cartStorage";
import { addWalletReceipt } from "@/pages/wallet/lib/walletStorage";
import { calculateCartTotal, filterCartItems } from "../lib/cartFilters";
import { getCartReceiptData } from "../lib/cartReceipt";

import { CartAuthRequired } from "./components/CartAuthRequired";
import { CartHeader } from "./components/CartHeader";
import { CartSummary } from "./components/CartSummary";
import { CartEmptyState } from "./components/CartEmptyState";
import { CartItemCard } from "./components/CartItemCard";
import { CartMessageModal } from "./components/CartMessageModal";
import { CartReceiptModal } from "./components/CartReceiptModal";

import { CollectionAgreementModal } from "@/pages/publications/detail/ui/CollectionAgreementModal";
import { PurchaseConfirmModal } from "@/pages/publications/detail/ui/PurchaseConfirmModal";
import { InsufficientBalanceModal } from "@/pages/publications/detail/ui/InsufficientBalanceModal";

type MessageState = {
  open: boolean;
  title: string;
  text: string;
  type: "success" | "error" | "wallet";
};

export const CartPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [items, setItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");

  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [buyingAll, setBuyingAll] = useState(false);

  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  const [agreementOpen, setAgreementOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [buyAllAgreementOpen, setBuyAllAgreementOpen] = useState(false);
  const [buyAllConfirmOpen, setBuyAllConfirmOpen] = useState(false);

  const [receipt, setReceipt] = useState<any | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const [insufficientData, setInsufficientData] =
    useState<PurchaseErrorResponse | null>(null);
  const [insufficientOpen, setInsufficientOpen] = useState(false);

  const [message, setMessage] = useState<MessageState>({
    open: false,
    title: "",
    text: "",
    type: "success",
  });

  const loadItems = () => {
    if (!user?.id) {
      return;
    }

    setItems(readCart(user.id));
  };

  useEffect(() => {
    loadItems();
  }, [user?.id]);

  const openMessage = (nextMessage: Omit<MessageState, "open">) => {
    setMessage({
      open: true,
      ...nextMessage,
    });
  };

  const closeMessage = () => {
    setMessage((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const showReceipt = (responseData: any) => {
    const nextReceipt = getCartReceiptData(responseData?.receipt);

    if (!nextReceipt || !user?.id) {
      return;
    }

    addWalletReceipt(String(user.id), nextReceipt);

    setReceipt(nextReceipt);
    setReceiptOpen(true);
  };

  const handleRemove = (id: number | string) => {
    if (!user?.id) {
      return;
    }

    const updated = items.filter((item) => String(item.id) !== String(id));
    writeCart(user.id, updated);
    setItems(updated);
  };

  const handleClear = () => {
    if (!user?.id) {
      return;
    }

    writeCart(user.id, []);
    setItems([]);

    openMessage({
      title: t("cart.modal.clearSuccessTitle"),
      text: t("cart.modal.clearSuccessText"),
      type: "success",
    });
  };

  const handlePurchaseError = (error: any) => {
    console.log("PURCHASE ERROR:", error?.response?.data || error);

    const data = error?.response?.data as PurchaseErrorResponse | undefined;

    if (isInsufficientBalanceError(error)) {
      setInsufficientData(data || null);
      setInsufficientOpen(true);
      return;
    }

    openMessage({
      title: t("cart.modal.errorTitle"),
      text:
        data?.error ||
        data?.detail ||
        data?.message ||
        data?.bank?.error ||
        data?.bank?.detail ||
        t("cart.messages.buyError"),
      type: "error",
    });
  };

  const handleBuyClick = (item: CartItem) => {
    if (!user?.id) {
      openMessage({
        title: t("cart.modal.authTitle"),
        text: t("cart.authRequired"),
        type: "error",
      });

      return;
    }

    setSelectedItem(item);
    setAgreementOpen(true);
  };

  const handleAgreementConfirm = () => {
    setAgreementOpen(false);
    setConfirmOpen(true);
  };

  const handleConfirmBuy = async () => {
    if (!user?.id || !selectedItem) {
      return;
    }

    try {
      setBuyingId(selectedItem.id);

      const response = await purchasePublication(selectedItem.id, {
        user_id: user.id,
      });

      const responseData = response.data as any;

      showReceipt(responseData);

      if (responseData.wallet?.buyer_balance !== undefined) {
        updateLocalWalletBalance(user.id, responseData.wallet.buyer_balance);
      }

      if (responseData.bank?.buyer?.balance !== undefined) {
        updateLocalWalletBalance(user.id, responseData.bank.buyer.balance);
      }

      const updated = items.filter((cartItem) => cartItem.id !== selectedItem.id);
      writeCart(user.id, updated);
      setItems(updated);

      setConfirmOpen(false);
      setSelectedItem(null);

      openMessage({
        title: t("cart.modal.successTitle"),
        text: responseData.message || t("cart.messages.buySuccess"),
        type: "success",
      });
    } catch (error: any) {
      handlePurchaseError(error);
    } finally {
      setBuyingId(null);
    }
  };

  const handleBuyAllClick = () => {
    if (!user?.id) {
      openMessage({
        title: t("cart.modal.authTitle"),
        text: t("cart.authRequired"),
        type: "error",
      });

      return;
    }

    if (items.length === 0) {
      return;
    }

    setBuyAllAgreementOpen(true);
  };

  const handleBuyAllAgreementConfirm = () => {
    setBuyAllAgreementOpen(false);
    setBuyAllConfirmOpen(true);
  };

  const handleConfirmBuyAll = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setBuyingAll(true);

      let updatedItems = [...items];

      for (const item of items) {
        const response = await purchasePublication(item.id, {
          user_id: user.id,
        });

        const responseData = response.data as any;

        showReceipt(responseData);

        if (responseData.wallet?.buyer_balance !== undefined) {
          updateLocalWalletBalance(user.id, responseData.wallet.buyer_balance);
        }

        if (responseData.bank?.buyer?.balance !== undefined) {
          updateLocalWalletBalance(user.id, responseData.bank.buyer.balance);
        }

        updatedItems = updatedItems.filter((cartItem) => cartItem.id !== item.id);

        writeCart(user.id, updatedItems);
        setItems(updatedItems);
      }

      setBuyAllConfirmOpen(false);

      openMessage({
        title: t("cart.modal.successTitle"),
        text: t("cart.messages.buyAllSuccess"),
        type: "success",
      });
    } catch (error: any) {
      setBuyAllConfirmOpen(false);
      handlePurchaseError(error);
      loadItems();
    } finally {
      setBuyingAll(false);
    }
  };

  const filteredItems = useMemo(() => {
    return filterCartItems(items, search);
  }, [items, search]);

  const total = useMemo(() => {
    return calculateCartTotal(items);
  }, [items]);

  if (!user) {
    return <CartAuthRequired />;
  }

  return (
    <>
      <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <CartHeader search={search} onSearchChange={setSearch} />

          {items.length > 0 && (
            <CartSummary
              total={total}
              buyingAll={buyingAll}
              onClear={handleClear}
              onBuyAll={handleBuyAllClick}
            />
          )}

          {filteredItems.length === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  buyingId={buyingId}
                  onBuy={handleBuyClick}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <CollectionAgreementModal
        open={agreementOpen}
        isPaid={selectedItem?.priceType === "paid"}
        processing={buyingId === selectedItem?.id}
        onClose={() => {
          if (buyingId) return;

          setAgreementOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleAgreementConfirm}
      />

      <PurchaseConfirmModal
        open={confirmOpen}
        title={selectedItem?.title || ""}
        price={selectedItem?.price || 0}
        isPaid={selectedItem?.priceType === "paid"}
        processing={buyingId === selectedItem?.id}
        onClose={() => {
          if (buyingId) return;

          setConfirmOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmBuy}
      />

      <CollectionAgreementModal
        open={buyAllAgreementOpen}
        isPaid={total > 0}
        processing={buyingAll}
        onClose={() => {
          if (buyingAll) return;

          setBuyAllAgreementOpen(false);
        }}
        onConfirm={handleBuyAllAgreementConfirm}
      />

      <PurchaseConfirmModal
        open={buyAllConfirmOpen}
        title={t("cart.modal.allMaterialsTitle")}
        price={total}
        isPaid={total > 0}
        processing={buyingAll}
        onClose={() => {
          if (buyingAll) return;

          setBuyAllConfirmOpen(false);
        }}
        onConfirm={handleConfirmBuyAll}
      />

      <InsufficientBalanceModal
        open={insufficientOpen}
        data={insufficientData}
        onClose={() => {
          setInsufficientOpen(false);
          setInsufficientData(null);
        }}
        onGoWallet={() => {
          setInsufficientOpen(false);
          setInsufficientData(null);
          navigate("/wallet");
        }}
      />

      <CartReceiptModal
        open={receiptOpen}
        receipt={receipt}
        onClose={() => {
          setReceiptOpen(false);
          setReceipt(null);
        }}
      />

      <CartMessageModal
        open={message.open}
        title={message.title}
        text={message.text}
        type={message.type}
        onClose={closeMessage}
      />
    </>
  );
};

export default CartPage;