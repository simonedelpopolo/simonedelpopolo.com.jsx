#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORIGINAL_PUBLIC_DIR="${SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR-}"
ORIGINAL_BUILD_DIR="${SIMONEDELPOPOLO_DEFAULT_BUILD_DIR-}"
source "$SCRIPT_DIR/../global_variables.sh"
source "$SIMONEDELPOPOLO_LOGGING_LIB_SCRIPT"

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Default VHost Pipeline Orchestrator

Options:
  --clean     Clean before building
  --build     Override build directory
  --public    Override deploy directory (public output)
  --deploy    Alias for --public
  --tld       Override TLD for links (e.g., .com, .host)
  --help      Show this help message

Examples:
  $(basename "$0")              # Build only
  $(basename "$0") --clean      # Clean + build
EOF
}

DO_CLEAN=false
BUILD_OVERRIDE=""
PUBLIC_OVERRIDE=""
TLD_OVERRIDE=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --clean)
      DO_CLEAN=true
      shift
      ;;
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

# Respect caller-provided env unless an explicit flag overrides it.
if [[ -n "$BUILD_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_DEFAULT_BUILD_DIR="$BUILD_OVERRIDE"
elif [[ -n "$ORIGINAL_BUILD_DIR" ]]; then
  SIMONEDELPOPOLO_DEFAULT_BUILD_DIR="$ORIGINAL_BUILD_DIR"
fi
if [[ -n "$PUBLIC_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR="$PUBLIC_OVERRIDE"
elif [[ -n "$ORIGINAL_PUBLIC_DIR" ]]; then
  SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR="$ORIGINAL_PUBLIC_DIR"
fi
if [[ -n "$TLD_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_TLD="$TLD_OVERRIDE"
fi
export SIMONEDELPOPOLO_DEFAULT_BUILD_DIR
export SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR
export SIMONEDELPOPOLO_TLD

print_header "Default VHost Pipeline"

START_TIME=$(date +%s)

# Step 1: Clean (if requested)
if [[ "$DO_CLEAN" == true ]]; then
  print_step "Cleaning artifacts"
  "$SIMONEDELPOPOLO_DEFAULT_CLEAN_SCRIPT"
  echo ""
fi

# Step 2: Build
print_step "Building site"
"$SIMONEDELPOPOLO_DEFAULT_BUILD_SCRIPT"
echo ""

END_TIME=$(date +%s)
ELAPSED=$((END_TIME - START_TIME))

print_header "Pipeline Complete"
print_success "Total time: ${ELAPSED}s"
print_substep "Source: ${SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR}"
print_substep "Build: ${SIMONEDELPOPOLO_DEFAULT_BUILD_DIR}"
print_substep "Public: ${SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR}"
