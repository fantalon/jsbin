(function(){
	libraries.clear();
	libraries.add({ 
			text:'Sandboxing', 
			requires:[
				'http://code.jquery.com/jquery-1.7.2.min.js',
				'http://twitter.github.com/bootstrap/assets/js/bootstrap.js',
				'http://jsbin.andrwj.com/js/vendor/codemirror2/codemirror.js',
				'http://sandbox.andrwj.com/Development/knockout.js/build/output/knockout-latest.debug.js'
			],
			style: [
				'http://twitter.github.com/bootstrap/assets/css/bootstrap-responsive.css',
				'http://twitter.github.com/bootstrap/assets/css/bootstrap.css',
				'http://sandbox.andrwj.com/Development/codemirror2/lib/codemirror.css',
				'http://sandbox.andrwj.com/Development/codemirror2/theme/neat.css'
			],
			scripts: [ 
				{ text: 'KLUGE', url: 'http://sandbox.andrwj.com/Development/sandbox/kluge.js'}
			] 
		});
	libraries.add({ 
			text:'CodeMirror2', 
			requires:[
				'http://code.jquery.com/jquery-1.7.2.min.js',
				'http://sandbox.andrwj.com/Development/knockout.js/build/output/knockout-latest.debug.js',
				'http://twitter.github.com/bootstrap/assets/js/bootstrap.js',
				'http://jsbin.andrwj.com/js/vendor/codemirror2/codemirror.js',
				'http://jsbin.andrwj.com/js/vendor/codemirror2/xml.js',
				'http://jsbin.andrwj.com/js/vendor/codemirror2/css.js',
				'http://jsbin.andrwj.com/js/vendor/codemirror2/javascript.js',
				'http://jsbin.andrwj.com/js/vendor/codemirror2/htmlmixed.js'
			],
			style: [
				'http://twitter.github.com/bootstrap/assets/css/bootstrap.css',
				'http://twitter.github.com/bootstrap/assets/css/bootstrap-responsive.css',
				'http://sandbox.andrwj.com/Development/codemirror2/lib/codemirror.css',
				'http://sandbox.andrwj.com/Development/codemirror2/theme/neat.css',
				'http://jsbin.andrwj.com/css/andrwj.css'
			],
			scripts: [ 
				{ text: 'CodeMirror Stuffs', url: 'http://sandbox.andrwj.com/Development/sandbox/kluge.js'}
			] 
		});
})();
