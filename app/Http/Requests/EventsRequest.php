<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EventsRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $timezone = config('app.timezone');

        $normalizeDateTime = function (?string $value) use ($timezone): ?string {
            if ($value === null || trim($value) === '') {
                return null;
            }

            return Carbon::parse($value)
                ->setTimezone($timezone)
                ->format('Y-m-d H:i:s');
        };

        $this->merge([
            'started_at' => $normalizeDateTime($this->input('started_at')),
            'finished_at' => $normalizeDateTime($this->input('finished_at')),
        ]);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Sesuaikan dengan kebutuhan, misalnya hanya admin
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('election_events', 'name')
                    ->ignore($this->route('event')), // safe untuk store & update
            ],
            'keyword' => 'required|string|max:50',
            'started_at' => 'required|date',
            'finished_at' => 'required|date|after:started_at',
            'start_date' => 'nullable|date',
            'duration' => 'nullable|integer|min:1',
            'is_autorun' => 'boolean',
            'status' => 'required|in:pending,scheduled,running,finished,cancelled',
            'is_running' => 'boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama event wajib diisi.',
            'name.string' => 'Nama event harus berupa teks.',
            'name.max' => 'Nama event maksimal 100 karakter.',
            'name.unique' => 'Nama event sudah digunakan, silakan pilih nama lain.',

            'keyword.string' => 'Keyword harus berupa teks.',
            'keyword.max' => 'Keyword maksimal 50 karakter.',

            'start_date.required' => 'Tanggal mulai wajib diisi.',
            'start_date.date' => 'Tanggal mulai harus berupa format tanggal yang valid.',

            'duration.required' => 'Durasi wajib diisi.',
            'duration.integer' => 'Durasi harus berupa angka.',
            'duration.min' => 'Durasi minimal 1 menit.',

            'status.required' => 'Status event wajib diisi.',
            'status.in' => 'Status event harus salah satu dari: pending, scheduled, running, finished, cancelled.',
            'finished_at.after' => 'Waktu selesai harus setelah waktu mulai.',
        ];
    }
}
