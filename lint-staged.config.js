module.exports = {
    '**/*.ts?(x)': (files) => [
        `eslint --cache --ext ".ts,.tsx --fix ${files.join(' ')}`,
        'tsc -p tsconfig.json --noEmit',
    ],
    '**/*.spec.ts?(x)': 'jest --bail --findRelatedTests',
    '**/*.{js,jsx,ts,tsx,json,scss}': ['prettier -w'],
    '**/*.php': ['./vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php --allow-risky=yes'],
};
