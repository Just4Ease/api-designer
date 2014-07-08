(function () {
  'use strict';

  angular.module('ramlEditorApp')
    .directive('ramlEditorNewFolderButton', function ramlEditorNewFolderButton(ramlEditorInputPrompt, ramlRepository, generateName) {
      return {
        restrict: 'E',
        template: '<span role="new-button" ng-click="newFolder()"><i class="fa fa-folder-open"></i>&nbsp;New Folder</span>',
        link:     function (scope) {
          scope.newFolder = function newFolder() {
            var directory = scope.fileBrowser.selectedTarget.isDirectory ?
              scope.fileBrowser.selectedTarget :
              ramlRepository.getDirectory(ramlRepository.parentPath(scope.fileBrowser.selectedTarget), scope.homeDirectory);
            var message = 'Input a name for your new folder:';
            var defaultName = generateName(directory.getDirectories().map(function (d){return d.name;}), 'Folder');

            var validations = [
              {
                message: 'That folder name is already taken.',
                validate: function(input) {
                  return !directory.children.some(function (directory) {
                    return directory.name.toLowerCase() === input.toLowerCase();
                  });
                }
              } , {
                message: 'Folder name cannot be empty.',
                validate: function(input) {
                  return input.length > 0;
                }
              }
            ];

            ramlEditorInputPrompt.open(message, defaultName, validations)
              .then(function(input) {
                directory.createDirectory.call(directory, input);
              });
          };
        }
      };
    })
  ;
})();
