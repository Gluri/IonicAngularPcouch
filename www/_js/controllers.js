'use strict';

angular.module('pCoachApp.controllers', [])


    .controller('TodoCtrl', function($scope, $ionicModal, todoDb, $ionicListDelegate) {
       
        $scope.tasks = [];
        $scope.online = false;
       
       

        $scope.toggleOnline = function() {
        $scope.online = !$scope.online;
            if ($scope.online) {  
                $scope.sync = todoDb.sync('http://92.222.33.181:5984/gennaro', {live: true})
                    .on('error', function (err) {
                        console.log("Syncing stopped");
                        console.log(err);
                    });
            } 
            else {
                $scope.sync.cancel();
            }
        };


        $scope.completionChanged = function(task) {
            task.completed = !task.completed;
            $scope.update(task);
        };

        
        todoDb.changes({
            live: true,
            onChange: function (change) {
                if (!change.deleted) {
                    todoDb.get(change.id, function(err, doc) {
                    if (err) console.log(err);
                        $scope.$apply(function() { //UPDATE
                            for (var i = 0; i < $scope.tasks.length; i++) {
                                if ($scope.tasks[i]._id === doc._id) {
                                    $scope.tasks[i] = doc;
                                return;
                                }
                            } // CREATE / READ
                        $scope.tasks.push(doc);
                        });
                    })
                } 
                else { //DELETE
                    $scope.$apply(function () {
                        for (var i = 0; i<$scope.tasks.length; i++) {
                            if ($scope.tasks[i]._id === change.id) {
                                $scope.tasks.splice(i,1);
                            }
                        }
                    })
                }
            }
        });


        
        $scope.update = function (task) {
            todoDb.get(task._id, function (err, doc) {
                if (err) {
                    console.log(err);
                } 
                else {
                    todoDb.put(angular.copy(task), doc._rev, function (err, res) {
                    if (err) console.log(err);
                    });
                }
            });
        };


        
        $scope.delete = function(task) {
            todoDb.get(task._id, function (err, doc) {
            todoDb.remove(doc, function (err, res) {});
            });
        };




        $scope.new = function() {
            $scope.newModal.show();
        };

        
        $scope.newTask = function(task) {
            task.completed = false;
                todoDb.post(angular.copy(task), function(err, res) {
                    if (err) console.log(err)
                        task.nome = "";
                        task.cognome = "";
                        task.indirizzo = "";
                        task.email = "";
                });
            $scope.newModal.hide();
        };


        $scope.closeNewTask = function() {
            $scope.newModal.hide();
        };


        $ionicModal.fromTemplateUrl('templates/new-item.html', function(modal) {
            $scope.newModal = modal;
            }, 
            { scope: $scope
        });




        $scope.edit = function (index) {  
            $scope.editModal.show(); 
            $scope.task = $scope.tasks[index];
        };

        
        $scope.editTask = function(task) {
            $scope.editModal.hide();
            $scope.update(task);
            $ionicListDelegate.closeOptionButtons()
        };


        $scope.closeEditTask = function() {
            $scope.editModal.hide();
            $ionicListDelegate.closeOptionButtons()
        };


        $ionicModal.fromTemplateUrl('templates/edit-item.html', function(modal) {
            $scope.editModal = modal;
            }, 
            { scope: $scope
        });
    })
    
    
    .controller('MainCtrl', function($scope) {
        $scope.toggleMenu = function() {
            $scope.sideMenuController.toggleLeft();
        }
        $scope.leftButtons = [{
            type: 'button-icon icon ion-navicon',
            tap: function(e) {
                $scope.toggleMenu();
            }
        }];
    });


