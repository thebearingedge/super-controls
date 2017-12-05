cp -R _demo/ _book/demo/ && \
cd _book && \
git init && \
git remote add origin git@github.com:thebearingedge/super-controls && \
git checkout -b gh-pages && \
echo "super-controls.js.org" > CNAME && \
git add . && \
git commit -m "Publish pages." && \
git push origin gh-pages --force
