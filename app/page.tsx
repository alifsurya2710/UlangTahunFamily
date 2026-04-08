"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

interface Person {
  name: string;
  role: string;
  message: string;
  color: string;
  gradient: string;
  icon: string;
  birthdayDate: string;
  coupons: string[];
}

// Falling Heart Component for the Intro Rain effect
// Hydration safe: Only calculates random values on the client
const HeartRain = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0, rotate: 0 }}
          animate={{ 
            y: "110vh", 
            opacity: [0, 1, 1, 0],
            rotate: [0, 45, -45, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 15, 
            repeat: Infinity, 
            delay: Math.random() * 15,
            ease: "linear"
          }}
          className="absolute text-pink-300/30 text-3xl md:text-5xl"
        >
          💖
        </motion.div>
      ))}
    </div>
  );
};

export default function Home() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);
  
  // Navigation Flow States
  const [showIntro, setShowIntro] = useState(true);
  const [showSelection, setShowSelection] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [entryMethod, setEntryMethod] = useState<"voice" | "manual" | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "surprise" | "memories">("home");
  
  // Voice Recognition States
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "success" | "error">("idle");
  const [recordedTranscript, setRecordedTranscript] = useState("");
  const [browserSupported, setBrowserSupported] = useState(true);
  const [revealedCoupon, setRevealedCoupon] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loveLevel, setLoveLevel] = useState(50);
  
  // Per-person Password States
  const [unlockingPerson, setUnlockingPerson] = useState<Person | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  
  const people: Person[] = [
    {
      name: "Mamah",
      role: "Malaikat Tanpa Sayap",
      message: "Terima kasih untuk segalanya Mamah. Doa dan kasih sayang Mamah adalah kekuatan terbesar Aa. Selamat ulang tahun yaa, semoga panjang umur dan sehat selalu, dan kehadiran Mamah selalu jadi berkah terindah dalam hidup Aa 💖 Aa oge minta maaf ka Mamah karna Aa pernah ngabentak Mamah, sering marah-marah jeung hese dibejaan mun nanaon teh, Aa juga minta maaf kalau belum bisa jadi anak yang Mamah mau atau yang diharapkan dari Mamah ke Aa. Aa sadar Aa masih banyak kurangna, kadang teu serius mun aya naon-naon, tapi Aa bersyukur banget punya Mamah 💖 makasih yaa Mamah udah jadi Mamah yang baik, yang jarang marah-marah ka Aa jeung ka si Neneng, dan selalu ngeusahain apa yang Aa pengen. LOVE YOU Mamah 💖",
      color: "#ff4d6d",
      gradient: "from-[#ff758c] to-[#ff7eb3]",
      icon: "👩‍🍼",
      birthdayDate: "16-Juli-1978",
      coupons: ["Voucher Pijat Aa (30 Menit)", "Makan di Resto Mana Saja Bebas Pilih", "Libur Masak & Cuci Piring (Aa yang Kerjain)"]
    },
    {
      name: "Bapak",
      role: "Superhero Keluarga",
      message: "Terima kasih Bapak atas semua perjuangan dan cinta Bapak ka Aa yang tak terbatas. Semoga di hari spesial ini Bapak selalu diberi kesehatan, kebahagiaan, dan kemudahan dalam segala hal, Aa bangga punya Bapak 💖 Aa oge minta maaf ka Bapak karna Aa can bisa jadi budak lalaki nu bisa dibanggakeun jeung diandelkeun ku Bapak, Aa juga minta maaf karna Aa orangna hese dibejaan, kadang polontong jeung banyak hereyna. Tapi jujur Aa bersyukur banget punya Bapak 💖 karena Bapak can pernah marah-marah atawa galak ka budakna, tara ngomong kasar, teu pernah ngabentak, Tapi paling kurang na Bapak mah rada on-on saeutik jeung pedit saeutik, tapi teu nanaon, namanya juga manusia pasti ada kurang jeung lebihna. Makasih yaa Bapak udah jadi Bapak yang baik dan perhatian ka Aa jeung ka si Neneng. LOVE YOU Bapak 💖",
      color: "#ff8fa3",
      gradient: "from-[#ff8fa3] to-[#ffb3c1]",
      icon: "👨‍👩-👦",
      birthdayDate: "15-Oktober-1979",
      coupons: ["Voucher Kopi Enak Bikinan Aa", "Nonton Film Bioskop Bebas Pilih", "Voucher Temenin Belanja (Aa yang Bawa Belanjaan)"]
    },
    {
      name: "Neneng",
      role: "Penghibur Keluarga",
      message: "Happy birthday Nenengku tersayang! Semoga kamu jadi pribadi yang makin baik, sukses dalam studi, dan selalu ceria nyebarin tawa ke orang-orang di sekitar Neneng. Aa selalu ada buat nemenin dan dukung setiap langkah Neneng 💖 Aa juga mau minta maaf yaa, karena sekarang Aa belum bisa ngasih apa-apa ke Neneng, tapi insyaAllah nanti kalau Aa sudah kerja jeung punya uang, naon wae yang Neneng pengen bakal Aa usahain buat dibeliin 💖",
      color: "#ff8fa3",
      gradient: "from-[#ff8fa3] to-[#ffb3c1]",
      icon: "👧",
      birthdayDate: "30-November-2010",
      coupons: ["Voucher Jajan Seblak / Baso Aci", "Top up Game atau Skin Bebas Pilih", "Voucher Jalan-jalan ke Mall Bareng Aa"]
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Check voice support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupported(false);
    }

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startVoiceRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceStatus("listening");
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setRecordedTranscript(transcript);
      
      const keywords = ["selamat", "ulang", "tahun", "ya", "yaa", "hbd"];
      const matchCount = keywords.filter(word => transcript.includes(word)).length;
      
      if (matchCount >= 2 || transcript.includes("selamat ulang tahun")) {
        setVoiceStatus("success");
        setEntryMethod("voice"); // SET VOICE ENTRY
        setTimeout(() => {
          setShowIntro(false);
          setShowSelection(true);
        }, 800);
      } else {
        setVoiceStatus("error");
        setTimeout(() => setVoiceStatus("idle"), 2500);
      }
    };

    recognition.onerror = () => {
      setVoiceStatus("error");
      setIsListening(false);
      setTimeout(() => setVoiceStatus("idle"), 2000);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleManualEntry = () => {
    setEntryMethod("manual");
    setShowIntro(false);
    setShowSelection(true);
  };

  const handleIdentitySelect = (person: Person) => {
    if (entryMethod === "voice") {
      // Direct access if entered via voice
      setCurrentUser(person);
      setShowSelection(false);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    } else {
      // Require password if entered manually
      setUnlockingPerson(person);
      setPasswordInput("");
      setPasswordError(false);
    }
  };

  const handleVerifyPassword = () => {
    if (!unlockingPerson) return;
    
    // Passwords mapped to new names
    const passwords: Record<string, string> = {
      "Mamah": "16778",
      "Bapak": "151079",
      "Neneng": "301110"
    };

    if (passwordInput === passwords[unlockingPerson.name]) {
      setCurrentUser(unlockingPerson);
      setShowSelection(false);
      setUnlockingPerson(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 8000);
    } else {
      setPasswordError(true);
      setTimeout(() => setPasswordError(false), 2000);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSelection(true);
    setActiveTab("home");
    setRevealedCoupon(null);
  };

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden font-outfit selection:bg-pink-300">
      
      {/* 1. Intro Overlay with Voice Activation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            className="fixed inset-0 z-[300] mesh-bg flex flex-col items-center justify-center p-6 bg-pink-50 overflow-hidden"
          >
            {/* Pink Heart Rain Effect - Only render on client to avoid hydration mismatch */}
            {isMounted && <HeartRain />}

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-2xl relative z-10"
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="w-32 h-32 md:w-56 md:h-56 flex items-center justify-center mx-auto mb-10 overflow-hidden rounded-full border-4 border-dashed border-pink-400/30 p-4 bg-white/20 backdrop-blur-sm shadow-2xl">
                <Image src="/logo.png" alt="Logo" width={224} height={224} className="object-contain" priority />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-pink-600 mb-6 tracking-tight drop-shadow-xl">Selamat ulang <br /> tahun yaa</h1>
              <div className="flex flex-col items-center gap-8">
                {voiceStatus === "success" ? (
                  <motion.div animate={{ scale: 1.2 }} className="text-4xl text-green-500 font-bold">Akses Diterima! ✨</motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <button onClick={startVoiceRecognition} disabled={isListening} className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer pointer-events-auto z-50 ${isListening ? 'bg-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.5)] scale-110' : 'bg-gradient-to-r from-pink-500 to-rose-600 shadow-xl shadow-pink-200'} text-white`}>
                      {isListening && <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 bg-pink-400 rounded-full" />}
                      <span className="text-4xl md:text-5xl relative z-10">{isListening ? "🎙️" : voiceStatus === "error" ? "❌" : "🎤"}</span>
                    </button>
                    <p className="mt-8 text-pink-700 font-bold text-lg italic">{isListening ? "Mendengarkan..." : voiceStatus === "error" ? "Coba lagi..." : "Klik & katakan: 'Selamat ulang tahun yaa'"}</p>
                    <button onClick={handleManualEntry} className="mt-12 text-pink-400 text-xs font-bold uppercase tracking-widest hover:text-pink-600 transition-colors">Atau Buka Manual 🔓</button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Intermediate Selection Screen */}
      <AnimatePresence>
        {showSelection && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed inset-0 z-[200] mesh-bg flex flex-col items-center justify-center p-10 overflow-y-auto"
          >
            <div className="max-w-5xl w-full text-center">
              <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="mb-16">
                <div className="w-20 h-20 mx-auto mb-6 opacity-80">
                  <Image src="/logo.png" alt="Logo Small" width={80} height={80} className="object-contain" />
                </div>
                <span className="text-pink-500 font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Siapa Yang Masuk Hari Ini Yaa?</span>
                <h2 className="text-4xl md:text-6xl font-black text-pink-700 tracking-tighter filter drop-shadow-md">Pilih Identitas Kamu</h2>
                <p className="text-pink-900/40 font-medium mt-4">Ketuk salah satu nama untuk membuka kejutan ulang tahun yang sederhana ini.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-4">
                {people.map((person) => (
                  <motion.div
                    key={person.name}
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleIdentitySelect(person)}
                    className="group cursor-pointer"
                  >
                    <div className={`relative h-[350px] w-full rounded-[3rem] bg-gradient-to-br ${person.gradient} shadow-2xl flex flex-col items-center justify-center p-8 overflow-hidden transition-all duration-500 group-hover:shadow-pink-300/50`}>
                       <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-5xl mb-6 shadow-inner">
                         {person.icon}
                       </div>
                       <h3 className="text-white text-3xl font-black tracking-tight mb-1">{person.name}</h3>
                       <span className="text-white/80 font-bold text-xs uppercase tracking-widest mb-1">{person.role}</span>
                       <span className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em] mb-8">{person.birthdayDate}</span>
                       <div className="px-6 py-2 bg-white/20 rounded-full border border-white/20 text-white font-bold text-[10px] tracking-widest uppercase">
                          {entryMethod === "voice" ? "MASUK KESINI ✨" : "MASUK KESINI 🔐"}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => { setShowSelection(false); setShowIntro(true); }} className="mt-20 text-pink-400 font-bold text-xs hover:text-pink-600 flex items-center gap-2 mx-auto uppercase tracking-extra-widest">
                <span>↩</span> Kembali ke Beranda
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Content (Dashboard) */}
      <AnimatePresence>
        {currentUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-30">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 w-full px-10 py-8 z-50 pointer-events-none">
              <div className="max-w-[1440px] mx-auto grid grid-cols-3 items-center pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Image src="/logo.png" alt="Logo tiny" width={40} height={40} className="object-contain" />
                  </div>
                  <span className="text-lg font-black text-pink-700 tracking-tighter">MYFAMILYBIRTHDAY</span>
                </div>
                <div className="hidden lg:flex items-center justify-center gap-10 font-bold text-xs tracking-widest uppercase text-pink-800 opacity-60">
                  <a href="#home" className="hover:text-pink-500 transition-colors">Home</a>
                  <a href="#message" className="hover:text-pink-500 transition-colors">Pesan</a>
                  <a href="#about" className="hover:text-pink-500 transition-colors">Tentang</a>
                </div>
                 <div className="flex items-center justify-end gap-6">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-pink-500 text-white animate-pulse' : 'bg-pink-100 text-pink-500'}`}
                    >
                      {isPlaying ? "🎵" : "🔇"}
                    </button>
                    <button onClick={handleLogout} className="text-[10px] font-black tracking-widest text-pink-400 hover:text-pink-600 transition-colors uppercase">Ganti User ↩</button>
                    <div className="px-6 py-2 bg-pink-100 uppercase text-pink-600 font-black text-[10px] rounded-full border border-pink-200">{currentUser.name} Masuk</div>
                 </div>
              </div>
            </nav>

            <main className="min-h-screen pt-32 pb-24 px-6 md:px-10 relative overflow-hidden flex flex-col items-center">
               <div className="absolute inset-0 bg-dot-pattern opacity-20" />
               
               {/* Dashboard Tab Navigation */}
               <div className="relative z-40 mb-12 flex bg-white/40 backdrop-blur-xl p-2 rounded-full border border-pink-100 shadow-xl">
                  {[
                    { id: "home", label: "Celebration", icon: "✨" },
                    { id: "surprise", label: "Surprise", icon: "🎁" },
                    { id: "memories", label: "Moments", icon: "💖" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-500 ${
                        activeTab === tab.id 
                        ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-200' 
                        : 'text-pink-400 hover:text-pink-600 hover:bg-white/50'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden md:inline">{tab.label}</span>
                    </button>
                  ))}
               </div>

               <AnimatePresence mode="wait">
                 {activeTab === "home" && (
                   <motion.div 
                     key="home"
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="w-full max-w-4xl flex flex-col items-center"
                   >
                     {/* Visual Centerpiece */}
                     <motion.div 
                       whileHover={{ scale: 1.02 }}
                       className="w-[280px] h-[280px] md:w-[400px] md:h-[400px] rounded-[4rem] bg-gradient-to-br from-pink-400 to-rose-500 border-[12px] border-white/40 shadow-[0_20px_60px_rgba(244,114,182,0.3)] flex flex-col justify-center p-8 text-center relative z-10 overflow-hidden"
                     >
                        <motion.div animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity }} className="text-8xl mb-6">
                          {currentUser.icon}
                        </motion.div>
                        <h2 className="text-white text-3xl md:text-5xl font-black leading-tight drop-shadow-lg uppercase tracking-tighter">
                          Happy Birthday <br/> {currentUser.name}!
                        </h2>
                     </motion.div>
                     
                     <div className="mt-12 w-full max-w-2xl bg-white/70 backdrop-blur-3xl border border-white/50 rounded-[3.5rem] p-10 md:p-16 shadow-2xl shadow-pink-200/20 relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          Ucapan Dari Aa
                        </div>
                        <p className="text-gray-700 text-xl md:text-2xl font-serif italic leading-relaxed text-center whitespace-pre-wrap">
                          "{currentUser.message}"
                        </p>
                        <div className="mt-12 flex justify-center gap-6 text-3xl">
                          {["🎁", "🎈", "🎂", "✨"].map((e, idx) => (
                            <motion.span 
                              key={e} 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 + (idx * 0.1) }}
                              whileHover={{ scale: 1.5, rotate: 20 }}
                            >
                              {e}
                            </motion.span>
                          ))}
                        </div>
                     </div>
                   </motion.div>
                 )}

                 {activeTab === "surprise" && (
                   <motion.div 
                     key="surprise"
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.1 }}
                     className="w-full max-w-4xl flex flex-col items-center py-10"
                   >
                     <div className="text-center mb-16">
                        <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Special for {currentUser.name}</span>
                        <h2 className="text-5xl md:text-7xl font-black text-pink-800 tracking-tighter">
                          {revealedCoupon ? "Yeay! Kamu Dapat..." : "Ketuk Kotaknya! 🎁"}
                        </h2>
                     </div>
                     
                     <div className="relative">
                       <AnimatePresence mode="wait">
                         {!revealedCoupon ? (
                           <motion.div 
                             key="closed-box"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={() => {
                               setShowConfetti(true);
                               const randomCoupon = currentUser.coupons[Math.floor(Math.random() * currentUser.coupons.length)];
                               setRevealedCoupon(randomCoupon);
                               setTimeout(() => setShowConfetti(false), 5000);
                             }}
                             className="relative w-64 h-64 md:w-80 md:h-80 cursor-pointer"
                           >
                              <motion.div 
                                animate={{ y: [0, -20, 0], rotate: [0, 2, -2, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-full h-full bg-pink-100 rounded-[3rem] border-4 border-pink-200 flex items-center justify-center shadow-2xl overflow-hidden group"
                              >
                                 <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                 <span className="text-8xl md:text-9xl filter drop-shadow-2xl group-hover:scale-110 transition-transform">🎁</span>
                              </motion.div>
                              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -inset-10 border-4 border-dashed border-pink-200 rounded-full opacity-30 pointer-events-none" />
                           </motion.div>
                         ) : (
                           <motion.div 
                             key="revealed-coupon"
                             initial={{ opacity: 0, scale: 0.5, y: 50 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             className="flex flex-col items-center"
                           >
                             <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border-4 border-pink-100 relative overflow-hidden">
                               <div className="bg-gradient-to-br from-pink-500 to-rose-600 px-8 py-12 rounded-[2rem] text-center text-white w-72 md:w-[400px]">
                                 <div className="text-4xl mb-6">✨</div>
                                 <p className="text-[10px] font-black tracking-widest uppercase opacity-70 mb-2">FAMILY BIRTHDAY VOUCHER</p>
                                 <h3 className="text-2xl md:text-3xl font-black leading-tight mb-8">
                                   {revealedCoupon}
                                 </h3>
                                 <div className="w-full h-px bg-white/20 mb-8" />
                                 <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                                   Tukarkan voucher ini ke Aa kapan saja! <br/> (Hanya berlaku untuk yang ulang tahun hari ini ❤️)
                                 </p>
                               </div>
                               <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
                               <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full" />
                             </div>
                             
                             <button 
                               onClick={() => setRevealedCoupon(null)}
                               className="mt-12 text-pink-500 font-black text-[10px] uppercase tracking-widest hover:text-rose-600 transition-colors flex items-center gap-2"
                             >
                               <span>↺</span> Coba Lagi
                             </button>
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>

                     {!revealedCoupon && (
                       <p className="mt-16 text-pink-900/40 font-bold uppercase tracking-widest text-xs">
                         Ada kejutan kecil di setiap ketukan ✨
                       </p>
                     )}
                   </motion.div>
                 )}

                 {activeTab === "memories" && (
                   <motion.div 
                     key="memories"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="w-full max-w-5xl"
                   >
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white/60 backdrop-blur-2xl p-10 md:p-12 rounded-[3.5rem] border border-pink-100 shadow-xl flex flex-col">
                           <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-3xl mb-8 shadow-inner">🏆</div>
                           <h3 className="text-2xl font-black text-pink-800 mb-4 tracking-tight">Kenapa {currentUser.name} Hebat?</h3>
                           <ul className="space-y-4 mb-12">
                             {[
                               "Selalu memberi dukungan penuh buat Aa",
                               "Sabar banget ngadepin Aa nu rada on-on",
                               "Sumber kebahagiaan di rumah kita ❤️",
                               "Paling ngertiin apa yang Aa butuhin"
                             ].map((trait, i) => (
                               <motion.li 
                                 key={i}
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: i * 0.1 }}
                                 className="flex items-center gap-4 text-gray-600 font-medium"
                               >
                                 <span className="w-2 h-2 rounded-full bg-pink-400" />
                                 {trait}
                               </motion.li>
                             ))}
                           </ul>

                           {/* Interactive Love Meter */}
                           <div className="mt-auto pt-8 border-t border-pink-50">
                              <div className="flex justify-between items-center mb-4">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-pink-500">Love Meter Untuk Aa</span>
                                 <span className="text-lg font-black text-pink-600">{loveLevel}%</span>
                              </div>
                              <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={loveLevel} 
                                onChange={(e) => setLoveLevel(parseInt(e.target.value))}
                                className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500 mb-4"
                              />
                              <p className="text-[9px] font-bold text-pink-400 italic text-center">
                                {loveLevel < 30 ? "Masa sakitu hungkul? 🥺" : loveLevel < 70 ? "Hatur nuhun Mamah/Bapak/Neng 💖" : "I LOVE YOU TOO! ✨💖"}
                              </p>
                           </div>
                        </div>

                        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-10 md:p-12 rounded-[3.5rem] shadow-2xl shadow-pink-200 text-white relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:rotate-12 transition-transform duration-700">
                              <div className="w-32 h-32 md:w-56 md:h-56 border-8 border-white rounded-[3rem] rotate-12" />
                           </div>
                           <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-8 backdrop-blur-md shadow-inner">📸</div>
                           <h3 className="text-2xl font-black mb-4 tracking-tight">Gallery Segera Hadir</h3>
                           <p className="text-white/80 font-medium leading-relaxed mb-12">
                             Nanti di bagian ini Aa bakal pasang foto-foto kebersamaan kita yang paling estetik. Untuk sekarang, bayangin aja dulu betapa gantengnya Aa dan gimana sayangnya Aa ka {currentUser.name} 😋
                           </p>
                           <div className="mt-auto pt-8 border-t border-white/20 flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center text-xl">✨</div>
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Status Album</p>
                                <p className="text-xs font-black tracking-widest uppercase">Sedang Kurasi Foto...</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Decorative floating elements specific to tab */}
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="fixed inset-0 pointer-events-none opacity-10 z-0">
                  <div className={`sphere-3d absolute top-1/2 left-1/4 w-32 h-32 rounded-full`} />
                  <div className={`sphere-3d absolute bottom-1/4 right-1/2 w-48 h-48 rounded-full`} />
               </motion.div>
            </main>

            <div id="about" className="py-32 px-10 mesh-bg border-t border-pink-100">
               <div className="max-w-4xl mx-auto text-center">
                  <div className="w-32 h-32 mx-auto mb-10 overflow-hidden rounded-full p-2 bg-white shadow-xl">
                    <Image src="/logo.png" alt="About Logo" width={128} height={128} className="object-contain" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-pink-800 mb-8 tracking-tighter">Terima Kasih Telah Hadir</h2>
                  <p className="text-pink-900/50 text-lg md:text-xl font-medium leading-relaxed italic">"Website ini dibuat spesial sebagai bentuk cinta, kasih sayang, doa, dan apresiasi Aa untuk {currentUser.name}. Semoga hari ini dan hari-hari ke depan selalu dipenuhi kebahagiaan, kesehatan, dan segala hal baik dari Allah SWT 💖"</p>
                  <div className="mt-16 flex flex-wrap justify-center gap-6">
                    <a 
                      href="https://www.tiktok.com/@malifsuryaramadhan" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-10 py-4 bg-white border border-pink-100 rounded-3xl text-pink-700 font-bold shadow-xl hover:shadow-pink-200 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                      TIKTOK 
                    </a>
                    <a 
                      href="https://www.instagram.com/_mochalifsurya14_/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-10 py-4 bg-white border border-pink-100 rounded-3xl text-pink-700 font-bold shadow-xl hover:shadow-pink-200 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      INSTAGRAM 
                    </a>
                  </div>
               </div>
            </div>

            <footer className="py-20 px-10 border-t border-pink-50 relative overflow-hidden">
               <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                  <div className="text-left md:w-1/3">
                     <p className="text-pink-800/40 text-[9px] font-bold uppercase tracking-[0.3em]">Developer by Moch Alif Surya Ramadhan</p>
                  </div>
                  <div className="text-center md:w-1/3">
                     <p className="text-pink-800/20 font-bold tracking-[0.5em] uppercase text-[10px]">MY FAMILY BIRTHDAY • {currentUser.name} EDISI</p>
                  </div>
                  <div className="md:w-1/3" /> {/* Spacer */}
               </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} colors={['#ff4d6d', '#ff758c', '#ff8fa3', '#ffb3c1', '#ffffff']} />}

      {/* Password Modal Overlay */}
      <AnimatePresence mode="wait">
        {unlockingPerson && (
          <motion.div
            key="password-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-pink-900/40 backdrop-blur-md z-[400] flex items-center justify-center p-6"
            onClick={() => setUnlockingPerson(null)}
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] max-w-sm w-full p-10 shadow-2xl border border-pink-100 text-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-400 to-rose-500" />
              <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center mx-auto mb-6 shadow-sm p-3">
                <Image src="/logo.png" alt="Password Logo" width={60} height={60} className="object-contain" />
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2 leading-none">Akses Terkunci</h3>
              <p className="text-pink-500/60 font-bold text-sm mb-8 uppercase tracking-widest leading-relaxed">Masukkan Kode Akses <br/> {unlockingPerson.name}</p>
              <div className="relative mb-6">
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerifyPassword()} placeholder="Kode Akses..." className={`w-full px-6 py-4 bg-pink-50/50 border-2 rounded-2xl text-center text-xl font-bold tracking-[0.5em] transition-all outline-none ${passwordError ? 'border-red-400 bg-red-50 text-red-500' : 'border-pink-100 focus:border-pink-400 focus:bg-white text-pink-700'}`} autoFocus />
                {passwordError && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-7 left-0 w-full text-red-500 text-xs font-bold">Password salah, coba lagi!</motion.p>}
              </div>
              <button onClick={handleVerifyPassword} className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest">Buka Sekarang ✨</button>
              <button onClick={() => setUnlockingPerson(null)} className="mt-6 text-pink-400 text-xs font-bold hover:text-pink-600 transition-colors uppercase tracking-widest">Batal</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}