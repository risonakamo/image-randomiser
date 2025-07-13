set -exu
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

cd ..
rm -rf build
pnpm b

cd image-randomiser-web
rm -rf build
pnpm b