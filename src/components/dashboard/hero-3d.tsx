"use client"

import { useEffect, useRef } from "react"
import { Play } from "lucide-react"

interface Video {
    id: number
    title: string
    thumbnail: string
    duration: string
    views: string
}

interface Hero3DProps {
    videos: Video[]
}

export default function Hero3D({ videos }: Hero3DProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleMouseMove = (e: MouseEvent) => {
            const cards = container.querySelectorAll(".video-card-3d")
            cards.forEach((card: Element) => {
                const htmlCard = card as HTMLElement
                const rect = htmlCard.getBoundingClientRect()
                const x = (e.clientX - rect.left - rect.width / 2) / 20
                const y = (e.clientY - rect.top - rect.height / 2) / 20

                htmlCard.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale(1.05)`
            })
        }

        const handleMouseLeave = () => {
            const cards = container.querySelectorAll(".video-card-3d")
            cards.forEach((card: Element) => {
                const htmlCard = card as HTMLElement
                htmlCard.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`
            })
        }

        container.addEventListener("mousemove", handleMouseMove)
        container.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            container.removeEventListener("mousemove", handleMouseMove)
            container.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [])

    return (
        <div className="relative w-full overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-black/80 to-black/60 p-6 md:p-8 mb-8">
            <div className="absolute inset-0 opacity-10 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-amber-500/10" />
                <svg className="absolute inset-0 w-full h-full animate-pulse" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(200 100% 55%)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative z-10 mb-12 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
                    <span className="text-transparent bg-gradient-to-r from-amber-300 via-cyan-400 to-amber-300 bg-clip-text animate-gradient-x">
                        Tournament Highlights
                    </span>
                </h1>
                <p className="text-amber-100/70 text-lg md:text-xl">
                    Experience the best moments in stunning 3D
                </p>
            </div>

            <div ref={containerRef} className="relative z-10">
                <div className="mb-8 overflow-hidden rounded-xl">
                    <div className="flex gap-4 scroll-container-left">
                        {[...videos, ...videos].map((video, idx) => (
                            <div
                                key={`left-${idx}`}
                                className="video-card-3d flex-shrink-0 w-80 h-48 rounded-lg overflow-hidden border border-amber-500/20 hover:border-amber-500/60 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="relative w-full h-full">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-14 h-14 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                        <p className="text-white text-xs font-bold line-clamp-2">{video.title}</p>
                                        <p className="text-amber-300 text-xs mt-1">{video.views}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-8 overflow-hidden rounded-xl">
                    <div className="flex gap-4 scroll-container-right">
                        {[...videos, ...videos].map((video, idx) => (
                            <div
                                key={`right-${idx}`}
                                className="video-card-3d flex-shrink-0 w-80 h-48 rounded-lg overflow-hidden border border-emerald-500/20 hover:border-emerald-500/60 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="relative w-full h-full">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                        <p className="text-white text-xs font-bold line-clamp-2">{video.title}</p>
                                        <p className="text-emerald-300 text-xs mt-1">{video.views}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {videos.slice(0, 4).map((video, idx) => (
                        <div
                            key={`grid-${video.id}`}
                            className="video-card-3d relative overflow-hidden rounded-lg border border-cyan-500/20 hover:border-cyan-500/60 transition-all duration-300 group cursor-pointer float-animation"
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <div className="aspect-video relative">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 backdrop-blur-sm">
                                        <Play className="w-5 h-5 text-white fill-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-3">
                                <p className="text-white text-xs font-bold line-clamp-1 group-hover:text-cyan-300 transition-colors">
                                    {video.title}
                                </p>
                                <p className="text-cyan-300/70 text-xs mt-1">
                                    {video.views} • {video.duration}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 text-cyan-300 text-xs font-bold">
                    3D Enabled
                </div>
                <div className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 text-xs font-bold">
                    Live
                </div>
            </div>
        </div>
    )
}