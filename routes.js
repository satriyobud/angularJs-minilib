/*
 * @author      Darry
 * @contributor Satriyobud
 * @contributor Freydika GP
 * 
 *
 * no-copyright needed
 *
 * @version beta version
 *
 * @license LGPL
 * @license http://opensource.org/licenses/LGPL-3.0 Lesser GNU Public License
 *
 
 *
 * 
 */
function detectmobile() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

function makeRange(highBound) {
  var result = [];
  for (var i=0;i<highBound;i++) result.push(i);
  return result;
}

function select2() {
  $('.select2').select2({ 
    
    placeholder : ' - Pilih - ',allowClear: true });
}
function datatable(){
  $('.datatable').DataTable();
}



function tanggal(t) {
  $(t).flatpickr();
}
function addComma(input) {
  var output = input
  if (parseFloat(input)) {
    input = new String(input);
    var parts = input.split(".");
    parts[0] = parts[0].split("").reverse().join("").replace(/(\d{3})(?!$)/g, "$1,").split("").reverse().join("");
    output = parts.join(".");
  }
  return output;
}
quisioner.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
quisioner.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeBar = true;
}])

.config(function($routeProvider, $controllerProvider, $locationProvider, $filterProvider) {

  $locationProvider.hashPrefix('');
  
  $routeProvider
  .when('/', {
        templateUrl : 'pages/home/index.html',
        resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('app/home.js');
      }]
      }
      })
  .when('/:controller', {
    templateUrl : function($routeParams) {

      return 'pages/'+$routeParams.controller+'.html';
    },
    resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('app/'+$route.current.params.controller+'.js');
      }]
    },
    controller : function($routeParams) {
      return $routeParams.controller;
    }
  })
  .when('/:controller/:function', {
    templateUrl : function($routeParams) {
      return 'pages/'+$routeParams.controller+'/'+$routeParams.function+'.html';
    },
    resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('app/'+$route.current.params.controller+'.js');
      }]
    }
  })
  .when('/:controller/:function/:id', {
    templateUrl : function($routeParams) {
      return 'pages/'+$routeParams.controller+'/'+$routeParams.function+'.html';
    },
    resolve: {
      loadMyCtrl: ['$route','$ocLazyLoad', function($route,$ocLazyLoad) {
        return $ocLazyLoad.load('app/'+$route.current.params.controller+'.js');
      }]
    }
  })

  .otherwise({redirectTo:'/index.html'})

})

.run(function($rootScope, $templateCache) {
   $rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
   $rootScope.$on('$stateChangeSuccess', function() {
   document.body.scrollTop = document.documentElement.scrollTop = 0;
})
})

.run(['$rootScope', '$route', '$timeout', function($rootScope, $route, $timeout) {
    $rootScope.$on('$routeChangeSuccess', function() {
      if (typeof(current) !== 'undefined'){
        $templateCache.remove(current.templateUrl);
      }
      if (typeof(next) !== 'undefined'){
        $templateCache.remove(next.templateUrl);
      }
      document.title = $rootScope.title;
      $rootScope.notice = {};
      $rootScope.search = {};
      $rootScope.sort   = {};
      $rootScope.input  = {};
      $rootScope.notice.success = "";
      $rootScope.notice.error  = "";
      $rootScope.delay  = {debounce: 700};
      setTimeout(function () {
        $('th.center').find('select.select2').before('<br />');
      },1000);
  });
}])

.service('minilib', function ($http,$resource,$rootScope,$location) {
  this.get = function (u,d,r,c) {
    $http({
      method  : 'GET',
      url     : base_url+u,
      params  : d
    })
    .then(function (res) {
      r(res.data);
    })
    .catch(function (res) {
      r(res);
    })

  }
  this.post = function (u,d,r,c) {
    $http({
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      transformRequest : function(data){
        return $.param(data);
      },
      method  : 'POST',
      url     : base_url+u,
      data    : d
    })
    .then(function (res) {
      r(res.data);
    },function(err) {
       console.log(err.data);
    }).catch(function (res) {
      r(res.data);
    })

  }
  this.confirm = function (t,y,n) {
    $.confirm({
      icon: 'fa fa-warning',
			title: 'HAPUS DATA',
			content: 'Anda Yakin Akan Menghapus Data '+t+' ?',
			animation: 'rotateXR',
      buttons: {
        batal: {
          text: 'Batal',
          btnClass: 'btn-default',
          keys: ['enter', 'shift'],
          action: n
        },
        ok: {
          text: 'OK',
          btnClass: 'btn-success',
          keys: ['enter', 'shift'],
          action: y
        }
      }
    })
  }
  this.menu = function(){
    var url = document.URL.split("#/");
    // var menu_link = url[5]+'/'+url[6];
    // console.log();
    return url[1];
  }
  this.custom_confirm = function (h,t,y,n) {
    $.confirm({
      icon: 'fa fa-warning',
			title: h,
			content: t,
      buttons: {
        batal: {
          text: 'Batal',
          btnClass: 'btn-default',
          keys: ['enter', 'shift'],
          action: function () {
            $rootScope.$apply(n);
          }
        },
        ok: {
          text: 'OK',
          btnClass: 'btn-success',
          keys: ['enter', 'shift'],
          action: function () {
            $rootScope.$apply(y);
          }
        }
      }
    })
  }
 this.autocomplete = function(u,d,t,r,mr=function(a){ return a; }) {
    var self = $(this);
    var trg = 1;
    var key = '';
    if (detectmobile()) {
      $(document).on('textInput', 'input[ng-model="'+t+'"]', function (e) {
        var keyCode = e.originalEvent.data.charCodeAt(0);
        if (trg == 1) {
          trg += 1;
        d['key'] = '';
        d['key'] = $('input[ng-model="'+t+'"]').val();
        if ((keyCode == 13 || keyCode == 32 || keyCode == 9) && key != d['key']) {
          $('input[ng-model="'+t+'"]').parent().find('.au').remove();
          $('input[ng-model="'+t+'"]').after('<div class="au"></div>');
          key = d['key'];
          self.autocomplete({
            source : function (request, response) {
                $.ajax({
                  type    : 'GET',
                  url     : base_url+u,
                  data    : d,
                  cache   : false
                })
                .then(function (res) {
                  res = JSON.parse(res);
                  res = mr(res);
                  if (res.length == 0) {
                    var a = {};
                    a['id'] = "";
                    a['value'] = "Data tidak ditemukan.";
                    res.push(a);
                  }
                  $('input[ng-model="'+t+'"]').next().remove();
                  response(res);
                })
            },
            select: function (e, re) {
              $rootScope.$apply(r(re.item));
              e.keyCode = '';
            }
          })
          if ((keyCode == 13 || keyCode == 32 || keyCode == 9) && self.autocomplete('close')) {
            self.trigger('input');
          }
        } else {
          if (self.autocomplete().length >= 1) {
            self.autocomplete('destroy');
          }
        }
      }
      })
    } else {
      $(document).on('keydown', 'input[ng-model="'+t+'"]', function (e) {
        if (trg == 1) {
          trg += 1;
        d['key'] = '';
        d['key'] = $('input[ng-model="'+t+'"]').val();
        var self = $(this);
        if ((e.keyCode == 13 || e.keyCode == 32) && key != d['key']) {
          $('input[ng-model="'+t+'"]').parent().find('.au').remove();
          $('input[ng-model="'+t+'"]').after('<div class="au"></div>');
          key = d['key'];
          self.autocomplete({
            source : function (request, response) {
                $.ajax({
                  type    : 'GET',
                  url     : base_url+u,
                  data    : d,
                  cache   : false
                })
                .then(function (res) {
                  res = JSON.parse(res);
                  res = mr(res);
                  if (res.length == 0) {
                    var a = {};
                    a['id'] = "";
                    a['value'] = "Data tidak ditemukan.";
                    res.push(a);
                  }
                  $('input[ng-model="'+t+'"]').next().remove();
                  response(res);
                })
            },
            select: function (e, re) {
              $rootScope.$apply(r(re.item));
              e.keyCode = '';
            }
          })
          if ((e.keyCode == 13 || e.keyCode == 32) && self.autocomplete('close')) {
            self.trigger('input');
          }
        } else {
          if (self.autocomplete().length >= 1) {
            self.autocomplete('destroy');
          }
        }
      }
    })
    }
  }
  this.upload = function (u,f,r) {
    $(f).on('submit', function(){
      var formData = new FormData(this);
      $.ajax({
        type:'POST',
        url: base_url+u,
        data:formData,
        cache:false,
        contentType: false,
        processData: false,
        success:function(res){
          res = JSON.parse(res);
          r(res);
        }
      });
    });
  }
  this.rot13 = function (key){
  var result = "";
  for (var i = 0, len = key.length; i < len; i++) {
    result += rot13(key[i]);
  }
  return result;
  }
  this.get_object = function (arr, key, val) {
    var zzz = arr.findIndex(function (s){
        return s[key] == val;
    });
    return arr[zzz];
  }
  this.get_index = function (arr, key, val) {
    var obj = arr.findIndex(function (s){
        return s[key] == val;
    });
    var o = angular.toJson(obj);
    return JSON.parse(o);
  }
  this.clear_hashkey = function (obj) {
    var o = angular.toJson(obj);
    return JSON.parse(o);
  }
  this.alert_label = function (is, mdl, txt="") {
    if (is) {
      $('input[ng-model="'+mdl+'"]').parent().prepend('<b class="float-right noticer" style="color:red">'+txt+'</b>');
    } else {
      $('input[ng-model="'+mdl+'"]').parent().find('b.noticer').slideUp()
    }
  }
  this.custom_alert = function (h,t) {
    $.alert({
      title: h,
      content: t,
			confirmButton: 'OK'
    })
  }
  this.check_edit = function (urlcheck,id,e,urltujuan="",resp) {
    e.preventDefault();
      this.get(urlcheck,{'id':id}, function (res) {
        if (res.edited == 1) {
          $.alert({
            title: "PERINGATAN!",
            content: res.msg,
      			confirmButton: 'OK'
          })
          return false;
        }else {
          if(urltujuan!=""){
            $location.path(urltujuan);
          }
          else {
            resp(1);
          }
        }
      });
  }
})

.directive('ngFile', ['$parse', function ($parse) {
 return {
  require: '?ngModel',
  link: function(scope, elem, attrs, ctrl) {
   elem.bind('change', function(){

    $parse(attrs.ngFile).assign(scope,elem[0].files)
    scope.$apply();
   });
  }
 };
}])

.directive('ngFilter', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      ctrl.$options.$$options.updateOn = 'input';
      if (!ctrl) return;
      ctrl.$formatters.unshift(function (a) {
        return $filter(attrs.ngFilter)(ctrl.$modelValue)
      });
      elem.bind('input', function(event) {
        elem.val($filter(attrs.ngFilter)(elem.val()));
      });
    }
  };
}])




.directive('ngTgl', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var today = new Date();
      var frTgl = attrs.ngTgl == "" ? 'dd M yy' : attrs.ngTgl ;
      elem.datepicker({
        dateFormat  : frTgl,
        changeMonth : true,
        changeYear  : true,
        yearRange   :"1960:"+ (parseFloat(today.getFullYear())+100),
      });
    }
  };
}])

.directive('ngTglNoback', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var today = new Date();
      var frTgl = attrs.ngTglNoback == "" ? 'dd M yy' : attrs.ngTglNoback ;
      elem.datepicker({
        dateFormat  : frTgl,
        changeMonth : true,
        changeYear  : true,
        yearRange   : today.getFullYear()+":2060",
        minDate     : new Date()
      });
    }
  };
}])

.directive('ngTglNonext', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var today = new Date();
      var frTgl = attrs.ngTglNonext == "" ? 'dd M yy' : attrs.ngTglNonext ;
      elem.datepicker({
        dateFormat  : frTgl,
        changeMonth : true,
        changeYear  : true,
        yearRange   : "1960:"+today.getFullYear(),
        maxDate     : new Date()
      })
    }
  };
}])

.directive('ngPersen', ['$filter', function ($filter) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, elem, attr, ctrl) {
      elem.on('input change', function (e) {
        elem.val(elem.val().replace(/[^0-9\%\+\s]/g,''));
      });
    }
  }
}])

.directive('ngAngka', ['$filter', function ($filter) {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, elem, attr, ctrl) {
      //ctrl.$options.$$options.updateOn = 'input';
      setTimeout(function(){
        if (parseFloat(elem.val()) < 1 || isNaN(parseFloat(elem.val()))) {
          elem.val(0).trigger('input');
        } else {
          elem.trigger('input');
        }
      },200)
      elem.on('input change', function (e) {
          var dec = attr.ngAngka == "" ? 0 : parseInt(attr.ngAngka) ;
          var val = elem.val().replace(/[^\d.-]/g,'');
          val = val.toString().match(/[.]/g) != null && val.toString().match(/[.]/g).length > 1 ? val.substring(0,val.length-1) : val ;
          val = /[.]/g.test(val) ? val : parseFloat(val) ;
          val = isNaN(val) ? 0 : val.toString() ;
          val = ((val != '0.0' && val.substr(val.length-1,1) != '.') && val.substr(val.length-2) != '.0') ? addComma(Math.round(val*Math.pow(10,dec))/Math.pow(10,dec)) : addComma(val) ;
          elem.val(val);
          ctrl.$parsers.push(function (val) { /* model */
            return (val == '' || val == null) ? 0 : parseFloat(val.toString().replace(/[^\d.]/g,''));
          });
          ctrl.$formatters.push(function (val) { /* view */
            return (val == '' || val == null) ? 0 : addComma(val.toString().replace(/[^\d.]/g,''));
          });
      })
    }
  }
}])

.directive('ngAngkaMin', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attr, ctrl) {
      setTimeout(function(){
        if (parseFloat(elem.val()) < 1 || isNaN(parseFloat(elem.val()))) {
          elem.val(0).trigger('input');
        } else {
          elem.trigger('input');
        }
      },200)
      elem.on('input', function (e) {
        var dec = attr.ngAngkaMin == "" ? 0 : parseInt(attr.ngAngkaMin) ;
        var val = elem.val().replace(/[^\d.-]/g,'');
        val = val.toString().match(/[-]/g) != null && val.toString().match(/[-]/g).length > 1 ? val.toString().replace(/[-]/g,'') : val ;
        val = /[-]/g.test(val) && val.substr(val.length-1) != '.' ? (0 - parseFloat(val.replace(/[-]/g,''))) : val ;
        val = val.toString().match(/[.]/g) != null && val.toString().match(/[.]/g).length > 1 ? val.substring(0,val.length-1) : val ;
        val = /[.]/g.test(val) ? val : parseFloat(val) ;
        val = isNaN(val) ? 0 : val ;
        val = /[-]/g.test(val) ? '-'+(addComma(val.toString().replace(/[-]/g,''))) : addComma(val) ;
        val = val != '0' && val.substr(val.length-1,1) != '.' ? addComma(Math.round(parseFloat(val.replace(/,/g,''))*Math.pow(10,dec))/Math.pow(10,dec)) : val ;
        val = val.toString().substr(0,2) == '-,'  ? '-'+val.substring(2,val.length) : val ;
        elem.val(val);
        ctrl.$parsers.push(function (val) { /* model */
          return val == '' ? 0 : parseFloat(val.toString().replace(/[^\d.-]/g,''));
        });
        ctrl.$formatters.push(function (val) { /* view */
          return addComma(val.toString().replace(/[^\d.-]/g,''));
        });
      })
    }
  }
}])

// .directive('ngTelp', function () {
//   return function (scope, elem, attrs) {
//     elem.bind("input", function () {
//       var v = this.value;
//       var sv = /[^0-9+-]/.test(this.value) ? v.replace(/[^0-9+-]/g,'') : v ;
//       this.value = sv;
//     });
//   };
// })

.directive('ngTelp', function () {
  return function (scope, elem, attrs) {
    elem.bind("input", function () {
      var v = this.value;
      var sv = /[^0-9]/.test(this.value) ? v.replace(/[^0-9]/g,'') : v ;
      this.value = sv;
    });
  };
})

.directive('ngMin', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      ctrl.$options.$$options.updateOn = 'blur';
      elem.on('blur', function () {
        var min = parseFloat(attrs.ngMin);
        var val = parseFloat(elem.val().replace(/[^\d.-]/g,'')) < min || elem.val() == "" ? min : elem.val().replace(/[^\d.-]/g,'') ;
        elem.val(val).trigger('change');
      })
    }
  };
}])

.directive('ngMax', ['$filter', function ($filter) {
  return {
    require: '?ngModel',
    link: function (scope, elem, attrs, ctrl) {
      elem.on('input', function () {
        var max = parseFloat(attrs.ngMax);
        var val = parseFloat(elem.val().replace(/[^\d.-]/g,'')) > max ? max : elem.val().replace(/[^\d.-]/g,'') ;
        elem.val(val).trigger('change');
      })
    }
  };
}])

.directive('ngEnter', function () {
  return function (scope, elem, attrs) {
    elem.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
})

/*.filter('ucfirst', function() {
  return function(input) {
    return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
})*/
.filter('ceil', function() {
  return function(input) {
    return Math.ceil(input);
  };
});



function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        var size=Math.round(input.files[0].size/1024);
        reader.onload = function (e) {
            $('#img_logo').attr('src', e.target.result);
            $('#img_size').html(size+" KB");
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(function () {

  $(document).on('click', '.sel', function () {
    $(this).select();
  })

  $(document).on('focus click', '.jam', function () {
      $(this).clockpicker({
      placement: 'bottom',
      align: 'left',
      autoclose: true,
      'default': 'now'
    });
  })

  $(document).on('click', 'input[ng-angka], input[ng-decimal]', function () {
    $(this).select();
  })

  $(document).on('load', 'input[ng-format="number"]', function () {
    $(this).val(0).trigger('input');
  })

  $(document).on('click','#btn_csv', function () {
    var url_export = $(this).attr('link-template');
    $.confirm({
      icon: 'fa fa-warning',
      title: 'PERTANYAAN',
      content: 'Apakah Anda Ingin Mengimport File CSV atau Mengexport Template CSV ?',
      animation: 'rotateXR',
      buttons: {
        batal: {
          text: 'Batal',
          btnClass: 'btn-default',
          keys: ['enter','shift'],
          action: function(){
            return true;
          }
        },
        exportTemplateCsv: {
          text: 'Export Template CSV',
          btnClass: 'btn-primary',
          keys: ['enter','shift'],
          action: function(){
            document.location.href=url_export;
          }
        },
        importCsv: {
          text: 'Import CSV',
          btnClass: 'btn-warning',
          keys: ['enter','shift'],
          action: function(){
            $('#input_csv').trigger('click');
          }
        }
      }
    })
  })
  
  $(document).on('click','#btn_csv_init', function () {
    var url_export = $(this).attr('link-template');
    $.confirm({
      icon: 'fa fa-warning',
      title: 'PERTANYAAN',
      content: 'Apakah Anda Ingin Mengimport File CSV atau Mengexport Template CSV ?',
      animation: 'rotateXR',
      buttons: {
        batal: {
          text: 'Batal',
          btnClass: 'btn-default',
          keys: ['enter','shift'],
          action: function(){
            return true;
          }
        },
        exportTemplateCsv: {
          text: 'Export Template CSV',
          btnClass: 'btn-primary',
          keys: ['enter','shift'],
          action: function(){
            document.location.href = url_export;
          }
        },
        importCsv: {
          text: 'Import CSV',
          btnClass: 'btn-warning',
          keys: ['enter','shift'],
          action: function(){
            $('#input_csv').trigger('click');
          }
        }
      }
    })
  })

  $(document).on('keydown', function(e) {
      if(e.ctrlKey && (e.key == "p" || e.charCode == 16 || e.charCode == 112 || e.keyCode == 80) ){
          //alert("Silahkan Gunakan Tombol Print untuk Mencetak");
          e.cancelBubble = true;
          e.preventDefault();

          e.stopImmediatePropagation();
      }
  });
  /*$(document).on('blur','.form-control', function () {
     this.value = this.value.toUpperCase();
  })*/
})


/*end of routes.js*/
