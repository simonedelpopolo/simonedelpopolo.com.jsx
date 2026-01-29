#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../global_variables.sh"
source "$SIMONEDELPOPOLO_LOGGING_LIB_SCRIPT"

usage() {
  cat <<'USAGE'
Usage: tsc.sh [OPTIONS]

TypeScript Utilities

Options:
  --check-ts  Run TypeScript type check (no emit)
  --watch     Watch src/ and run default build on change (prompts to install watcher)
  --watch-run Run watch pipeline once (internal use)
  --help      Show this help message

Notes:
  Watcher installs use brew/cargo/npm depending on selection and availability.
USAGE
}

CHECK_TS=false
WATCH=false
WATCH_RUN=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --check-ts)
      CHECK_TS=true
      shift
      ;;
    --watch)
      WATCH=true
      shift
      ;;
    --watch-run)
      WATCH_RUN=true
      shift
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

if [[ "$CHECK_TS" == false && "$WATCH" == false && "$WATCH_RUN" == false ]]; then
  print_error "No action specified"
  usage
  exit 1
fi

resolve_tsc_bin() {
  local local_tsc="${SIMONEDELPOPOLO_ROOT_DIR}/node_modules/.bin/tsc"

  if [[ -x "$local_tsc" ]]; then
    echo "$local_tsc"
    return 0
  fi

  if command -v tsc >/dev/null 2>&1; then
    command -v tsc
    return 0
  fi

  if ! command -v npm >/dev/null 2>&1; then
    print_error "npm is required to install TypeScript globally"
    exit 1
  fi

  print_warning "tsc not found, installing globally"
  npm install -g typescript

  if command -v tsc >/dev/null 2>&1; then
    command -v tsc
    return 0
  fi

  print_error "tsc is still unavailable after global install"
  exit 1
}

run_tsc_check() {
  print_header "TypeScript Check"

  if [[ ! -f "$SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG" ]]; then
    print_error "Missing tsconfig: ${SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG}"
    exit 1
  fi

  local tsc_bin
  tsc_bin="$(resolve_tsc_bin)"

  print_step "Checking types"
  print_substep "Config: ${SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG}"
  "$tsc_bin" --noEmit --project "$SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG"
  print_success "Type check complete"
}

run_watch_pipeline() {
  print_header "Watch Pipeline"

  if [[ ! -f "$SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG" ]]; then
    print_error "Missing tsconfig: ${SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG}"
    exit 1
  fi

  local tsc_bin
  tsc_bin="$(resolve_tsc_bin)"

  print_step "TypeScript check"
  "$tsc_bin" --noEmit --project "$SIMONEDELPOPOLO_DEFAULT_TSC_CONFIG"

  print_step "ESLint fix (non-blocking)"
  npx eslint --fix "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR/**/*.{ts,tsx}" || true

  print_step "Build"
  bash "$SIMONEDELPOPOLO_DEFAULT_BUILD_SCRIPT"
}

watch_builds() {
  print_header "Build Watch"

  if [[ ! -d "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR" ]]; then
    print_error "Missing source directory: ${SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR}"
    exit 1
  fi

  if [[ ! -f "$SIMONEDELPOPOLO_DEFAULT_BUILD_SCRIPT" ]]; then
    print_error "Missing build script: ${SIMONEDELPOPOLO_DEFAULT_BUILD_SCRIPT}"
    exit 1
  fi

  print_step "Watching source tree"
  print_substep "Path: ${SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR}"
  print_substep "On change: ${SIMONEDELPOPOLO_DEFAULT_TSC_SCRIPT} --watch-run"
  local preferred_watcher=""

  start_watchexec() {
    if command -v watchexec >/dev/null 2>&1; then
      print_substep "Watcher: watchexec"
      watchexec --watch "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR" --exts ts,tsx,css,html,svg,json -- bash "$SIMONEDELPOPOLO_DEFAULT_TSC_SCRIPT" --watch-run
      return 0
    fi
    return 1
  }

  start_fswatch() {
    if command -v fswatch >/dev/null 2>&1; then
      print_substep "Watcher: fswatch"
      fswatch -o "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR" | while read -r _; do
        print_step "Change detected"
        bash "$SIMONEDELPOPOLO_DEFAULT_TSC_SCRIPT" --watch-run
      done
      return 0
    fi
    return 1
  }

  start_nodemon() {
    if command -v nodemon >/dev/null 2>&1; then
      print_substep "Watcher: nodemon"
      nodemon --watch "$SIMONEDELPOPOLO_DEFAULT_SOURCE_DIR" --ext ts,tsx,css,html,svg,json --exec "bash \"$SIMONEDELPOPOLO_DEFAULT_TSC_SCRIPT\" --watch-run"
      return 0
    fi
    return 1
  }

  start_watcher() {
    case "$preferred_watcher" in
      watchexec)
        start_watchexec || start_fswatch || start_nodemon
        ;;
      fswatch)
        start_fswatch || start_watchexec || start_nodemon
        ;;
      nodemon)
        start_nodemon || start_watchexec || start_fswatch
        ;;
      *)
        start_watchexec || start_fswatch || start_nodemon
        ;;
    esac
  }

  install_watchexec() {
    if command -v watchexec >/dev/null 2>&1; then
      return 0
    fi

    if command -v brew >/dev/null 2>&1; then
      print_step "Installing watchexec via brew"
      brew install watchexec
    elif command -v cargo >/dev/null 2>&1; then
      print_step "Installing watchexec via cargo"
      cargo install watchexec-cli
    else
      print_error "No supported installer found for watchexec"
      exit 1
    fi

    if ! command -v watchexec >/dev/null 2>&1; then
      print_error "watchexec is still unavailable after install"
      exit 1
    fi
  }

  install_fswatch() {
    if command -v fswatch >/dev/null 2>&1; then
      return 0
    fi

    if command -v brew >/dev/null 2>&1; then
      print_step "Installing fswatch via brew"
      brew install fswatch
    else
      print_error "No supported installer found for fswatch"
      exit 1
    fi

    if ! command -v fswatch >/dev/null 2>&1; then
      print_error "fswatch is still unavailable after install"
      exit 1
    fi
  }

  install_nodemon() {
    if command -v nodemon >/dev/null 2>&1; then
      return 0
    fi

    if ! command -v npm >/dev/null 2>&1; then
      print_error "npm is required to install nodemon"
      exit 1
    fi

    print_step "Installing nodemon via npm"
    npm install -g nodemon

    if ! command -v nodemon >/dev/null 2>&1; then
      print_error "nodemon is still unavailable after install"
      exit 1
    fi
  }

  prompt_watcher_install() {
    print_warning "No watcher found"
    echo "Choose a watcher to install:"
    echo "1) watchexec (recommended)"
    echo "2) fswatch"
    echo "3) nodemon"
    echo "0) cancel"
    read -r -p "Selection [1-3,0]: " selection

    case "$selection" in
      1)
        preferred_watcher="watchexec"
        install_watchexec
        ;;
      2)
        preferred_watcher="fswatch"
        install_fswatch
        ;;
      3)
        preferred_watcher="nodemon"
        install_nodemon
        ;;
      0|"")
        print_warning "Watch canceled"
        exit 1
        ;;
      *)
        print_error "Invalid selection"
        exit 1
        ;;
    esac
  }

  if start_watcher; then
    return
  fi

  prompt_watcher_install

  if start_watcher; then
    return
  fi

  print_error "Watcher install failed"
  exit 1
}

if [[ "$CHECK_TS" == true ]]; then
  run_tsc_check
fi

if [[ "$WATCH_RUN" == true ]]; then
  run_watch_pipeline
  exit 0
fi

if [[ "$WATCH" == true ]]; then
  watch_builds
fi
