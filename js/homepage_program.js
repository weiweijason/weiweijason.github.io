$(document).ready(function () {
    // $('.js-img-shake').hide();

    $('.js-start').on('click', function () {
        // var options = $('.js-textarea').val().split('\n');
        // var rand = Math.floor(Math.random() * options.length);
        // var rand = Math.floor(Math.random()*5)

        // $('.js-img-shake').show();
        // $('.js-img-ok').hide();
        // $('.js-result').text('等待結果...');
        // if(rand>0){
        //     document.write("qqq");
        // }
        setTimeout(function () {
            location.href='html/luckeydraw_index.html';
            
            // $('.js-result').text('開獎結果：' + options[rand]);
        }, 10);
    });
    $('.js-start2').on('click', function () {
        // var options = $('.js-textarea').val().split('\n');
        // var rand = Math.floor(Math.random() * options.length);
        // var rand = Math.floor(Math.random()*5)

        // $('.js-img-shake').show();
        // $('.js-img-ok').hide();
        // $('.js-result').text('等待結果...');
        // if(rand>0){
        //     document.write("qqq");
        // }        setTimeout(function () {
            location.href='html/taipeizoo_index.html';
            
            // $('.js-result').text('開獎結果：' + options[rand]);
        }, 10);
    });
    
    $('.js-start3').on('click', function () {
        setTimeout(function () {
            location.href='firebase_hosting_page/index.html';
        }, 10);
    });
    
    $('.js-start4').on('click', function () {
        setTimeout(function () {
            location.href='presentation.html';
        }, 10);
    });
});
