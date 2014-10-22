'use strict';


angular.module('pCoachApp.services', [])

.factory('todoDb', function() {
    var db = new PouchDB('gennaro',{
                cache: true,
                ajax: {cache:true}
            });
    return db;
  });


