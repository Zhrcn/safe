import React from "react";

const SpinnerCircle = ({ className }) => (
    <div className={`w-14 h-14 rounded-2xl absolute border-4 border-solid ${className}`}></div>
);

export default function LoadingSpinner() {
    return (
        <div
            className="flex items-center justify-center min-h-screen"
            role="status"
            aria-label="Loading"
        >
            <div className="relative">
                <SpinnerCircle className="border-muted animate-spin-slow shadow-inner" />
                <SpinnerCircle className="border-primary border-t-transparent animate-spin shadow-lg" />
            </div>
        </div>
    );
}