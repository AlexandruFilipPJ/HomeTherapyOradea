# Video Compression Script using FFmpeg
# Downscales videos to 720p H.264 MP4 with streaming faststart

$mediaDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
if ([string]::IsNullOrEmpty($mediaDir)) {
    $mediaDir = "d:\websites\HomeTherapy\assets\media"
}

Write-Host "Scanning for videos in: $mediaDir"

# Fetch all videos except backup files and temporary outputs
$videos = Get-ChildItem -Path $mediaDir -File | Where-Object {
    $_.Extension -match "\.(mp4|mov|avi|mkv|mov)" -and 
    $_.BaseName -notmatch "_backup" -and 
    $_.BaseName -notmatch "_compressed"
}

if ($videos.Count -eq 0) {
    Write-Host "No raw video files found in $mediaDir to compress. Place your videos here first."
    exit
}

Write-Host "Found $($videos.Count) video(s) to process."

foreach ($video in $videos) {
    $inputFile = $video.FullName
    $baseName = $video.BaseName
    $ext = $video.Extension
    
    $tempOutputFile = Join-Path -Path $mediaDir -ChildPath "$($baseName)_compressed.mp4"
    $backupFile = Join-Path -Path $mediaDir -ChildPath "$($baseName)_backup$ext"
    $finalOutputFile = Join-Path -Path $mediaDir -ChildPath "$($baseName).mp4"
    
    Write-Host "--------------------------------------------------" -ForegroundColor Cyan
    Write-Host "Processing: $baseName$ext" -ForegroundColor Yellow
    Write-Host "Compiling to 720p H.264 Web-Optimized MP4..."
    
    # Run FFmpeg: scale to 720p, compress with x264 (CRF 23 for great balance), faststart enabled
    & ffmpeg -i "$inputFile" -vf "scale=-2:720" -vcodec libx264 -crf 23 -acodec aac -b:a 128k -movflags +faststart "$tempOutputFile" -y
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $tempOutputFile)) {
        # Backup original
        Rename-Item -Path $inputFile -NewName "$($baseName)_backup$ext"
        
        # Swap new file in place
        if (Test-Path $finalOutputFile) {
            Remove-Item -Path $finalOutputFile -Force
        }
        Rename-Item -Path $tempOutputFile -NewName "$($baseName).mp4"
        
        Write-Host "Done! Web-optimized video saved to: $baseName.mp4" -ForegroundColor Green
        Write-Host "Original backed up as: $($baseName)_backup$ext" -ForegroundColor Gray
    } else {
        Write-Host "Error: FFmpeg failed to compress $baseName$ext" -ForegroundColor Red
    }
}

Write-Host "All videos processed!" -ForegroundColor Green
