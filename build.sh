#!/usr/bin/env bash
# Rebuild the single-file index.html from parts/.
#  - parts/style.css is inlined where parts/1_head.html links it
#  - Three.js is inlined from node_modules
#  - the Cinzel + Sriracha fonts in fonts/ are inlined as base64, replacing the Google Fonts <link>s
# so the page works fully offline.
set -e
cd "$(dirname "$0")"
THREE_JS=node_modules/three/build/three.min.js
[ -f "$THREE_JS" ] || npm install
FONT_CSS=$(node -e '
const fs=require("fs");let css=fs.readFileSync("fonts/fonts.css","utf8");
css=css.replace(/url\(([^)]+\.woff2)\)/g,(m,f)=>"url(data:font/woff2;base64,"+fs.readFileSync("fonts/"+f).toString("base64")+")");
process.stdout.write("<style>\n"+css+"</style>")')
{
  # head without the Google Fonts links and without its final "<script>" line; fonts go right after <title>
  # and the <link> to style.css is replaced by the contents of parts/style.css
  head -n -1 parts/1_head.html | grep -v 'fonts.googleapis.com\|fonts.gstatic.com' | while IFS= read -r line; do
    case "$line" in
      *'href="style.css"'*) printf '<style>\n'; cat parts/style.css; printf '</style>\n' ;;
      *) printf '%s\n' "$line" ;;
    esac
    case "$line" in *"</title>"*) printf '%s\n' "$FONT_CSS" ;; esac
  done
  printf '<script>\n'; cat "$THREE_JS"; printf '\n</script>\n'
  # optional realistic 3D scan of หวาน: build with `SCAN=1 bash build.sh`, then open the page with #scan
  if [ "${SCAN:-0}" = 1 ]; then printf '<script>const SCAN_FRONT=1,WAN_GLB="'; base64 -w0 img/wan_fullbody.glb; printf '";</script>\n'; fi
  printf '<script>\n'
  cat parts/2_draw.js parts/3_scene.js parts/4_deities.js parts/4_major.js parts/5_minorA.js parts/6_minorB.js \
      parts/6b_xmas.js parts/6d_three.js parts/6d1_pretty.js parts/6d2_play.js parts/6d3_scan.js parts/6e_carousel.js parts/6f_fx.js parts/6g_cine.js parts/7_app.js parts/8_shop.js
  printf '</script>\n</body>\n</html>\n'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
