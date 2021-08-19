<?php

namespace App\View\Components\apps;

use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class SinglePageApplication extends Component
{
    public string $appName;
    public string $title;
    public ?string $lang;
    public ?string $publicPath;

    public function __construct(string $appName, string $title, ?string $publicPath = null, ?string $lang = null)
    {
        $this->appName = $appName;
        $this->title = $title;
        $this->lang = $lang;
        $this->publicPath = $publicPath;
    }

    public function getLang(): string
    {
        return $this->lang ?? str_replace('_', '-', app()->getLocale());
    }

    public function getPublicPath(): string
    {
        if (! $this->publicPath) {
            $this->publicPath = '/apps/' . $this->appName . '/';
            if (app()->environment("production")) {
                $this->publicPath = config('app.mix_url') . "/apps/" . $this->appName;
            }
        }

        return $this->publicPath;
    }

    public function render(): View
    {
        return view('components.apps.single-page-application');
    }
}
