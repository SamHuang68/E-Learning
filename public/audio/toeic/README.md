# TOEIC 短聽力教材音檔

這三筆是 **本機系統語音合成** 的教材音檔，**非真人錄音**。2026-10-09 以已安裝的 Windows `System.Speech`、`Microsoft David Desktop`（`en-US`，語速 0、音量 100）產生，再以既有 FFmpeg 8.0.1 轉為 MP3。沒有下載錄音、安裝新依賴或使用外部聲音供應商。

原文只取自 `src/toeic/data/practice/orange.ts` 的 `orange:6` 三筆 `passage`，使用既有 `speakText ?? sentence` 契約；本輪三筆都沒有 `speakText` 覆寫。原課文、卡片識別與 `audio.src` 不變。檔內 ID3 標籤保存原文、真實聲音名稱、語言、教材識別及原文 SHA-256，並明示合成來源與非真人錄音。

| 音檔 | 位元組 | 實測長度毫秒 | 音檔 SHA-256 |
| --- | ---: | ---: | --- |
| `orange-6-p1.mp3` | 46936 | 2900 | `15b85c004a29284f329b6a1160b7d7c1a2f50b4d91e51e18fa6bce7a7ffc9206` |
| `orange-6-p2.mp3` | 47358 | 2926 | `e0a27c64be7e541725c89743cd6254cdcf46a632f002d14ee21efef44cbdd589` |
| `orange-6-p3.mp3` | 45684 | 2821 | `1fcfad217a683f2c5f693080ef636ac957fb911affbf9c4e5de23af481725b04` |

長度以 FFprobe 讀取後四捨五入至毫秒；格式為 MPEG-1 Layer III、44.1 kHz、單聲道、128 kbps CBR，無額外 Xing 框。三筆皆已完成 FFmpeg 全檔解碼檢查。檔案、格式、標籤與雜湊證據不能代替人工聽辨、語音轉錄或音質驗收，也不提供發音評分。

## 產生與防再發

產音需要本機已安裝的指定英文聲音、Node.js 原生 TypeScript 型別移除能力、FFmpeg 與 FFprobe。使用 Windows PowerShell：

```powershell
powershell.exe -NoProfile -File .\scripts\產生英語課文語音.ps1
```

腳本直接讀取原教材，只接受原三筆卡片與 `public/audio/toeic` 內對應路徑；在載入聲音或建立產音暫存前，會拒絕任何既有目標檔。沒有覆寫選項。若要重製，須先明確決定如何保存原素材與驗收證據，再同步更新實測 `durationMs`、真實聲音名稱及本表雜湊。腳本不會改寫教材或 README、不刪除舊證據，也不會自動執行測試。

WAV 與轉檔副本保留於 `logs/英語課文產音-<時間>-<識別>` 具名子目錄，不進教材或版本提交。正式播放沿用原本的 `AudioLesson` 與 `SpeakButton`，音檔失敗時仍依既有契約回退系統語音。

`src/toeic/課文音檔素材.test.ts` 以純 Node.js 讀取已交付的位元組，檢查三筆來源、MP3 框格式與長度、canonical 原文與文字雜湊、真實合成來源以及本表音檔雜湊。CI 不呼叫 Windows 聲音、FFmpeg、網路或產音腳本。
