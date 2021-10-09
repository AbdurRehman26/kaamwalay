<?php

namespace App\Console\Commands\Orders;

use App\Models\OrderPayment;
use Illuminate\Console\Command;
use Symfony\Component\Console\Helper\ProgressBar;

class UpdateOrderPaymentAmount extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order-payments:update_amount';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'New fields are added in the order_payments table, this column needs to be filled with
                              payment type and amount fields';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct(protected ?ProgressBar $progressBar = null)
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
        $orderPayments = OrderPayment::with('order:id,grand_total')
            ->whereNull('amount')
            ->get();

        $this->initializeProgressBar($orderPayments->count());

        $orderPayments->each(fn ($orderPayment) => $this->updateTypeAndAmount($orderPayment));

        $this->finishProgressBar();

        return 0;
    }

    protected function initializeProgressBar(int $count): void
    {
        $this->info("Found a total of {$count} order payments: ");
        $this->progressBar = $this->output->createProgressBar($count);
        $this->progressBar->setBarCharacter('=');
        $this->progressBar->setProgressCharacter('>');
        $this->progressBar->setEmptyBarCharacter(' ');
        $this->progressBar->start();
    }

    protected function updateTypeAndAmount(OrderPayment $orderPayment): void
    {
        $orderPayment->amount = $orderPayment->order->grand_total;
        $orderPayment->type = OrderPayment::PAYMENT_TYPES['order_payment'];
        $this->progressBar->advance();
        $orderPayment->save();
    }

    protected function finishProgressBar(): void
    {
        $this->progressBar->finish();
        $this->newLine();
        $this->info('All order payments are updated.');
    }
}
