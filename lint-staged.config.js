module.exports = {
    '**/*.ts?(x)': (files) => [
        `eslint --cache --ext ".ts,.tsx --fix ${files.join(' ')}`,
        'tsc -p tsconfig.json --noEmit',
    ],
    '**/*.spec.ts?(x)': 'jest --bail --findRelatedTests',
    '**/*.{js,jsx,ts,tsx,json,scss}': ['prettier -w'],
    '**/*.php': (files) => [
        `bash -c "./vendor/bin/sail run laravel.test ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --allow-risky=yes ${files.join(
            ' ',
        )} || echo "Couldn\'t run php-cs-fixer."`,
        `bash -c "./vendor/bin/sail run laravel.test ./vendor/bin/phpstan analyze ${files.join(
            ' ',
        )} || echo "Couldn\'t run php-cs-fixer."`,
    ],
};
