npm run docs:clean && \
npm run docs:build && \
cd _book && \
git init && \
git remote add origin git@github.com:thebearingedge/controlled-components && \
git checkout -b gh-pages && \
git add . && \
git commit -m "Publish documentation." && \
git push origin gh-pages --force
