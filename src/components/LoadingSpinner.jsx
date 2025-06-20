export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-screen" role="status" aria-label="Loading">
            <div className="relative">
                <div className="w-14 h-14 rounded-lg absolute border-4 border-solid border-muted animate-spin-slow shadow-inner"></div>
                <div className="w-14 h-14 rounded-lg animate-spin absolute border-4 border-solid border-primary border-t-transparent shadow-lg"></div>
            </div>
        </div>
    );
} 