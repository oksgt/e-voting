<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnggotaKoperasiResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'nik' => $request->is('api/*') ? $this->encryptNik($this->nik) : $this->nik,
            'bidang' => $this->bidang,
            'nowa' => $this->nowa,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Encrypt NIK using AES-256-CBC with random IV prepended.
     */
    private function encryptNik(?string $nik): ?string
    {
        if ($nik === null) {
            return null;
        }

        $key = config('app.nik_encryption_key');

        if (empty($key)) {
            return $nik;
        }

        $iv = random_bytes(16);
        $encrypted = openssl_encrypt($nik, 'AES-256-CBC', $key, OPENSSL_RAW_DATA, $iv);

        return base64_encode($iv.$encrypted);
    }
}
