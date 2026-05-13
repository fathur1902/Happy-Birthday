import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Heart, Sparkles, ChevronRight, BookHeart } from "lucide-react";
import "./App.css";

// =====================================================================
// === KOMPONEN REACT BITS ===
// =====================================================================

// 1. ShinyText (Fase 4): Efek cahaya mengkilap berjalan pada teks
const ShinyText = ({ text, speed = 3, className = "" }) => {
  return (
    <motion.span
      className={className}
      animate={{ backgroundPosition: ["200% center", "-200% center"] }}
      transition={{ repeat: Infinity, duration: speed, ease: "linear" }}
      style={{
        backgroundImage:
          "linear-gradient(120deg, #ec4899 40%, #fbcfe8 50%, #ec4899 60%)",
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }}
    >
      {text}
    </motion.span>
  );
};

// 2. BlurText (Fase 4): Teks muncul per kata dari keadaan blur
const BlurText = ({
  text = "",
  delay = 50,
  initialDelay = 0,
  className = "",
}) => {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{
            delay: initialDelay + index * (delay / 1000),
            duration: 0.4,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
};

// 3. SplitText (Fase 2): Huruf melompat satu per satu (Bouncy text)
const SplitText = ({ text, className = "", delay = 30 }) => {
  return (
    <span
      className={className}
      style={{ display: "inline-flex", flexWrap: "wrap" }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * (delay / 1000),
            type: "spring",
            stiffness: 300,
            damping: 10,
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// 4. Magnet (Fase 2): Tombol interaktif yang mengikuti kursor kursor/jari
const Magnet = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 }); // Intensitas magnet
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.div>
  );
};
// =====================================================================

const PACAR_NAME = "Dhea Mursetyani";

const flipbookPhotos = [
  "/images/hbd1.jpeg",
  "/images/hbd2.jpeg",
  "/images/hbd3.jpeg",
  "/images/hbd4.jpeg",
  "/images/hbd5.jpeg",
  "/images/hbd6.jpeg",
  "/images/hbd7.jpeg",
];

const heartPattern = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
].flat();

const pixels = Array.from({ length: 40 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  animationDuration: `${Math.random() * 2 + 1}s`,
  animationDelay: `${Math.random() * 2}s`,
}));

export default function App() {
  const [phase, setPhase] = useState("countdown");
  const [countdownText, setCountdownText] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const scatterPositions = useMemo(() => {
    return heartPattern.map(() => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      rotate: (Math.random() - 0.5) * 1080,
    }));
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;
    const sequence = ["3", "2", "1", "HAPPY 22nd\nBIRTHDAY", PACAR_NAME];
    let step = 0;
    const interval = setInterval(() => {
      setCountdownText(sequence[step]);
      step++;
      if (step > sequence.length) {
        clearInterval(interval);
        setPhase("flipbook");
      }
    }, 1400);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextPage = () => {
    if (currentPage < flipbookPhotos.length - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      setPhase("heart");
    }
  };

  return (
    <div className="min-h-screen w-full bg-pink-500 text-white font-sans overflow-hidden relative flex items-center justify-center perspective-[1200px]">
      <AnimatePresence mode="wait">
        {/* ==========================================
            FASE 1: COUNTDOWN
        ========================================== */}
        {phase === "countdown" && (
          <motion.div
            key="countdown"
            exit={{
              opacity: 0,
              scale: 2,
              filter: "blur(10px)",
              transition: { duration: 0.8 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {pixels.map((pixel) => (
              <motion.div
                key={pixel.id}
                className="absolute top-[-20px] w-4 h-4 bg-white opacity-40 rounded-sm"
                style={{ left: pixel.left }}
                animate={{ y: ["0vh", "120vh"], rotate: [0, 360] }}
                transition={{
                  duration: parseFloat(pixel.animationDuration),
                  delay: parseFloat(pixel.animationDelay),
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}

            <AnimatePresence mode="wait">
              {countdownText && (
                <motion.h1
                  key={countdownText}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: [0, 1, 0, 1],
                    scale: 1,
                  }}
                  exit={{ opacity: 0, scale: 1.2, y: 20 }}
                  transition={{
                    duration: 0.5,
                    ease: "steps(4)",
                  }}
                  className="text-3xl sm:text-4xl md:text-6xl text-white text-center px-4 leading-loose whitespace-pre-line"
                  style={{
                    fontFamily: "'Press Start 2P', monospace",
                    textShadow: "6px 6px 0px #be185d, -2px -2px 0px #f472b6",
                  }}
                >
                  {countdownText}
                </motion.h1>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ==========================================
            FASE 2: FLIPBOOK DENGAN REACT BITS
        ========================================== */}
        {phase === "flipbook" && (
          <motion.div
            key="flipbook"
            initial={{ opacity: 0, y: 100, rotateX: 10, rotateY: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 5, rotateY: -10 }}
            exit={{
              opacity: 0,
              scale: 0.5,
              rotateZ: -10,
              transition: { duration: 0.6 },
            }}
            className="relative w-[280px] h-[380px] sm:w-[350px] sm:h-[450px] group"
            style={{ transformStyle: "preserve-3d" }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-16 left-0 right-0 flex justify-center text-pink-500 font-bold"
            >
              <span className="bg-white/90 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm border border-pink-200 shadow-md">
                <BookHeart size={18} className="text-pink-500" />
                {/* IMPLEMENTASI SPLITTEXT PADA JUDUL FLIPBOOK */}
                <SplitText text="Coba liat ya bub hehe😘" delay={40} />
              </span>
            </motion.div>

            {flipbookPhotos.map((src, index) => {
              const isFlipped = currentPage > index;
              const isCurrent = currentPage === index;
              return (
                <motion.div
                  key={index}
                  className="absolute inset-0 origin-left rounded-r-2xl border-4 border-pink-100 bg-white shadow-2xl cursor-pointer"
                  style={{ zIndex: flipbookPhotos.length - index }}
                  initial={false}
                  whileHover={
                    isCurrent
                      ? { rotateY: -5, transition: { duration: 0.2 } }
                      : {}
                  }
                  animate={{
                    rotateY: isFlipped ? -160 : 0,
                    opacity: isFlipped ? 0 : 1,
                    boxShadow: isFlipped
                      ? "-20px 20px 30px rgba(0,0,0,0)"
                      : "20px 20px 40px rgba(0,0,0,0.5)",
                  }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 50,
                    damping: 12,
                  }}
                  onClick={isCurrent ? handleNextPage : undefined}
                >
                  <img
                    src={src}
                    alt="Kenangan"
                    className="w-full h-full object-cover rounded-r-xl pointer-events-none"
                  />
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />

                  {isCurrent && (
                    <div className="absolute bottom-4 right-4">
                      {/* IMPLEMENTASI MAGNET PADA TOMBOL NEXT */}
                      <Magnet>
                        <div className="bg-rose-500 p-3 rounded-full text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse hover:animate-none">
                          <ChevronRight />
                        </div>
                      </Magnet>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ==========================================
            FASE 3: SCATTER BERPUTAR MEMBENTUK HATI
        ========================================== */}
        {phase === "heart" && (
          <motion.div
            key="heart"
            className="absolute inset-0 flex flex-col items-center justify-center bg-pink-500"
            exit={{ opacity: 0, filter: "blur(20px)", scale: 2 }}
          >
            <div className="grid grid-cols-11 w-[90vmin] h-[90vmin] gap-[2px] sm:gap-1 relative z-10">
              {heartPattern.map((val, index) => {
                const startPos = scatterPositions[index];
                return (
                  <motion.div
                    key={index}
                    initial={{
                      x: startPos.x,
                      y: startPos.y,
                      rotate: startPos.rotate,
                      scale: 0,
                      opacity: 0,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      rotate: 0,
                      scale: 1,
                      opacity: val === 1 ? 1 : 0,
                    }}
                    transition={{
                      duration: 2,
                      type: "spring",
                      stiffness: 80,
                      damping: 15,
                      delay: val === 1 ? Math.random() * 1.5 : 0,
                    }}
                    className={`w-full h-full rounded-sm overflow-hidden ${val === 1 ? "shadow-[0_0_10px_rgba(244,63,94,0.4)]" : ""}`}
                  >
                    {val === 1 && (
                      <img
                        src={flipbookPhotos[index % flipbookPhotos.length]}
                        alt="mozaik"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 3.5, type: "spring", bounce: 0.5 }}
              onClick={() => setPhase("letter")}
              className="absolute z-50 flex items-center gap-3 px-8 py-4 bg-white text-pink-600 font-black text-xl md:text-2xl rounded-full shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-110 active:scale-95 transition-all"
            >
              <Heart className="fill-pink-500 animate-pulse" /> BACA YA BUB
            </motion.button>
          </motion.div>
        )}

        {/* ==========================================
            FASE 4: SURAT UCAPAN (DENGAN REACT BITS)
        ========================================== */}
        {phase === "letter" && (
          <>
            <div className="fixed inset-0 pointer-events-none z-50">
              <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={900}
                gravity={0.15}
                colors={["#ffffff", "#f43f5e", "#fb7185", "#fbcfe8"]}
              />
            </div>

            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
              className="text-center w-[90%] max-w-2xl bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-pink-100 z-10 text-gray-800"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", bounce: 0.6 }}
              >
                <Heart className="text-rose-500 fill-rose-500 mx-auto mb-4 h-16 w-16 animate-pulse" />
              </motion.div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 mb-2">
                Happy 22th Birthday, Sayang🎉
              </h1>

              <h2 className="text-lg sm:text-xl font-semibold mb-6 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 animate-spin text-pink-500" />
                <ShinyText text="The Missing Piece: Found" />
                <Sparkles className="h-4 w-4 animate-spin text-pink-500" />
              </h2>

              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-left bg-pink-50 p-5 rounded-2xl border border-pink-100 shadow-inner">
                <BlurText
                  initialDelay={1.5}
                  delay={50}
                  text="Haloo bubb, Selamat bertambah umur yaa menjadi 22th"
                />
                <BlurText
                  initialDelay={2.5}
                  delay={35}
                  text="Selamat ulang tahun bub. Terima kasih sudah menjadi partner yang selalu ada di setiap proses, baik sulit maupun senang. Dari masa kuliah sampai sekarang, kamu tetap menjadi dukungan terbaik yang pernah aku temui. Aku bersyukur memilikimu sebagai kepingan masa depanku. Mari terus melakangkah bersama kedepan."
                />
                <BlurText
                  initialDelay={6.5}
                  delay={35}
                  text="Semoga di umur 22th ini, kamu makin bahagia, rezekinya lancar, dan semoga makin sayang sama aku hehe. I'm so lucky to have you in my life."
                />
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 8.5, type: "spring" }}
                  className="font-extrabold text-rose-600 text-center text-xl mt-6"
                >
                  Love u more bubb❤️
                </motion.p>
              </div>

              <motion.div
                className="mt-8 opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 9.5 }}
              >
                <p className="text-sm text-gray-500 italic">
                  Dibuat dengan kondisi badan yang sedikit sakit
                </p>
                <p className="text-sm text-gray-500 italic">from ur love</p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
