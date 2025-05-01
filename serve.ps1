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

# 全局变量保存服务器进程ID
$ServerProcess = $null

# 关闭服务器的函数
function Stop-Server {
    if ($ServerProcess -ne $null -and -not $ServerProcess.HasExited) {
        Write-Host "Stopping server process (PID: $($ServerProcess.Id))..."
        Stop-Process -Id $ServerProcess.Id -Force
        Write-Host "Server stopped successfully."
    } else {
        Write-Host "No running server process found."
    }
}

# 尝试使用 Python 3 启动服务器
try {
    Write-Host "Attempting to start server with Python 3..."
    # 保存进程对象以便后续关闭
    $ServerProcess = Start-Process -NoNewWindow -PassThru -FilePath "python" -ArgumentList "-m","http.server","6899"
    Write-Host "Server started with PID: $($ServerProcess.Id)"
    # 自动打开浏览器访问本地服务器
    Start-Process "http://localhost:6899"
    # 如果 Python 3 命令成功执行且用户未按 Ctrl+C，脚本会卡在这里直到服务器停止
    # 如果 Python 3 命令本身失败（例如找不到 python），会进入 catch 块
} catch {
    Write-Warning "Failed to start server with Python 3 command. Error: $($_.Exception.Message)"
    Write-Host "Trying Python 2 command..."
    # 尝试使用 Python 2
    try {
        $ServerProcess = Start-Process -NoNewWindow -PassThru -FilePath "python" -ArgumentList "-m","SimpleHTTPServer","6899"
        Write-Host "Server started with PID: $($ServerProcess.Id)"
        # 自动打开浏览器访问本地服务器
        Start-Process "http://localhost:6899"
    } catch {
        Write-Error "Failed to start server with Python 2 command as well. Error: $($_.Exception.Message)"
        Write-Error "Please ensure Python (3 or 2) is installed and in your PATH."
    }
}

# 添加服务器关闭选项
Write-Host ""
Write-Host "To stop the server manually, type 'stop' and press Enter"
Write-Host "Or press Ctrl+C to exit"
Write-Host ""

# 监听用户输入
while ($true) {
    $input = Read-Host
    if ($input -eq "stop") {
        Stop-Server
        break
    }
}