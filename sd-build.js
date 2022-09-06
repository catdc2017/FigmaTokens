const StyleDictionaryPackage = require('style-dictionary');

const themes = ['optum', 'uhc-solas', 'rally'];
const platforms = ['web', 'ios', 'android'];
const tokenPrefix = 'bui';

// FUNCTION TO FILTER ALIAS TOKENS FROM FILE OUTPUT
StyleDictionaryPackage.registerFilter({
    name: 'filter-core-undefined',
    matcher: function (prop) {
        return prop.attributes.category !== 'core' && prop.value !== '';
    },
});

// HAVE THE STYLE DICTIONARY CONFIG DYNAMICALLY GENERATED
function getStyleDictionaryConfig(brand, platform) {
    return {
        source: [
            `src/themes/${brand}/*.json`,
            `src/themes/${brand}/application/*.json`,
            `src/themes/${brand}/component/*.json`,
            'src/design-tokens/**/*.json',
        ],
        platforms: {
            scss: {
                prefix: `${tokenPrefix}`,
                transformGroup: 'scss',
                buildPath: `dist/${brand}/scss/`,
                files: [
                    {
                        destination: '_variables.scss',
                        format: 'scss/variables',
                        filter: 'filter-core-undefined',
                    },
                ],
            },
            less: {
                prefix: `${tokenPrefix}`,
                transformGroup: 'less',
                buildPath: `dist/${brand}/less/`,
                files: [
                    {
                        destination: '_variables.less',
                        format: 'less/variables',
                        filter: 'filter-core-undefined',
                    },
                ],
            },
            css: {
                prefix: `${tokenPrefix}`,
                transformGroup: 'css',
                buildPath: `dist/${brand}/css/`,
                files: [
                    {
                        destination: '_variables.css',
                        format: 'css/variables',
                        filter: 'filter-core-undefined',
                    },
                ],
            },
            javascript: {
                prefix: `${tokenPrefix}`,
                transformGroup: 'js',
                buildPath: `dist/${brand}/js/`,
                files: [
                    {
                        format: 'javascript/es6',
                        destination: '_variables.js',
                    },
                    {
                        format: 'javascript/module-flat',
                        destination: '_variables.common.js',
                    },
                    {
                        format: 'typescript/es6-declarations',
                        destination: '_variables.d.ts',
                    },
                    {
                        format: 'javascript/module',
                        destination: '_variables.module.js',
                    },
                    {
                        format: 'typescript/module-declarations',
                        destination: '_variables.module.d.ts',
                    },

                    {
                        format: 'javascript/umd',
                        destination: '_variables.umd.js',
                    },
                    {
                        format: 'json',
                        destination: '_variables.raw.json',
                    },
                    {
                        destination: '_variables.json',
                        format: 'json/flat',
                    },
                ],
            },
        },
    };
}

console.log('Build started...');

// PROCESS THE DESIGN TOKENS FOR THE DIFFERENT BRANDS AND PLATFORMS

platforms.map(function (platform) {
    themes.map(function (brand) {
        console.log('\n==============================================');
        console.log(`\nProcessing: [${platform}] [${brand}]`);

        const StyleDictionary = StyleDictionaryPackage.extend(getStyleDictionaryConfig(brand));
        StyleDictionary.buildAllPlatforms();

        console.log('\nEnd processing');
    });
});

console.log('\n==============================================');
console.log('\nBuild completed!');
