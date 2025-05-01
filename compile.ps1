# 获取脚本所在的目录
$ScriptPath = $PSScriptRoot

Write-Host "Compiling Twine story..."
Write-Host "Script location: $ScriptPath"

# 切换到脚本所在目录 (项目根目录)
Set-Location -Path $ScriptPath
Write-Host "Current directory: $(Get-Location)"

# 定义并检查/创建 assets 文件夹
$AssetsPath = Join-Path -Path $ScriptPath -ChildPath "assets"
if (-not (Test-Path -Path $AssetsPath -PathType Container)) {
    Write-Host "Creating assets directory..."
    New-Item -Path $AssetsPath -ItemType Directory | Out-Null
    New-Item -Path (Join-Path -Path $AssetsPath -ChildPath "images") -ItemType Directory | Out-Null
    New-Item -Path (Join-Path -Path $AssetsPath -ChildPath "audio") -ItemType Directory | Out-Null
    Write-Host "Assets directory created."
} else {
    Write-Host "Assets directory already exists."
}

# 定义源文件目录
$SrcDir = "src"
$SrcPath = Join-Path -Path $ScriptPath -ChildPath $SrcDir

# 检查源文件目录是否存在
if (-not (Test-Path -Path $SrcPath -PathType Container)) {
    Write-Error "Error: Source directory '$SrcDir' not found at '$SrcPath'."
    Write-Host "Please create the '$SrcDir' directory and move your story files (.twee) into it."
    Read-Host "Press Enter to exit"
    exit 1
} else {
    Write-Host "Source directory found: $SrcDir"
}

# 运行 Tweego 命令
Write-Host "--- Attempting to run tweego ---"
try {
    tweego -f sugarcube-2 "$SrcDir" -o "index.html"
    Write-Host "--- tweego command finished successfully. Output file: index.html ---"
} catch {
    Write-Error "Tweego compilation failed: $($_.Exception.Message)"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Script finished."
Read-Host "Press Enter to exit" # 相当于 pause