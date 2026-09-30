type Pair = [string, string]

export const RADAR_DIM_COPY: Record<string, Record<string, { label: Pair; description: Pair }>> = {
  math: {
    algebra: { label: ['代數方程運算', 'Algebra'], description: ['等量公理、因式分解與多項式運算能力', 'Equations, factoring, and polynomials'] },
    geometry: { label: ['空間幾何直觀', 'Geometry'], description: ['畢氏定理、圓周角與平面坐標幾何', 'Pythagoras, inscribed angles, coordinates'] },
    calculus: { label: ['函數與微積分', 'Functions'], description: ['三角函數、黎曼和切片與導函數極限', 'Trig, Riemann slices, derivative limits'] },
    statistics: { label: ['數據統計分析', 'Statistics'], description: ['機率分布、數據圖表與綜合模擬考表現', 'Chance, charts, and saved paper records'] },
    logic: { label: ['抽象邏輯證明', 'Reasoning'], description: ['無字證明推導與破題訊號辨析', 'Proof sketches and solving signals'] },
  },
  ja: {
    kana: { label: ['五十音與假名', 'Kana'], description: ['清音、濁音、拗音聽讀與拼寫', 'Seion, dakuon, and youon'] },
    vocab: { label: ['漢字與生活詞彙', 'Vocab'], description: ['JLPT 高頻核心詞彙與漢字讀音', 'High-frequency words and kanji readings'] },
    grammar: { label: ['動作訊號文法', 'Grammar signals'], description: ['補助動詞、授受動詞與時態判斷', 'Auxiliary, giving-receiving, and tense cues'] },
    keigo: { label: ['職場敬語溝通', 'Keigo'], description: ['丁寧語、尊敬語、謙讓語情境切換', 'Polite, honorific, and humble registers'] },
    listening: { label: ['聽力跟讀發音', 'Listening'], description: ['Shadowing 跟讀與語調高低重音', 'Shadowing and pitch accent'] },
  },
  en: {
    chunks: { label: ['高頻商務語塊', 'Chunks'], description: ['固定搭配、介系詞語塊與 3 秒反射', 'Collocations and short retrieval'] },
    listening: { label: ['聽力理解辨析', 'Listening'], description: ['Part 1~4 圖片、簡短對話與廣播訊息', 'Parts 1-4 pictures, talks, and talks'] },
    grammar: { label: ['Part 5 文法結構', 'Part 5 grammar'], description: ['詞性填空、連接詞、主被動時態', 'Speech-part, conjunction, and voice items'] },
    reading: { label: ['長文閱讀速讀', 'Reading'], description: ['Part 7 雙篇/三篇閱讀快速定位細節', 'Part 7 multi-passage detail location'] },
    vocab: { label: ['核心商務字彙', 'Business vocab'], description: ['證書級距（Orange→Gold）高頻單字', 'High-frequency words by practice band'] },
  },
  calculus: {
    limits: { label: ['極限與連續性 (ε-δ)', 'Limits (ε-δ)'], description: ['極限逼近、左右極限、連續性與漸近線判斷', 'One-sided limits, continuity, asymptotes'] },
    derivatives: { label: ['導數與切線極值', 'Derivatives'], description: ['鏈鎖律、微分幾何斜率、臨界點與凹凸反曲點', 'Chain rule, slope, critical points'] },
    integrals: { label: ['黎曼和與定積分', 'Integrals'], description: ['分割逼近、梯形/辛普森法與旋轉體體積', 'Slices, trapezoid/Simpson, solids'] },
    ftc: { label: ['微積分基本定理 (FTC)', 'FTC'], description: ['累積函數面積變化率與微分/積分互逆關係', 'Accumulation rate and inverse pair'] },
    taylor: { label: ['泰勒級數與逼近', 'Taylor series'], description: ['多項式局部逼近、收斂半徑與拉格朗日餘項', 'Local polynomials and remainder'] },
  },
  physics: {
    mechanics: { label: ['力學與運動定律', 'Mechanics'], description: ['斜拋、牛頓定律、動量與力學能守恆、SHM', 'Projectile, Newton, momentum, SHM'] },
    thermo: { label: ['熱學與分子動力論', 'Thermo'], description: ['理想氣體狀態方程式、熱力學第一定律與氣體動能', 'Ideal gas, first law, kinetic theory'] },
    waves: { label: ['波動與幾何物理光學', 'Waves'], description: ['波的反射折射干涉繞射、司乃耳定律、雙狹縫實驗', 'Reflection, Snell, double-slit'] },
    electromagnetism: { label: ['電磁學與電路分析', 'E&M'], description: ['庫仑定律、克希荷夫電路、勞兮茲力與法拉第電磁感應', 'Coulomb, Kirchhoff, Faraday'] },
    modern: { label: ['近代物理與量子現象', 'Modern physics'], description: ['光電效應、物質波、波耳原子模型與核反應', 'Photoelectric, matter waves, Bohr'] },
  },
  chemistry: {
    structure: { label: ['物質構造與化學鍵', 'Bonding'], description: ['週期表規律、電子排列、VSEPR 分子幾何與混成軌域', 'Periodic table, VSEPR, hybrids'] },
    stoichiometry: { label: ['化學計量與氣體溶液', 'Stoichiometry'], description: ['莫耳數反應式計量、理想氣體定律與溶液依數性', 'Moles, gas law, colligative properties'] },
    equilibrium: { label: ['反應速率與化學平衡', 'Kinetics'], description: ['碰撞學說、活化能、勒沙特列平衡移動與 Ksp', 'Collision theory, Le Chatelier, Ksp'] },
    acid_redox: { label: ['酸鹼滴定與電化學電池', 'Acid-base'], description: ['pH 緩衝溶液、滴定曲線、氧化數與法拉第電解定律', 'Buffers, titration, Faraday'] },
    organic: { label: ['有機化學與生物聚合物', 'Organic'], description: ['工能基異構物命名、取代加成酯化反應與高分子聚合物', 'Functional groups and polymers'] },
  },
  zh: {
    tones_pronunciation: { label: ['四聲聲調與拼音發音', 'Tones'], description: ['五度標記法四聲音高曲線、有気音與そり舌音發音精確度', 'Tone contours, aspiration, retroflex'] },
    false_friends: { label: ['日中同形異義語辨析', 'False friends'], description: ['手紙・汽車・勉強・大丈夫等高頻日中偽友詞避坑掌握度', 'High-frequency Sino-Japanese lookalikes'] },
    grammar_signals: { label: ['3秒文法動作訊號樹', 'Grammar signals'], description: ['把字句、被字句、了1/了2、是…的焦點強調構文秒殺法則', 'Ba, passive, le, and shi-de cues'] },
    practical_dialogue: { label: ['生活情境對話與跟讀', 'Dialogue'], description: ['手搖飲微糖去冰、士林夜市點餐、MRT捷運與超商咖啡對話', 'Drinks, night market, MRT, convenience store'] },
    tocfl_competency: { label: ['TOCFL 華語文測驗實力', 'TOCFL mock'], description: ['TOCFL A1/A2 聽力理解、詞彙語法與閱讀理解應試落點', 'A1/A2 listening, vocab, and reading items'] },
  },
  cs: {
    hardware_arch: { label: ['電腦硬體與馮紐曼架構', 'Hardware'], description: ['五大功能單元（CU, ALU, MU, IU, OU）、系統匯流排、暫存器與機器週期', 'Von Neumann units, bus, registers'] },
    os_system: { label: ['作業系統與行程記憶體', 'OS'], description: ['行程執行緒區別、CPU 排程、死結四大條件、虛擬記憶體與分頁機制', 'Processes, scheduling, deadlock, paging'] },
    network_security: { label: ['網路協定與網際網路通訊', 'Networks'], description: ['OSI 七層與 TCP/IP、三向交握、DNS 域名解析、HTTP/HTTPS 與 TLS', 'OSI, TCP/IP, handshake, DNS, TLS'] },
    ai_compute: { label: ['現代 AI 硬體與加速晶片', 'AI hardware'], description: ['CPU vs GPU 平行運算、TPU 脈動陣列、NPU 邊緣推論與 VRAM 最佳化', 'CPU/GPU, TPU, NPU, VRAM'] },
    llm_algorithms: { label: ['Transformer 與大模型架構', 'Transformers'], description: ['Self-Attention 自注意力機制、KV Cache、量化技術 (INT4) 與 Hive Agent', 'Attention, KV cache, INT4, agents'] },
  },
}
