/**
 * Premium skeleton and loader components for CivicEase dashboard.
 * Drop-in replacements for boring "Loading..." text.
 */

/* ── Base shimmer skeleton bar ── */
export function Skeleton({ className = '' }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
            style={{ animationDuration: '1.5s' }}
        />
    );
}

/* ── Card skeleton (for issue cards, community posts, resource cards) ── */
export function CardSkeleton({ lines = 3, showBadge = true, showImage = false }) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-4">
            <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-3/5" />
                {showBadge && <Skeleton className="h-6 w-20 rounded-full" />}
            </div>
            {showImage && <Skeleton className="h-40 w-full rounded-lg" />}
            <div className="space-y-2">
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton key={i} className={`h-3.5 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
                ))}
            </div>
            <Skeleton className="h-3 w-2/5" />
        </div>
    );
}

/* ── Issue Detail skeleton ── */
export function IssueDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-2/3" />
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex flex-wrap gap-3 mt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-7 w-28 rounded-full" />
                    ))}
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-48 rounded-2xl" />
            </div>
        </div>
    );
}

/* ── Dashboard Overview skeleton ── */
export function DashboardOverviewSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20">
            {/* Quick Actions */}
            <Skeleton className="md:col-span-7 h-28 rounded-xl" />
            <Skeleton className="md:col-span-5 h-28 rounded-xl" />
            {/* Stats + Quick Links */}
            <div className="md:col-span-4 flex flex-col gap-8">
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-3">
                    <Skeleton className="h-3 w-24" />
                    <div className="flex justify-between">
                        <Skeleton className="h-10 w-16" />
                        <Skeleton className="h-10 w-16" />
                    </div>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-3 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-16" />
                </div>
            </div>
            <div className="md:col-span-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-4">
                <Skeleton className="h-6 w-32" />
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}

/* ── Resource Grid skeleton ── */
export function ResourceGridSkeleton({ count = 6 }) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 space-y-4">
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ── Spinner with message (for form submissions) ── */
export function SpinnerWithMessage({ message = 'Processing...', size = 'md' }) {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-6 w-6 border-[3px]',
        lg: 'h-8 w-8 border-[3px]',
    };

    return (
        <span className="inline-flex items-center gap-2.5">
            <span
                className={`${sizeClasses[size]} animate-spin rounded-full border-gray-300 border-t-sky-500`}
            />
            <span className="text-sm font-medium text-gray-600">{message}</span>
        </span>
    );
}

/* ── Typing indicator for AI chat ── */
export function TypingIndicator() {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start gap-3">
                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gray-600 ring-1 ring-gray-200">
                    AI
                </span>
                <div className="flex items-center gap-1.5 pt-1">
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}

/* ── Community Post Page skeleton ── */
export function PostDetailSkeleton() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-3/4" />
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-3 mt-4">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-3 w-32 self-center" />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton className="h-5 w-28" />
                {[1, 2].map((i) => (
                    <div key={i} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                ))}
            </div>
        </div>
    );
}
