<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Sedang Sibuk</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #f0f0f5, #dcdce4);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .card {
            backdrop-filter: blur(20px);
            background: rgba(255, 255, 255, 0.6);
            border-radius: 20px;
            padding: 40px;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            max-width: 300px;
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid #007aff;
            /* iOS blue */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        h1 {
            font-size: 20px;
            font-weight: 600;
            color: #1c1c1e;
            margin-bottom: 10px;
        }

        p {
            font-size: 14px;
            color: #3a3a3c;
            margin: 0;
        }
    </style>
</head>

<body>
    <div class="card">
        <div class="spinner"></div>
        <h1>Sistem Sedang Sibuk</h1>
        <p>Silakan tunggu sebentar...</p>
    </div>
</body>

</html>
