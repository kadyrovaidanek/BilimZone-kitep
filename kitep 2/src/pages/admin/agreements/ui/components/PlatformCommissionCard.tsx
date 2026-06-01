import { useEffect, useState } from "react";
import { Percent, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
    getActivePlatformCommission,
    updateActivePlatformCommission,
} from "@/shared/api/platformCommission";

export const PlatformCommissionCard = () => {
    const { t } = useTranslation();

    const [commission, setCommission] = useState("20.00");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const loadCommission = async () => {
        try {
            setLoading(true);

            const response = await getActivePlatformCommission();
            setCommission(String(response.data.commission_percent || "20.00"));
        } catch (error) {
            console.log("PLATFORM COMMISSION LOAD ERROR:", error);
            setMessage(
                t("commission.messages.loadError", {
                    defaultValue: "Не удалось загрузить комиссию платформы",
                }),
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCommission();
    }, []);

    const handleSave = async () => {
        const value = Number(commission);

        if (!Number.isFinite(value) || value < 0 || value > 100) {
            setMessage(
                t("commission.validation.percent", {
                    defaultValue: "Введите процент от 0 до 100",
                }),
            );
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const response = await updateActivePlatformCommission({
                commission_percent: value.toFixed(2),
            });

            setCommission(String(response.data.commission_percent));

            setMessage(
                t("commission.messages.saved", {
                    defaultValue: "Комиссия платформы сохранена",
                }),
            );
        } catch (error: any) {
            console.log("PLATFORM COMMISSION SAVE ERROR:", error?.response?.data || error);

            setMessage(
                error?.response?.data?.commission_percent?.[0] ||
                error?.response?.data?.error ||
                t("commission.messages.saveError", {
                    defaultValue: "Не удалось сохранить комиссию",
                }),
            );
        } finally {
            setSaving(false);
        }
    };

    const ownerPercent = Math.max(100 - Number(commission || 0), 0);

    return (
        <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                        <Percent size={24} />
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {t("commission.title", {
                                defaultValue: "Комиссия платформы",
                            })}
                        </h2>

                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                            {t("commission.subtitle", {
                                defaultValue:
                                    "Этот процент будет удерживаться сервисом при покупке платных публикаций. Остальная сумма начисляется автору или организации.",
                            })}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold">
                            <span className="rounded-2xl bg-green-50 px-3 py-2 text-green-700">
                                {t("commission.authorPart", {
                                    defaultValue: "Автору",
                                })}
                                : {ownerPercent.toFixed(2)}%
                            </span>

                            <span className="rounded-2xl bg-blue-50 px-3 py-2 text-blue-700">
                                {t("commission.servicePart", {
                                    defaultValue: "Сервису",
                                })}
                                : {Number(commission || 0).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid w-full gap-3 sm:grid-cols-[1fr_auto] lg:w-[420px]">
                    <label className="block">
                        <span className="mb-2 block text-sm font-bold text-slate-700">
                            {t("commission.field", {
                                defaultValue: "Комиссия, %",
                            })}
                        </span>

                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            value={commission}
                            disabled={loading || saving}
                            onChange={(event) => {
                                setCommission(event.target.value);
                                setMessage("");
                            }}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100"
                            placeholder="20"
                        />
                    </label>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={loading || saving}
                        className="self-end inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        <Save size={18} />
                        {saving
                            ? t("commission.saving", {
                                defaultValue: "Сохраняем...",
                            })
                            : t("commission.save", {
                                defaultValue: "Сохранить",
                            })}
                    </button>
                </div>
            </div>

            {message && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                    {message}
                </div>
            )}
        </section>
    );
};