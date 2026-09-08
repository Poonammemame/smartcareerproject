<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PathFinder - Backend API Browser Tester</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
        body { background: #0f172a; color: #f8fafc; padding: 30px; }
        .container { max-width: 950px; margin: 0 auto; }
        h1 { font-size: 24px; font-weight: 700; color: #38bdf8; margin-bottom: 8px; }
        p.subtitle { color: #94a3b8; font-size: 14px; margin-bottom: 24px; }
        .card { background: #1e293b; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #334155; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 16px; }
        button { background: #2563eb; color: white; border: none; padding: 11px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 13px; }
        button:hover { background: #1d4ed8; transform: translateY(-1px); }
        button.admin { background: #dc2626; }
        button.admin:hover { background: #b91c1c; }
        button.user { background: #16a34a; }
        button.user:hover { background: #15803d; }
        button.purple { background: #7c3aed; }
        button.purple:hover { background: #6d28d9; }
        button.amber { background: #d97706; }
        button.amber:hover { background: #b45309; }
        button.teal { background: #0d9488; }
        button.teal:hover { background: #0f766e; }
        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #334155; color: #cbd5e1; margin-bottom: 12px; }
        .status-badge.ok { background: #064e3b; color: #6ee7b7; }
        .status-badge.err { background: #7f1d1d; color: #fca5a5; }
        pre { background: #0b0f19; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; overflow-x: auto; color: #a5f3fc; font-family: monospace; font-size: 13px; max-height: 420px; }
    </style>
</head>
<body>
<div class="container">
    <h1>🚀 PathFinder Backend API Browser Tester</h1>
    <p class="subtitle">Test live Student & Admin backend APIs directly in your browser with 1 click.</p>

    <div class="card">
        <div class="section-title">Admin Dashboard Backend APIs (http://localhost:8090/adminDashboard.jsp)</div>
        <div class="grid">
            <button class="admin" onclick="testAdminLogin()">🔐 1. Admin Login (Admin@123)</button>
            <button class="teal" onclick="testAllUsers()">👥 2. GET /api/user/all (Admin)</button>
            <button class="teal" onclick="testAllResults()">📊 3. GET /api/result/all (Admin)</button>
        </div>

        <div class="section-title" style="margin-top: 14px;">User Dashboard & Assessment APIs</div>
        <div class="grid">
            <button class="user" onclick="testUserLogin()">🔑 1. User Login (Poonam@123)</button>
            <button onclick="testQuestions()">❓ 2. GET /api/question/all</button>
            <button class="purple" onclick="testMyResults()">📈 3. GET /api/result/my</button>
            <button class="amber" onclick="testRecommendations()">🎯 4. GET /api/recommendation/my</button>
        </div>

        <div style="margin-top: 14px;">
            <span id="statusBadge" class="status-badge">Ready to Test</span>
            <span id="endpointUrl" style="color: #94a3b8; font-size: 12px; margin-left: 10px;"></span>
        </div>
        <pre id="output">Click any button above to test backend API response...</pre>
    </div>
</div>

<script src="${pageContext.request.contextPath}/JS/config.js?v=20260827_3"></script>
<script>
    let activeToken = localStorage.getItem("adminToken") || localStorage.getItem("token") || "";

    function setOutput(status, isOk, url, data) {
        const badge = document.getElementById("statusBadge");
        badge.textContent = status;
        badge.className = "status-badge " + (isOk ? "ok" : "err");
        document.getElementById("endpointUrl").textContent = url;
        document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    }

    function testAdminLogin() {
        const url = "http://localhost:8090/api/admin/login";
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "admin@gmail.com", password: "Admin@123" })
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            if (res.ok && res.data.token) {
                activeToken = res.data.token;
                localStorage.setItem("adminToken", activeToken);
                localStorage.setItem("token", activeToken);
                setOutput("Status 200 OK - Admin Authenticated (Role: ADMIN)", true, "POST " + url, res.data);
            } else {
                setOutput("Status " + res.status + " Error", false, "POST " + url, res.data);
            }
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }

    function testAllUsers() {
        const url = "http://localhost:8090/api/user/all";
        fetch(url, {
            headers: { "Authorization": "Bearer " + activeToken, "Accept": "application/json" }
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            setOutput("Status " + res.status + " (" + (Array.isArray(res.data) ? res.data.length : 0) + " Registered Users)", res.ok, "GET " + url, res.data);
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }

    function testAllResults() {
        const url = "http://localhost:8090/api/result/all";
        fetch(url, {
            headers: { "Authorization": "Bearer " + activeToken, "Accept": "application/json" }
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            setOutput("Status " + res.status + " (" + (Array.isArray(res.data) ? res.data.length : 0) + " Assessment Results)", res.ok, "GET " + url, res.data);
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }

    function testUserLogin() {
        const url = "http://localhost:8090/api/auth/login";
        fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "poonam@gmail.com", password: "Poonam@123" })
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            if (res.ok && res.data.token) {
                activeToken = res.data.token;
                localStorage.setItem("token", activeToken);
                localStorage.setItem("userId", res.data.userId);
                setOutput("Status 200 OK - User Authenticated (Role: USER)", true, "POST " + url, res.data);
            } else {
                setOutput("Status " + res.status + " Error", false, "POST " + url, res.data);
            }
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }

    function testQuestions() {
        const url = "http://localhost:8090/api/question/all";
        fetch(url, {
            headers: { "Authorization": "Bearer " + activeToken, "Accept": "application/json" }
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            setOutput("Status " + res.status + " (" + (Array.isArray(res.data) ? res.data.length : 0) + " Questions)", res.ok, "GET " + url, res.data);
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }

    function testMyResults() {
        const url = "http://localhost:8090/api/result/my";
        fetch(url, {
            headers: { "Authorization": "Bearer " + activeToken, "Accept": "application/json" }
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            setOutput("Status " + res.status + " (User Results Loaded)", res.ok, "GET " + url, res.data);
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }

    function testRecommendations() {
        const url = "http://localhost:8090/api/recommendation/my";
        fetch(url, {
            headers: { "Authorization": "Bearer " + activeToken, "Accept": "application/json" }
        })
        .then(res => res.json().then(data => ({ status: res.status, ok: res.ok, data })))
        .then(res => {
            setOutput("Status " + res.status + " (Recommendation Loaded)", res.ok, "GET " + url, res.data);
        })
        .catch(err => setOutput("Connection Error", false, url, { error: err.message }));
    }
</script>
</body>
</html>