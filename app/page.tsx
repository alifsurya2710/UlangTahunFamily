"use client";

import { useState, useEffect } from "react";
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
}

// ✅ FIXED HeartRain (NO hydration error)
const HeartRain = () => {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    const generated = [...Array(20)].map(() => ({
      x: Math.random() * 100,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 15,
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h, i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: h.x + "%", opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: h.duration,
            repeat: Infinity,
            delay: h.delay,
            ease: "linear",
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

  const [showIntro, setShowIntro] = useState(true);
  const [showSelection, setShowSelection] = useState(false);
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [entryMethod, setEntryMethod] = useState<"voice" | "manual" | null>(null);

  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "success" | "error">("idle");
  const [recordedTranscript, setRecordedTranscript] = useState("");
  const [browserSupported, setBrowserSupported] = useState(true);

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
      birthdayDate: "16-Juli-1978"
    },
    {
      name: "Bapak",
      role: "Superhero Keluarga",
      message: "Terima kasih Bapak atas semua perjuangan dan cinta Bapak ka Aa yang tak terbatas. Semoga di hari spesial ini Bapak selalu diberi kesehatan, kebahagiaan, dan kemudahan dalam segala hal, Aa bangga punya Bapak 💖 Aa oge minta maaf ka Bapak karna Aa can bisa jadi budak lalaki nu bisa dibanggakeun jeung diandelkeun ku Bapak, Aa juga minta maaf karna Aa orangna hese dibejaan, kadang polontong jeung banyak hereyna. Tapi jujur Aa bersyukur banget punya Bapak 💖 karena Bapak can pernah marah-marah atawa galak ka budakna, tara ngomong kasar, teu pernah ngabentak, Tapi paling kurang na Bapak mah rada on-on saeutik jeung pedit saeutik, tapi teu nanaon, namanya juga manusia pasti ada kurang jeung lebihna. Makasih yaa Bapak udah jadi Bapak yang baik dan perhatian ka Aa jeung ka si Neneng. LOVE YOU Bapak 💖",
      color: "#ff8fa3",
      gradient: "from-[#ff8fa3] to-[#ffb3c1]",
      icon: "👨‍👩‍👦",
      birthdayDate: "15-Oktober-1979"
    },
    {
      name: "Neneng",
      role: "Penghibur Keluarga",
      message: "Happy birthday Nenengku tersayang! Semoga kamu jadi pribadi yang makin baik, sukses dalam studi, dan selalu ceria nyebarin tawa ke orang-orang di sekitar Neneng. Aa selalu ada buat nemenin dan dukung setiap langkah Neneng 💖 Aa juga mau minta maaf yaa, karena sekarang Aa belum bisa ngasih apa-apa ke Neneng, tapi insyaAllah nanti kalau Aa sudah kerja jeung punya uang, naon wae yang Neneng pengen bakal Aa usahain buat dibeliin 💖",
      color: "#ff8fa3",
      gradient: "from-[#ff8fa3] to-[#ffb3c1]",
      icon: "👧",
      birthdayDate: "30-November-2010"
    }
  ];

  useEffect(() => {
    setIsMounted(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

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

  return (
    <div className="min-h-screen mesh-bg relative overflow-hidden">
      
      <AnimatePresence>
        {showIntro && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-pink-50">
            
            {/* ✅ SAFE NOW */}
            {isMounted && <HeartRain />}

            <div className="text-center">
              <h1 className="text-5xl font-bold text-pink-600">
                Selamat Ulang Tahun 🎂
              </h1>
              <button
                onClick={() => {
                  setShowIntro(false);
                  setShowSelection(true);
                }}
                className="mt-10 px-6 py-3 bg-pink-500 text-white rounded-full"
              >
                Masuk
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSelection && (
          <div className="flex items-center justify-center h-screen gap-10">
            {people.map((p) => (
              <button
                key={p.name}
                onClick={() => setCurrentUser(p)}
                className="p-10 bg-pink-200 rounded-xl"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </AnimatePresence>

      {currentUser && (
        <div className="text-center mt-40">
          <h1 className="text-4xl text-pink-600">
            Happy Birthday {currentUser.name} 🎉
          </h1>
          <p className="mt-6">{currentUser.message}</p>
        </div>
      )}

      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
        />
      )}
    </div>
  );
}