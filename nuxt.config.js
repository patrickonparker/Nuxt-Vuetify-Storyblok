// Load Dependencies
import axios from 'axios';

// Allow using .env files for local development
require('dotenv').config();

//
//
//     ___ _ ____   __
//    / _ \ '_ \ \ / /
//   |  __/ | | \ V /
//    \___|_| |_|\_/
//
//

// Read site settings from environment variables
const NAME = process.env.SITE_NAME;
const URL = process.env.SITE_URL;
const ICON = process.env.SITE_ICON;
const FAVICON = process.env.SITE_FAVICON;
const TOKEN = process.env.STORYBLOK_TOKEN;
const BING_ID = process.env.BING_WEBMASTER;
const ANALYTICS = process.env.GOOGLE_ANALYTICS;
const PROGRESS = process.env.PROGRESS_BAR_COLOR
  ? process.env.PROGRESS_BAR_COLOR
  : '#fff';
const PRIMARY_LIGHT = process.env.THEME_PRIMARY
  ? process.env.THEME_PRIMARY
  : '#2979FF';
const PRIMARY_DARK = process.env.DARK_THEME_PRIMARY
  ? process.env.DARK_THEME_PRIMARY
  : '#2979FF';
const DARK = process.env.DARK_THEME === 'true' ? true : false;

module.exports = {
  // Enable Server-Side Rendering
  mode: 'universal',

  //                   _
  //                  | |
  //    _ __ ___   ___| |_ __ _
  //   | '_ ` _ \ / _ \ __/ _` |
  //   | | | | | |  __/ || (_| |
  //   |_| |_| |_|\___|\__\__,_|
  //
  //

  // Progress Bar Color
  loading: { color: PROGRESS },

  // Custom Site Meta (i.e. favicons)
  head: {
    meta: [{ name: 'msvalidate.01', content: BING_ID }],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: FAVICON ? FAVICON : 'favicon.ico'
      }
    ]
  },

  // Site Meta (Through PWA Submodule)
  meta: {
    name: NAME,
    theme_color: PRIMARY_DARK ? PRIMARY_DARK : PRIMARY_LIGHT,
    nativeUI: true
  },

  icon: {
    iconFileName: ICON
  },

  // Web App Manifest (Through PWA Submodule)
  manifest: {
    name: NAME,
    short_name: NAME,
    icons: [
      {
        src: ICON,
        sizes: '512x512',
        type: 'image/jpg'
      }
    ]
  },

  //          _             _
  //         | |           (_)
  //    _ __ | |_   _  __ _ _ _ __  ___
  //   | '_ \| | | | |/ _` | | '_ \/ __|
  //   | |_) | | |_| | (_| | | | | \__ \
  //   | .__/|_|\__,_|\__, |_|_| |_|___/
  //   | |             __/ |
  //   |_|            |___/

  // Nuxt Build Modules
  buildModules: ['@nuxtjs/vuetify'],

  // Nuxt Modules
  modules: [
    ['storyblok-nuxt', { accessToken: TOKEN, cacheProvider: 'memory' }],
    ['@nuxtjs/markdownit'],
    ['@nuxtjs/pwa'],
    ['@nuxtjs/sitemap']
  ],

  // Plugins (Global component registration, filters, etc)
  plugins: [
    '~/plugins/components',
    '~/plugins/filters',
    { src: 'plugins/vue-typer.js', ssr: false },
    { src: 'plugins/vue-carousel-3d.js', ssr: false },
    { src: 'plugins/magicgrid.js', ssr: false }
  ],

  // Load SCSS
  css: ['@/assets/style/style.scss'],

  // Sitemap Config
  sitemap: {
    hostname: URL,
    gzip: true,
    exclude: ['/global']
  },

  // Google Analytics
  googleAnalytics: {
    id: ANALYTICS,
    dev: false
  },

  // Markdown-It Config
  markdownit: { injected: true },

  //                     _   _  __
  //                    | | (_)/ _|
  //   __   ___   _  ___| |_ _| |_ _   _
  //   \ \ / / | | |/ _ \ __| |  _| | | |
  //    \ V /| |_| |  __/ |_| | | | |_| |
  //     \_/  \__,_|\___|\__|_|_|  \__, |
  //                                __/ |
  //                               |___/

  // Vuetify Configuration
  vuetify: {
    customProperties: true,
    defaultAssets: {
      font: true,
      icons: 'mdi'
    },
    theme: {
      dark: DARK,
      themes: {
        light: {
          primary: PRIMARY_LIGHT
        },
        dark: {
          primary: PRIMARY_DARK
        }
      },
      options: {
        customProperties: true
      }
    }
  },

  //    _           _ _     _
  //   | |         (_) |   | |
  //   | |__  _   _ _| | __| |
  //   | '_ \| | | | | |/ _` |
  //   | |_) | |_| | | | (_| |
  //   |_.__/ \__,_|_|_|\__,_|
  //
  //

  // Router Middleware
  router: {
    middleware: 'setCacheVersion'
  },

  // Build Configuration
  build: {
    extractCSS: true,
    // PostCSS Config
    postcss: {
      // Add plugin names as key and arguments as value
      // Install them before as dependencies with npm or yarn
      plugins: {
        // Disable a plugin by passing false as value
        'postcss-responsive-type': {}
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true
        }
      }
    },

    // You can extend webpack config here
    extend(config, ctx) {}
  },

  // Generate Routes
  generate: {
    routes: function(callback) {
      const version = 'published';
      let cache_version = 0;

      // Other routes that are not in Storyblok with their slug.
      let routes = ['/', '/home'];

      // Load space and receive latest cache version key to improve performance
      axios
        .get(`https://api.storyblok.com/v1/cdn/spaces/me?token=${TOKEN}`)
        .then(space_res => {
          // timestamp of latest publish
          cache_version = space_res.data.space.version;

          // Call for all Links using the Links API: https://www.storyblok.com/docs/Delivery-Api/Links
          axios
            .get(
              `https://api.storyblok.com/v1/cdn/links?token=${TOKEN}&version=${version}&cv=${cache_version}`
            )
            .then(res => {
              Object.keys(res.data.links).forEach(key => {
                if (res.data.links[key].slug != 'home') {
                  routes.push('/' + res.data.links[key].slug);
                }
              });

              callback(null, routes);
            });
        });
    }
  }
};
