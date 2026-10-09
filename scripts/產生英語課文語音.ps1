#requires -Version 5.1
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
if ($PSVersionTable.PSEdition -ne 'Desktop') {
    throw '請用 Windows PowerShell 執行：powershell.exe -NoProfile -File .\scripts\產生英語課文語音.ps1。此產音工具不會安裝聲音或套件。'
}

$workspace = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$sourceFile = Join-Path $workspace 'src\toeic\data\practice\orange.ts'
$assetDirectory = Join-Path $workspace 'public\audio\toeic'
$assetPrefix = $assetDirectory + [IO.Path]::DirectorySeparatorChar
$logsDirectory = Join-Path $workspace 'logs'
$voiceName = 'Microsoft David Desktop'
$voiceCulture = 'en-US'

function Assert-PlainPath([string] $path) {
    $resolved = [IO.Path]::GetFullPath($path)
    if ($resolved -ne $workspace -and
        -not $resolved.StartsWith($workspace + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw "路徑不在目前專案內：$resolved"
    }
    $current = $resolved
    while ($current.Length -ge $workspace.Length) {
        if (Test-Path -LiteralPath $current) {
            $item = Get-Item -LiteralPath $current -Force
            if (($item.Attributes -band [IO.FileAttributes]::ReparsePoint) -ne 0) {
                throw "拒絕使用連結或重新解析路徑：$current"
            }
        }
        if ($current -eq $workspace) { break }
        $current = [IO.Path]::GetDirectoryName($current)
    }
}

Assert-PlainPath $sourceFile
Assert-PlainPath $assetDirectory
Assert-PlainPath $logsDirectory
if (-not [IO.File]::Exists($sourceFile)) { throw "找不到原教材：$sourceFile" }
if (-not [IO.Directory]::Exists($assetDirectory)) { throw "找不到指定音檔目錄：$assetDirectory" }
if ([IO.File]::Exists($logsDirectory)) { throw "證據目錄不能是檔案：$logsDirectory" }

$node = Get-Command node.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1
$ffmpeg = Get-Command ffmpeg.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1
$ffprobe = Get-Command ffprobe.exe -CommandType Application -ErrorAction Stop | Select-Object -First 1

# 只讀既有三筆教材；識別與來源必須相符，英文原句不在腳本中另存清單。
$canonicalReader = @'
import { pathToFileURL } from 'node:url';
const { orangePractice } = await import(pathToFileURL(process.argv[1]).href);
const expected = ['orange-6-p1', 'orange-6-p2', 'orange-6-p3'];
const cards = orangePractice['orange:6']?.passage;
if (!Array.isArray(cards) || cards.length !== expected.length) throw new Error('指定教材必須恰有原有三筆課文');
const rows = expected.map((id) => {
  const matches = cards.filter((card) => card.id === id);
  if (matches.length !== 1) throw new Error(`教材識別不唯一：${id}`);
  const card = matches[0];
  const text = card.speakText ?? card.sentence;
  const src = card.audio?.src;
  if (typeof text !== 'string' || !text.trim()) throw new Error(`教材缺少原文：${id}`);
  if (src !== `audio/toeic/${id}.mp3`) throw new Error(`教材來源超出允許範圍：${id}`);
  return { id, text, src };
});
console.log(JSON.stringify(rows));
'@

$previousEncoding = [Console]::OutputEncoding
$synthesizer = $null
try {
    [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
    $sourceJson = & $node.Source --input-type=module -e $canonicalReader $sourceFile
    if ($LASTEXITCODE -ne 0) { throw '無法讀取原教材；需要支援原生 TypeScript 型別移除的 Node.js 版本。' }
    $sources = ConvertFrom-Json -InputObject ($sourceJson -join [Environment]::NewLine)
    if ($sources.Count -ne 3) { throw '原教材資料不符合指定三筆來源。' }

    # 預設不覆寫；在載入聲音、建立暫存目錄或產音之前先核對全部目標。
    foreach ($source in $sources) {
        if ($source.id -notmatch '^orange-6-p[123]$' -or $source.src -cne "audio/toeic/$($source.id).mp3") {
            throw "來源路徑不符合指定教材：$($source.src)"
        }
        $destination = [IO.Path]::GetFullPath((Join-Path (Join-Path $workspace 'public') $source.src))
        if (-not $destination.StartsWith($assetPrefix, [StringComparison]::OrdinalIgnoreCase)) {
            throw "拒絕寫入指定音檔目錄以外的位置：$destination"
        }
        Assert-PlainPath $destination
        if (Test-Path -LiteralPath $destination) {
            throw "拒絕覆寫既有教材音檔：$destination。需要重新產音時，請先明確決定如何保存既有素材及其驗收證據。"
        }
        $source | Add-Member -NotePropertyName destination -NotePropertyValue $destination
    }

    Add-Type -AssemblyName System.Speech
    $synthesizer = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $installedVoice = @($synthesizer.GetInstalledVoices() | Where-Object {
        $_.Enabled -and $_.VoiceInfo.Name -eq $voiceName -and $_.VoiceInfo.Culture.Name -eq $voiceCulture
    })
    if ($installedVoice.Count -ne 1) { throw "缺少已啟用的指定本機聲音：$voiceName（$voiceCulture）。本工具不會安裝或改用其他供應商。" }
    $synthesizer.SelectVoice($voiceName)
    $synthesizer.Rate = 0
    $synthesizer.Volume = 100

    if (-not [IO.Directory]::Exists($logsDirectory)) { [void][IO.Directory]::CreateDirectory($logsDirectory) }
    $scratch = Join-Path $logsDirectory ('英語課文產音-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '-' + [Guid]::NewGuid().ToString('N').Substring(0, 8))
    Assert-PlainPath $scratch
    if (Test-Path -LiteralPath $scratch) { throw "證據目錄已存在，拒絕覆寫：$scratch" }
    [void][IO.Directory]::CreateDirectory($scratch)
    $receipts = @()

    foreach ($source in $sources) {
        $wav = Join-Path $scratch ($source.id + '.wav')
        $mp3 = Join-Path $scratch ($source.id + '.mp3')
        $synthesizer.SetOutputToWaveFile($wav)
        try { $synthesizer.Speak([string]$source.text) }
        finally { $synthesizer.SetOutputToNull() }
        $sha = [Security.Cryptography.SHA256]::Create()
        try { $textHash = [BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes([string]$source.text))).Replace('-', '').ToLowerInvariant() }
        finally { $sha.Dispose() }
        $provenance = "來源：orange:6/$($source.id)；文字 SHA-256：$textHash；語言：$voiceCulture；產生器：Windows System.Speech；類型：本機系統語音合成；非真人錄音。"

        & $ffmpeg.Source -hide_banner -v error -n -i $wav -codec:a libmp3lame -b:a 128k -ar 44100 -ac 1 -write_xing 0 -id3v2_version 3 -write_id3v1 0 `
            -metadata "title=$($source.text)" -metadata "artist=$voiceName" -metadata 'album=TOEIC 本機系統語音合成教材（非真人錄音）' `
            -metadata 'language=eng' -metadata "comment=$provenance" $mp3
        if ($LASTEXITCODE -ne 0) { throw "MP3 轉檔失敗，未交付此素材：$($source.id)" }
        $probeJson = & $ffprobe.Source -v error -show_entries 'format=duration,size:stream=codec_name,sample_rate,channels' -of json $mp3
        if ($LASTEXITCODE -ne 0) { throw "無法讀取音檔格式：$($source.id)" }
        $probe = $probeJson | ConvertFrom-Json
        if (@($probe.streams).Count -ne 1 -or $probe.streams[0].codec_name -ne 'mp3' -or
            $probe.streams[0].sample_rate -ne '44100' -or $probe.streams[0].channels -ne 1) {
            throw "音檔格式不符合單聲道 MP3 契約：$($source.id)"
        }
        $duration = [double]::Parse($probe.format.duration, [Globalization.CultureInfo]::InvariantCulture)
        if ([double]::IsNaN($duration) -or [double]::IsInfinity($duration) -or $duration -le 0) {
            throw "音檔長度無效：$($source.id)"
        }
        & $ffmpeg.Source -hide_banner -v error -i $mp3 -f null -
        if ($LASTEXITCODE -ne 0) { throw "完整解碼失敗，未交付此素材：$($source.id)" }
        $source | Add-Member -NotePropertyName encoded -NotePropertyValue $mp3
        $receipts += [pscustomobject]@{
            '教材識別' = $source.id
            '原文' = $source.text
            '音檔相對路徑' = $source.src
            '聲音名稱' = $synthesizer.Voice.Name
            '語言' = $synthesizer.Voice.Culture.Name
            '長度毫秒' = [int][Math]::Round($duration * 1000)
            '位元組' = (Get-Item -LiteralPath $mp3).Length
            '音檔 SHA-256' = (Get-FileHash -LiteralPath $mp3 -Algorithm SHA256).Hash.ToLowerInvariant()
            '原文 SHA-256' = $textHash
            '完整解碼' = '通過；不代表人工聽辨或音質驗收'
        }
    }

    foreach ($source in $sources) {
        Assert-PlainPath $source.destination
        # File.Copy 的第三個參數明確為 false；競態下也不允許覆寫既有音檔。
        [IO.File]::Copy($source.encoded, $source.destination, $false)
    }
    Write-Host "已產生三筆本機合成教材音檔；WAV 與轉檔證據保留於：$scratch"
    Write-Host '請依下列實測值更新原教材的 durationMs、真實聲音名稱及素材 README；不自動改寫教材或既有證據。'
    $receipts | ConvertTo-Json -Depth 4
}
finally {
    if ($null -ne $synthesizer) { $synthesizer.Dispose() }
    [Console]::OutputEncoding = $previousEncoding
}
