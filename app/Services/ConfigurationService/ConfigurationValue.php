<?php

namespace App\Services\ConfigurationService;

class ConfigurationValue
{
    private const OPTION_SEPARATOR = ':';
    private const ARGUMENT_SEPARATOR = ',';

    public bool $show = true;
    private ConfigurationValueGetter $getter;

    private array $gettersMap = [
        'env' => ConfigurationEnvironmentValue::class,
    ];

    public function __construct(private string $value)
    {
        $this->getter = new ConfigurationEnvironmentValue();
        $this->parse();
    }

    private function parse(): void
    {
        $options = explode(self::OPTION_SEPARATOR, $this->value);
        $key = $options[0];
        array_shift($options);

        foreach ($options as $option) {
            $this->addOption($option);
        }

        $this->setKey($key);
    }

    private function addOption(string $option): void
    {
        $args = explode(self::ARGUMENT_SEPARATOR, $option);
        $name = $args[0];
        array_shift($args);

        if ($name === 'auth') {
            $this->show = auth()->check();

            return;
        }

        /**
         * @var $getter ConfigurationValueGetter
         */
        $getter = $this->gettersMap[$name];
        if ($getter) {
            $this->getter = new $getter(...$args);
        }
    }

    public function setKey(string $key): self
    {
        $this->getter->setKey($key);

        return $this;
    }

    public static function from($value): self
    {
        return new ConfigurationValue($value);
    }

    public function getKey(): string
    {
        return $this->getter->getKey();
    }

    public function getValue(): mixed
    {
        return $this->getter->getValue();
    }

    public function canBeInclude(): bool
    {
        return $this->show;
    }
}
