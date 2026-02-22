'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart,
    Flower,
    Trash2,
    Users,
    Star,
    Trophy,
    RefreshCcw,
    ArrowRight,
    Bird,
    Cat,
    Sun,
    CloudRain
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useVoice } from '@/hooks/useVoice'

interface Gorev {
    id: number
    isim: string
    mesaj: string
    ikontipi: 'flower' | 'trash' | 'users' | 'bird' | 'cat'
    tamamlandi: boolean
    x: number
    y: number
}

interface Seviye {
    id: number
    isim: string
    aciklama: string
    baslangicMesaji: string
    tebrikMesaji: string
    gorevler: Gorev[]
    renkSinifi: string
}

const SEVIYELER: Seviye[] = [
    {
        id: 1,
        isim: "Bölüm 1: Çiçekli Park",
        aciklama: "Parkı güzelleştirmeye ne dersin?",
        baslangicMesaji: "Harika bir gün Hafsa! Haydi parktaki çiçekleri sulayalım ve çöplerimizi toplayalım. Hazır mısın?",
        tebrikMesaji: "İnanılmazsın Hafsa! Park sayende pırıl pırıl oldu. Şimdi bir sonraki maceraya hazır mısın?",
        renkSinifi: "from-sky-200 to-emerald-100",
        gorevler: [
            { id: 101, isim: "Susuz Çiçek", mesaj: "Çiçek kana kana su içti! 🌸", ikontipi: 'flower', tamamlandi: false, x: 25, y: 40 },
            { id: 102, isim: "Yerdeki Paket", mesaj: "Çevremiz artık daha temiz! ✨", ikontipi: 'trash', tamamlandi: false, x: 65, y: 70 },
            { id: 103, isim: "Acıkmış Serçe", mesaj: "Cik cik! Ona yem verdiğin için çok mutlu. 🐦", ikontipi: 'bird', tamamlandi: false, x: 50, y: 20 },
        ]
    },
    {
        id: 2,
        isim: "Bölüm 2: Sevgi Caddesi",
        aciklama: "Mahalledeki dostlarımıza yardım edelim.",
        baslangicMesaji: "Şimdi Sevgi Caddesi'ndeyiz! Buradaki kedicikleri sevelim ve arkadaşlarımızı güldürelim.",
        tebrikMesaji: "Vay canına Hafsa! Caddeye sevgi saçtın resmen. Bütün mahalle seni konuşuyor!",
        renkSinifi: "from-orange-100 to-rose-100",
        gorevler: [
            { id: 201, isim: "Yalnız Kedicik", mesaj: "Miyav! Karnı doydu ve mırıldıyor. 🐱", ikontipi: 'cat', tamamlandi: false, x: 15, y: 65 },
            { id: 202, isim: "Küs Arkadaşlar", mesaj: "Barışmak dünyanın en güzel şeyi! 🤝", ikontipi: 'users', tamamlandi: false, x: 75, y: 35 },
            { id: 203, isim: "Dökülen Yapraklar", mesaj: "Mis gibi oldu! 🍂", ikontipi: 'trash', tamamlandi: false, x: 40, y: 80 },
            { id: 204, isim: "Solgun Lale", mesaj: "Lale yeniden canlandı! 🌷", ikontipi: 'flower', tamamlandi: false, x: 85, y: 15 },
            { id: 205, isim: "Uçamayan Kuş", mesaj: "Kanatlarını çırpıp gökyüzüne havalandı! 🕊️", ikontipi: 'bird', tamamlandi: false, x: 30, y: 25 },
        ]
    },
    {
        id: 3,
        isim: "Bölüm 3: İyilik Sarayı",
        aciklama: "Gerçek bir İyilik Kahramanı olma vakti!",
        baslangicMesaji: "Hafsa, sen artık bir iyilik kahramanısın! Son görevlerini de yapıp dünyayı tamamen aydınlatmaya hazır mısın?",
        tebrikMesaji: "MÜKEMMEL! Sen dünyanın en yardımsever çocuğusun Hafsa! Sen gerçek bir iyilik meleğisin!",
        renkSinifi: "from-indigo-100 to-purple-100",
        gorevler: [
            { id: 301, isim: "Ağlayan Bebek", mesaj: "Gülümsemesi etrafı aydınlattı! 👶", ikontipi: 'users', tamamlandi: false, x: 20, y: 20 },
            { id: 302, isim: "Kurumuş Ağaç", mesaj: "Ağaç meyve vermeye hazır! 🌳", ikontipi: 'flower', tamamlandi: false, x: 80, y: 80 },
            { id: 303, isim: "Cam Kırıkları", mesaj: "Dikkatlice topladın, artık herkes güvende! 🛡️", ikontipi: 'trash', tamamlandi: false, x: 50, y: 55 },
            { id: 304, isim: "Üşüyen Kedicikler", mesaj: "Sıcacık yuvaları var artık! 🏰", ikontipi: 'cat', tamamlandi: false, x: 10, y: 45 },
            { id: 305, isim: "Yaralı Kanat", mesaj: "Yeniden özgürce uçuyor! ✨", ikontipi: 'bird', tamamlandi: false, x: 90, y: 35 },
            { id: 306, isim: "Su Birikintisi", mesaj: "Yol artık tertemiz! ⛲", ikontipi: 'trash', tamamlandi: false, x: 35, y: 10 },
            { id: 307, isim: "Papatya Tarlası", mesaj: "Bütün papatyalar sana teşekkür ediyor! 🌼", ikontipi: 'flower', tamamlandi: false, x: 65, y: 30 },
        ]
    }
]

export default function GizliIyilikci() {
    const [mevcutSeviyeIdx, setMevcutSeviyeIdx] = useState(0)
    const [basladi, setBasladi] = useState(false)
    const [gorevler, setGorevler] = useState<Gorev[]>([])
    const [puan, setPuan] = useState(0)
    const [seviyeBitti, setSeviyeBitti] = useState(false)
    const [oyunTamamlandi, setOyunTamamlandi] = useState(false)
    const [aktifMesaj, setAktifMesaj] = useState<string | null>(null)
    const { konus } = useVoice()

    const mevcutSeviye = SEVIYELER[mevcutSeviyeIdx]

    const oyunuBaslat = () => {
        setBasladi(true)
        setMevcutSeviyeIdx(0)
        setGorevler(SEVIYELER[0].gorevler.map(g => ({ ...g, tamamlandi: false })))
        setPuan(0)
        setSeviyeBitti(false)
        konus(SEVIYELER[0].baslangicMesaji)
    }

    const sonrakiSeviye = () => {
        if (mevcutSeviyeIdx < SEVIYELER.length - 1) {
            const yeniIdx = mevcutSeviyeIdx + 1
            setMevcutSeviyeIdx(yeniIdx)
            setGorevler(SEVIYELER[yeniIdx].gorevler.map(g => ({ ...g, tamamlandi: false })))
            setPuan(0)
            setSeviyeBitti(false)
            konus(SEVIYELER[yeniIdx].baslangicMesaji)
        }
    }

    const oyunuSifirla = () => {
        setMevcutSeviyeIdx(0)
        setOyunTamamlandi(false)
        setSeviyeBitti(false)
        setBasladi(false)
    }

    const iyilikYap = (id: number) => {
        const gorev = gorevler.find(g => g.id === id)
        if (!gorev || gorev.tamamlandi || seviyeBitti) return

        setAktifMesaj(gorev.mesaj)
        konus(gorev.mesaj)

        const yeniGorevler = gorevler.map(g => {
            if (g.id === id) return { ...g, tamamlandi: true }
            return g
        })

        setGorevler(yeniGorevler)
        const yeniPuan = puan + 1
        setPuan(yeniPuan)

        if (yeniPuan === gorevler.length) {
            bitirSeviye()
        }

        setTimeout(() => setAktifMesaj(null), 3500)
    }

    const bitirSeviye = () => {
        setTimeout(() => {
            setSeviyeBitti(true)
            konus(mevcutSeviye.tebrikMesaji)

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FF6B6B', '#4ECDC4', '#FFE66D']
            })

            if (mevcutSeviyeIdx === SEVIYELER.length - 1) {
                setOyunTamamlandi(true)
                konus("Tebrikler Hafsa! Sen efsanevi bir iyilik kahramanısın. Bütün bölümleri bitirdin! İstersen baştan başlayabilirsin.")
            }
        }, 1000)
    }

    const renderIkon = (tip: string, tamamlandi: boolean) => {
        if (tamamlandi) return <Star className="w-10 h-10 text-brand-accent fill-brand-accent animate-float" />

        switch (tip) {
            case 'flower': return <Flower className="w-10 h-10 text-rose-400" />
            case 'trash': return <Trash2 className="w-10 h-10 text-slate-400" />
            case 'users': return <Users className="w-10 h-10 text-sky-400" />
            case 'bird': return <Bird className="w-10 h-10 text-orange-400" />
            case 'cat': return <Cat className="w-10 h-10 text-amber-500" />
            default: return <Heart className="w-10 h-10 text-brand-primary" />
        }
    }

    if (!basladi) {
        return (
            <div className="fixed inset-0 bg-brand-primary flex flex-col items-center justify-center z-[100] p-6 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <Sun className="absolute top-10 right-10 w-40 h-40 text-white animate-spin-slow" />
                    <CloudRain className="absolute bottom-20 left-20 w-32 h-32 text-white animate-bounce" />
                </div>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-48 h-48 bg-white rounded-[60px] flex items-center justify-center mb-8 shadow-2xl relative"
                >
                    <Heart className="w-28 h-28 text-brand-primary fill-brand-primary" />
                    <div className="absolute -top-4 -right-4 bg-brand-accent p-4 rounded-full shadow-lg">
                        <Star className="text-brand-dark w-8 h-8 fill-brand-dark" />
                    </div>
                </motion.div>
                <h1 className="text-7xl font-black text-white mb-6 tracking-tighter drop-shadow-xl uppercase leading-none">HAFSA&apos;NIN DÜNYASI</h1>
                <p className="text-3xl text-white/90 font-bold mb-12 italic">Her tıklama bir iyilik, her iyilik bir yıldız! ⭐</p>
                <div className="flex gap-4">
                    <button
                        onClick={oyunuBaslat}
                        className="h-28 px-20 bg-white text-brand-primary rounded-[50px] text-4xl font-black hover:scale-110 transition-all shadow-2xl border-b-8 border-slate-100 flex items-center gap-4 active:scale-95"
                    >
                        BAŞLAYALIM MI? 🚀
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-screen bg-sky-50 overflow-hidden flex flex-col font-sans">
            {/* Header */}
            <div className="p-6 flex justify-between items-center bg-white/90 backdrop-blur-md border-b-4 border-brand-secondary z-20 shadow-lg">
                <div className="flex items-center gap-6">
                    <button onClick={oyunuSifirla} className="w-16 h-16 bg-brand-primary rounded-[22px] flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-all">
                        <Heart className="text-white w-10 h-10 fill-white" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-brand-dark tracking-tighter uppercase leading-none mb-1">{mevcutSeviye.isim}</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">{mevcutSeviye.aciklama}</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden lg:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border-2 border-slate-100">
                        <span className="text-[10px] font-black text-indigo-400 uppercase">SESLİ REHBER</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                        </div>
                    </div>

                    <div className="bg-brand-accent px-8 py-4 rounded-[28px] border-4 border-white shadow-xl flex items-center gap-4 transform rotate-2 relative overflow-hidden group">
                        <Star className="text-brand-dark w-7 h-7 fill-brand-dark group-hover:scale-125 transition-transform" />
                        <span className="text-3xl font-black text-brand-dark leading-none">{puan} <span className="text-xl opacity-30">/</span> {gorevler.length}</span>
                    </div>
                </div>
            </div>

            {/* Stage */}
            <div className={`flex-1 relative overflow-hidden bg-gradient-to-b ${mevcutSeviye.renkSinifi} transition-colors duration-1000 cursor-crosshair`}>
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <Sun className="absolute top-20 left-40 w-48 h-48 text-white/50 animate-spin-slow" />
                    <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/20 rounded-full blur-3xl" />
                </div>

                {gorevler.map((gorev) => (
                    <motion.div
                        key={gorev.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        whileTap={{ scale: 0.8 }}
                        className="absolute cursor-pointer p-6"
                        style={{ left: `${gorev.x}%`, top: `${gorev.y}%` }}
                        onClick={() => iyilikYap(gorev.id)}
                        onMouseEnter={() => !gorev.tamamlandi && konus(gorev.isim)}
                    >
                        <div className={`relative flex items-center justify-center transition-all duration-700 ${gorev.tamamlandi ? 'bg-transparent' : 'bg-white/60 hover:bg-white/95 rounded-[30px] w-24 h-24 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-4 border-white ring-8 ring-white/20'}`}>
                            {renderIkon(gorev.ikontipi, gorev.tamamlandi)}

                            {!gorev.tamamlandi && (
                                <motion.div
                                    initial={{ y: 0 }}
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-brand-dark text-white text-[10px] px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-black shadow-xl uppercase tracking-widest"
                                >
                                    BURAYA TIKLA ✨
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {/* Toast Message */}
                <AnimatePresence>
                    {aktifMesaj && (
                        <motion.div
                            initial={{ y: 150, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: -100, opacity: 0, scale: 0.8 }}
                            className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl text-white px-12 py-8 rounded-[50px] shadow-2xl border-4 border-brand-secondary z-30 text-center min-w-[400px]"
                        >
                            <div className="bg-brand-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 scale-150">
                                <Heart className="text-white fill-white w-6 h-6" />
                            </div>
                            <p className="text-3xl font-black tracking-tight">{aktifMesaj}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Level Overlays */}
                <AnimatePresence>
                    {seviyeBitti && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-brand-dark/90 backdrop-blur-xl flex flex-col items-center justify-center z-50 p-6 text-center"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 15, -15, 0],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-40 h-40 bg-brand-accent rounded-[50px] flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(255,230,109,0.4)]"
                            >
                                <Trophy className="w-24 h-24 text-brand-dark" />
                            </motion.div>

                            <h2 className="text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">SÜPERSİN HAFSA! 💖</h2>
                            <p className="text-2xl text-brand-accent font-bold mb-16 max-w-2xl px-4 leading-relaxed italic">
                                &quot;{mevcutSeviye.tebrikMesaji}&quot;
                            </p>

                            {oyunTamamlandi ? (
                                <div className="flex flex-col gap-6 items-center">
                                    <h3 className="text-white text-3xl font-black mb-4 uppercase">Şehirdeki tüm iyilikler bitti! ✨</h3>
                                    <button
                                        onClick={oyunuSifirla}
                                        className="h-24 px-16 bg-brand-primary rounded-[40px] text-3xl font-black hover:scale-105 transition-all shadow-2xl flex items-center gap-4 uppercase text-white active:scale-95"
                                    >
                                        <RefreshCcw className="w-10 h-10" /> EN BAŞTAN BAŞLA
                                    </button>
                                    <p className="text-white/40 text-sm font-bold uppercase tracking-widest mt-4">Hafsa, sen dünyanın en iyi çocuğusun!</p>
                                </div>
                            ) : (
                                <button
                                    onClick={sonrakiSeviye}
                                    className="h-28 px-20 bg-brand-secondary rounded-[40px] text-4xl font-black hover:scale-105 transition-all shadow-[0_20px_60px_rgba(78,205,196,0.3)] flex items-center gap-4 uppercase group text-white active:scale-95"
                                >
                                    SONRAKİ BÖLÜM <ArrowRight className="w-12 h-12 group-hover:translate-x-3 transition-transform" />
                                </button>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-5 flex justify-between items-center bg-white border-t border-slate-100">
                <div className="flex gap-4">
                    {SEVIYELER.map((s, i) => (
                        <div key={s.id} className={`w-3 h-3 rounded-full transition-all duration-500 ${i === mevcutSeviyeIdx ? 'bg-brand-primary w-8' : 'bg-slate-200'}`} />
                    ))}
                </div>
                <p className="text-xs font-black text-slate-300 uppercase tracking-[0.3em]">Hafsa&apos;nın İyilik Günlüğü 🌈 v2.1</p>
            </div>
        </div>
    )
}
