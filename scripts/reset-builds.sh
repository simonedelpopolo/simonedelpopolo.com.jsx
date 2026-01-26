#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/global_variables.sh"
source "$SIMONEDELPOPOLO_LOGGING_LIB_SCRIPT"

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Reset build artifacts and local environment outputs.

Options:
  --build     Override build directory
  --public    Override deploy directory (public output)
  --deploy    Alias for --public
  --certs     Override certificates directory
  --data      Override data directory
  --help      Show this help message
EOF
}

BUILD_OVERRIDE=""
PUBLIC_OVERRIDE=""
CERTS_OVERRIDE=""
DATA_OVERRIDE=""

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
    --certs)
      if [[ $# -lt 2 ]]; then
        print_error "Missing argument for $1"
        usage
        exit 1
      fi
      CERTS_OVERRIDE="$2"
      shift 2
      ;;
    --data)
      if [[ $# -lt 2 ]]; then
        print_error "Missing argument for $1"
        usage
        exit 1
      fi
      DATA_OVERRIDE="$2"
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
if [[ -n "$CERTS_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_CERTS_DIR="$CERTS_OVERRIDE"
  SIMONEDELPOPOLO_CERTS_CA_DIR="$SIMONEDELPOPOLO_CERTS_DIR/ca"
fi
if [[ -n "$DATA_OVERRIDE" ]]; then
  SIMONEDELPOPOLO_DATA_DIR="$DATA_OVERRIDE"
fi
export SIMONEDELPOPOLO_DEFAULT_BUILD_DIR
export SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR
export SIMONEDELPOPOLO_CERTS_DIR
export SIMONEDELPOPOLO_CERTS_CA_DIR
export SIMONEDELPOPOLO_DATA_DIR

print_header "Reset Builds"

print_step "Removing public deployment"
if [[ -d "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR" ]]; then
  rm -rf "$SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR"
  print_success "Removed public directory: ${SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR}"
else
  print_substep "${SIMONEDELPOPOLO_DEFAULT_PUBLIC_DIR} directory does not exist"
fi

print_step "Removing build directory"
if [[ -d "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR" ]]; then
  rm -rf "$SIMONEDELPOPOLO_DEFAULT_BUILD_DIR"
  print_success "Removed build directory: ${SIMONEDELPOPOLO_DEFAULT_BUILD_DIR}"
else
  print_substep "${SIMONEDELPOPOLO_DEFAULT_BUILD_DIR} directory does not exist"
fi

NODE_MODULES_DIR="${SIMONEDELPOPOLO_ROOT_DIR}/node_modules"
print_step "Removing node_modules"
if [[ -d "$NODE_MODULES_DIR" ]]; then
  rm -rf "$NODE_MODULES_DIR"
  print_success "Removed node_modules: ${NODE_MODULES_DIR}"
else
  print_substep "${NODE_MODULES_DIR} does not exist"
fi

LOCK_FILE="${SIMONEDELPOPOLO_ROOT_DIR}/package-lock.json"
print_step "Removing package-lock.json"
if [[ -f "$LOCK_FILE" ]]; then
  rm -f "$LOCK_FILE"
  print_success "Removed package-lock.json: ${LOCK_FILE}"
else
  print_substep "${LOCK_FILE} does not exist"
fi

print_step "Removing data directory"
if [[ -d "$SIMONEDELPOPOLO_DATA_DIR" ]]; then
  rm -rf "$SIMONEDELPOPOLO_DATA_DIR"
  print_success "Removed data directory: ${SIMONEDELPOPOLO_DATA_DIR}"
else
  print_substep "${SIMONEDELPOPOLO_DATA_DIR} directory does not exist"
fi

print_step "Removing certificates"
if [[ -d "$SIMONEDELPOPOLO_CERTS_DIR" ]]; then
  rm -rf "$SIMONEDELPOPOLO_CERTS_DIR"
  print_success "Removed certificates directory: ${SIMONEDELPOPOLO_CERTS_DIR}"
else
  print_substep "${SIMONEDELPOPOLO_CERTS_DIR} directory does not exist"
fi

print_success "Reset complete"
