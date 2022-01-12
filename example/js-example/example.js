(function() {
    'use strict';
            
    window.addEventListener('load', init, false);
            
	function init() {
        // Verknüpfung einer Funltionen mit dem ersten p-Element
        let p = document.getElementsByTagName('p')[0];
        p.addEventListener('click', 
            function() { 
                console.log('click');
            }
        );

        // JavaScript
        let g = document.getElementsByClassName('goodbye'); 
        for(let i = 0; i < g.length; i++) {
            g[i].classList.add('selected');
        }
   
        // jQuery
        $('.goodbye-jq').addClass('selected-jq');
    }       
})();