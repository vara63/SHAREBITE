# SHAREBITE Baseline & Load Testing Guide

This directory contains automated baseline load testing scripts for the **SHAREBITE (FoodShare AI)** API backend using `Autocannon` and Node.js.

---

## 🎯 Test Specification
- **Virtual Users (VUs)**: 100 concurrent virtual connections
- **Duration**: 60 seconds (1 minute continuous load)
- **Target Target**: `http://localhost:5000/health` or `/donations`

---

## 📊 Key Metrics Explained

| Metric | Description | Benchmark Target |
| :--- | :--- | :--- |
| **Requests per second (RPS)** | Total volume of HTTP requests processed by backend per second | **> 100 - 500+ req/sec** |
| **Average Response Time** | Mean time taken to complete request/response cycle | **< 250ms - 500ms** |
| **Minimum Latency** | Fastest recorded single request response time | **< 50ms** |
| **Maximum Latency** | Slowest recorded single request response time | **< 1500ms** |
| **Error Rate** | Count of failed requests (5xx/4xx/timeouts) | **0% Error Rate** |

---

## 🚀 Execution Instructions

### 1. Install Dependencies
```bash
cd load-tests
npm install
```

### 2. Run Baseline Test (100 VUs for 60 seconds)
```bash
npm run test:baseline
```

### 3. Customizing Target URL or Duration
```bash
API_URL=http://localhost:5000/donations VIRTUAL_USERS=100 DURATION_SEC=60 npm run test:baseline
```
