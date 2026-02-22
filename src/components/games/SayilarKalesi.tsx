'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles,
    Trophy,
    RefreshCcw,
    Gem,
    Crown
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useVoice } from '@/hooks/useVoice'

export default function SayilarKalesi() {
    const [hedefSayi, setHedefSayi] = useState<number>(0)
    const [secenekler, setSecenekler] = useState<number[]>([])
    const [items, setItems] = useState<number[]>([])
    const [puan, setPuan] = useState(0)
    const [oyunBitti, setOyunBitti] = useState(false)
    const [aktifMesaj, setAktifMesaj] = useState<string | null>(null)
    const { konus, voicesLoaded } = useVoice()

    const yeniTur = useCallback(() => {
        const sayi = Math.floor(Math.random() * 5) + 1 // 1-5 arası
        setHedefSayi(sayi)

        // Ekranda gösterilecek görsel objeler
        setItems(Array.from({ length: sayi }, (_, i) => i))

        // Şıklanacak seçenekler
        const ys: number[] = []
        while (ys.length < 2) {
            const r = Math.floor(Math.random() * 8) + 1
            if (r !== sayi && !ys.includes(r)) {
                ys.push(r)
            }
        }
        setSecenekler([sayi, ...ys].sort(() => 0.5 - Math.random()))

        setTimeout(() => {
            konus(`Hafsa, kalede kaç tane parlayan elmas var? Hadi beraber sayalım!`, { pitch: 1.2 })
        }, 500)
    }, [konus])

    useEffect(() => {
        if (voicesLoaded && items.length === 0) {
            const timer = setTimeout(() => {
                yeniTur()
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [voicesLoaded, yeniTur, items.length])

    const secimYap = (n: number) => {
        if (oyunBitti) return

        if (n === hedefSayi) {
            setAktifMesaj("Aferin Hafsa! Tam " + n + " tane! ✨")
            konus("Aferin Hafsa! Tam " + n + " tane!", { pitch: 1.2 })
            const yeniPuan = puan + 1
            setPuan(yeniPuan)

            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#F59E0B', '#6366F1', '#EC4899']
            })

            if (yeniPuan >= 5) {
                setOyunBitti(true)
                konus("İnanılmazsın Prenses Hafsa! Sayıların kraliçesi oldun. Şatodaki tüm elmasları saydın!", { pitch: 1.2 })
            } else {
                setTimeout(yeniTur, 2500)
            }
        } else {
            setAktifMesaj("Hoppala! Bir daha sayalım mı? 😊")
            konus(`Hoppala! Bu ${n} sayısı. Bir daha sayalım mı Hafsa?`)
        }

        setTimeout(() => setAktifMesaj(null), 3500)
    }

    const oyunuSifirla = () => {
        setPuan(0)
        setOyunBitti(false)
        yeniTur()
    }

    return (
        <div className="relative w-full h-screen bg-[#F0F4FF] overflow-hidden flex flex-col font-sans">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white/90 backdrop-blur-md border-b-4 border-indigo-200 z-20 shadow-lg">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-indigo-600 rounded-[22px] flex items-center justify-center shadow-lg transform rotate-3">
                        <Crown className="text-white w-10 h-10" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-indigo-700 tracking-tighter uppercase leading-none">SAYILAR KALESİ</h1>
                        <p className="text-sm font-bold text-indigo-300 uppercase tracking-widest leading-none font-black italic">Sihirli Rakamlar</p>
                    </div>
                </div>

                <div className="bg-indigo-500 px-8 py-4 rounded-[28px] border-4 border-white shadow-xl flex items-center gap-4 transform -rotate-2">
                    <span className="text-3xl font-black text-white">{puan} / 5</span>
                    <Sparkles className="text-white w-8 h-8 animate-pulse" />
                </div>
            </div>

            {/* Stage */}
            <div className="flex-1 relative bg-gradient-to-b from-[#F0F4FF] to-[#C3DAFE] overflow-hidden">
                <AnimatePresence>
                    {!oyunBitti && (
                        <motion.div
                            key="game-stage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center"
                        >
                            {/* Vault / Display Area */}
                            <div className="mt-16 bg-white/40 backdrop-blur-sm p-12 rounded-[60px] border-8 border-white/60 shadow-inner flex flex-wrap justify-center items-center gap-8 min-h-[300px] max-w-4xl">
                                {items.map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, y: 50 }}
                                        animate={{ scale: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ scale: 1.2, rotate: 15 }}
                                    >
                                        <Gem className="w-24 h-24 text-indigo-500 fill-indigo-200 drop-shadow-[0_10px_20px_rgba(99,102,241,0.4)]" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Options */}
                            <div className="absolute bottom-20 flex gap-8">
                                {secenekler.map((n) => (
                                    <motion.button
                                        key={n}
                                        whileHover={{ scale: 1.1, y: -10 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => secimYap(n)}
                                        className="w-32 h-32 bg-white rounded-[40px] shadow-2xl border-b-8 border-indigo-100 flex items-center justify-center text-6xl font-black text-indigo-600 hover:bg-indigo-50 transition-colors active:scale-95"
                                    >
                                        {n}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Message */}
                <AnimatePresence>
                    {aktifMesaj && (
                        <motion.div
                            initial={{ scale: 0, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-16 py-10 rounded-[60px] shadow-[0_20px_80px_rgba(79,70,229,0.5)] z-40 text-center"
                        >
                            <p className="text-5xl font-black tracking-tight">{aktifMesaj}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Victory Screen */}
                <AnimatePresence>
                    {oyunBitti && (
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center z-50 p-10 text-center"
                        >
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="mb-10"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 blur-3xl bg-white/30 rounded-full animate-pulse" />
                                    <Trophy className="w-48 h-48 text-yellow-400 relative z-10" />
                                </div>
                            </motion.div>

                            <h2 className="text-8xl font-black text-white mb-6 uppercase tracking-tighter">PRENSESİN ZAFERİ! 🏰</h2>
                            <p className="text-3xl text-indigo-100 font-bold mb-16 max-w-3xl leading-relaxed">
                                Şatodaki tüm gizli mücevherleri saydın Hafsa! Matematik dünyasının en cesur prensesi sensin.
                            </p>

                            <button
                                onClick={oyunuSifirla}
                                className="h-28 px-20 bg-white text-indigo-600 rounded-[50px] text-4xl font-black hover:scale-110 transition-all shadow-2xl flex items-center gap-6 active:scale-95"
                            >
                                <RefreshCcw className="w-12 h-12" /> TEKRAR SAYALIM
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 text-center bg-white text-indigo-200 font-bold text-xs uppercase tracking-[0.5em] z-10">
                Hafsa&apos;nın Sayılar Şatosu 🏰 v1.1
            </div>
        </div>
    )
}
