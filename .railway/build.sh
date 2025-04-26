#!/bin/bash
# Tento skript obíde problém s "npm ci" na Railway
# a namiesto toho použije "npm install"

echo "=== Vlastný build script pre Railway ==="
npm install --omit=dev
echo "=== Inštalácia závislostí dokončená ===" 