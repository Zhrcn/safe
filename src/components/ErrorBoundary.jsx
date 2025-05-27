'use client';

import { Component } from 'react';
import { Box, Typography, Button } from '@mui/material';

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
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '100vh',
                        p: 3,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Oops! Something went wrong.
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.handleReset}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
} 