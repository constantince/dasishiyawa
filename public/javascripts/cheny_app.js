var IP = '172.16.0.189';
// var IP = '192.168.1.102';
// var IP = '192.168.31.101';
require.config({
	baseUrl: 'javascripts',
	urlArgs:'version=1230',
	paths: {
		base: 'base/base',
		config: 'base/Config'
	}
});
/*
var HASH = (function(root){
	var hash = root.location.hash.replace(/^#\/?/gi, '');
	if(hash.indexOf('?')> -1 ) {
		hash = hash.split('?')[0];
	}
	var cig = {
		//注意采用小写原则匹配
		A: ['a'],
	}
	if(hash.indexOf('/')) {
		hash = hash.split('/')[0].toLocaleLowerCase();
	}
	for(var i in cig) {
		if(cig[i].indexOf(hash) >-1 ) hash = i;
	} 
	return hash != '' ? hash: 'A';
})(window, undefined)
*/


//require(function(base, page) {
(function(root){
	require(['config'], function(C){
		// console.log(C)
		var hash = root.location.hash.replace(/^#\/?/gi, '');
		if(hash.indexOf('?')> -1 ) {
			hash = hash.split('?')[0];
		}
		var config = C.PAGERULES;
		if(hash.indexOf('/')) {
			hash = hash.split('/')[0].toLocaleLowerCase();
		}
		for(var i in config) {
			if(config[i].indexOf(hash) >-1 ) hash = i;
		} 
		hash != '' ? hash: 'A';

		require(['use/'+hash], function(){
			Backbone.history.start();
		});
	});
})(window);