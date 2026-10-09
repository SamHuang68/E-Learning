import { useEffect, useId, useRef, useState } from 'react'
import type { AudioLessonLanguage, AudioLessonSegment, AudioLessonSource } from '../utils/audioLessonTypes'
import { exportAudioCheck, type AudioCheck } from '../utils/語音檢查'

export function AudioSourceLabel({ source, en }: { source: AudioLessonSource; en: boolean }) {
  const voice = source.voice
  const service = voice?.localService === true ? en ? 'On-device voice' : '本機聲音'
    : voice?.localService === false ? en ? 'Network voice' : '連線聲音'
      : en ? 'Service type unknown' : '服務類型未知'
  return <div className="audio-lesson-source-detail">
    <p>{en ? 'Selected source: ' : '選用音源：'}{source.kind === 'clip'
      ? en ? 'Lesson audio' : '教材音檔'
      : <>{en ? 'System speech' : '系統語音'} · {voice
        ? voice.name || (en ? 'Browser default voice' : '瀏覽器預設聲音')
        : en ? 'Voice not selected yet' : '尚未取得聲音'} · {service}</>}
      {` · ${voice?.lang || source.lang}`}</p>
    {source.fallbackReason ? <p>{en
      ? 'The lesson audio failed; system speech was attempted instead.'
      : '教材音檔未能播放，已改嘗試系統語音。'}{` (${source.fallbackReason})`}</p> : null}
  </div>
}

type Props = {
  en: boolean
  check: AudioCheck | null
  samples: AudioLessonSegment[]
  canPlay: (items: AudioLessonSegment[]) => boolean
  languageName: (lang: AudioLessonLanguage) => string
  onPlay: (sample: AudioLessonSegment) => void
  onRefresh: () => void
  onHeard: (heard: 'yes' | 'no') => void
}

export function AudioCheckPanel({ en, check, samples, canPlay, languageName, onPlay, onRefresh, onHeard }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [copyState, setCopyState] = useState({ status: 'ready' })
  const panelRef = useRef<HTMLDetailsElement>(null)
  const copyRun = useRef(0)
  const exportId = useId()
  const report = check ? exportAudioCheck(check) : ''
  useEffect(() => {
    if (check?.phase === 'error' || check?.heard === 'no') setExpanded(true)
  }, [check?.phase, check?.heard])
  useEffect(() => {
    copyRun.current += 1
    setCopyState({ status: 'ready' })
    return () => { copyRun.current += 1 }
  }, [report])
  const finishedCheck = check?.isCheck && ['complete', 'error', 'stopped'].includes(check.phase)
  async function copy() {
    const run = ++copyRun.current
    try {
      await navigator.clipboard.writeText(report)
      if (copyRun.current === run) setCopyState({ status: 'copied' })
    } catch {
      if (copyRun.current === run) setCopyState({ status: 'failed' })
    }
  }
  return <details className="audio-check" ref={panelRef} open={expanded}
    onToggle={() => setExpanded(panelRef.current?.open ?? false)}>
    <summary>{en ? 'Audio check and help' : '音訊檢查與協助'}</summary>
    <p>{en
      ? 'Test a short excerpt from this lesson using the selected speed and system voice, without repeat pauses or progress credit.'
      : '用目前語速與系統聲音試播本課短句，不留白跟讀，也不計入學習進度。'}</p>
    <div className="audio-lesson-actions">
      {samples.map((sample) => <button type="button" className="ghost" key={sample.lang}
        disabled={!canPlay([sample])} onClick={() => onPlay(sample)}>
        {en ? `Test ${languageName(sample.lang)} excerpt` : `試播${languageName(sample.lang)}節錄`}
      </button>)}
      <button type="button" className="ghost" onClick={onRefresh}>{en ? 'Refresh voice list' : '更新語音清單'}</button>
    </div>
    {!samples.length ? <p>{en ? 'No text excerpt is available for a voice test.' : '本課沒有可用於試播的文字節錄。'}</p> : null}
    {samples.some((sample) => !canPlay([sample])) ? <p>{en
      ? 'A disabled test needs system speech support and a matching device voice. Enable the language on your device, then refresh the list.'
      : '試播按鈕無法使用時，請確認瀏覽器支援系統語音，並在裝置啟用對應語言後更新清單。'}</p> : null}
    {finishedCheck ? <div className="audio-check-hearing">
      <p>{en ? 'Did you hear the excerpt? Playback events cannot confirm audible sound.' : '你有聽到節錄嗎？播放事件無法證明實際有聲音。'}</p>
      <div className="audio-lesson-actions">
        <button type="button" className="ghost" disabled={!check.started} aria-pressed={check.heard === 'yes'} onClick={() => onHeard('yes')}>{en ? 'I heard it' : '有聽到'}</button>
        <button type="button" className="ghost" aria-pressed={check.heard === 'no'} onClick={() => onHeard('no')}>{en ? 'I did not hear it' : '沒有聽到'}</button>
      </div>
      <p role="status">{check.heard === 'yes' ? en ? 'Your confirmation is recorded for this attempt only.' : '已記錄你對這次試播的確認。'
        : check.heard === 'no' ? en ? 'Check the settings below, then use the same test button to retry.' : '請依下方步驟檢查，再按相同試播按鈕重試。' : null}</p>
    </div> : null}
    <ol>
      <li>{en ? 'Check that the browser site or tab is not muted. This page cannot detect or remove site muting.' : '確認瀏覽器網站或分頁未被靜音；網頁無法判斷網站是否被靜音，也不能代為解除。'}</li>
      <li>{en ? 'Check the system volume mixer, output device, and headphones.' : '檢查系統音量混音器、輸出裝置與耳機。'}</li>
      <li>{en ? 'For a missing voice, enable the language in device settings and refresh the voice list. A network voice may require a connection.' : '缺少聲音時，請在裝置設定啟用該語言，再更新語音清單；連線聲音可能需要網路。'}</li>
    </ol>
    <p>{en ? 'No recording or automatic upload. The latest attempt stays in memory until you change the lesson, interface language, or close this view.' : '不錄音、不自動上傳。只在記憶體保留最近一次嘗試，切換課程、介面語言或關閉此畫面後清除。'}</p>
    {check ? <details className="audio-check-report">
      <summary>{en ? 'Diagnostic details' : '診斷明細'}</summary>
      <p>{en ? 'Includes the selected voice name and playback events; excludes lesson text, account data, and progress. Review before sharing.' : '包含選用聲音名稱與播放事件，不含教材文字、帳號與進度；分享前請先確認內容。'}</p>
      <label htmlFor={exportId}>{en ? 'Latest attempt report' : '最近一次診斷紀錄'}</label>
      <textarea id={exportId} readOnly value={report} rows={8} spellCheck={false} />
      <button type="button" className="ghost" onClick={() => { void copy() }}>{en ? 'Copy report' : '複製診斷紀錄'}</button>
      <p role="status">{copyState.status === 'copied' ? en ? 'Report copied.' : '已複製診斷紀錄。'
        : copyState.status === 'failed' ? en ? 'Copy was unavailable. Select and copy the text above manually.' : '無法自動複製，請選取上方文字手動複製。' : null}</p>
    </details> : null}
  </details>
}
