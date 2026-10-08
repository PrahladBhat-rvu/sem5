@echo off
setlocal
echo Installing packages...
call npm install || exit /b 1
echo Generating Prisma client...
call npx prisma generate || exit /b 1
echo Syncing database...
call npx prisma db push || exit /b 1
echo.
echo Done. Run npm run dev
pause
