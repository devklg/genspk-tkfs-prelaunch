import { useState } from 'react'
// Import images directly
import logoImage from '@assets/images/logo.png'
import kongaLineImage from '@assets/images/konga-line.png'
// Import CSS modules
import styles from '@styles/Hero.module.css'
// Import 0
import introVideo from '@assets/videos/intro.mp4'

function HeroSection() {
    const [videoPlaying, setVideoPlaying] = useState(false)

    const handlePlayVideo = () => {
        setVideoPlaying(true)
    }

    return (
        <div className="relative overflow-hidden bg-background-dark py-16 sm:py-24">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <img
                        src={logoImage}
                        alt="Talk Fusion Logo"
                        className="h-16 mx-auto mb-6"
                    />

                    <h1 className="text-4xl font-extrabold tracking-tight text-primary-gold sm:text-5xl md:text-6xl">
                        Join Kevin's Konga Line
                    </h1>

                    <p className="mt-3 max-w-md mx-auto text-base text-text-dark sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        The future of email is here. Join the video email revolution with Talk Fusion and get paid in just 1 minute!
                    </p>

                    <div className="mt-10">
                        {videoPlaying ? (
                            <div className="aspect-w-16 aspect-h-9 max-w-3xl mx-auto">
                                <video
                                    controls
                                    autoPlay
                                    playsinline
                                    webkit-playsinline
                                    className="rounded-lg shadow-xl"
                                >
                                    <source src={introVideo} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div
                                className="relative aspect-w-16 aspect-h-9 max-w-3xl mx-auto cursor-pointer"
                                onClick={handlePlayVideo}
                            >
                                <img
                                    src={kongaLineImage}
                                    alt="Kevin's Konga Line"
                                    className="rounded-lg shadow-xl object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="h-20 w-20 rounded-full bg-primary-blue bg-opacity-75 flex items-center justify-center">
                                        <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection