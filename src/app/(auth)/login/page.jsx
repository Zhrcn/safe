'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoginMutation } from '@/store/services/user/authApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Eye, EyeOff, Mail, Lock, Github, Twitter } from 'lucide-react';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/Checkbox';

const LoginPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [login, { isLoading }] = useLoginMutation();

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
                setError(result.message || 'Login failed');
            }
        } catch (error) {
            setError(error.message || 'Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo and Brand */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-primary mb-2">S.A.F.E</h1>
                    <p className="text-muted-foreground">Secure Access For Everyone</p>
                </div>

                <Card className="w-full shadow-lg border-0 rounded-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            Enter your credentials to access your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive" className="animate-in fade-in duration-300">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                    <Button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
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
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={setRememberMe}
                                    />
                                    <Label htmlFor="remember" className="text-sm text-gray-600">
                                        Remember me
                                    </Label>
                                </div>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {/* Handle GitHub login */}}
                                >
                                    <Github className="h-4 w-4 mr-2" />
                                    GitHub
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {/* Handle Twitter login */}}
                                >
                                    <Twitter className="h-4 w-4 mr-2" />
                                    Twitter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t pt-4">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                href="/register"
                                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage; 