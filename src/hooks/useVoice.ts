'use client'

import { useCallback, useEffect, useState, useRef } from 'react'

export function useVoice() {
    const [voicesLoaded, setVoicesLoaded] = useState(false)
    const voicesRef = useRef<SpeechSynthesisVoice[]>([])

    const loadVoices = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            const loadedVoices = window.speechSynthesis.getVoices()
            if (loadedVoices.length > 0) {
                voicesRef.current = loadedVoices
                setVoicesLoaded(true)
                return true
            }
        }
        return false
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!loadVoices()) {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.onvoiceschanged = loadVoices
                }
            }
        }, 100)

        return () => {
            clearTimeout(timer)
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.onvoiceschanged = null
            }
        }
    }, [loadVoices])

    const konus = useCallback((metin: string, options?: { pitch?: number, rate?: number, retryWithDefault?: boolean }) => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            // Stop any current speech
            window.speechSynthesis.cancel()

            // Resume if paused (known Chrome bug)
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume()
            }

            const utterance = new SpeechSynthesisUtterance(metin)

            if (!options?.retryWithDefault) {
                // Try to find the best Turkish voice
                const trVoice = voicesRef.current.find(v =>
                    v.lang.toLowerCase().includes('tr') && v.localService
                ) || voicesRef.current.find(v =>
                    v.lang.toLowerCase().includes('tr')
                )
                if (trVoice) utterance.voice = trVoice
            }

            utterance.lang = 'tr-TR'
            utterance.rate = options?.rate || 1
            utterance.pitch = options?.pitch || 1

            utterance.onerror = (event) => {
                // 'interrupted' is normal when we call .cancel() to speak something new
                if (event.error === 'interrupted') {
                    return
                }

                console.error("SpeechSynthesis Error Detail:", event.error)

                if (!options?.retryWithDefault) {
                    setTimeout(() => {
                        konus(metin, { ...options, retryWithDefault: true })
                    }, 200)
                }
            }

            try {
                window.speechSynthesis.speak(utterance)
            } catch (e) {
                console.error("SpeechSynthesis Speak Exception:", e)
            }
        }
    }, [])

    return { konus, voicesLoaded }
}
