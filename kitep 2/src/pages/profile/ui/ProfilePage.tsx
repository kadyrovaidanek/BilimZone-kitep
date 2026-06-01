import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/entities/user/model/useAuth";
import { getProfile, updateProfile } from "@/shared/api/auth";
import {
  Eye,
  EyeOff,
  Star,
  ShoppingBag,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  LogOut,
  Save,
  Camera,
} from "lucide-react";

const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];

type ProfileInnerData = {
  surname?: string;
  first_name?: string;
  father_name?: string;
  phone_number?: string;

  specialization?: string;
  bio?: string;

  organization_name?: string;
  full_name?: string;
  address?: string;
  website?: string;

  photo?: string | null;

  rating?: number | string;
  total_sales?: number;
};

type ProfileData = {
  id: number;
  email: string;
  username: string;
  role: "reader" | "author" | "organization" | "manager_admin" | string;
  profile?: ProfileInnerData | null;
};

type FormState = {
  email: string;
  username: string;

  surname: string;
  first_name: string;
  father_name: string;
  phone_number: string;

  specialization: string;
  bio: string;

  organization_name: string;
  full_name: string;
  address: string;
  website: string;

  old_password: string;
  new_password: string;

  photoFile: File | null;
  photoPreview: string | null;
};

const emptyForm: FormState = {
  email: "",
  username: "",

  surname: "",
  first_name: "",
  father_name: "",
  phone_number: "",

  specialization: "",
  bio: "",

  organization_name: "",
  full_name: "",
  address: "",
  website: "",

  old_password: "",
  new_password: "",

  photoFile: null,
  photoPreview: null,
};

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  textarea = false,
  icon,
  placeholder,
  currentValue,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  textarea?: boolean;
  icon?: React.ReactNode;
  placeholder?: string;
  currentValue?: string;
}) => {
  if (textarea) {
    return (
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-slate-700">
          {label}
        </span>

        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            min-h-[110px] w-full rounded-2xl border border-slate-200 bg-white
            px-4 py-3 text-sm text-slate-800 outline-none
            placeholder:text-slate-400 focus:border-blue-400 focus:ring-2
            focus:ring-blue-100 transition
          "
        />

        {currentValue && (
          <p className="mt-1 text-xs text-slate-400">Сейчас: {currentValue}</p>
        )}
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full rounded-2xl border border-slate-200 bg-white
            px-4 py-3 text-sm text-slate-800 outline-none
            placeholder:text-slate-400 focus:border-blue-400
            focus:ring-2 focus:ring-blue-100 transition
            ${icon ? "pl-11" : ""}
          `}
        />
      </div>

      {currentValue && (
        <p className="mt-1 text-xs text-slate-400">Сейчас: {currentValue}</p>
      )}
    </label>
  );
};

const PasswordField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) => {
  const [show, setShow] = useState(false);

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full rounded-2xl border border-slate-200 bg-white
            px-4 py-3 pr-12 text-sm text-slate-800 outline-none
            placeholder:text-slate-400 focus:border-blue-400
            focus:ring-2 focus:ring-blue-100 transition
          "
        />

        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

    </label>
  );
};

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const role = profile?.role || user?.role;
  const roleLabel = role ? t(`profile.roles.${role}`) : "";

  const initials = useMemo(() => {
    const source =
      form.first_name ||
      form.organization_name ||
      form.username ||
      form.email ||
      "U";

    return source.slice(0, 1).toUpperCase();
  }, [form.first_name, form.organization_name, form.username, form.email]);

  const fullName = useMemo(() => {
    const name = `${form.surname} ${form.first_name} ${form.father_name}`.trim();

    if (role === "organization") {
      return form.organization_name || form.full_name || form.username;
    }

    return name || form.username || form.email;
  }, [form, role]);

  const update = (field: keyof FormState, value: string | File | null) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const validatePassword = () => {
    if (!form.new_password && !form.old_password) {
      return "";
    }

    if (form.new_password && !form.old_password) {
      return t("profile.passwordErrors.oldPasswordRequired");
    }

    if (form.old_password && !form.new_password) {
      return t("profile.passwordErrors.newPasswordRequired");
    }

    if (form.new_password.length < 8) {
      return t("profile.passwordErrors.minLength");
    }

    if (!/[A-Za-zА-Яа-яЁё]/.test(form.new_password)) {
      return t("profile.passwordErrors.letter");
    }

    if (!/\d/.test(form.new_password)) {
      return t("profile.passwordErrors.number");
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.new_password)) {
      return t("profile.passwordErrors.special");
    }

    return "";
  };
  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await getProfile(user.id);
      const data: ProfileData = res.data;

      setProfile(data);

      setForm({
        email: data.email || "",
        username: data.username || "",

        surname: data.profile?.surname || "",
        first_name: data.profile?.first_name || "",
        father_name: data.profile?.father_name || "",
        phone_number: data.profile?.phone_number || "",

        specialization: data.profile?.specialization || "",
        bio: data.profile?.bio || "",

        organization_name: data.profile?.organization_name || "",
        full_name: data.profile?.full_name || "",
        address: data.profile?.address || "",
        website: data.profile?.website || "",

        old_password: "",
        new_password: "",

        photoFile: null,
        photoPreview: data.profile?.photo || null,
      });
    } catch (error) {
      console.log("PROFILE LOAD ERROR:", error);
      setFormError(t("profile.error"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      setFormError(t("profile.photoError"));
      setSuccessMessage("");
      e.target.value = "";
      return;
    }

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      photoFile: file,
      photoPreview: preview,
    }));
  };

  const handleSave = async () => {
    if (!user?.id) return;

    const passwordValidationError = validatePassword();

    if (passwordValidationError) {
      setFormError(passwordValidationError);
      setSuccessMessage("");
      return;
    }

    try {
      setSaving(true);
      setFormError("");
      setSuccessMessage("");

      const fd = new FormData();

      fd.append("email", form.email);
      fd.append("username", form.username);

      fd.append("surname", form.surname);
      fd.append("first_name", form.first_name);
      fd.append("father_name", form.father_name);
      fd.append("phone_number", form.phone_number);

      fd.append("specialization", form.specialization);
      fd.append("bio", form.bio);

      fd.append("organization_name", form.organization_name);
      fd.append("full_name", form.full_name);
      fd.append("address", form.address);
      fd.append("website", form.website);

      if (form.old_password) {
        fd.append("old_password", form.old_password);
      }

      if (form.new_password) {
        fd.append("new_password", form.new_password);
      }

      if (form.photoFile) {
        fd.append("photo", form.photoFile);
      }

      const res = await updateProfile(user.id, fd);
      const updatedProfile: ProfileData = res.data;

      setProfile(updatedProfile);

      setForm((prev) => ({
        ...prev,
        old_password: "",
        new_password: "",
        photoFile: null,
        photoPreview: updatedProfile.profile?.photo || prev.photoPreview,
      }));

      setSuccessMessage(t("profile.saved"));
    } catch (error: any) {
      console.log("PROFILE SAVE ERROR:", error?.response?.data || error);

      const data = error?.response?.data;

      if (data?.username) {
        setFormError(Array.isArray(data.username) ? data.username[0] : data.username);
      } else if (data?.email) {
        setFormError(Array.isArray(data.email) ? data.email[0] : data.email);
      } else if (data?.password) {
        setFormError(Array.isArray(data.password) ? data.password[0] : data.password);
      } else if (data?.old_password) {
        setFormError(
          Array.isArray(data.old_password)
            ? data.old_password[0]
            : data.old_password,
        );
      } else if (data?.new_password) {
        setFormError(
          Array.isArray(data.new_password)
            ? data.new_password[0]
            : data.new_password,
        );
      } else if (data?.error) {
        setFormError(Array.isArray(data.error) ? data.error[0] : data.error);
      } else {
        setFormError(t("profile.error"));
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">{t("profile.notAuthorized")}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">{t("profile.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-black text-slate-900 sm:text-4xl">
            {t("profile.title")}
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            {t("profile.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr] lg:gap-8">
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
              <div className="flex h-28 items-end justify-center bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 sm:h-36">
                <div className="h-24 w-24 translate-y-10 rounded-3xl bg-white p-1 shadow-lg">
                  {form.photoPreview ? (
                    <img
                      src={form.photoPreview}
                      alt="profile"
                      className="h-full w-full rounded-[20px] object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[20px] bg-blue-700 text-4xl font-black text-white">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 pb-6 pt-14 text-center sm:px-6">
                <h2 className="break-words text-xl font-black text-slate-900">
                  {fullName}
                </h2>

                <p className="mt-1 break-words text-sm text-slate-400">
                  {form.email}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                  {role === "organization" ? (
                    <Building2 size={16} />
                  ) : (
                    <User size={16} />
                  )}
                  {roleLabel}
                </div>

                <div className="mt-5">
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border-2 border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50">
                    <Camera size={18} />

                    {role === "organization"
                      ? t("profile.changeLogo")
                      : t("profile.changePhoto")}

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-2 text-xs text-slate-400">
                    {t("profile.photoHint")}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={logout}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <LogOut size={18} />
                  {t("profile.logout")}
                </button>
              </div>
            </section>

            {role === "author" && (
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-4 text-lg font-black text-slate-900">
                  {t("profile.sections.stats")}
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-yellow-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                      <Star size={18} />
                      <span className="font-black">
                        {profile?.profile?.rating || "0"}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {t("profile.fields.rating")}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-orange-500">
                      <ShoppingBag size={18} />
                      <span className="font-black">
                        {profile?.profile?.total_sales || 0}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {t("profile.fields.sales")}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl">
                {t("profile.sections.account")}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field
                  label={t("profile.fields.email")}
                  value={form.email}
                  placeholder={t("profile.fields.email")}
                  currentValue={profile?.email}
                  onChange={(value) => update("email", value)}
                  icon={<Mail size={18} />}
                />

                <Field
                  label={t("profile.fields.username")}
                  value={form.username}
                  placeholder={t("profile.fields.username")}
                  currentValue={profile?.username}
                  onChange={(value) => update("username", value)}
                  icon={<User size={18} />}
                />
              </div>
            </section>

            {(role === "reader" || role === "author") && (
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl">
                  {role === "author"
                    ? t("profile.sections.author")
                    : t("profile.sections.personal")}
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label={t("profile.fields.surname")}
                    value={form.surname}
                    placeholder={t("profile.fields.surname")}
                    currentValue={profile?.profile?.surname}
                    onChange={(value) => update("surname", value)}
                  />

                  <Field
                    label={t("profile.fields.firstName")}
                    value={form.first_name}
                    placeholder={t("profile.fields.firstName")}
                    currentValue={profile?.profile?.first_name}
                    onChange={(value) => update("first_name", value)}
                  />

                  <Field
                    label={t("profile.fields.fatherName")}
                    value={form.father_name}
                    placeholder={t("profile.fields.fatherName")}
                    currentValue={profile?.profile?.father_name}
                    onChange={(value) => update("father_name", value)}
                  />

                  <Field
                    label={t("profile.fields.phone")}
                    value={form.phone_number}
                    placeholder={t("profile.fields.phone")}
                    currentValue={profile?.profile?.phone_number}
                    onChange={(value) => update("phone_number", value)}
                    icon={<Phone size={18} />}
                  />

                  {role === "author" && (
                    <>
                      <Field
                        label={t("profile.fields.specialization")}
                        value={form.specialization}
                        placeholder={t("profile.fields.specialization")}
                        currentValue={profile?.profile?.specialization}
                        onChange={(value) => update("specialization", value)}
                      />

                      <div className="md:col-span-2">
                        <Field
                          label={t("profile.fields.bio")}
                          value={form.bio}
                          placeholder={t("profile.fields.bio")}
                          currentValue={profile?.profile?.bio}
                          onChange={(value) => update("bio", value)}
                          textarea
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {role === "organization" && (
              <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl">
                  {t("profile.sections.organization")}
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field
                    label={t("profile.fields.organizationName")}
                    value={form.organization_name}
                    placeholder={t("profile.fields.organizationName")}
                    currentValue={profile?.profile?.organization_name}
                    onChange={(value) => update("organization_name", value)}
                    icon={<Building2 size={18} />}
                  />

                  <Field
                    label={t("profile.fields.fullName")}
                    value={form.full_name}
                    placeholder={t("profile.fields.fullName")}
                    currentValue={profile?.profile?.full_name}
                    onChange={(value) => update("full_name", value)}
                    icon={<Building2 size={18} />}
                  />

                  <div className="md:col-span-2">
                    <Field
                      label={t("profile.fields.bio")}
                      value={form.bio}
                      placeholder={t("profile.fields.bio")}
                      currentValue={profile?.profile?.bio}
                      onChange={(value) => update("bio", value)}
                      textarea
                    />
                  </div>

                  <Field
                    label={t("profile.fields.address")}
                    value={form.address}
                    placeholder={t("profile.fields.address")}
                    currentValue={profile?.profile?.address}
                    onChange={(value) => update("address", value)}
                    icon={<MapPin size={18} />}
                  />

                  <Field
                    label={t("profile.fields.website")}
                    value={form.website}
                    placeholder={t("profile.fields.website")}
                    currentValue={profile?.profile?.website}
                    onChange={(value) => update("website", value)}
                    icon={<Globe size={18} />}
                  />
                </div>
              </section>
            )}

            <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-5 text-xl font-black text-slate-900 sm:text-2xl">
                {t("profile.sections.password")}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <PasswordField
                  label={t("profile.fields.oldPassword")}
                  placeholder={t("profile.fields.oldPassword")}
                  value={form.old_password}
                  onChange={(value) => update("old_password", value)}
                />

                <PasswordField
                  label={t("profile.fields.newPassword")}
                  placeholder={t("profile.fields.newPassword")}
                  value={form.new_password}
                  onChange={(value) => update("new_password", value)}
                />
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {t("profile.passwordHint")}
              </p>
            </section>
            {formError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600">
                {formError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-700">
                {successMessage}
              </div>
            )}
            <div className="sticky bottom-4 z-20">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="
                  flex w-full items-center justify-center gap-2 rounded-2xl
                  bg-orange-500 px-6 py-4 font-black text-white
                  shadow-lg shadow-orange-200 transition hover:bg-orange-600
                  disabled:bg-orange-300
                "
              >
                <Save size={20} />
                {saving ? t("profile.saving") : t("profile.save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;