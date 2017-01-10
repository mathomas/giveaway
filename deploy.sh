aws s3 sync . s3://${1} --exclude="*" --include="*.html" --include="*.css" --include="*.js" --include "lib" --include="lib2"
