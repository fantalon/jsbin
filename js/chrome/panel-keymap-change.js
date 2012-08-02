/*
 * 패널 키맵 변경 기능 추가
 * 2012-05011 (Fri)
 * @author: AJ <andrwj@gmail.com>
 */
(function(){
	var panel = ["javascript", "html"];
	var focuseq = {"javascript":0, "html":1};
	var ready = {"javascript":false, "html":false};

	function enable(e, $el) {
		e.setOption('keyMap','vim');	
		e.refresh();
		$el.addClass('vim-on');
	}	
	function disable(e, $el) {
		e.setOption('keyMap','default');	
		e.refresh();
		$el.removeClass('vim-on');
	}	

	var $panelsvisible = $('#panelsvisible input');

	function togglePanelShow(which) {
		var $chk = $panelsvisible.filter("[data-panel='"+which+"']");
		$chk.trigger('click');
		/*TODO Live 패널이 뜨면 JS와 HTML 패널의 폭이 틀려지는 점 수정 */
	}
	function toggleShowJS(){ togglePanelShow('javascript'); }
	function toggleShowHTML(){ togglePanelShow('html'); }
	function toggleShowLive(){ togglePanelShow('live'); }

	panel.forEach( function(pnl){
		var key = "keymap-state-" + pnl, state=0;
		var $btn = $('.code.' + pnl + ' > .label > p > .andrwj-keymap-change');
		var editor = editors[pnl];

		function toggleState() {
			state ^= 1;
			if(state)
				enable(editor, $btn);
			else
				disable(editor, $btn);
			localStorage.setItem( key, state )
		}

		function switchFocus() {
			var focusOn = focuseq[pnl];
			editors[ panel[(focusOn ^ 1)] ].focus();
		}

		editor.setOption("extraKeys", {"Shift-Cmd-Enter": toggleState, "Alt-Tab": switchFocus, "Shift-Cmd-L":toggleShowLive});

		if (null === localStorage.getItem( key )) localStorage.setItem( key, 0 );
		state = localStorage.getItem( key )
		
		$btn.click(function(e){
			state ^= 1;
			if(state)
				enable(editor, $btn);
			else
				disable(editor, $btn);
			localStorage.setItem( key, state )
		});

		state ^= 1;
		$btn.trigger('click');
		ready[pnl] = true;
	});



})();
