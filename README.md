# hao-pages ![npm package version](https://img.shields.io/npm/v/hao-pages?label=npm%20version) ![Node.js support](https://img.shields.io/node/v/hao-pages)

Workflow based on [Gulp](https://github.com/gulpjs/gulp) packaging.

## Installation

```sh
yarn add hao-pages -D
# or
npm i hao-pages -D
```

## Usage

### Add your `pages.config.js` in the root directory

In order to replace the default configuration, you might write something like this:

```js
module.exports = {
  build: {
    src: 'src',
    dist: 'release', // output directory, default `dist`
    temp: '.tmp', // temporary file directory, default `temp`
    public: 'public', // When building, it will all be copied to the output directory
    paths: {
      styles: 'assets/styles/*.scss',
      scripts: 'assets/scripts/*.js',
      pages: '*.html',
      images: 'assets/images/**',
      fonts: 'assets/fonts/**',
    },
  },
  data: require('./src/data'), // template engine data
}
```

With the configuration above, your directory now looks like this:

```md
.
├── package.json
├── pages.config.js
├── public
│   └── favicon.ico
├── src
│   ├── index.html
│   ├── layouts
│   │   └── basic.html
│   ├── data.js
│   ├── partials
│   │   ├── footer.html
│   │   ├── header.html
│   └── assets
│       ├── fonts
│       ├── images
│       ├── scripts
│       └── styles
└── yarn.lock
```

### Run

Execute the command in the project root directory:

```sh
# clean
yarn hao-pages clean
# develop
yarn hao-pages dev
# build
yarn hao-pages build
```

Or add the command to the `package.json`:

```json
"scripts": {
  "clean": "hao-pages clean",
  "dev": "hao-pages dev",
  "build": "hao-pages build"
},
```
