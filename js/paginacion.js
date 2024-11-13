$(document).ready(function(){
    $('#tblpedido').pageMe({
      pagerSelector:'#myPager',
      activeColor: 'blue',
      prevText:'Anterior',
      nextText:'Siguiente',
      showPrevNext:true,
      hidePageNumbers:false,
      perPage:10
    });
  });