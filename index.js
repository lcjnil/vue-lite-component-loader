const cheerio = require('cheerio');
const loaderUtils = require('loader-utils');
const {compileTemplate} = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');

function createComponent($template, isProduction) {
    const name = $template.attr('name');
    const props = $template.attr('props');
    const model = $template.attr('model');

    const html = $template.html();

    const compiled = compileTemplate({
        source: html,
        filename: name,
        compiler,
        isProduction,
    });

    return `
(() => {
    ${compiled.code}
    return {
        name: '${name}',
        props: ${props},
        render: render,
        staticRenderFns: staticRenderFns,
        _scopeId: Component.options._scopeId,
        ${model ? `model: ${model}` : ''}
    }
})()
    `;
}

module.exports = function(source, map) {
    const loaderContext = this;

    const {minimize} = loaderContext;
    const options = loaderUtils.getOptions(loaderContext) || {};
    const isProduction = options.productionMode || minimize || process.env.NODE_ENV === 'production';

    const $ = cheerio.load(source, {decodeEntities: false});

    const obj = Array.prototype.map
        .call($('template'), template => {
            const $template = $(template);
            const name = $template.attr('name');
            return `'${name}': ${createComponent.call(this, $template, isProduction)}`;
        })
        .join(',');

    this.callback(
        null,
        `
    export default function(Component) {
        Component.options.components = Object.assign(Component.options.components || {}, {
            ${obj}
        })
    }
    `,
        map,
    );
};
