;(function(){
	var foldfunc = {
		'html': CodeMirror.newFoldFunction(CodeMirror.tagRangeFinder),
		'javascript': CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder),
		'css': CodeMirror.newFoldFunction(CodeMirror.braceRangeFinder)
	};

	function enableVIM(e, $el) {
		e.setOption('keyMap','vim');	
		e.refresh();
		$el.addClass('vim-on');
	}
	function disableVIM(e, $el) {
		e.setOption('keyMap','default');	
		e.refresh();
		$el.removeClass('vim-on');
	}
	
	function nPanel() {
		var n=0;
		panels.allEditors(function(){ n++; });
		return n;
	}

	var link = { head: null, tail: null };

	panels.allEditors(function(panel){
		var editor = panel.editor;
		var eid = panel.id;
		var hl = editor.setLineClass(0, "activeline");

		editor.setOption("onCursorActivity", function() {
          editor.setLineClass(hl, null, null);
          hl = editor.setLineClass(editor.getCursor().line, null, "activeline");
          editor.matchHighlight("CodeMirror-matchhighlight");
		});
		editor.setOption("onGutterClick", foldfunc[eid]);

		/* vim key biding */
		var key = "keymap-state-" + eid, state=0;
		var $btn = $(".andrwj-keymap-change", panel.$el);

		function toggleState() {
			state ^= 1;
			if(state)
				enableVIM(editor, $btn);
			else
				disableVIM(editor, $btn);
			localStorage.setItem( key, state )
		}

		function focusSwitching() {
			var pnl = panel.__next__;
			while( !(pnl == panel || pnl.visible) ) pnl = pnl.__next__;
			pnl.editor.focus();
		}

		editor.setOption("extraKeys", {"Shift-Cmd-Enter": toggleState, "Alt-Tab": focusSwitching});

		if (null === localStorage.getItem( key )) localStorage.setItem( key, 0 );
		state = localStorage.getItem( key )

		$btn.click(function(e){
			state ^= 1;
			if(state)
				enableVIM(editor, $btn);
			else
				disableVIM(editor, $btn);
			localStorage.setItem( key, state )
		});

		state ^= 1;
		$btn.trigger('click');

		if(!link.head) link.head = panel;
		if(link.tail) {
			link.tail.__next__ = panel;
		}
		link.tail = panel;
		panel.__next__ = link.head;
	});
	delete link.head;
	delete link.tail;
})();
