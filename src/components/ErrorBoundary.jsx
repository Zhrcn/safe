'use client';
import { Component } from 'react';
import {Button} from '@/components/ui/Button';
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
                    <div className="bg-card border-2 border-danger/60 rounded-2xl shadow-xl p-8 max-w-lg w-full">
                        <h1 className="text-2xl font-extrabold mb-4 text-danger tracking-tight">
                            Oops! Something went wrong.
                        </h1>
                        <p className="text-muted-foreground mb-6 text-base">
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <Button
                            onClick={this.handleReset}
                            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow"
                        >
                            Try Again
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
} 