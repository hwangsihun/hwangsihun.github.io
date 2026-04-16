$ErrorActionPreference = 'Stop'

$htmlPath = Join-Path $PSScriptRoot 'ARTSKOREALAB-design-system.html'
$pdfPath = Join-Path $PSScriptRoot 'ARTSKOREALAB-design-system.pdf'
$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$tempDir = Join-Path $PSScriptRoot '.chrome-temp'

if (-not (Test-Path $chromePath)) {
    throw "Google Chrome executable not found: $chromePath"
}

if (-not (Test-Path $htmlPath)) {
    throw "HTML source not found: $htmlPath"
}

$htmlUri = [System.Uri]::new($htmlPath).AbsoluteUri

try {
    New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

    & $chromePath `
        --headless=new `
        --disable-gpu `
        --no-first-run `
        --no-default-browser-check `
        --disable-crash-reporter `
        --allow-file-access-from-files `
        --run-all-compositor-stages-before-draw `
        --virtual-time-budget=12000 `
        "--user-data-dir=$tempDir" `
        --print-to-pdf-no-header `
        "--print-to-pdf=$pdfPath" `
        $htmlUri

    if (-not (Test-Path $pdfPath)) {
        throw "PDF export failed: $pdfPath was not created."
    }

    Write-Output "Exported: $pdfPath"
}
finally {
    if (Test-Path $tempDir) {
        Start-Sleep -Milliseconds 500
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
    }
}
