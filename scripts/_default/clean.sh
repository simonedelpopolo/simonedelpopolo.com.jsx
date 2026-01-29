#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"
source "$SIMONEDELPOPOLO_LOGGING_LIB_SCRIPT"

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Default VHost Clean

Options:
  --build     Override build directory
  --public    Override deploy directory (public output)
  --deploy    Alias for --public
  --help      Show this help message
EOF
}

BUILD_OVERRIDE=""
PUBLIC_OVERRIDE=""

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
export SIMONEDELPOPOLO_DEFAULT_BUILD_DIR
export SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR

print_header "Default VHost Clean"

print_step "Removing public deployment"
if [[ -d "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR" ]]; then
  rm -rf "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR"
  print_success "Removed public directory: ${SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR}"
else
  print_substep "Public directory does not exist"
fi

print_step "Removing build directory"
if [[ -d "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR" ]]; then
  rm -rf "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR"
  print_success "Removed build directory: ${SIMONEDELPOPOLO_DEFAULT_BUILD_DIR}"
else
  print_substep "Build directory does not exist"
fi



print_success "Default vhost clean complete"
