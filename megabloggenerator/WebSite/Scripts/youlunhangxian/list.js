/*
* @Author: jonas hsiao
* @Date:   2016-06-12 09:25:15
* @Last Modified by:   yuzhiqiang
* @Last Modified time: 2016-09-09 14:57:35
*/
'use strict';
var isUrlJump = false;
$(function () {
    if (!isUrlJump) {
        initPage();
        uzLazy(['line-list']);
        unitFilter();
        chooseSorter();
        scrollFloat();
        dispShip();
        dispList();
    }
});

//初始化表单，防刷新状态保存
function initPage() {
    $('#j_listSortBar').find('input').prop('checked', false);
}

//点击左侧大节点筛选
function slideBarFilter() {

    var nd = $('#j_sideSizer');

    //显示菜单
    nd.children('.list-item').on('mouseenter', function () {
        var o = $(this);
        var op = o.children('.item-cont');
        var ot = o.children('.sub-pop');
        var ov = $.trim(op.find('.item-bd').text());
        var oam = o.find('.arrow-mod');

        oam.find('.i-arrow').hide();
        if (ov) {
            oam.find('i[class^=i-close]').removeAttr('class').addClass('i-close-white').show();
        } else {
            oam.find('i[class^=i-close]').hide();
        }
        ot.show();
    }).on('mouseleave', function () {
        var o = $(this);
        var op = o.children('.item-cont');
        var ot = o.children('.sub-pop');
        var ov = $.trim(op.find('.item-bd').text());
        var oam = o.find('.arrow-mod');

        if (ov) {
            oam.find('.i-arrow').hide();
            oam.find('i[class^=i-close]').removeAttr('class').addClass('i-close-black').show();
        } else {
            oam.find('.i-arrow').show();
            oam.find('i[class^=i-close]').hide();
        }
        ot.hide();
    });

    // empty value
    nd.find('.arrow-mod').find('i[class^=i-close]').on('click', function () {
        isUrlJump = true;
        var o = $(this);
        var ot = o.parent('.arrow-mod').prev('.item-bd');
        if (ot.attr("data-v").lastIndexOf('data-brand') != -1) {
            $(".yl-intro-bar ").css("display", "none");
        }
        ot.text('');
        ot.removeAttr('data-v');
        o.hide();
        nd.children('.list-item').unbind('mouseenter').unbind('mouseleave');
        pageSelectionChange();
    });

    var it = nd.find('.sub-pop').find('.sizer-item');
    it.on('click', function () {
        isUrlJump = true;
        var o = $(this);
        if (o.hasClass('sizer-off')) {
            return;
        }
        var ov = o.attr('data-v');
        var op = o.parents('.sub-pop');
        var ot = op.siblings('.item-cont').find('.item-bd');
        //文字过长会无法显示
        if (o.html().length > 10) { ot.text(o.html().substring(o.html().length - 10, o.html().length)); } else { ot.text(o.html()); }
        ot.attr('data-v', o.attr('data-v'));
        op.hide();
        nd.children('.list-item').unbind('mouseenter').unbind('mouseleave');
        pageSelectionChange();
    });
}

function chooseSorter() {

    var jsb = $('#j_listSortBar');

    jsb.find('.menu-wrap').on('click', function () {
        var o = $(this);
        var os = o.siblings('.menu-wrap');
        var osm = o.find('.sub-menu');//子菜单

        if (osm.get(0)) {
            return;
        }
        //重置原始文字
        jsb.find('.menu-wrap[data-tag=price]').find('.menu-hd').find('em').text('价格');
        jsb.find('.menu-wrap[data-tag=date]').find('.menu-hd').find('em').text('出发日期');

        //重置list-item
        jsb.find('.list-item').removeClass('list-item-on');

        //重置所有desc asc
        jsb.find('.icon-item').removeClass('icon-asc').removeClass('icon-desc').addClass('icon-desc');

        os.removeClass('on');
        o.addClass('on');

        if ($('#j_sortList_loader').get(0)) {
            window.alert('请稍等');
        }
        pageSelectionChange();
    });

    //sub menu hover
    jsb.find('.menu-wrap').on('mouseenter', function () {
        var o = $(this);
        var sm = o.find('.sub-menu');
        sm.show();
        sm.get(0) && o.addClass('menu-wrap-on');
    }).on('mouseleave', function () {
        var o = $(this);
        o.removeClass('menu-wrap-on').find('.sub-menu').hide();
    });

    //choose sub menu item
    jsb.find('.sub-menu').find('.list-item').on('click', function () {

        var o = $(this);
        var omenu = o.parents('.sub-menu');//当前菜单

        var op = o.parents('.menu-wrap');
        var ops = op.siblings('.menu-wrap');
        var tag = op.attr('data-tag');

        omenu.hide();

        ops.removeClass('on');

        if (tag === 'price' || tag === 'date') {

            //重置list-item
            jsb.find('.list-item').removeClass('list-item-on');
            //重置所有icon-*
            jsb.find('.icon-item').removeClass('icon-asc').removeClass('icon-desc');


            var idx = o.index();
            var oi = op.find('.icon-item');
            oi.addClass('icon-' + (idx === 0 ? 'desc' : 'asc'));
            op.addClass('on');

            //重置非当前文字
            if (tag === 'price') {
                jsb.find('.menu-wrap[data-tag=date]').find('.menu-hd').find('em').text('出发日期');
            } else if (tag === 'date') {
                jsb.find('.menu-wrap[data-tag=price]').find('.menu-hd').find('em').text('价格');
            }

            //设置当前文字
            op.find('.menu-hd').find('em').text(o.text());
            o.addClass('list-item-on');
            //设置当前list-item-on

        } else if (tag === 'coupon') {
            var cks = omenu.find('input:checked');

            //设置文字
            var sb = [];
            cks.each(function (k, v) {
                var ock = $(this);
                sb.push($.trim(ock.parent().text()));
            });

            op.find('.sale-bar').find('s').text(sb.length ? sb.join('，') : '选择优惠');

        }

        if ($('#j_sortList_loader').get(0)) {
            //alert('请稍等');
        }
        pageSelectionChange();
    });
}

//获取tag参数列表
function getFilteredParams() {
    var rels = [];

    //左侧大节点筛选
    var zds = $('#j_sideSizer').find('span.item-bd[data-v]');
    zds.each(function (k, v) {
        var zd = $(this);
        if (zd.attr('data-v')) {
            rels.push(zd.attr('data-v'));
        }
    });

    //横向导航下拉筛选
    var cks = $('#j_listSortBar').find('input:checked');//选中的input check

    cks.each(function (k, v) {
        var ck = $(this);
        var ckp = ck.parents('.list-item');
        if (ckp.attr('data-v')) {
            rels.push(ckp.attr('data-v'));
        }
    });

    return rels.join(',');
}

function unitFilter() {
    var jss = $('#j_sideSizer');
    var jsb = $('#j_listSortBar');

    //过滤的参数
    var params = getFilteredParams();
    //排序的参数
    var itemon = jsb.children('.bar-main').children('.on');
    var itemonmenu = itemon.find('.sub-menu');
    var tag = itemon.attr('rel');
    var oi = 'asc';
    if (itemonmenu.get(0)) {
        //多重筛选
        if (itemon.find('.icon-desc').get(0)) {
            oi = 'desc';
        }
    }
    if (!isUrlJump) {
        initSorter(params, tag, oi);
    }
}

//原子筛选
function initSorter(tag, atag, akey) {
    var list = $('#j_sortList');
    if (atag == 'data-index' || atag == 'data-hot') {
        akey = 'desc';
    }
    console.log(tag, '~', atag, '~', akey);
    $('#j_sortList_null').remove();

    if (list.get(0)) {
        if (_util.check.isIE6) {
            return;
        }
        list.uzSorter({
            sortBy: tag || '',
            sortAscTag: atag || '',
            sortAscKey: akey || 'asc',
            targetNull: "<div class='box-fix'><div class='fruitless-box tc'><i class='icon-item mr10 vm icon-common-bulky png'></i><span class='fb-cont f16 tl vm'><p>未找到<em class='blue f18 b'>XXX</em>相关的邮轮产品，您可以尝试其他关键字搜索</p><p>您也可以在<b class='red f18'>9：00~21：00</b>拨打<b class='red f18'>1010-9898</b>联系客服，我们将竭诚为您服务。</p></span></div></div>",
            tragetAjaxText: "",
            onInit: function () {
                // listPager();
            },
            onCallback: function () {
                listPager();
            }
        });
    }
}

//分页
function listPager() {
    var pagers = $('.fn-pager');
    if (pagers.get(0)) {
        pagers.each(function () {
            var pager = $(this);
            var pageSize = parseInt(pager.attr('data-pagesize'), 10);
            var pageItems = parseInt(pager.attr('data-counts'), 10);
            var pageNum = pageItems % pageSize === 0 ? (pageItems / pageSize) : (Math.floor(pageItems / pageSize) + 1);

            pager.uzPager({
                pageSize: pageSize,
                pageItems: pageItems, //列表条数
                targetNode: pager.siblings('.pager-target-node'),
                onInit: function (allPage) {
                    //触发上下分页
                    var jp = $('#j_paging');
                    var jpl = jp.find('.btn-prev');
                    var jpr = jp.find('.btn-next');

                    jp.find('.paging-cont').html("<span class='paging-cont vm'><i class='red'>1</i>/" + allPage + "页</span>");

                    //上一页
                    jpl.on('click', function () {
                        var o = $(this);
                        if (o.hasClass('off')) {
                            return;
                        }
                        pager.find('.prev').trigger('click');
                    });

                    //下一页
                    jpr.on('click', function () {
                        var o = $(this);
                        if (o.hasClass('off')) {
                            return;
                        }
                        pager.find('.next').trigger('click');
                    });

                },
                onCallback: function (currentPage, allPage) {
                    //分页事件 ajax or dom handle
                    skipToPoint();
                    //触发上下分页状态
                    var jp = $('#j_paging');
                    var jpl = jp.find('.btn-prev');
                    var jpr = jp.find('.btn-next');

                    jp.find('.paging-cont').html("<span class='paging-cont vm'><i class='red'>" + currentPage + "</i>/" + allPage + "页</span>");

                    if (parseInt(currentPage, 10) === 1) {
                        jpl.addClass('off');
                        jpr.removeClass('off');
                    } else if (parseInt(currentPage, 10) === parseInt(allPage, 10)) {
                        jpr.addClass('off');
                        jpl.removeClass('off');
                    } else {
                        jpl.removeClass('off');
                        jpr.removeClass('off');
                    }

                }
            });



        });
    }
    resetFilterItems();
}

//跳转到顶部
function skipToPoint() {
    var oft = $('#j_youlunList');
    if (oft.get(0)) {
        $('body,html').animate({ scrollTop: oft.offset().top }, 800);
    }
}

//滚动浮动
function scrollFloat() {
    var w = $(window);
    var jsb = $('#j_sideBar');
    var sbOh = jsb.outerHeight(true);
    var jss = $('#j_sideSizer');

    w.on('scroll', function () {
        var st = w.scrollTop();
        var ot = jsb.offset().top;
        var iEnd = $('#j_sortList').siblings('.fn-pager').offset().top;

        if (st > ot && st < iEnd - sbOh) {
            jss.addClass('side-sizer-on').css({ 'position': 'fixed', 'top': 0 });
        } else if (st >= iEnd - sbOh) {
            jss.css({ 'position': 'absolute', 'top': iEnd - sbOh });
        } else {
            jss.removeClass('side-sizer-on').css({ 'position': 'static' });
        }
    });

    w.trigger('scroll');

}
function generateUrl() {
    //demo URL:http://localhost:18203/youlun/r-c-cc-cr-dd-x-00-0-00.html
    var url = window.location.href;
    var host = window.location.href.split('youlun/')[0];
    //params "data-route=日韩邮轮航线,data-port=上海,data-brand=歌诗达邮轮赛琳娜号,data-date=2016年8月,data-day=3-5天"
    var params = getFilteredParams();
    var paramarray = params.split(',');
    var resultUrl = "youlun/";
    //邮轮航线
    var route = "r";
    //出发城市
    var port = "c";
    //邮轮公司
    var company = "cc";
    //邮轮
    var ship = "cr";
    //出发日期
    var godate = "dd";
    //行程天数
    var day = "x";
    for (var para in paramarray) {
        if (paramarray[para].lastIndexOf('data-route') != -1) {
            var routeNo = paramarray[para].split('_')[1];
            route = "r" + routeNo;
        }
        if (paramarray[para].lastIndexOf('data-port') != -1) {
            var portNo = paramarray[para].split('_')[1];
            port = "c" + portNo;
        }
        if (paramarray[para].lastIndexOf('data-company') != -1) {
            var companyNo = paramarray[para].split('_')[1];
            company = "cc" + companyNo;
        }
        if (paramarray[para].lastIndexOf('data-brand') != -1) {
            var shipNo = paramarray[para].split('_')[1];
            company = "cc" + getCompanyCodeByShip(shipNo);
            ship = "cr" + shipNo;
        }
        if (paramarray[para].lastIndexOf('data-date') != -1) {
            var godateNo = paramarray[para].split('_')[1];
            godate = "dd" + godateNo;
        }
        if (paramarray[para].lastIndexOf('data-day') != -1) {
            var dayNo = paramarray[para].split('_')[1];
            if (dayNo == '3') { dayNo = "35"; }
            if (dayNo == '6') { dayNo = "68"; }
            if (dayNo == '9') { dayNo = "912"; }
            if (dayNo == '13') { dayNo = "1315"; }
            if (dayNo == '16') { dayNo = "1618"; }
            if (dayNo == '19') { dayNo = "19"; }
            day = "x" + dayNo;
        }
    }
    //价格升序
    //价格降序
    var priceasc = "00";
    //关注度
    var watchnum = "0";
    //出发日期升序
    //出发日期降序
    var godateasc = "00";
    //优惠标记
    var jsb = $('#j_listSortBar');
    var itemon = jsb.children('.bar-main').children('.on');
    var itemonmenu = itemon.find('.sub-menu');
    var tag = itemon.attr('rel');
    var oi = 'asc';
    if (itemonmenu.get(0)) {
        if (itemon.find('.icon-desc').get(0)) {
            oi = 'desc';
        }
    }
    var sortstr = tag + oi;
    if (sortstr == "data-pricedesc") {
        priceasc = "o0";
    } else if (sortstr == "data-priceasc") {
        priceasc = "o1";
    } else if (sortstr == "data-hotasc") {
        watchnum = "a";
    } else if (sortstr == "data-date-scaledesc") {
        godateasc = "o5";
    } else if (sortstr == "data-date-scaleasc") {
        godateasc = "d1";
    }
    resultUrl += (route + "-" + port + "-" + company + "-" + ship + "-" + godate + "-" + day + "-" + priceasc + "-" + watchnum + "-" + godateasc);
    return host + resultUrl + ".html";
}
function getCompanyCodeByShip(ship) {
    var companyData = $(".youlun-list #j_sideSizer .list-item-3 .sizer-items .si-item .sizer-item[data-v='data-brand=_" + ship + "']").parent().prev().find("span").attr("data-v");
    return companyData.split('_')[1];
}
function changeUrl(url) {
    window.location.href = url;
}

function pageSelectionChange() {
    changeUrl(generateUrl());
}
//根据当前所选条件，更改其他筛选器可用性，以保证列表始终能搜索到产品
function resetFilterItems() {
    //获取当前的选中条件
    var allSels = [];
    //获取所有查询条件
    $('#j_sideSizer .sizer-item').each(function (k, v) {
        if ($(this).attr('data-v')) { allSels.push($(this).attr('data-v')); }
    });
    //标识是否进行了分页和过滤
    var currListCount = $("#j_sortList .line-list .list-item").length;
    //遍历列表过滤项选出有效的项
    var enabledSels = [];
    $("#j_sortList .line-list .list-item").each(function () {
        var ship = $(this);
        for (var unsel in allSels) {
            var attrName = allSels[unsel].split('=')[0];
            var attrVal = allSels[unsel].split('=')[1];
            if (ship.attr(attrName) == attrVal) {
                if ($.inArray(allSels[unsel], enabledSels) == -1) {
                    enabledSels.push(allSels[unsel]);
                }
            }
        }
    });
    $(".nosizer-item").each(function () {
        if ($(this).parent().next().find(".sizer-item.sizer-off").length === 12) {
            $(this).css("display", "none");
        }
    });
    //设置未选中的其他项的可用性
    for (var se in allSels) {
        var IsExistEnable = false;
        for (var enabledSel in enabledSels) {
            if (allSels[se] == enabledSels[enabledSel]) {
                IsExistEnable = true;
            }
        }
        if (!IsExistEnable && currListCount !== 0) {
            $("#j_sideSizer  .sizer-item[data-v='" + allSels[se] + "']").css("display", "none");
        }
    }
    slideBarFilter();
}
function dispShip() {
    var name = $("#j_sideSizer .list-item-3 .item-bd.fr").text();
    $('.yl-intro-bar').css('display', 'none'); $('#intro-bar-' + name + '').css('display', 'block');
}
function dispList() {
    var selectionJSB = $('#j_listSortBar').children('.bar-main').children('.on');
    if (selectionJSB.attr("data-tag") == "price" || selectionJSB.attr("data-tag") == "date") {
        selectionJSB.find(".menu-hd .mr5.vm").text(selectionJSB.find(".list-item-on").text());
    }
    $("#j_listSortBar").css("display", "");
    $("#j_sortList").css("display", "");
}