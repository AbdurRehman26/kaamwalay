<?php

namespace App\Console\Commands;

use App\Exports\Order\OrdersExport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ExportOrders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:export {date : YYYY-MM-DD format}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Export orders and upload csv to AWS S3';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('Exporting...');

        $date = $this->argument('date');

        $filePath = 'exports/orders-' . $date . '-' . Str::uuid() . '.csv';
        Excel::store(new OrdersExport($date),$filePath, 's3', \Maatwebsite\Excel\Excel::CSV);

        $this->info(Storage::disk('s3')->url($filePath));
        $this->info('Export completed.');

        return 0;
    }
}
