'use client';
import RegisterForm from '@/components/auth/RegisterForm';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
export default function RegisterPage() {
    const { t } = useTranslation();
    return (
        <div className="container max-w-4xl mx-auto mt-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground">
                        {t('register.join')}
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('register.createAccount')}
                    </p>
                </div>
            </motion.div>
            <RegisterForm />
        </div>
    );
} 