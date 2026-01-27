#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"
source "$SIMONEDELPOPOLO_LOGGING_LIB_SCRIPT"

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Default VHost Build

Options:
  --build     Override build directory
  --public    Override deploy directory (public output)
  --deploy    Alias for --public
  --tld       Override TLD for links (e.g., .com, .host)
  --help      Show this help message
EOF
}

BUILD_OVERRIDE=""
PUBLIC_OVERRIDE=""
TLD_OVERRIDE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build)
      if [[ $# -lt 2 ]]; then
        print_error "Missing argument for $1"
        usage
        exit 1
      fi
      BUILD_OVERRIDE="$2"
      shift 2
      ;;
    --public|--deploy)
      if [[ $# -lt 2 ]]; then
        print_error "Missing argument for $1"
        usage
        exit 1
      fi
      PUBLIC_OVERRIDE="$2"
      shift 2
      ;;
    --tld)
      if [[ $# -lt 2 ]]; then
        print_error "Missing argument for $1"
        usage
        exit 1
      fi
      TLD_OVERRIDE="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      print_error "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -n "$BUILD_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_DEFAULT_BUILD_DIR="$BUILD_OVERRIDE"
fi
if [[ -n "$PUBLIC_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR="$PUBLIC_OVERRIDE"
fi
if [[ -n "$TLD_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_TLD="$TLD_OVERRIDE"
fi
export SIMONEDELPOPOLO_DEFAULT_BUILD_DIR
export SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR
export SIMONEDELPOPOLO_TLD

print_header "Default VHost Build"

if ! command -v npm >/dev/null 2>&1; then
  print_error "npm is required but was not found in PATH"
  exit 1
fi

NODE_MODULES_DIR="${SIMONEDELPOPOLO_ROOT_DIR}/node_modules"
ESBUILD_BIN="${NODE_MODULES_DIR}/.bin/esbuild"
if [[ ! -d "$NODE_MODULES_DIR" || ! -x "$ESBUILD_BIN" ]]; then
  print_step "Installing dependencies"
  npm install
  print_success "Dependencies installed"
fi

print_step "Creating directories"
mkdir -p "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR" "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR"

print_step "Bundling application"
print_substep "Output: ${SIMONEDELPOPOLO_DEFAULT_BUILD_DIR} (with code splitting)"

npx esbuild "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/app.tsx" \
  --bundle \
  --format=esm \
  --platform=browser \
  --target=es2020 \
  --jsx=transform \
  --jsx-factory=h \
  --jsx-fragment=Fragment \
  --define:__SIMONEDELPOPOLO_TLD__="\"${SIMONEDELPOPOLO_TLD}\"" \
  --outdir="$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR" \
  --splitting \
  --entry-names=[name]
print_success "Bundle created"

print_step "Copying static assets"
if [[ -d "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static" ]]; then
  cp -r "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/static/." "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR/"
  print_substep "Copied static directory"
fi
print_success "Static assets copied in $SIMONEDELPOPOLO_DEFAULT_BUILD_DIR."

print_step "deploying into $SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR"
if [[ -d "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR" ]]; then
  cp -r "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR/." "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR/"
  print_substep "deployed"
fi

# print_step "Bundling CSS"
# "$SCRIPT_DIR/bundle-css.sh"
# print_success "CSS bundle created"

print_success "Default vhost build complete -> ${SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR}"
