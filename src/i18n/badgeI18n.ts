import type { Badge } from '../engine/gamification'
import type { UiLocale } from './locale'
import { pickUi } from './pickUi'

const BADGE_COPY: Record<string, { title: [string, string]; description: [string, string] }> = {
  'badge-first-step': { title: ['啟程第一步', 'First step'], description: ['完成首次題目練習或卡片複習', 'Finish a first exercise or card review'] },
  'badge-streak-7': { title: ['一週恆心勳章', 'Seven-day habit'], description: ['連續學習達 7 天，建立穩定微學習習慣', 'Practice on 7 days in the local habit record'] },
  'badge-fsrs-master': { title: ['記憶百鍊大師', 'FSRS practice'], description: ['累積完成 50 次 FSRS 間隔提取複習', 'Log 50 FSRS review events'] },
  'badge-combo-10': { title: ['勢如破竹 10 連擊', '10 in a row'], description: ['在單次練習中達成連續 10 題正確', 'Answer 10 items correctly in one session'] },
  'badge-math-balance': { title: ['天平平衡宗師', 'Balance-scale practice'], description: ['透過等量公理成功解開 5 道一元一次方程式', 'Finish 5 one-variable equation items'] },
  'badge-math-algebra-tiles': { title: ['代數幾何拼圖手', 'Algebra tiles'], description: ['完成二次多項式與乘法公式之面積積木拼裝', 'Use algebra tiles on quadratic area models'] },
  'badge-math-matrix-warp': { title: ['高維空間領航員', 'Matrix transforms'], description: ['探索 2D 矩陣線性變換與行列式面積縮放', 'Explore 2D matrix maps and area scaling'] },
  'badge-math-riemann-limit': { title: ['阿基米德極限切片', 'Riemann slices'], description: ['親手調節黎曼和切片數逼近連續曲線定積分', 'Change Riemann slice count toward an integral'] },
  'badge-calc-riemann-pro': { title: ['黎曼和連續切片宗師', 'Calculus Riemann lab'], description: ['透過無限細分切片逼近定積分極限', 'Refine slices toward a definite-integral limit'] },
  'badge-phys-projectile': { title: ['力學拋體領航者', 'Projectile lab'], description: ['成功模擬斜拋運動並解開力學運動定律題目', 'Run the projectile lab and related items'] },
  'badge-phys-optics-master': { title: ['光學司乃耳之眼', 'Optics lab'], description: ['完成司乃耳折射實驗並掌握全反射臨界角', 'Use Snell refraction and critical-angle demos'] },
  'badge-phys-circuit-pro': { title: ['歐姆與電磁探索家', 'Circuits lab'], description: ['完成直流電路實驗與電磁感應分析', 'Finish DC circuit and induction lab work'] },
  'badge-chem-periodic-explorer': { title: ['週期表元素探測手', 'Periodic table lab'], description: ['探索元素週期律並掌握族群電子排列', 'Explore groups and electron arrangements'] },
  'badge-chem-vsepr-architect': { title: ['VSEPR 空間幾何建築師', 'VSEPR lab'], description: ['建立 3D 分子空間模型並掌握混成軌域幾何', 'Build 3D VSEPR models and hybrid geometry'] },
  'badge-chem-titration-pro': { title: ['酸鹼滴定鍊金術士', 'Titration lab'], description: ['完成 pH 滴定曲線模擬與緩衝溶液計算', 'Run pH titration curves and buffer drills'] },
  'badge-ja-kana-pro': { title: ['五十音無雙', 'Kana set'], description: ['完成清音、濁音與拗音完整發音演練', 'Practice seion, dakuon, and youon'] },
  'badge-ja-signals-ace': { title: ['3 秒文法動作訊號王', 'Japanese signal tree'], description: ['掌握補助動詞與授受動詞之情境決策樹', 'Use auxiliary and giving-receiving decision trees'] },
  'badge-toeic-chunk-master': { title: ['商務語塊直覺大師', 'TOEIC chunks'], description: ['完成高頻商務語塊三階段跟讀與主動輸出', 'Shadow and produce high-frequency chunks'] },
  'badge-toeic-gold-seeker': { title: ['黃金證書挑戰者', 'Blue / Gold band'], description: ['在多益模擬測驗中獲得 Blue / Gold 級距認證', 'Reach a Blue or Gold practice-band record'] },
  'badge-toeic-signals-pro': { title: ['多益3秒秒殺神手', 'TOEIC grammar traps'], description: ['掌握使役動詞、動名詞與連接詞判別等秒殺破題法則', 'Causative, gerund, and conjunction traps'] },
  'badge-zh-tone-master': { title: ['四聲發音大師', 'Tone practice'], description: ['精通五度標記法四聲音高曲線與拼音注音對照', 'Tone contours with pinyin and bopomofo'] },
  'badge-zh-false-friend-ace': { title: ['偽友詞避坑達人', 'False-friend drills'], description: ['完全掌握手紙、汽車、勉強、大丈夫等高頻日中同形異義語', 'Practice high-frequency Sino-Japanese lookalikes'] },
  'badge-zh-tocfl-pass': { title: ['TOCFL 模擬考首捷', 'TOCFL mock'], description: ['完成 TOCFL A1/A2 華語文能力模擬測驗並取得合格評級', 'Finish an A1/A2 TOCFL-style mock paper'] },
}

export function localizeBadge(badge: Badge, locale: UiLocale): Badge {
  const copy = BADGE_COPY[badge.id]
  if (!copy) return badge
  return {
    ...badge,
    title: pickUi(locale, copy.title[0], copy.title[1]),
    description: pickUi(locale, copy.description[0], copy.description[1]),
  }
}
