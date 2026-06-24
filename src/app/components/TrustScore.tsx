import { motion } from "motion/react";

interface TrustScoreProps {
  score: number; // 0-100
  size?: "small" | "large";
}

export function TrustScore({ score, size = "large" }: TrustScoreProps) {
  const isLarge = size === "large";
  const dimension = isLarge ? 200 : 120;
  
  // Calculate detail level based on score (more intricate as trust grows)
  const detailLevel = Math.floor((score / 100) * 5);
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base pot shape */}
          <motion.path
            d="M100 30 L140 80 L135 160 C135 170 120 180 100 180 C80 180 65 170 65 160 L60 80 Z"
            fill="url(#pot-gradient)"
            stroke="#B85C42"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Weaving pattern detail - increases with score */}
          {detailLevel >= 1 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <path
                d="M70 90 Q85 92 100 90 Q115 88 130 90"
                stroke="#4A5D7F"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
            </motion.g>
          )}
          
          {detailLevel >= 2 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <path
                d="M68 110 Q85 108 100 110 Q115 112 132 110"
                stroke="#7A8F6B"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <circle cx="75" cy="100" r="2" fill="#B85C42" opacity="0.5" />
              <circle cx="125" cy="100" r="2" fill="#B85C42" opacity="0.5" />
            </motion.g>
          )}
          
          {detailLevel >= 3 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <path
                d="M70 130 Q85 132 100 130 Q115 128 130 130"
                stroke="#4A5D7F"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M72 150 Q85 148 100 150 Q115 152 128 150"
                stroke="#7A8F6B"
                strokeWidth="1.5"
                fill="none"
                opacity="0.6"
              />
            </motion.g>
          )}
          
          {detailLevel >= 4 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <circle cx="85" cy="120" r="2" fill="#D4A574" opacity="0.7" />
              <circle cx="100" cy="125" r="2" fill="#D4A574" opacity="0.7" />
              <circle cx="115" cy="120" r="2" fill="#D4A574" opacity="0.7" />
            </motion.g>
          )}
          
          {detailLevel >= 5 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <path
                d="M75 65 L80 75 M95 60 L100 70 M120 65 L115 75"
                stroke="#B85C42"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.4"
              />
            </motion.g>
          )}
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="pot-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D4A574" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#B85C42" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Score overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className={`font-playfair ${isLarge ? "text-4xl" : "text-2xl"} font-bold text-primary`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {score}
            </motion.div>
            {isLarge && (
              <div className="text-xs text-muted-foreground mt-1">Trust Score</div>
            )}
          </div>
        </div>
      </div>
      
      {isLarge && (
        <p className="text-sm text-center text-muted-foreground max-w-xs">
          Your trust grows with every contribution, weaving you deeper into the circle
        </p>
      )}
    </div>
  );
}
