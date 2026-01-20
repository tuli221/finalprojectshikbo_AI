# Stop MySQL service
Write-Host "Stopping MySQL service..." -ForegroundColor Yellow
Stop-Service MySQL -ErrorAction SilentlyContinue
Stop-Service MariaDB -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Delete orphaned tablespace files
$tables = @('users', 'courses', 'instructors', 'otps', 'instructor_requests', 'student_profiles', 'course_user', 'course_information')
$dataDir = "C:\xampp\mysql\data\finalshikboai"

Write-Host ""
Write-Host "Cleaning orphaned files in: $dataDir" -ForegroundColor Cyan

if (Test-Path $dataDir) {
    foreach ($table in $tables) {
        $ibdFile = Join-Path $dataDir "$table.ibd"
        $frmFile = Join-Path $dataDir "$table.frm"
        
        if (Test-Path $ibdFile) {
            Remove-Item $ibdFile -Force
            Write-Host "  ✓ Deleted: $table.ibd" -ForegroundColor Green
        }
        if (Test-Path $frmFile) {
            Remove-Item $frmFile -Force
            Write-Host "  ✓ Deleted: $table.frm" -ForegroundColor Green
        }
    }
} else {
    Write-Host "  ✗ Data directory not found!" -ForegroundColor Red
}

# Start MySQL service
Write-Host ""
Write-Host "Starting MySQL service..." -ForegroundColor Yellow
Start-Service MySQL -ErrorAction SilentlyContinue
Start-Service MariaDB -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run:" -ForegroundColor Cyan
Write-Host "  cd e:\finalproject\backend" -ForegroundColor White
Write-Host "  php artisan migrate:fresh --force" -ForegroundColor White
