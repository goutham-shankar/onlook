'use client';

import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import UnicornScene from 'unicornstudio-react/next';

export function UnicornBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [sceneReady, setSceneReady] = useState(false);
    const [sceneFailed, setSceneFailed] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!sceneReady) {
                setSceneFailed(true);
            }
        }, 8000);

        return () => clearTimeout(timeout);
    }, [sceneReady]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Handle wheel events to allow scrolling while keeping mouse interactivity
        const handleWheel = (e: WheelEvent) => {
            // Prevent the default to avoid double-scrolling
            e.preventDefault();
            // Manually trigger scroll on the window
            window.scrollBy({
                top: e.deltaY,
                left: e.deltaX,
                behavior: 'auto',
            });
        };

        // Use passive: false so we can call preventDefault()
        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className="absolute inset-0 z-0 h-screen w-screen"
            style={{
                willChange: 'opacity',
                transform: 'translateZ(0)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 1 }}
        >
            {!sceneFailed && (
                <UnicornScene
                    jsonFilePath="/scenes/flow-background.json"
                    width="100%"
                    height="100%"
                    scale={1}
                    dpi={1}
                    fps={60}
                    onError={() => setSceneFailed(true)}
                    onLoad={() => setSceneReady(true)}
                />
            )}

            {sceneFailed && (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800" />
            )}
        </motion.div>
    );
}
