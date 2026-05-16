# Nande RP StoryBoard: Test Suite

This directory contains scripts for running automated tests to ensure the platform remains stable.

## Running All Tests
To run both backend and frontend tests, run:
```powershell
./scripts/run-tests.ps1
```

## Manual Backend Tests
```bash
cd backend
./venv/Scripts/python -m pytest app/tests/test_story.py
```

## Manual Frontend Tests
```bash
cd frontend
npx vitest run
```
