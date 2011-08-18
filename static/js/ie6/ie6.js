$(document).ready(function(){

    // FORMS
    $("input[type='button']").addClass('button');
    $("input[type='checkbox']").addClass('checkbox');
    $("input[type='file']").addClass('file');
    $("input[type='image']").addClass('image');
    $("input[type='password']").addClass('password');
    $("input[type='radio']").addClass('radio');
    $("input[type='submit']").addClass('submit');
    $("input[type='text']").addClass('text');

});

// BELATED PNG IMAGE FIXING
DD_belatedPNG.fix(
    '.selector, ' +
    '.final_selector'
);
