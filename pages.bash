cp -R _demo/ _book/demo/
cd _book && \
git init && \
git remote add origin git@github.com:thebearingedge/controlled-components && \
git checkout -b gh-pages && \
git add . && \
git commit -m "Publish pages." && \
git push origin gh-pages --force