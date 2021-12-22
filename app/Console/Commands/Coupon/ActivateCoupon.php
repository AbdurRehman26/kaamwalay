<?php

namespace App\Console\Commands\Coupon;

use App\Services\Admin\Coupon\CouponService;
use Illuminate\Console\Command;
use Symfony\Component\Console\Command\Command as CommandAlias;

class ActivateCoupon extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'coupons:activate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This command will activate coupons when they reach availability date';

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
        $queuedCoupons = $this->couponService->getQueuedCouponsNearingActivation();

        $this->info("Total of {$queuedCoupons->count()} will be activated.");

        $this->couponService->activateCoupons($queuedCoupons);

        $this->info("Total of {$queuedCoupons->count()} are now activated.");

        return CommandAlias::SUCCESS;
    }
}
