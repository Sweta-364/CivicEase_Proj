#!/usr/bin/env bash
# Render build script for the FastAPI backend
set -e

echo "==> Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Backend build complete."
