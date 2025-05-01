# 获取脚本所在的目录
$ScriptPath = $PSScriptRoot

Write-Host "Starting compilation and server script..."
Write-Host "Script location: $ScriptPath"

# 切换到脚本所在目录 (项目根目录)
Set-Location -Path $ScriptPath
Write-Host "Current directory: $(Get-Location)"

# --- 编译步骤 ---
Write-Host "Compiling Twine story using tweego..."
$SrcDir = "src"
$OutputFile = "index.html"

# 检查源目录是否存在
$SrcPath = Join-Path -Path $ScriptPath -ChildPath $SrcDir
if (-not (Test-Path -Path $SrcPath -PathType Container)) {
    Write-Error "Error: Source directory '$SrcDir' not found at '$SrcPath'."
    Write-Host "Please create the '$SrcDir' directory and move your story files (.twee) into it."
    Read-Host "Press Enter to exit"
    exit 1
}

# 运行 Tweego 命令
try {
    tweego -f sugarcube-2 "$SrcDir" -o $OutputFile
    Write-Host "Compilation finished successfully. Output file: $OutputFile"
} catch {
    Write-Error "Tweego compilation failed: $($_.Exception.Message)"
    Write-Host "Aborting server start."
    Read-Host "Press Enter to exit"
    exit 1 # 编译失败则退出
}

# --- 启动服务器步骤 ---
Write-Host "" # 空行
Write-Host "Starting local HTTP server..."
Write-Host "Serving files from this directory: $(Get-Location)"
Write-Host ""
Write-Host "Open your web browser and go to:"
Write-Host "  http://localhost:6899"
Write-Host "or"
Write-Host "  http://127.0.0.1:6899"
Write-Host ""
Write-Host "Press Ctrl+C in this window to stop the server."
Write-Host ""

# 尝试使用 Python 3 启动服务器
try {
    Write-Host "Attempting to start server with Python 3..."
    # 使用 Start-Process 在新窗口或后台启动，避免阻塞脚本
    # 如果希望服务器在前台运行，可以直接调用 python -m http.server 6899
    # 但那样脚本的 pause 部分可能不会执行，直到服务器停止
    # 这里我们直接在前台运行，因为 serve.bat 也是这样做的
    python -m http.server 6899
    # 如果 Python 3 命令成功执行且用户未按 Ctrl+C，脚本会卡在这里直到服务器停止
    # 如果 Python 3 命令本身失败（例如找不到 python），会进入 catch 块
} catch {
    Write-Warning "Failed to start server with Python 3 command. Error: $($_.Exception.Message)"
    Write-Host "Trying Python 2 command..."
    # 尝试使用 Python 2
    try {
        python -m SimpleHTTPServer 6899
    } catch {
        Write-Error "Failed to start server with Python 2 command as well. Error: $($_.Exception.Message)"
        Write-Error "Please ensure Python (3 or 2) is installed and in your PATH."
    }
}

# 因为服务器在前台运行，这行 pause 可能只在服务器启动失败或结束后执行
Read-Host "Server stopped or failed to start. Press Enter to exit"