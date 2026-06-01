import { LoginForm } from '@/widgets/LoginForm/LoginForm';
import LoginBackgrnd from '@/assets/images/LoginBackgrnd.svg';
import LogoWhite from "@/assets/images/logo.svg";
import { BackButton } from '@/shared/ui/BackButton';

export const LoginPage = () => (
  <div className="flex min-h-screen bg-white font-sans">

    {/* 🔹 ФОРМА СЛЕВА */}
    <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">

      <div className="absolute top-4 right-4">
        <BackButton />
      </div>

      <LoginForm />
    </div>

    {/* 🔹 КАРТИНКА СПРАВА */}
    <div className="hidden lg:block w-1/2 relative">

      {/* 🔹 ЛОГО */}
      <div className='absolute z-40 my-6 mx-6'>
        <img src={LogoWhite} alt='Bilimzone Logo' />
      </div>

      {/* 🔹 КАРТИНКА */}
      <img
        src={LoginBackgrnd}
        alt="Education platform"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* 🔹 ОВЕРЛЕЙ */}
      <div className="absolute inset-0 bg-blue-950 opacity-40 mix-blend-multiply" />

      {/* 🔹 ТЕКСТ */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-bold">
            <span className="text-blue-900">BILIM</span>
            <span className="text-orange-500">ZONE</span>
          </h1>
          <p className="mt-4 text-xl text-white">
            Платформа для поиска, публикации и покупки учебных материалов
          </p>
        </div>
      </div>

    </div>

  </div>
);