import { useAuth } from "@/entities/user/model/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, ReactNode, JSX, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaPhone,
  FaTelegramPlane,
  FaArrowLeft,
  FaChevronDown,
} from "react-icons/fa";

import { useScrollSpy } from "@/shared/lib/hooks/useScrollSpy";
import { SupportSidebar } from "@/widgets/support-sidebar/ui/SupportSidebar";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/Button";

type FaqItem = {
  question: string;
  answer: string;
};

const SectionWrapper = ({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) => (
  <section
    id={id}
    className="scroll-mt-24 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8"
  >
    <h2 className="mb-6 text-2xl font-black text-slate-900">{title}</h2>
    <div className="text-slate-600">{children}</div>
  </section>
);

const ContactCard = ({
  icon,
  title,
  text,
  href,
}: {
  icon: JSX.Element;
  title: string;
  text: string;
  href: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-2xl bg-slate-50 p-5 transition hover:bg-blue-50"
  >
    <div className="flex items-center gap-4">
      <div className="text-2xl text-blue-600">{icon}</div>

      <div>
        <h4 className="font-bold text-slate-800">{title}</h4>
        <p className="text-sm text-slate-500 transition hover:text-blue-600">
          {text}
        </p>
      </div>
    </div>
  </a>
);

const FaqAccordion = ({ items }: { items: FaqItem[] }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = activeIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-bold text-slate-900">
                {item.question}
              </span>

              <FaChevronDown
                className={`shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-600 sm:text-base">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const SupportPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const sections = [
    {
      id: "faq",
      label: t("support.sections.faq", {
        defaultValue: "Часто задаваемые вопросы",
      }),
    },
    {
      id: "contacts",
      label: t("support.sections.contacts", {
        defaultValue: "Контакты",
      }),
    },
    {
      id: "terms",
      label: t("support.sections.terms", {
        defaultValue: "Правила платформы",
      }),
    },
    {
      id: "privacy",
      label: t("support.sections.privacy", {
        defaultValue: "Конфиденциальность",
      }),
    },
  ];

  const faqItems: FaqItem[] = [
    {
      question: "Как купить материал?",
      answer:
        "Откройте нужную публикацию в каталоге, нажмите «Купить сейчас», подтвердите покупку и оплатите её с кошелька. После успешной покупки материал появится в разделе «Моя коллекция».",
    },
    {
      question: "Где найти купленные публикации?",
      answer:
        "Все купленные и добавленные бесплатные публикации находятся в разделе «Моя коллекция». Там можно открыть материал, скачать файл или перейти к странице публикации.",
    },
    {
      question: "Как пополнить кошелёк?",
      answer:
        "Перейдите в раздел «Кошелёк», выберите «Пополнить», введите данные карты Bilim Bank/Fake Bank, сумму и подтвердите операцию кодом. После подтверждения баланс обновится автоматически.",
    },
    {
      question: "Что делать, если не хватает денег для покупки?",
      answer:
        "Если на кошельке недостаточно средств, система покажет сообщение с нужной суммой, текущим балансом и недостающей суммой. Сначала пополните кошелёк, затем повторите покупку.",
    },
    {
      question: "Как добавить материал в избранное?",
      answer:
        "На странице публикации нажмите кнопку «Добавить в избранное». После этого материал можно будет быстро найти через раздел «Избранные» или вкладку «Избранные» в коллекции.",
    },
    {
      question: "Как автору добавить публикацию?",
      answer:
        "Автор или организация должны перейти в раздел «Мои публикации», нажать «Добавить материал», заполнить название, описание, категорию, тип доступа, цену при необходимости и загрузить файл. После отправки публикация попадёт на модерацию.",
    },
    {
      question: "Как проходит модерация публикации?",
      answer:
        "После отправки материала администратор проверяет файл, описание, категорию и корректность данных. Если всё правильно, публикация получает статус «Опубликовано». Если есть ошибка, администратор может отклонить публикацию и указать причину.",
    },
    {
      question: "Как автор получает доход?",
      answer:
        "После покупки платной публикации часть суммы начисляется автору или организации, а комиссия платформы начисляется сервису. Процент комиссии задаётся администратором в настройках платформы.",
    },
    {
      question: "Где посмотреть финансовую статистику?",
      answer:
        "Авторы, организации и администратор могут открыть раздел «Отчёты». Там отображаются публикации, покупки, доходы, активность и популярность материалов.",
    },
    {
      question: "Что делать, если файл не открывается?",
      answer:
        "Проверьте подключение к интернету и попробуйте открыть страницу заново. Если проблема остаётся, напишите в поддержку и укажите название публикации, ваш логин и описание проблемы.",
    },
  ];

  const sectionIds = sections.map((section) => section.id);

  const activeSectionId = useScrollSpy(sectionIds, {
    rootMargin: "-20% 0px -80% 0px",
  });

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert(
      t("support.form.success", {
        defaultValue:
          "Сообщение принято. Поддержка свяжется с вами в ближайшее время.",
      }),
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 sm:py-12">
      <div className="mb-8">
        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-900"
        >
          <FaArrowLeft />
          {isAuthenticated
            ? t("support.backToDashboard", {
              defaultValue: "Назад",
            })
            : t("support.backHome", {
              defaultValue: "Назад на главную",
            })}
        </button>
      </div>

      <header className="mb-12 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-10 text-center text-white shadow-sm sm:px-10">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-100">
          BilimZone
        </p>

        <h1 className="text-3xl font-black sm:text-5xl">
          {t("support.title", {
            defaultValue: "Поддержка и помощь",
          })}
        </h1>

        <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-blue-100 sm:text-lg">
          {t("support.subtitle", {
            defaultValue:
              "Здесь собраны ответы на частые вопросы по покупке материалов, кошельку, публикациям, модерации и работе платформы.",
          })}
        </p>
      </header>

      <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-12">
        <SupportSidebar sections={sections} activeId={activeSectionId} />

        <div className="w-full space-y-8 lg:flex-1">
          <SectionWrapper
            id="faq"
            title={t("support.sections.faq", {
              defaultValue: "Часто задаваемые вопросы",
            })}
          >
            <FaqAccordion items={faqItems} />
          </SectionWrapper>

          <SectionWrapper
            id="contacts"
            title={t("support.sections.contacts", {
              defaultValue: "Контакты",
            })}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <ContactCard
                  icon={<FaPhone />}
                  title={t("support.contact.phone", {
                    defaultValue: "Телефон",
                  })}
                  text="+996 220 71 29 57"
                  href="tel:+996220712957"
                />

                <ContactCard
                  icon={<FaTelegramPlane />}
                  title={t("support.contact.telegram", {
                    defaultValue: "Telegram",
                  })}
                  text="@kadyrovaidanek"
                  href="https://t.me/kadyrovaidanek"
                />

                <ContactCard
                  icon={<FaEnvelope />}
                  title={t("support.contact.email", {
                    defaultValue: "Email",
                  })}
                  text="aidanekkadyrova1@gmail.com"
                  href="mailto:aidanekkadyrova1@gmail.com"
                />
              </div>

              <div className="rounded-2xl bg-slate-50 p-6">
                <h4 className="mb-4 font-bold text-slate-800">
                  {t("support.form.title", {
                    defaultValue: "Написать в поддержку",
                  })}
                </h4>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    type="email"
                    placeholder={t("support.form.email", {
                      defaultValue: "Ваш email",
                    })}
                    required
                  />

                  <textarea
                    className="w-full rounded-xl border border-slate-300 px-3 py-3 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    rows={5}
                    placeholder={t("support.form.message", {
                      defaultValue: "Опишите проблему или вопрос",
                    })}
                    required
                  />

                  <Button type="submit" className="w-full">
                    {t("support.form.submit", {
                      defaultValue: "Отправить",
                    })}
                  </Button>
                </form>
              </div>
            </div>
          </SectionWrapper>

          <SectionWrapper
            id="terms"
            title={t("support.sections.terms", {
              defaultValue: "Правила платформы",
            })}
          >
            <div className="space-y-4 leading-7">
              <p>
                Пользователь должен соблюдать правила платформы BilimZone:
                размещать только корректные учебные материалы, не нарушать
                авторские права и не публиковать запрещённый контент.
              </p>

              <p>
                Все материалы автора или организации проходят проверку
                администратором. Платные публикации становятся доступными
                пользователю после успешной оплаты.
              </p>
            </div>
          </SectionWrapper>

          <SectionWrapper
            id="privacy"
            title={t("support.sections.privacy", {
              defaultValue: "Конфиденциальность",
            })}
          >
            <div className="space-y-4 leading-7">
              <p>
                BilimZone использует данные пользователя только для работы
                аккаунта, покупки материалов, начисления дохода авторам,
                уведомлений и формирования отчётов.
              </p>

              <p>
                Данные кошелька, история покупок и личная информация не должны
                передаваться третьим лицам без необходимости.
              </p>
            </div>
          </SectionWrapper>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;