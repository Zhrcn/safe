'use client';

import { Container, Typography, Box } from '@mui/material';
import RegisterForm from '@/components/auth/RegisterForm';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    return (
        <Container component="main" maxWidth="md" className="mt-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box className="text-center mb-8">
                    <Typography component="h1" variant="h3" className="font-bold text-foreground">
                        Join S.A.F.E
                    </Typography>
                    <Typography variant="body1" className="mt-2 text-muted-foreground">
                        Create your account to access our secure medical platform
                    </Typography>
                </Box>
            </motion.div>

            <RegisterForm />
        </Container>
    );
} 