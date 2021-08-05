<?php

namespace App\View\Components\apps;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SinglePageApplication extends Component
{
    public $componentName = 'sap';

    /**
     * @var string
     */
    public $app;
    /**
     * @var string
     */
    public $title;
    /**
     * @var string
     */
    public $lang;
    /**
     * @var string
     */
    public $publicPath;

    /**
     * @param string $app
     * @param string $title
     * @param string|null $lang
     */
    public function __construct(string $app, string $title, ?string $lang = null)
    {
        $this->app = $app;
        $this->title = $title;
        $this->lang = $lang ?? str_replace('_', '-', app()->getLocale());

        $this->setPublicPath();
    }

    private function setPublicPath(): void
    {
        $this->publicPath = '/apps/' . $this->app . '/';
        if (app()->environment("production")) {
            $this->publicPath = config('app.mix_url') . "/apps/" . $this->app;
        }
    }

    /**
     * @return View
     */
    public function render(): View
    {
        return view('components.apps.single-page-application');
    }
}
