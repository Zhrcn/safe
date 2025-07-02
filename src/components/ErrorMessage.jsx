export default function ErrorMessage({ message }) {
    return (
        <div className="flex items-center justify-center min-h-screen" role="alert" aria-live="assertive">
            <div className="bg-destructive/10 border-2 border-destructive text-destructive px-6 py-4 rounded-2xl shadow-lg max-w-md w-full">
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="font-semibold text-base">{message}</p>
                </div>
            </div>
        </div>
    );
} 