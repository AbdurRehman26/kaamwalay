<?php

namespace App\Console\Commands;

use App\Exports\UsersExport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Excel;

class ExportUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:export';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export all users to a csv and upload it to AWS S3';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(): int
    {
        $this->info('Exporting...');

        $filePath = 'exports/users-' . Str::uuid() . '.csv';
        (new UsersExport)->store($filePath, 's3', Excel::CSV);

        $this->info(Storage::disk('s3')->url($filePath));
        $this->info('Export completed.');

        return Command::SUCCESS;
    }
}
