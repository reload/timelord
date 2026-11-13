import { angular } from './vendor.js';
import { TimeLordController } from './timelord-controller.js';

// index.php loads this module with a cache-busting "?v=" parameter; pass it on
// to the templates too.
const version = new URL(import.meta.url).searchParams.get('v');
const versioned = (path) => (version ? `${path}?v=${version}` : path);

const app = angular.module('TimeLordApp', ['angular-loading-bar', 'ngRoute', 'ngMd5']);

app.config(['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) => {
  $routeProvider.when('/', {
    templateUrl: versioned('templates/frontpage.html'),
    controller: 'TimeLord',
    reloadOnSearch: false,
  });

  // Remove the "/#/" from the URL.
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);

app.controller('TimeLord', TimeLordController);

// Module scripts are deferred, so the document has been parsed by now.
angular.bootstrap(document.body, ['TimeLordApp']);
