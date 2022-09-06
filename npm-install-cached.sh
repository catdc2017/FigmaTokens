#!/bin/bash
# The following environment variables need to be set.
# OOSS_BUCKET - The name of your bucket 
# OOSS_HOST - The host for your buckets
# OOSS_ACCESS_KEY_ID - Access key for your bucket
# OOSS_SECRET_KEY_ID - Secret key for your bucket

# Signs the content for AWS Authorization
sign_content () {
    local signature=`echo -en $1 | openssl sha1 -hmac $2 -binary | base64`
    echo "$signature"
}

# Extract environment variables
bucket=${OOSS_BUCKET} 
host=${OOSS_HOST}
AccessKeyID=${OOSS_ACCESS_KEY_ID}  
SecretKeyID=${OOSS_SECRET_KEY_ID}

# Create MD5 hash filename text
hash=($(md5sum package.json)) # uncomment for Linux
# hash=$(md5 -q package.json) # uncomment for macOS
filename=${hash}".tar.gz"

resource="/${bucket}/${filename}"
contentType="application/x-compressed-tar"
dateValue=`date -R`
responseFile="/tmp/ooss.res.$(date +%s)"
endpoint=https://${host}/${bucket}/${filename}

# Attempt to pull archive for md5 hash
echo "[NPM cache install] Checking cache at ${endpoint}"
baseContentToSign="${contentType}\n${dateValue}\n${resource}"  
getContentToSign="GET\n\n${baseContentToSign}"  
curl -H "Host: ${host}/${bucket}" -H "Date: ${dateValue}" -H "Content-Type: ${contentType}" -H "Authorization: AWS ${AccessKeyID}:$(sign_content "${getContentToSign}" "${SecretKeyID}")" ${endpoint} -o ${responseFile}

# Checks if the returned message for has no key found signalling that there is no cached resource.
if grep -Fq "NoSuchKey" ${responseFile} 
then
  echo "[NPM cache install] No cached archive"
  echo "[NPM cache install] Installing..."
  npm install 
  echo "[NPM cache install] Compressing..."
  compressedNodeModules="/tmp/${filename}"
  tar -czf $compressedNodeModules ./node_modules
  echo "[NPM cache install] Storing cached ${filename} file to ${endpoint}"
  putContentToSign="PUT\n\n${baseContentToSign}"  
  curl -X PUT -T $compressedNodeModules -H "Host: ${host}/${bucket}" -H "Date: ${dateValue}" -H "Content-Type: ${contentType}" -H "Authorization: AWS ${AccessKeyID}:$(sign_content "${putContentToSign}" "${SecretKeyID}")" ${endpoint}
  echo "[NPM cache install] Done"
elif grep -Fq "<Error>" ${responseFile} 
then
  echo "[NPM cache install] Error"
  cat ${responseFile}
else
  echo "[NPM cache install] Cached archive found."
  echo "[NPM cache install] Exploding in 3 2 1..."
  tar -xzf ${responseFile}
  echo "[NPM cache install] Done"
fi

rm $responseFile
rm -f $compressedNodeModules
