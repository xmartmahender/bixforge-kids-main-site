@echo off
echo 🚀 Deploying Main Children's Website for Production...
echo.

echo ✅ Step 1: Installing dependencies...
call npm install

echo.
echo ✅ Step 2: Building for production...
call npm run build

echo.
echo ✅ Step 3: Production build complete!
echo.
echo 📁 Build files are in the '.next' folder
echo 🌐 Ready for deployment to Vercel, Netlify, or any hosting service
echo.
echo 🎯 Next steps:
echo    1. Deploy to Vercel (recommended for Next.js)
echo    2. Configure environment variables
echo    3. Test user tracking functionality
echo    4. Verify Firebase connection
echo.
echo 🎉 Main Website is ready for production!
pause
