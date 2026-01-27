#!/usr/bin/env bash
# CSS Bundling Script
# Bundles all CSS files into a single optimized file while keeping individual files intact

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}▸ Bundling CSS files...${NC}"

# Create temp directory for processing
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Define CSS file order for SHARED/BASE styles only
# Component and page-specific CSS should be loaded via css() method
CSS_FILES=(
  # Base styles (always needed)
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/palette.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/reset.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/theme.css"

  # Fonts (always needed regardless of page/component)
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/orbitron.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/share-tech-mono.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/intel-one-mono.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/monoton.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/audiowide.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/syncopate.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/bungee.css"
  "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/css/fonts/press-start-2p.css"
)

# Components and pages are excluded - they load via css() method on-demand:
# - Components: header, footer, forms, animations, etc.
# - Pages: index, contact, enroll, notfound
# This avoids duplication and enables true lazy loading

# Extract @import statements and regular CSS separately
IMPORTS_FILE="$TEMP_DIR/imports.css"
CONTENT_FILE="$TEMP_DIR/content.css"
> "$IMPORTS_FILE"
> "$CONTENT_FILE"

# Process each CSS file
for css_file in "${CSS_FILES[@]}"; do
  if [ -f "$css_file" ]; then
    echo "/* $(basename $css_file) */" >> "$CONTENT_FILE"

    # Extract @import statements to imports file
    grep "^@import" "$css_file" >> "$IMPORTS_FILE" 2>/dev/null || true

    # Extract non-@import content to content file
    grep -v "^@import" "$css_file" >> "$CONTENT_FILE" 2>/dev/null || true

    echo "" >> "$CONTENT_FILE"
  else
    echo "Warning: $css_file not found, skipping"
  fi
done

# Combine imports first, then content (CSS requires @import at top)
CONCAT_FILE="$TEMP_DIR/bundle.concat.css"
cat "$IMPORTS_FILE" > "$CONCAT_FILE"
echo "" >> "$CONCAT_FILE"
cat "$CONTENT_FILE" >> "$CONCAT_FILE"

# Create minified bundle (without bundling to avoid asset resolution)
BUNDLE_OUTPUT="$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR/css/style.css"
mkdir -p "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR/css"

# Simple minification: remove comments, collapse whitespace
# Using sed for basic minification (preserves urls and paths)
sed -e 's|/\*.*\*/||g' \
    -e 's|^[[:space:]]*||g' \
    -e '/^$/d' \
    "$CONCAT_FILE" | tr -s ' ' > "$BUNDLE_OUTPUT"

# Get file sizes for output
ORIGINAL_SIZE=$(wc -c < "$CONCAT_FILE" | xargs)
BUNDLE_SIZE=$(wc -c < "$BUNDLE_OUTPUT" | xargs)
REDUCTION=$(echo "scale=1; ($ORIGINAL_SIZE - $BUNDLE_SIZE) * 100 / $ORIGINAL_SIZE" | bc)

echo -e "${GREEN}✓ CSS bundle created${NC}"
echo -e "  Original: ${ORIGINAL_SIZE} bytes"
echo -e "  Bundled:  ${BUNDLE_SIZE} bytes (${REDUCTION}% reduction)"
echo -e "  Output:   ${BUNDLE_OUTPUT}"
