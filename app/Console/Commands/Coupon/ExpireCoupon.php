<?php

namespace App\Console\Commands\Coupon;

use App\Services\Admin\Coupon\CouponService;
use Illuminate\Console\Command;

class ExpireCoupon extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coupons:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will expire all the coupons when they reach their end of availability date';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(protected CouponService $couponService)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $coupons = $this->couponService->getCouponsNearingExpiry();

        $this->info("Total of {$coupons->count()} will be expired.");

        $this->couponService->expireCoupons($coupons);

        $this->info("Total of {$coupons->count()} are now expired.");

        return Command::SUCCESS;
    }
}
