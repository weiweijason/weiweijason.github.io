$(document).ready(function () {
    $('.js-img-shake').hide();

    $('.js-start').on('click', function () {
        // var options = $('.js-textarea').val().split('\n');
        // var rand = Math.floor(Math.random() * options.length);
        var rand = Math.floor(Math.random()*5)

        $('.js-img-shake').show();
        $('.js-img-ok').hide();
        $('.js-result').text('等待結果...');
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
            rand=(rand%8);
            parseInt(rand);
            // rand=1;
            if(rand == 1){
                location.href='../taipeizoo_draw/monkey.html';
            }else if(rand == 2){
                location.href='../taipeizoo_draw/bat.html';
            }else if(rand == 3){
                location.href='../taipeizoo_draw/bear.html';
            }else if(rand == 4){
                location.href='../taipeizoo_draw/eagle.html';
            }else if(rand == 5){
                location.href='../taipeizoo_draw/goria.html';
            }else if(rand == 6){
                location.href='../taipeizoo_draw/ma.html';
            }else if(rand == 7){
                location.href='../taipeizoo_draw/snake.html';
            }else{
                location.href='../taipeizoo_draw/spider.html';
            }
            // $('.js-result').text('開獎結果：' + options[rand]);
        }, 2000);
    });
});
