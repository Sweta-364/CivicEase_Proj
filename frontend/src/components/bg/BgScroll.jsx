"use client";

import { useEffect, useRef, useState, createContext, useContext } from "react";
import { useScroll, useTransform, motion, useMotionValueEvent } from "motion/react";

const FRAME_COUNT = 240;

// Context to share scroll progress with children
export const ScrollContext = createContext(null);

export function useScrollContext() {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScrollContext must be used within BgScroll");
    }
    return context;
}

// Generate image paths
const getFramePath = (index) => {
    const frameNumber = String(index + 1).padStart(3, "0");
    return `/hero-sequence-2/ezgif-frame-${frameNumber}.jpg`;
};

export default function BgScroll({ children }) {
    const containerRef = useRef(null);
    const imgRef = useRef(null);
    const imagesRef = useRef([]); // Store preloaded Image objects in a ref (no re-renders)
    const [isLoading, setIsLoading] = useState(true);
    const [loadProgress, setLoadProgress] = useState(0);

    // Scroll progress mapped to container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Transform scroll progress to frame index
    const frameIndex = useTransform(
        scrollYProgress,
        [0, 1],
        [0, FRAME_COUNT - 1]
    );

    // Preload all images into memory
    useEffect(() => {
        let loaded = 0;
        const loadedImages = new Array(FRAME_COUNT);

        const promises = Array.from({ length: FRAME_COUNT }, (_, i) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = getFramePath(i);
                img.onload = () => {
                    loaded++;
                    setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
                    loadedImages[i] = img;
                    resolve(img);
                };
                img.onerror = reject;
            });
        });

        Promise.all(promises)
            .then(() => {
                imagesRef.current = loadedImages;
                setIsLoading(false);
                // Show the first frame
                if (imgRef.current && loadedImages[0]) {
                    imgRef.current.src = loadedImages[0].src;
                }
            })
            .catch((error) => {
                console.error("Failed to load images:", error);
            });
    }, []);

    // Swap the <img> src on scroll — single img element, no DOM churn
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const idx = Math.round(latest);
        const img = imagesRef.current[idx];
        if (img && imgRef.current) {
            imgRef.current.src = img.src;
        }
    });

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-black">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#060918]">
                    <div className="relative h-16 w-16">
                        <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-800 border-t-cyan-500" />
                    </div>
                    <p className="mt-4 font-sans text-sm tracking-wider text-slate-400">
                        Loading experience... {loadProgress}%
                    </p>
                    <div className="mt-3 h-1 w-48 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                            className="h-full bg-cyan-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${loadProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            )}

            {/* Sticky Image Background — single <img> element, src swapped on scroll */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
                <img
                    ref={imgRef}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                        opacity: isLoading ? 0 : 1,
                        transition: "opacity 0.8s ease-out",
                        imageRendering: "high-quality",
                        transform: "translateZ(0)",
                        willChange: "transform"
                    }}
                    draggable={false}
                />
                {/* Minimal vignette — just enough to keep text readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-x-0 top-0 pt-40 pb-64 pointer-events-none">
                <ScrollContext.Provider value={{ scrollYProgress }}>
                    <div className="pointer-events-auto relative z-10">{children}</div>
                </ScrollContext.Provider>
            </div>
        </div>
    );
}
