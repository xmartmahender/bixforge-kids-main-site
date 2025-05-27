@echo off
echo.
echo ========================================
echo   🚀 Push Main Website to GitHub
echo ========================================
echo.
echo IMPORTANT: Replace YOUR_USERNAME with your actual GitHub username!
echo.
echo Example: If your GitHub username is "john123", change:
echo   https://github.com/YOUR_USERNAME/bixforge-kids-zone-main.git
echo to:
echo   https://github.com/john123/bixforge-kids-zone-main.git
echo.
echo Press any key when you've created the GitHub repository...
pause
echo.
echo Pushing to GitHub...
echo.

cd /d "%~dp0"

REM Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/bixforge-kids-zone-main.git
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   ✅ SUCCESS! Main website pushed to GitHub
echo ========================================
echo.
echo Your repository is now available at:
echo https://github.com/YOUR_USERNAME/bixforge-kids-zone-main
echo.
pause
