function appendHTML(html) {
}
$(function() {
    var html = opener['printTourData'];
    $('body').append(html);
    
    window.print();
})
