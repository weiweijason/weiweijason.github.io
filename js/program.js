$(document).ready(function () {
    $('.js-img-shake').hide();

    $('.js-start').on('click', function () {
        // var options = $('.js-textarea').val().split('\n');
        // var rand = Math.floor(Math.random() * options.length);
        var rand = Math.floor(Math.random()*5)

        $('.js-img-shake').show();
        $('.js-img-ok').hide();
        $('.js-result').text('等待開將結果...');
        // if(rand>0){
        //     document.write("qqq");
        // }
        setTimeout(function () {
            $('.js-img-shake').hide();
            $('.js-img-ok').show();
            // if(rand>0){
            //     document.write('qqq' + rand);
            //     // $('.js-result').text('qqq');
            // }
            // location.href='01.html'
            rand=(rand%5);
            parseInt(rand);
            if(rand == 1){
                location.href='01.html';
            }else if(rand == 2){
                location.href='02.html';
            }else if(rand == 3){
                location.href='03.html';
            }else if(rand == 4){
                location.href='04.html';
            }else if(rand == 5){
                location.href='05.html';
            }else{
                location.href='06.html';
            }
            // $('.js-result').text('開獎結果：' + options[rand]);
        }, 1500);
    });
});
