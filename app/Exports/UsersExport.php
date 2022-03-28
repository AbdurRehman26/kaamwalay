<?php

namespace App\Exports;

use App\Models\User;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class UsersExport implements FromCollection, WithHeadings, WithMapping
{
    use Exportable;

    public function collection(): Collection
    {
        return User::all();
    }

    public function headings(): array
    {
        return ['name', 'email', 'phone', 'created_at'];
    }

    /**
     * @param User $row
     * @return array
     */
    public function map($row): array
    {
        return [
            $row->name,
            $row->email,
            $row->phone,
            $row->created_at,
        ];
    }
}
