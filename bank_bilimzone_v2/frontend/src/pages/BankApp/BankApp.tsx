import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CreditCard,
  Copy,
  LogOut,
  ReceiptText,
  Users,
  UserPlus,
  Wallet,
  Landmark,
  ShieldCheck,
  RefreshCcw,
  KeyRound,
} from "lucide-react";

import { bankApi } from "../../api/bankApi";
import type { BankCustomer, BankTransaction } from "../../types/bank";

type AppMode = "select" | "bankLogin" | "bankPanel" | "userLogin" | "userPanel";
type Tab = "cashIn" | "cashOut" | "transfer" | "topUpBilimZone" | "pay";

type PendingCode = {
  code: string;
  card_number: string;
  masked_number: string;
  card_holder: string;
  customer_id: number;
  created_at: string;
};

const BANK_ADMIN_LOGIN = "bank";
const BANK_ADMIN_PASSWORD = "bank123";

const CUSTOMER_ID_KEY = "bankCustomerId";

export function BankApp() {
  const [mode, setMode] = useState<AppMode>("select");

  const [bankLogin, setBankLogin] = useState("");
  const [bankPassword, setBankPassword] = useState("");

  const [customers, setCustomers] = useState<BankCustomer[]>([]);
  const [customer, setCustomer] = useState<BankCustomer | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [pendingCodes, setPendingCodes] = useState<PendingCode[]>([]);

  const [loginPhone, setLoginPhone] = useState("+996");
  const [loginPassword, setLoginPassword] = useState("");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("+996");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("12345678");
  const [initialBalance, setInitialBalance] = useState("10000");
  const [bilimzoneUserId, setBilimzoneUserId] = useState("");

  const [activeTab, setActiveTab] = useState<Tab>("cashIn");
  const [amount, setAmount] = useState("");
  const [toCard, setToCard] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const account = customer?.accounts?.[0] || null;
  const card = account?.card || null;

  const balanceText = useMemo(() => {
    const value = Number(account?.balance || 0);

    return value.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [account]);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const loadCustomers = async () => {
    setLoading(true);
    clearMessages();

    try {
      const data = await bankApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки клиентов");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingCodes = async (customerId: number) => {
    try {
      const response = await bankApi.getPendingCodes(customerId);
      setPendingCodes(response.codes);
    } catch (err) {
      console.error("Ошибка загрузки кодов:", err);
    }
  };

  const loadCustomer = async (customerId: number) => {
    setLoading(true);
    clearMessages();

    try {
      const loaded = await bankApi.getCustomer(customerId);
      setCustomer(loaded);
      localStorage.setItem(CUSTOMER_ID_KEY, String(loaded.id));

      const loadedCard = loaded.accounts?.[0]?.card?.card_number;

      if (loadedCard) {
        const tx = await bankApi.getTransactions(loadedCard);
        setTransactions(tx);
      } else {
        setTransactions([]);
      }

      await loadPendingCodes(loaded.id);

      setMode("userPanel");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки клиента");
      localStorage.removeItem(CUSTOMER_ID_KEY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedCustomerId = localStorage.getItem(CUSTOMER_ID_KEY);

    if (savedCustomerId) {
      loadCustomer(Number(savedCustomerId));
    }
  }, []);

  const handleBankLogin = async () => {
    clearMessages();

    if (bankLogin !== BANK_ADMIN_LOGIN || bankPassword !== BANK_ADMIN_PASSWORD) {
      setError("Неверный логин или пароль банка");
      return;
    }

    setMode("bankPanel");
    setBankLogin("");
    setBankPassword("");
    await loadCustomers();
  };

  const createCustomerFromBank = async () => {
    if (!fullName.trim() || !phone.trim() || !password.trim()) {
      setError("Заполните ФИО, телефон и пароль");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      await bankApi.register({
        full_name: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
        initial_balance: initialBalance || "10000",
        external_bilimzone_user_id: bilimzoneUserId.trim(),
      });

      setMessage("Клиент банка создан");
      setFullName("");
      setPhone("+996");
      setEmail("");
      setPassword("12345678");
      setInitialBalance("10000");
      setBilimzoneUserId("");

      await loadCustomers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка создания клиента");
    } finally {
      setLoading(false);
    }
  };

  const userLogin = async () => {
    if (!loginPhone.trim() || !loginPassword.trim()) {
      setError("Введите телефон и пароль");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const response = await bankApi.login({
        phone: loginPhone.trim(),
        password: loginPassword.trim(),
      });

      setCustomer(response.customer);
      localStorage.setItem(CUSTOMER_ID_KEY, String(response.customer.id));

      const loadedCard = response.customer.accounts?.[0]?.card?.card_number;

      if (loadedCard) {
        setTransactions(await bankApi.getTransactions(loadedCard));
      } else {
        setTransactions([]);
      }

      await loadPendingCodes(response.customer.id);

      setMode("userPanel");
      setMessage("Вход выполнен");
      setLoginPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCustomer(null);
    setTransactions([]);
    setPendingCodes([]);
    localStorage.removeItem(CUSTOMER_ID_KEY);
    setMode("select");
    clearMessages();
  };

  const bankLogout = () => {
    setMode("select");
    setCustomers([]);
    clearMessages();
  };

  const refreshCustomer = async () => {
    if (customer?.id) {
      await loadCustomer(customer.id);
    }
  };

  const execute = async () => {
    if (!card?.card_number) {
      setError("Сначала войдите как пользователь банка");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Введите корректную сумму");
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      if (activeTab === "cashIn") {
        await bankApi.cashIn({
          card_number: card.card_number,
          amount,
          description: description || "Пополнение банковского счёта",
        });

        setMessage("Счёт пополнен");
      }

      if (activeTab === "cashOut") {
        await bankApi.cashOut({
          card_number: card.card_number,
          amount,
          description: description || "Снятие со счёта",
        });

        setMessage("Снятие выполнено");
      }

      if (activeTab === "transfer") {
        if (!toCard.trim()) {
          setError("Введите карту получателя");
          setLoading(false);
          return;
        }

        await bankApi.transfer({
          from_card: card.card_number,
          to_card: toCard.trim(),
          amount,
          description: description || "Перевод",
        });

        setMessage("Перевод выполнен");
      }

      if (activeTab === "topUpBilimZone") {
        const userId =
          customer?.external_bilimzone_user_id || `bank_customer_${customer?.id}`;

        await bankApi.topUpBilimZone({
          card_number: card.card_number,
          amount,
          bilimzone_user_id: userId,
          description: description || "Пополнение BilimZone",
        });

        setMessage("Баланс BilimZone пополнен");
      }

      if (activeTab === "pay") {
        await bankApi.pay({
          card_number: card.card_number,
          amount,
          merchant: "BilimZone",
          external_reference: description || undefined,
        });

        setMessage("Оплата выполнена");
      }

      setAmount("");
      setToCard("");
      setDescription("");

      await refreshCustomer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка операции");
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setMessage("Скопировано");
  };

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "cashIn", label: "Пополнить счёт" },
    { id: "cashOut", label: "Снять" },
    { id: "transfer", label: "Перевести" },
    { id: "topUpBilimZone", label: "Пополнить BilimZone" },
    { id: "pay", label: "Оплатить" },
  ];

  return (
    <main className="page">
      <section className="hero">
        <div>
          <div className="badge">
            <Building2 size={17} />
            Fake Bank
          </div>

          <h1>BilimZone Bank</h1>

          <p>
            Отдельный банковский сервис для тестирования счетов, карт,
            пополнений, выводов, платежей и кодов подтверждения BilimZone.
          </p>
        </div>

        <div className="heroActions">
          {mode === "bankPanel" && (
            <button className="logout" onClick={bankLogout}>
              <LogOut size={18} />
              Выйти из банка
            </button>
          )}

          {mode === "userPanel" && (
            <button className="logout" onClick={logout}>
              <LogOut size={18} />
              Выйти
            </button>
          )}
        </div>
      </section>

      {(message || error) && (
        <div className={error ? "alert error" : "alert success"}>
          {error || message}
        </div>
      )}

      {mode === "select" && (
        <section className="selectGrid">
          <button className="choiceCard" onClick={() => setMode("bankLogin")}>
            <div className="choiceIcon">
              <Landmark size={34} />
            </div>

            <h2>Войти как банк</h2>

            <p>Админ-панель банка: список клиентов и регистрация клиентов.</p>
          </button>

          <button className="choiceCard" onClick={() => setMode("userLogin")}>
            <div className="choiceIcon">
              <Wallet size={34} />
            </div>

            <h2>Войти как пользователь</h2>

            <p>Личный кабинет клиента банка по телефону и паролю.</p>
          </button>
        </section>
      )}

      {mode === "bankLogin" && (
        <section className="authGrid single">
          <div className="card">
            <h2>
              <ShieldCheck size={22} />
              Вход банка
            </h2>

            <label>Логин банка</label>
            <input
              value={bankLogin}
              onChange={(e) => setBankLogin(e.target.value)}
              placeholder="bank"
            />

            <label>Пароль</label>
            <input
              type="password"
              value={bankPassword}
              onChange={(e) => setBankPassword(e.target.value)}
              placeholder="bank123"
            />

            <button className="primary" onClick={handleBankLogin}>
              Войти в банк
            </button>

            <button className="ghost" onClick={() => setMode("select")}>
              Назад
            </button>
          </div>
        </section>
      )}

      {mode === "userLogin" && (
        <section className="authGrid single">
          <div className="card">
            <h2>
              <Wallet size={22} />
              Вход пользователя
            </h2>

            <label>Телефон</label>
            <input
              value={loginPhone}
              onChange={(e) => setLoginPhone(e.target.value)}
              placeholder="+996700000001"
            />

            <label>Пароль</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="12345678"
            />

            <button className="primary" onClick={userLogin} disabled={loading}>
              {loading ? "Загрузка..." : "Войти"}
            </button>

            <button className="ghost" onClick={() => setMode("select")}>
              Назад
            </button>
          </div>
        </section>
      )}

      {mode === "bankPanel" && (
        <section className="bankPanelGrid">
          <div className="card">
            <h2>
              <UserPlus size={22} />
              Регистрация клиента
            </h2>

            <label>ФИО</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Aidanek Kadyrova"
            />

            <label>Телефон</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+996700000009"
            />

            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@gmail.com"
            />

            <label>Пароль</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="12345678"
            />

            <label>Начальный баланс KGS</label>
            <input
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              placeholder="10000"
            />

            <label>ID пользователя BilimZone, если есть</label>
            <input
              value={bilimzoneUserId}
              onChange={(e) => setBilimzoneUserId(e.target.value)}
              placeholder="Например: 1"
            />

            <button
              className="primary"
              onClick={createCustomerFromBank}
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать клиента"}
            </button>
          </div>

          <div className="card">
            <div className="sectionHeader">
              <h2>
                <Users size={22} />
                Клиенты банка
              </h2>

              <button className="smallBtn" onClick={loadCustomers}>
                Обновить
              </button>
            </div>

            {customers.length === 0 ? (
              <p className="muted">Клиентов пока нет</p>
            ) : (
              <div className="customerList">
                {customers.map((item) => {
                  const itemAccount = item.accounts?.[0];
                  const itemCard = itemAccount?.card;

                  return (
                    <div className="customerItem" key={item.id}>
                      <div>
                        <strong>{item.full_name}</strong>
                        <p>{item.phone}</p>
                        <p>{item.email || "—"}</p>
                        <p className="muted">
                          BilimZone ID:{" "}
                          {item.external_bilimzone_user_id || "не связан"}
                        </p>
                      </div>

                      <div className="customerRight">
                        <strong>
                          {Number(itemAccount?.balance || 0).toLocaleString(
                            "ru-RU"
                          )}{" "}
                          KGS
                        </strong>
                        <p>{itemCard?.card_number || "Нет карты"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {mode === "userPanel" && customer && account && card && (
        <>
          <section className="dashboardGrid">
            <div className="card profile">
              <h2>Клиент банка</h2>

              <p className="big">{customer.full_name}</p>
              <p>{customer.phone}</p>
              <p>{customer.email || "—"}</p>

              <p className="muted">
                BilimZone ID:{" "}
                {customer.external_bilimzone_user_id || "не связан"}
              </p>
            </div>

            <div className="card account">
              <h2>Счёт KGS</h2>

              <div className="copyRow">
                <p className="big">{account.account_number}</p>

                <button onClick={() => copy(account.account_number)}>
                  <Copy size={16} />
                </button>
              </div>

              <p className="muted">{account.currency}</p>

              <div className="balance">
                <span>Баланс</span>
                <strong>{balanceText} KGS</strong>
              </div>
            </div>

            <div className="bankCard">
              <div className="bankTop">
                <CreditCard />
                <span>BilimZone Bank</span>
              </div>

              <div className="copyRow">
                <p className="cardNumber">{card.card_number}</p>

                <button onClick={() => copy(card.card_number)}>
                  <Copy size={16} />
                </button>
              </div>

              <p>{card.card_holder}</p>

              <p>
                {String(card.expiry_month).padStart(2, "0")}/{card.expiry_year} ·
                CVV {card.cvv}
              </p>
            </div>
          </section>

          <section className="card codesCard">
            <div className="sectionHeader">
              <h2>
                <KeyRound size={22} />
                Коды подтверждения
              </h2>

              <button
                className="smallBtn"
                onClick={() => loadPendingCodes(customer.id)}
              >
                <RefreshCcw size={16} />
                Обновить
              </button>
            </div>

            {pendingCodes.length === 0 ? (
              <p className="muted">
                Новых кодов нет. Когда вы запросите пополнение или вывод на
                сайте BilimZone, код появится здесь.
              </p>
            ) : (
              <div className="codeList">
                {pendingCodes.map((item) => (
                  <div
                    className="codeItem"
                    key={`${item.card_number}-${item.created_at}`}
                  >
                    <div>
                      <strong>{item.masked_number}</strong>
                      <p>{item.card_holder}</p>
                      <p className="muted">{item.created_at}</p>
                    </div>

                    <div className="codeValue">{item.code}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mainGrid">
            <div className="card">
              <h2>Операции</h2>

              <div className="tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={activeTab === tab.id ? "tab activeTab" : "tab"}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <label>Сумма</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
              />

              {activeTab === "transfer" && (
                <>
                  <label>Карта получателя</label>

                  <input
                    value={toCard}
                    onChange={(e) => setToCard(e.target.value)}
                    placeholder="9964000000000002"
                  />
                </>
              )}

              <label>Описание</label>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Описание операции"
              />

              <button className="primary" onClick={execute} disabled={loading}>
                {loading ? "Выполняется..." : "Выполнить"}
              </button>
            </div>

            <div className="card">
              <h2>
                <ReceiptText size={22} />
                История операций
              </h2>

              {transactions.length === 0 ? (
                <p className="muted">Операций пока нет</p>
              ) : (
                <div className="txList">
                  {transactions.map((tx) => (
                    <div className="tx" key={tx.id}>
                      <div>
                        <strong>{tx.transaction_type}</strong>
                        <p>{tx.description || "—"}</p>
                        <small>
                          {new Date(tx.created_at).toLocaleString("ru-RU")}
                        </small>
                      </div>

                      <div className="txRight">
                        <span
                          className={tx.status === "SUCCESS" ? "good" : "bad"}
                        >
                          {tx.status}
                        </span>

                        <strong>
                          {Number(tx.amount).toLocaleString("ru-RU")} KGS
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}