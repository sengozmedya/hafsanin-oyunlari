'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Star, Sparkles, BookOpen, Crown, RefreshCcw, Volume2 } from 'lucide-react'
import GizliIyilikci from '@/components/games/GizliIyilikci'
import RenkliBahce from '@/components/games/RenkliBahce'
import SayilarKalesi from '@/components/games/SayilarKalesi'
import { useVoice } from '@/hooks/useVoice'

type GameType = 'iyilik' | 'renkler' | 'rakamlar' | null

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const { konus, voicesLoaded } = useVoice()

  useEffect(() => {
    if (!selectedGame && voicesLoaded && audioEnabled) {
      const timer = setTimeout(() => {
        konus("Merhaba Prenses Hafsa! Bugün hangi oyunu oynamak istersin? İyilik Şehri mi, Renkli Bahçe mi, yoksa Sayılar Kalesi mi?")
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [selectedGame, voicesLoaded, konus, audioEnabled])

  const startAudio = () => {
    setAudioEnabled(true)
    konus("Harika! Sesler açıldı. Hoş geldin Hafsa!")
  }

  const renderGame = () => {
    switch (selectedGame) {
      case 'iyilik': return <GizliIyilikci />
      case 'renkler': return <RenkliBahce />
      case 'rakamlar': return <SayilarKalesi />
      default: return null
    }
  }

  if (selectedGame) {
    return (
      <div className="relative w-full h-screen">
        {renderGame()}
        <button
          onClick={() => setSelectedGame(null)}
          className="absolute top-4 left-4 z-[60] bg-white/90 p-4 rounded-[25px] shadow-2xl hover:scale-110 transition-all border-4 border-pink-200 group"
        >
          <div className="flex items-center gap-2">
            <RefreshCcw className="text-pink-500 w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-pink-600 font-black text-xs uppercase tracking-tighter">MENÜYE DÖN</span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-100 via-white to-indigo-100 flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-20 left-10"><Crown className="text-pink-400 w-24 h-24" /></motion.div>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute bottom-20 right-10"><Sparkles className="text-yellow-400 w-32 h-32" /></motion.div>
      </div>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 relative z-10"
      >
        <div className="inline-flex items-center gap-4 mb-4">
          <Sparkles className="text-brand-accent w-10 h-10 animate-pulse" />
          <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-600 tracking-tighter drop-shadow-sm uppercase leading-none">
            HAFSA&apos;NIN DÜNYASI
          </h1>
          <Sparkles className="text-brand-accent w-10 h-10 animate-pulse" />
        </div>
        <p className="text-2xl font-bold text-slate-500 uppercase tracking-[0.3em]">En Güzel Prenses İçin Oyunlar 💖</p>
      </motion.div>

      <AnimatePresence>
        {!audioEnabled && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={startAudio}
              className="bg-brand-primary text-white p-12 rounded-[60px] shadow-[0_20px_80px_rgba(255,107,107,0.4)] flex flex-col items-center gap-6 border-8 border-white"
            >
              <Volume2 className="w-32 h-32 animate-bounce" />
              <span className="text-5xl font-black uppercase tracking-tighter">SESLERİ AÇ ✨</span>
              <p className="text-white/80 font-bold italic">Hafsa seni duymak istiyor!</p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl w-full relative z-10">
        <GameCard
          title="İyilik Şehri"
          desc="Dünyayı güzelleştirme vakti"
          icon={<Heart className="w-16 h-16 text-white fill-white" />}
          color="bg-gradient-to-br from-brand-primary to-rose-400"
          onClick={() => setSelectedGame('iyilik')}
          onHover={() => audioEnabled && konus("İyilik Şehri")}
        />

        <GameCard
          title="Renkli Bahçe"
          desc="Renkleri öğrenelim"
          icon={<Star className="w-16 h-16 text-white fill-white" />}
          color="bg-gradient-to-br from-emerald-400 to-teal-600"
          onClick={() => setSelectedGame('renkler')}
          onHover={() => audioEnabled && konus("Renkli Bahçe")}
        />

        <GameCard
          title="Sayılar Kalesi"
          desc="Sihirli rakamlarla tanış"
          icon={<BookOpen className="w-16 h-16 text-white fill-white" />}
          color="bg-gradient-to-br from-indigo-500 to-purple-700"
          onClick={() => setSelectedGame('rakamlar')}
          onHover={() => audioEnabled && konus("Sayılar Kalesi")}
        />
      </div>

      <footer className="mt-20 text-slate-400 font-bold uppercase tracking-widest text-xs">
        Sengoz Medya Gururla Sunar 🌈
      </footer>
    </main>
  )
}

interface GameCardProps {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
  onClick: () => void
  onHover: () => void
}

function GameCard({ title, desc, icon, color, onClick, onHover }: GameCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={onHover}
      onClick={onClick}
      className="flex flex-col items-center group relative outline-none"
    >
      <div className={`w-64 h-64 ${color} rounded-[60px] shadow-2xl flex items-center justify-center mb-6 border-8 border-white ring-12 ring-black/5 group-hover:ring-black/10 transition-all relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        {icon}
      </div>
      <h3 className="text-3xl font-black text-brand-dark mb-1 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{desc}</p>
    </motion.button>
  )
}
