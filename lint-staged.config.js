module.exports = {
    // '**/*.spec.ts?(x)': 'jest --bail --findRelatedTests',
    '**/*.ts?(x)': (files) => [
        // 'tsc-files --noEmit'
        `eslint --cache --ext ".ts,.tsx --fix ${files.join(' ')}`,
    ],
    '**/*.{js,jsx,ts,tsx,json,scss}': ['prettier -w'],
    '**/*.php': (files) => [
        `bash -c "./vendor/bin/sail run laravel.test ./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --allow-risky=yes ${files.join(
            ' ',
        )} || echo "Couldn\'t run php-cs-fixer."`,
    ],
};
