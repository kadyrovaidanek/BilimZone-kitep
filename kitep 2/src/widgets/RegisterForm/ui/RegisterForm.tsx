import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaChevronLeft, FaUserCircle, FaHome } from 'react-icons/fa';

interface StepInfo {
    number: number;
    title: string;
    icon: React.ElementType;
}

interface RegisterFormProps {
    steps: StepInfo[];
    currentStep: number;
    stepComponent: React.ReactNode;
    isRegistered: boolean;
    isLoading: boolean;
    onPrev: () => void;
    onNext: () => void;
    submitButtonText: string;
}

export const RegisterForm = ({
    steps,
    currentStep,
    stepComponent,
    isRegistered,
    isLoading,
    onPrev,
    submitButtonText,
}: RegisterFormProps) => {
    const { t } = useTranslation();

    const MobileProgress = () => {
        const progressPercentage = ((currentStep + 1) / steps.length) * 100;
        const currentStepInfo = steps[currentStep];

        return (
            <div className="md:hidden w-full mb-6">
                <div className="text-sm text-gray-600 mb-2">
                    {t('register_form.step_indicator', {
                        current: currentStep + 1,
                        total: steps.length,
                    })}
                    : <span className="font-semibold text-gray-800">{currentStepInfo.title}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                        className="bg-blue-600 h-2 rounded-full"
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                </div>
            </div>
        );
    };

    return (
        <div className="w-full min-h-[600px] sm:min-h-[550px] max-w-4xl mx-auto bg-white rounded-xl shadow-lg flex flex-col md:flex-row">
            <aside className="hidden md:block w-full md:w-1/3 bg-blue-50 p-8 rounded-l-xl">
                <span className="font-bold text-xl">
                    <span className="text-blue-900">BILIM</span>
                    <span className="text-orange-500">ZONE</span>
                </span>

                <nav className="mt-8">
                    <ul>
                        <AnimatePresence>
                            {steps.map((step, index) => (
                                <motion.li
                                    key={step.number + step.title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="flex items-start mb-6"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${currentStep === index
                                                ? 'bg-blue-600 text-white'
                                                : currentStep > index
                                                    ? 'bg-green-400 text-white'
                                                    : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {currentStep > index ? <FaCheckCircle /> : step.number}
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">{step.number}</p>
                                        <p className={`font-semibold ${currentStep === index ? 'text-gray-800' : 'text-gray-600'}`}>
                                            {step.title}
                                        </p>
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </nav>
            </aside>

            <main className="w-full md:w-2/3 p-4 sm:p-6 md:p-8 flex flex-col">
                {isRegistered ? (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                className="text-green-500 mb-6"
                            >
                                <FaCheckCircle className="text-8xl mx-auto" />
                            </motion.div>

                            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                                {t('register_form.messages.registration_complete')}
                            </h2>

                            <p className="text-lg text-gray-600">
                                {t('register_form.messages.redirecting')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow flex flex-col">
                            <MobileProgress />

                            <header className="flex justify-between items-center mb-8 h-8">
                                <div>
                                    {currentStep > 0 ? (
                                        <button
                                            type="button"
                                            onClick={onPrev}
                                            className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            <FaChevronLeft className="mr-2" /> {t('register_form.buttons.back')}
                                        </button>
                                    ) : (
                                        <Link
                                            to="/"
                                            className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                                        >
                                            <FaHome className="mr-2" /> {t('register_form.buttons.home')}
                                        </Link>
                                    )}
                                </div>

                                <div className="hidden sm:flex items-center text-sm">
                                    <FaUserCircle className="w-6 h-6 mr-2 text-gray-400" />
                                    <span className="font-semibold text-gray-700">
                                        {t('register_form.new_user')}
                                    </span>
                                </div>
                            </header>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ duration: 0.4, type: 'tween' }}
                                    className="flex-grow"
                                >
                                    {stepComponent}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <footer className="mt-auto pt-6 border-t border-gray-200 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto px-8 py-3 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? t('register_form.loading') : submitButtonText}
                            </button>
                        </footer>
                    </>
                )}
            </main>
        </div>
    );
};