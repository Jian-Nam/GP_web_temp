var colors = ['var(--colorB)', 'var(--colorC)']
var ranColor = colors[ Math.floor(Math.random() * colors.length) ];

// 다국어 타이포그래피
$(document).ready(function(e){
    $("main, footer").multilingual([
    "en", "num"
    ]);
});

$(document).ready(function(){
    // 배경 색상 랜덤
     $('body').css('background-color', ranColor);
    $('header').css('color', ranColor);
    $('main').css('color', ranColor);
})

