<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Voter Log - {{ $event_name }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Auto refresh setiap 60 detik -->
    <meta http-equiv="refresh" content="60">
</head>
<body class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">

    <div class="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-2 text-center">
            Daftar anggota yang sudah mengirim voting <br> {{ $event_name }}
        </h2>
        <p class="text-sm text-gray-500 text-center mb-4">
            Last Update: {{ now()->format('d M Y H:i') }}
        </p>
        <table class="w-full border-collapse text-left">
            <thead>
                <tr class="bg-gray-200/50 text-gray-700">
                    <th class="px-4 py-3 font-medium text-center">No</th>
                    <th class="px-4 py-3 font-medium">Nama</th>
                    <th class="px-4 py-3 font-medium">NIK</th>
                    <th class="px-4 py-3 font-medium">Nomor HP</th>
                    <th class="px-4 py-3 font-medium text-center">Total Votes</th>
                    <th class="px-4 py-3 font-medium">Waktu Voting</th>
                </tr>
            </thead>
            <tbody>
                @foreach($results as $index => $row)
                <tr class="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td class="px-4 py-3 text-center font-semibold text-gray-900">{{ $index + 1 }}</td>
                    <td class="px-4 py-3 font-semibold text-gray-900">{{ $row->user_name }}</td>
                    <td class="px-4 py-3 font-semibold text-gray-900">-</td>
                    <td class="px-4 py-3 text-gray-700">-</td>
                    <td class="px-4 py-3 text-center text-blue-600 font-bold">{{ $row->total_votes }}</td>
                    <td class="px-4 py-3 text-gray-600">
                        {{ \Carbon\Carbon::parse($row->waktu_voting)->format('d M Y H:i') }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

</body>
</html>
