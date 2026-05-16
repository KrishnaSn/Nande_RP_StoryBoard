# Run Backend Tests
Write-Host "🚀 Running Backend Tests..." -ForegroundColor Cyan
Set-Location backend
.\venv\Scripts\python.exe -m pytest app/tests/test_story.py
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Backend Tests Failed!" -ForegroundColor Red; exit 1 }

# Run Frontend Tests
Set-Location ..
Write-Host "`n🚀 Running Frontend Tests..." -ForegroundColor Cyan
Set-Location frontend
npx vitest run
if ($LASTEXITCODE -ne 0) { Write-Host "❌ Frontend Tests Failed!" -ForegroundColor Red; exit 1 }

Set-Location ..
Write-Host "`n✅ All Tests Passed! Safe to push." -ForegroundColor Green
