#!/bin/bash

export CURRENT_REPO=$(echo $TRAVIS_REPO_SLUG | awk -F'/' '{print $2}')
export CURRENT_BRANCH=$(echo $TRAVIS_BRANCH | sed 's/\//-/g')
export PKG_SUFFIX=$(if [[ $CURRENT_BRANCH =~ ^[0-9] ]]; then echo $CURRENT_BRANCH; else echo _$CURRENT_BRANCH; fi;)
export PKG_NAME=$CURRENT_REPO$PKG_SUFFIX
export DIST_DIRECTORY="${TRAVIS_BUILD_DIR}/electron/dist"
export FORMATS=( "tar.gz" "exe" "dmg" "deb" "rpm" )

echo "Installing gdrive .."

if [ "$TRAVIS_OS_NAME" == "osx" ]; then
  go get github.com/prasmussen/gdrive
  export GDRIVE_PATH=/Users/travis/go/bin/gdrive
else
  wget -O ~/gdrive "https://docs.google.com/uc?id=0B3X9GlR6EmbnQ0FtZmJJUXEyRTA&export=download"
  export GDRIVE_PATH=/home/travis/gdrive
fi

chmod +x $GDRIVE_PATH; sync;

cd $DIST_DIRECTORY

for FORMAT in "${FORMATS[@]}"
do
  BASENAME="${PKG_NAME}.${FORMAT}"

  if ls *.${FORMAT} 1> /dev/null 2>&1; then
    mv *.${FORMAT} $BASENAME

    if [ -f $BASENAME ]; then
      echo "Uploading ${FORMAT} .."
      $GDRIVE_PATH list --refresh-token $GDRIVE_REFRESH_TOKEN --query "'$GDRIVE_DIR' in parents and mimeType != 'application/vnd.google-apps.folder' and name = '$BASENAME'" --no-header | while read line ; do ID=$(echo $line | cut -d ' ' -f1 | xargs); $GDRIVE_PATH delete --refresh-token $GDRIVE_REFRESH_TOKEN $ID; done

      $GDRIVE_PATH upload --refresh-token $GDRIVE_REFRESH_TOKEN --parent $GDRIVE_DIR $BASENAME
    fi
  fi
done