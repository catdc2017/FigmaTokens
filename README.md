# Better.UI Design Tokens

Design tokens originated at Salesforce, and the best way to describe them is to simply quote their documentation:

> Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. We use them in place of hard-coded values (such as hex values for color or pixel values for spacing) in order to maintain a scalable and consistent visual system for UI development – [Salesforce UX](https://www.lightningdesignsystem.com/design-tokens/)

## Prerequisites

Before using this package or developing on this repository, you will need the following:

-   [Node/NPM](https://nodejs.org/en/) (14.15.4 or higher)
-   Read access to either the [Optum registry](https://tech.optum.com/resource-center/developer-tools/artifactory/artifactory-overview) or the [Rally registry](https://wiki.audaxhealth.com/x/rYHTAQ)
-   [Design Tokens](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421) knowledge and why we are using them
-   [Style Dictionary](https://amzn.github.io/style-dictionary/#/README) knowledge to update any of the tokens

## Installation

To use the variables from this package, download and install the package from our npm registry:

```bash
npm i @better-ui/foundations
```

## Project Structure

-   design-tokens folder contains different groups of tokens
-   The json file inside each grouping contains the structure for the design tokens related to it
-   themes folder contains the themes values for each theme

-   dist - This is what is contained in package in artifactory
-   Inside the dist folder, the `theme` folder will contain the design tokens in various formats

## Usage

We provide CSS, SCSS, LESS, and JS outputs to support applications that use [SASS](https://sass-lang.com/), [LESS](https://lesscss.org/), and any [css-in-js](https://blog.bitsrc.io/9-css-in-js-libraries-you-should-know-in-2018-25afb4025b9b) solutions.

### CSS

All of the theme variables will be available to use when importing the CSS variables files. Import the variables file and use the variables as you would normally.

In your component:

```jsx
import './page.css';
...
<button class="btn-success">submit</button>
```

In your page.css stylesheet:

```css
@import '@better-ui/foundations/dist/rally/css/_variables.css';

.btn-success {
    background-color: var(--bui-core-color-success-70);
}
```

### SASS

All of the theme variables will be available to use when importing the SASS variables file. Just import in the variables file and use the variables as you would normally.

In your SASS file:

```scss
@import '@better-ui/foundations/dist/rally/scss/_variables.scss';
```

Then use like:

```scss
.my-component {
    background-color: $bui-color-black;
}
```

### Javascript

The variables are also available in `.js` formats (including TypeScript declarations) for consuming within an application that utilizes a css-in-js solution. Import the variables into whatever component that needs them. Import from the theme within `dist/tokens` (optum|rally|uhc). This dist bundle contains both CommonJS and ES Modules formats. Each theme has a package.json with a `main`, `module`, `typings` property. Webpack will dynamically determine which bundle file to add to the output bundle. Node.js environments will use the cjs files so tools like jest will work out of the box without transform.

In your JS file:

```js
import { BUI_COLOR_BLACK } from '@better-ui/foundations/dist/rally/js/_variables.js';
```

In a project that utilizes Emotion:

```js
render(
    <div
        className={css`
            background-color: ${BUI_COLOR_BLACK};
        `}
    >
        Rendering with Emotion
    </div>
);
```

### LESS

In your LESS file:

```less
@import '@better-ui/foundations/dist/rally/less/_variables.less;
```

Then use like:

```less
.my-component {
    color: @bui-core-color-success-70;
}
```

### How to generate a theme/design tokens

1. Create a new folder in the themes folder e.g. optum, uhc-solas, rally and update the sd-build.ks file to include the new theme
2. To generate design tokens run `npm run build`. Output for themes is in the dist folder
3. Deploy the dist folder to Artifactory by running `npm run deploy-archive`. This step is handled by Jenkins and should not be performed locally

### Resources

-   [Style Dictionary](https://amzn.github.io/style-dictionary/#/)
-   [Using Design Tokens with the Lightning Design System](https://www.youtube.com/watch?v=wDBEc3dJJV8)
-   [Salesforce Theo](https://github.com/salesforce-ux/theo)
-   [Design Tokens for dummies](https://uxdesign.cc/design-tokens-for-dummies-8acebf010d71)
