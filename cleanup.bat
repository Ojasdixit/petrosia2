@echo off
echo Cleaning up redundant files from Petrosia Marketplace...

rem Remove redundant Cloudinary test/fix files
del /f "cloudinary-direct-upload.ts"
del /f "cloudinary-final-attempt.ts"
del /f "cloudinary-final-fix.ts"
del /f "cloudinary-hardcoded.ts"
del /f "cloudinary-unsigned-fix.ts"
del /f "cloudinary-unsigned-upload.ts"
del /f "cloudinary-url-format.ts"
del /f "default-preset-fix.ts"
del /f "fix-cloudinary-2.ts"
del /f "fix-cloudinary-unsigned.ts"
del /f "fix-cloudinary.ts"
del /f "fixed-cloudinary-signature.ts"
del /f "simulate-cloudinary.ts"
del /f "simulate-local-cloudinary.ts"
del /f "test-cloudinary-direct.js"
del /f "test-cloudinary.ts"
del /f "test-upload.ts"
del /f "test-env.js"

rem Remove redundant test components
del /f "client\src\components\testing\VideoTester.tsx"
del /f "client\src\components\video-test.tsx"
del /f "client\src\pages\video-test-page.tsx"
del /f "client\src\pages\video-tester-page.tsx"
del /f "public\favicon-test.html"

rem Consolidate database scripts
del /f "check-db-status.ts"
del /f "check-and-fix-pet-images.ts"
del /f "fix-pet-images.ts"
del /f "update-cloudinary-secrets.ts"
del /f "update-cloudinary-settings.ts"

rem Clean up duplicate SQL files (keeping only the most recent)
del /f "supabase-images.sql"
del /f "supabase_export.sql"
del /f "restore_data.sql"
del /f "restore_data_no_constraints.sql"

rem Clean up duplicate dog breed scripts
del /f "add-additional-dog-breeds.ts"
del /f "add-dog-breeds.ts"
del /f "add-more-breeds.ts"
del /f "add-requested-breeds.ts"
del /f "add-saint-bernard.ts"

rem Clean up duplicate schema scripts
del /f "push-blog-schema.ts"
del /f "push-db-schema.ts"
del /f "push-payment-schema.ts"
del /f "apply-payment-schema.ts"

rem Remove migration scripts now that we've migrated
del /f "import-to-supabase-simple.sh"
del /f "import-to-supabase.sh"
del /f "migrate-to-supabase.js"

echo Cleanup complete!
