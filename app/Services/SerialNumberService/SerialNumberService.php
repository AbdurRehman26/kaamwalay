<?php

namespace App\Services\SerialNumberService;

use Illuminate\Support\Str;

/**
 * @method static SerialNumber customer(?int $value = null, int $len = 8, string $pad = '0') Get a SerialNumber configured for customer
 */
class SerialNumberService
{
    public const PREFIX_MAP = [
        'customer' => 'C',
    ];

    /**
     * This message will try to generate a base serial number based on the given subject and value,
     * and of course len and pad arguments which can be used to customize the serial number.
     *
     * For a class string, the functions will try to se if the CanBeSerialNumbered interface method exist,
     * interface of which method 'getPrefixSerialNumber' will be later used to gen the prefix.
     * In case the string it's not a class but is defined on the PREFIX_MAP, the value of property that match
     * the subject will be used instead.
     * If nothing satisfy previous conditions, the subject will be used for prefix with some conditions.
     * For a string of which length it's less or equal with 3, the subject will become prefix transformed to uppercase
     * For a string bigger than 3, only uppercase letters will be picked after subject is transformed to PascalCase
     * with max. amount of 3 letter.
     *
     * @param CanBeSerialNumbered|string $subject
     * @param ?int $value
     * @param int $len
     * @param string $pad
     * @return SerialNumber
     */
    public static function for(CanBeSerialNumbered | string $subject, ?int $value = null, int $len = 8, string $pad = '0'): SerialNumber
    {
        if (class_exists($subject) && method_exists($subject, 'getPrefixSerialNumber')) {
            // If subject it's a class and implements CanBeSerialNumbered interface.
            // We will consider prefix being the result of that method call.
            $prefix = $subject::getPrefixSerialNumber();
        } elseif (isset(self::PREFIX_MAP[$subject])) {
            // If the subject exist on our predefined map, we will use the value
            // as prefix instead.
            $prefix = self::PREFIX_MAP[$subject];
        } elseif (Str::length($subject) <= 3) {
            // If the string has less or equal number of 3 letters we will consider
            // prefix uppercase transformed subject.
            $prefix = Str::upper($subject);
        } else {
            // For rest string that don't match any condition, we will transform subject to
            // PascalCase string, and then pick only uppercase letters, limiting the length to 3.
            $prefix = Str::substr(preg_replace('/[^A-Z]/', '', Str::studly($subject)), 0, 3);
        }

        return (new SerialNumber($prefix, $len, $pad))->setValue($value);
    }

    public static function __callStatic(string $name, array $arguments)
    {
        return self::for(self::PREFIX_MAP[$name], ...$arguments);
    }

    public function get(CanBeSerialNumbered | string $subject, $value, int $len = 8, string $pad = '0'): string
    {
        return self::for($subject, $value, $len, $pad);
    }
}
