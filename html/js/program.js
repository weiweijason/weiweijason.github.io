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
            rand=(rand%10);
            parseInt(rand);
            // rand=1;
            if(rand == 1){
                location.href='luckey_draw/01.html';
            }else if(rand == 2){
                location.href='luckey_draw/03.html';
            }else if(rand == 3){
                location.href='luckey_draw/05.html';
            }else if(rand == 4){
                location.href='luckey_draw/07.html';
            }else if(rand == 5){
                location.href='luckey_draw/09.html';
            }else if(rand == 6){
                location.href='luckey_draw/11.html';
            }else if(rand == 7){
                location.href='luckey_draw/13.html';
            }else if(rand == 8){
                location.href='luckey_draw/15.html';
            }else if(rand == 9){
                location.href='luckey_draw/17.html';
            }else{
                location.href='luckey_draw/19.html';
            }
            // $('.js-result').text('開獎結果：' + options[rand]);
        }, 2000);
    });
});
