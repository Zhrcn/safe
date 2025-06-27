'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/services/user/authApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/Checkbox';
import { useTranslation } from 'react-i18next';

const GoogleIcon = (props) => (
    <svg viewBox="0 0 24 24" width={16} height={16} {...props}>
        <g>
            <path fill="#4285F4" d="M21.805 10.023h-9.765v3.955h5.617c-.242 1.238-1.37 3.637-5.617 3.637-3.38 0-6.137-2.797-6.137-6.25s2.757-6.25 6.137-6.25c1.927 0 3.222.82 3.963 1.523l2.71-2.637C17.13 2.82 15.09 1.75 12.04 1.75 6.477 1.75 2 6.227 2 11.75s4.477 10 10.04 10c5.8 0 9.627-4.07 9.627-9.797 0-.66-.07-1.16-.162-1.68z"/>
            <path fill="#34A853" d="M3.153 7.345l3.27 2.4c.89-1.73 2.57-2.95 4.617-2.95 1.32 0 2.51.45 3.44 1.34l2.58-2.52C15.09 3.57 13.13 2.75 11.04 2.75c-3.38 0-6.137 2.797-6.137 6.25 0 1.01.25 1.97.69 2.845z"/>
            <path fill="#FBBC05" d="M12.04 21.75c2.7 0 4.97-.89 6.63-2.42l-3.06-2.51c-.82.56-1.87.89-3.57.89-2.74 0-5.07-1.85-5.91-4.36l-3.22 2.49c1.66 3.27 5.13 5.81 9.13 5.81z"/>
            <path fill="#EA4335" d="M21.805 10.023h-9.765v3.955h5.617c-.242 1.238-1.37 3.637-5.617 3.637-3.38 0-6.137-2.797-6.137-6.25s2.757-6.25 6.137-6.25c1.927 0 3.222.82 3.963 1.523l2.71-2.637C17.13 2.82 15.09 1.75 12.04 1.75 6.477 1.75 2 6.227 2 11.75s4.477 10 10.04 10c5.8 0 9.627-4.07 9.627-9.797 0-.66-.07-1.16-.162-1.68z" opacity=".1"/>
        </g>
    </svg>
);

const FacebookIcon = (props) => (
    <svg viewBox="0 0 24 24" width={16} height={16} {...props}>
        <g>
            <circle cx="12" cy="12" r="12" fill="#1877F3"/>
            <path d="M15.67 12.13h-2.02v6.13h-2.5v-6.13H9.01v-2.13h2.14V8.98c0-1.77 1.06-2.75 2.68-2.75.78 0 1.6.14 1.6.14v1.77h-.9c-.89 0-1.17.55-1.17 1.12v1.24h2.29l-.37 2.13z" fill="#fff"/>
        </g>
    </svg>
);

function getMedicalPattern(primary, accent, warning, error, background) {

    const svg = `
<svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g opacity="0.08">
    <rect x="25" y="0" width="10" height="30" rx="5" fill="${primary}"/>
    <rect x="0" y="25" width="30" height="10" rx="5" fill="${primary}"/>
    <circle cx="45" cy="45" r="8" stroke="${accent}" stroke-width="3" fill="none"/>
    <path d="M50 50 Q45 55 40 50" stroke="${error}" stroke-width="2" fill="none"/>
    <rect x="40" y="10" width="8" height="8" rx="2" fill="${warning}"/>
    <rect x="12" y="40" width="8" height="8" rx="2" fill="${warning}"/>
    <path d="M10 10 Q15 5 20 10" stroke="${error}" stroke-width="2" fill="none"/>
  </g>
</svg>
    `.replace(/\n/g, '').replace(/\s+/g, ' ');
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

import { useEffect, useState as useReactState } from 'react';

function getCssVar(name, fallback) {
    if (typeof window === 'undefined') return fallback;
    const val = getComputedStyle(document.documentElement).getPropertyValue(name);
    return val ? val.trim() : fallback;
}

const LoginPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [login, { isLoading }] = useLoginMutation();

    const [pattern, setPattern] = useReactState('');

    useEffect(() => {
        const primary = getCssVar('--primary', '#00b894');
        const accent = getCssVar('--accent', '#0098c3');
        const warning = getCssVar('--warning', '#fdcb6e');
        const errorColor = getCssVar('--destructive', '#d63031');
        const background = getCssVar('--background', '#ffffff');
        setPattern(getMedicalPattern(primary, accent, warning, errorColor, background));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login({ email, password }).unwrap();
            if (result.success) {
                if (result.user.role === 'patient') {
                    router.push('/patient/dashboard');
                } else if (result.user.role === 'doctor') {
                    router.push('/doctor/dashboard');
                } else if (result.user.role === 'admin') {
                    router.push('/admin/dashboard');
                }
            } else {
                setError(result.message || t('login.error'));
            }
        } catch (error) {
            setError(error.message || t('login.invalid'));
        }
    };

    const backgroundStyle = {
        backgroundColor: 'var(--background)',
        backgroundImage: pattern,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        minHeight: '100vh',
        transition: 'background 0.3s',
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
            style={backgroundStyle}
        >
            <div className="w-full max-w-md space-y-8">
                <div className="text-center mb-4">
                    <h1 className="text-4xl font-extrabold text-primary mb-1 tracking-tight">{t('appName')}</h1>
                    <p className="text-base text-muted-foreground">{t('login.brand')}</p>
                </div>
                <Card className="w-full shadow-xl border border-border rounded-2xl bg-white/90 dark:bg-background/90">
                    <CardHeader className="space-y-2 pb-0">
                        <CardTitle className="text-2xl font-bold text-center text-primary">
                            {t('login.welcome')}
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            {t('login.enterCredentials')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert variant="destructive" className="animate-in fade-in duration-300">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-primary">{t('login.email')}</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t('login.emailPlaceholder')}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-sm font-medium text-primary">{t('login.password')}</Label>
                                <div className="relative mt-1">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder={t('login.passwordPlaceholder')}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                    <Button
                                        type="button"
                                        tabIndex={-1}
                                        onClick={() => setShowPassword(!showPassword)}
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={setRememberMe}
                                    />
                                    <Label htmlFor="remember" className="text-sm text-muted-foreground">
                                        {t('login.rememberMe')}
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline font-medium"
                                >
                                    {t('login.forgotPassword')}
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors rounded-lg py-2"
                                disabled={isLoading}
                            >
                                {isLoading ? t('login.signingIn') : t('login.signIn')}
                            </Button>

                            <div className="flex items-center gap-2 my-2">
                                <div className="flex-1 border-t border-border" />
                                <span className="text-xs text-muted-foreground px-2">{t('login.orContinue')}</span>
                                <div className="flex-1 border-t border-border" />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-1/2 border-border text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors rounded-lg"
                                    onClick={() => {}}
                                >
                                    <GoogleIcon className="mr-1" />
                                    <span>{t('login.google', { defaultValue: 'Google' })}</span>
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-1/2 border-border text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors rounded-lg"
                                    onClick={() => {}}
                                >
                                    <FacebookIcon className="mr-1" />
                                    <span>{t('login.facebook', { defaultValue: 'Facebook' })}</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t pt-4 bg-transparent">
                        <p className="text-sm text-muted-foreground">
                            {t('login.noAccount')}{' '}
                            <Link
                                href="/register"
                                className="text-primary hover:underline font-semibold"
                            >
                                {t('signup', { defaultValue: 'Sign Up' })}
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;