'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Flower,
    Star,
    Sparkles,
    Trophy,
    RefreshCcw,
    Heart
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useVoice } from '@/hooks/useVoice'

interface Item {
    id: number
    renk: string
    renkIsmi: string
    ikontipi: 'flower' | 'star'
    x: number
    y: number
}

const RENKLER = [
    { isim: 'Kırmızı', kod: '#EF4444' },
    { isim: 'Mavi', kod: '#3B82F6' },
    { isim: 'Sarı', kod: '#F59E0B' },
    { isim: 'Yeşil', kod: '#10B981' },
    { isim: 'Mor', kod: '#8B5CF6' },
    { isim: 'Pembe', kod: '#EC4899' },
]

export default function RenkliBahce() {
    const [items, setItems] = useState<Item[]>([])
    const [hedefRenk, setHedefRenk] = useState<{ isim: string, kod: string } | null>(null)
    const [puan, setPuan] = useState(0)
    const [oyunBitti, setOyunBitti] = useState(false)
    const [aktifMesaj, setAktifMesaj] = useState<string | null>(null)
    const { konus, voicesLoaded } = useVoice()

    const yeniTur = useCallback(() => {
        const yeniItems: Item[] = []
        const kullanilanRenkler = [...RENKLER].sort(() => 0.5 - Math.random()).slice(0, 4)

        kullanilanRenkler.forEach((renk, idx) => {
            yeniItems.push({
                id: Math.random(),
                renk: renk.kod,
                renkIsmi: renk.isim,
                ikontipi: Math.random() > 0.5 ? 'flower' : 'star',
                x: 15 + (idx * 20),
                y: 30 + (Math.random() * 40)
            })
        })

        const secilenHedef = yeniItems[Math.floor(Math.random() * yeniItems.length)]
        setItems(yeniItems)
        setHedefRenk({ isim: secilenHedef.renkIsmi, kod: secilenHedef.renk })

        // Seslendirmeyi biraz geciktirerek tarayıcı/state uyumunu sağlıyoruz
        setTimeout(() => {
            konus(`Hafsa, bana ${secilenHedef.renkIsmi} olanı bulabilir misin?`, { pitch: 1.3 })
        }, 500)
    }, [konus])

    // Mount anında sesler hazırsa başla, değilse voicesLoaded bekle
    useEffect(() => {
        if (voicesLoaded && items.length === 0) {
            const timer = setTimeout(() => {
                yeniTur()
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [voicesLoaded, yeniTur, items.length])

    const secimYap = (item: Item) => {
        if (oyunBitti) return

        if (item.renkIsmi === hedefRenk?.isim) {
            setAktifMesaj("Harikasın Hafsa! Doğru renk! ✨")
            konus("Harikasın Hafsa! Doğru renk!", { pitch: 1.3 })
            const yeniPuan = puan + 1
            setPuan(yeniPuan)

            confetti({
                particleCount: 50,
                spread: 40,
                origin: { x: item.x / 100, y: item.y / 100 },
                colors: [item.renk]
            })

            if (yeniPuan >= 5) {
                setOyunBitti(true)
                konus("Tebrikler Prenses Hafsa! Bahçedeki tüm renkleri tanıdın. Sen harikasın!", { pitch: 1.2 })
            } else {
                setTimeout(yeniTur, 2000)
            }
        } else {
            setAktifMesaj("Hoppala! Bu değil, tekrar dene bakalım mı? 😊")
            konus(`Hoppala! Bu ${item.renkIsmi} rengi. Biz ${hedefRenk?.isim} rengini arıyoruz Hafsa.`)
        }

        setTimeout(() => setAktifMesaj(null), 3000)
    }

    const oyunuSifirla = () => {
        setPuan(0)
        setOyunBitti(false)
        yeniTur()
    }

    return (
        <div className="relative w-full h-screen bg-[#FFF5F7] overflow-hidden flex flex-col font-sans">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md border-b-4 border-pink-200 z-20">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-pink-500 rounded-[24px] flex items-center justify-center shadow-lg transform -rotate-3">
                        <Star className="text-white w-10 h-10 fill-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-pink-600 tracking-tighter uppercase">RENKLİ BAHÇE</h1>
                        <p className="text-sm font-bold text-pink-300 uppercase tracking-widest leading-none">Prenses Hafsa&apos;nın Öğrenme Bahçesi</p>
                    </div>
                </div>

                <div className="bg-white px-8 py-4 rounded-[28px] border-4 border-pink-100 shadow-xl flex items-center gap-4">
                    <span className="text-3xl font-black text-pink-500">{puan} / 5</span>
                    <Heart className="text-pink-500 w-8 h-8 fill-pink-500 animate-pulse" />
                </div>
            </div>

            {/* Stage */}
            <div className="flex-1 relative bg-gradient-to-b from-[#FFF5F7] to-[#FED7E2] overflow-hidden">
                {/* Decorative Flowers */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Sparkles className="absolute top-20 left-40 w-48 h-48 text-pink-400" />
                    <Flower className="absolute bottom-20 right-20 w-64 h-64 text-pink-400" />
                </div>

                <AnimatePresence>
                    {!oyunBitti && (
                        <motion.div
                            key="game-stage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                        >
                            {/* Question Box */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white/90 px-12 py-6 rounded-[40px] shadow-2xl border-4 border-pink-200 text-center z-10">
                                <p className="text-2xl font-bold text-slate-500 mb-2 uppercase tracking-tighter italic">Neyi arıyoruz?</p>
                                <h2 className="text-5xl font-black uppercase tracking-tighter" style={{ color: hedefRenk?.kod }}>
                                    {hedefRenk?.isim}
                                </h2>
                            </div>

                            {/* Targets */}
                            {items.map((item) => (
                                <motion.button
                                    key={item.id}
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    whileTap={{ scale: 0.8 }}
                                    className="absolute p-4 outline-none group"
                                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                                    onClick={() => secimYap(item)}
                                >
                                    <div className="relative">
                                        {item.ikontipi === 'flower' ? (
                                            <Flower className="w-32 h-32 drop-shadow-2xl" style={{ color: item.renk, fill: item.renk }} />
                                        ) : (
                                            <Star className="w-32 h-32 drop-shadow-2xl" style={{ color: item.renk, fill: item.renk }} />
                                        )}
                                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Feedback Message */}
                <AnimatePresence>
                    {aktifMesaj && (
                        <motion.div
                            initial={{ y: 150, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-12 py-8 rounded-[50px] shadow-2xl border-6 border-pink-400 z-30 text-center min-w-[500px]"
                        >
                            <p className="text-4xl font-black text-pink-600 tracking-tight">{aktifMesaj}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Victory Screen */}
                <AnimatePresence>
                    {oyunBitti && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-pink-500/95 backdrop-blur-xl flex flex-col items-center justify-center z-50 p-10 text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-48 h-48 bg-white rounded-[60px] flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(255,255,255,0.5)]"
                            >
                                <Trophy className="w-28 h-28 text-pink-500" />
                            </motion.div>

                            <h2 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase">HARİKASIN PRENSES! 🏰</h2>
                            <p className="text-3xl text-pink-100 font-bold mb-16 max-w-2xl px-4 leading-relaxed">
                                Bahçedeki tüm renkleri buldun ve çiçekleri uyandırdın. Hafsa ile dünya çok daha renkli!
                            </p>

                            <div className="flex gap-8">
                                <button
                                    onClick={oyunuSifirla}
                                    className="h-28 px-16 bg-white text-pink-600 rounded-[40px] text-3xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-4 active:scale-95"
                                >
                                    <RefreshCcw className="w-10 h-10" /> YENİDEN OYNA
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-4 text-center bg-white text-pink-300 font-bold text-xs uppercase tracking-[0.4em]">
                Hafsa&apos;nın Renk Serüveni 🌸
            </div>
        </div>
    )
}
