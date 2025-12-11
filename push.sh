cd docs
npm run build
cd dist
git add .
read -p "Enter commit: " answer
git commit -m "$answer"
git push -f https://github.com/Annie04082020/ReviewCardMaker.git gh-pages

cd ../..
git add .
git commit -m "$answer"
git push