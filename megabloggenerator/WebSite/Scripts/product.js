
winLoadFix(productUB);//用户U币数量

$(function () {
    askPop();
    productTab();

    productFocus(); //图片滑动

    uzLazy(['j_routeDetail', 'image-list', 'j_viewedList', 'j_detailPicTxt', 'product-feature', 'j_routeBeauty', 'j_comboPicTab']);

    productLatest(); //最近预定
    productComment(); //点评
    // productComment(); // 点评 --新版点评备份勿删
    // commentGallery(); // 点评详图 --新版点评备份勿删

    productLoadTJ(); //来源统计代码

    productInterest(1); //猜你喜欢收集浏览数据
    productShouCang(); //产品收藏
    latestOrderScroll(); //最新订单
    startDate();
    productSlides();

    tmNumControl();
    smCalendar(); //智能日历
    countdown(); //倒计时

    contentSwitch();
    clickJump();
    selectList('j_orderbox');

    //酒店套餐
    hotelComboOrder();
    imgPreview($('#j_comboPicTab'), 'data-original');

    _productNav.initCall();
    _routeTab.initCall();
    _zyxSideOrder.initCall();
    scrollEvent();

    gHoverEvent($('#j_carouselBar').parent());

    productTips(); //power tips
    activityBX(); //宝箱活动
    routeDetailFix();
    shopVisit();
});

function imgLazyload(obj) {
    var img = obj.find('img[data-original]');
    if (img.length) {
        img.each(function () {
            var oThis = $(this);
            var sSrc = oThis.attr('data-original');
            if (sSrc != oThis.attr('src')) {
                oThis.attr('src', sSrc);
            }
        });
    }
}

function refreshUserBX() {

    _uzw.user.refresh();

    var uid = _uzw.user.userid;
    var pid = $('#pid').val();
    var _popMod = function(node, xAxis) {
        var obj = $('#' + node);
        xAxis = xAxis || $(window).height() / 2;
        obj = (!obj.get(0)) ? $('.' + node) : obj;

        _uzw.ui.mask.show();
        obj.show();
        obj.on('click', '.j_popClose', function () {
            var oThis = $(this);
            var op = oThis.parents('.bx-pop');

            !op.get(0) && (op = oThis.parents('.ui-pop'));

            op.hide();
            _uzw.ui.mask.hide();
        });

        //IE6下的定位
        if (_util.check.isIE6) {
            obj.css('top', $(document).scrollTop() + xAxis);
            $(window).on('scroll', function () {
                obj.css('top', $(document).scrollTop() + xAxis);
            });
        }
    };

    $.ajax({
        type: 'GET',
        url: '//wapi.uzai.com/api/uzaibox/GetKey',
        dataType: 'jsonp',
        data: { 'userId': uid, 'productId': pid },
        success: function (d) {
            $('#j_fixedKey').remove();
            if (d == -1) {
                _popMod('j_popKeyB');
            } else if (d == 1) {
                _popMod('j_popKeyA');
            } else {
                _popMod('j_popTipsFailure');
            }
        }
    });
}

//检测服务器CDN
function checkServerCDN(evt) {
    try {
        //测试CDN
        if (evt) {
            evt();
        }

    } catch (e) {
        //js cdn拼接出问题。
        var ck = _uzw.cookie.get('uzwCDNErr');
        if (ck) {
            return;
        } else {
            try {
                //var df = _uzw.apis.sendEmail("CDN JS文件拼接错误");
                //df.done(function (data) {
                //    _uzw.cookie.set('uzwCDNErr', 1, 1);
                //});
            }
            catch (ee) {
                //console.log('send email error!');
            }
        }
    } finally {

    }
}

function scrollEvent() {
    $(window).scroll(function () {
        _productNav.unitScroll();
        _routeTab.unitScroll();
        _zyxSideOrder.unitScroll();
    });
}

var _productNav = {
    box: {},
    bar: {},
    side: {},
    mods: {},
    barH: 0,
    initCall: function() {
        _productNav.init();
        _productNav.navDispose();
        _productNav.unitScroll();
    },
    init: function() {
        _productNav.box = $('#j_products');
        _productNav.bar = _productNav.box.find('.product-nav-fixed');
        _productNav.side = _productNav.bar.find('.product-nav-side');
        _productNav.mods = _productNav.box.find('.slice-mod');
        _productNav.barH = _productNav.bar.height();
    },
    navDispose: function() {
        var box = _productNav.box;
        var bar = _productNav.bar;
        var side = _productNav.side;
        var mods = _productNav.mods;
        var barH = _productNav.barH;

        bar.find('li').on('click', function () {
            var o = $(this);
            var index = o.index();

            //目标mode
            var oMod = mods.eq(index);
            var ooTop = oMod.offset().top;

            $('body,html').animate({
                scrollTop: ooTop - barH + 1
            }, 800);

        });

        side.find('.btn-order').on('click', function () {
            var oThis = $(this);
            var ot = $('.product-intro').offset().top;
            var oBI = $('#j_bookingInfo');
            var oPO = $('#j_preOrder');
            var oTop = 0;
            var poTop = 0;
            if (oBI.get(0)) {
                oTop = oBI.offset().top;
            }
            if (oPO.get(0)) {
                poTop = oPO.offset().top;
            }

            if (oThis.hasClass('zyx-product-order')) {
                $('body,html').animate({
                    scrollTop: oTop
                }, 800);
            } else if (oThis.hasClass('yl-product-order')) {
                $('body,html').animate({
                    scrollTop: poTop
                }, 800);
            } else {
                $('body,html').animate({
                    scrollTop: ot
                }, 800);
            }
        });
    },
    fixColor: function (index) {
        var bar = _productNav.bar;
        var lis = bar.find('li');
        lis.removeClass('on');
        lis.eq(index).addClass('on');
    },
    unitScroll: function() {
        var box = _productNav.box;

        if (isEmptyObject(box)) {
            return;
        }

        var bar = _productNav.bar;
        var side = _productNav.side;
        var mods = _productNav.mods;
        var barH = _productNav.barH;
        var initTop = box.offset().top;
        var o = $(window);
        var st = o.scrollTop();

        if (st >= initTop) {
            if (_util.check.isIE6) {
                bar.css({
                    'top': st,
                    'position': 'absolute'
                });
            } else {
                bar.css({
                    'position': 'fixed',
                    'top': '0'
                });
            }

            side.show();
        } else {
            bar.css({
                'position': 'static',
                'top': 'auto'
            });
            side.hide();
        }

        mods.each(function (k, v) {
            var oo = $(this);
            var ooTop = oo.offset().top;
            if (ooTop - barH <= st) {
                _productNav.fixColor(k);
            }
        });
    }
};

var _routeTab = {
    obj: {},
    box: {},
    nav: {},
    mods: {},
    oEnd: {},
    initTop: 0,
    navH: 0,
    barH: 0,
    iEnd: 0,
    iNI: 0,
    oIndex: 0,
    iIndex: 0,
    initCall: function() {
        _routeTab.init();
        _routeTab.tabDispose();
        _routeTab.navDispose();
        _routeTab.unitScroll();
    },
    init: function() {
        _routeTab.obj = $('#j_routeTab');
        if (!_routeTab.obj.get(0)) {
            return;
        }
        _routeTab.box = _routeTab.obj.find('.bd').children('.item').eq(_routeTab.oIndex);
        _routeTab.nav = _routeTab.box.find('.route-navbar');
        if (isEmptyObject(_routeTab.nav)) {
            return;
        }
        _routeTab.nav.css({
            'position': 'static',
            'top': 'auto'
        });
        _routeTab.mods = _routeTab.box.find('.route-detail-hd');
        _routeTab.initTop = _routeTab.nav.offset().top;
        _routeTab.navH = _routeTab.nav.height();
        _routeTab.barH = $('#j_products').find('.product-nav-fixed').height();
        _routeTab.oEnd = _routeTab.box.find('.route-detail-box').next();
        if (isEmptyObject(_routeTab.oEnd)) {
            _routeTab.oEnd = _routeTab.obj.parents('.route-intro').next();
        }
        _routeTab.iNI = 35; //导航项(li)高度和间距
    },
    tabDispose: function() {
        var obj = _routeTab.obj;
        var nav = _routeTab.nav;

        obj.find('.hd').find('li').on('click', function () {
            var oThis = $(this);
            var os = oThis.siblings('li');

            var index = _routeTab.oIndex = oThis.index();
            os.removeClass('on');
            oThis.addClass('on');

            var op = oThis.parents('.hd').next('.bd');
            var items = op.children('.item');

            items.hide();
            items.eq(index).show();

            items.eq(index).find('.route-navbar').find('li').removeClass('on').eq(0).addClass('on');
            nav.css({
                'position': 'static',
                'top': 'auto'
            });
            _routeTab.init();
            _routeTab.navDispose();

            //判断是第几屏行程
            var tabIndex = index;
            var tabItem = obj.children('.bd').children('.item').eq(tabIndex);
            var tagSlide = tabItem.find('.j_routePhotoList');

            imgLazyload(tabItem);
            unitSlide(tagSlide, tabItem, index);
        });
    },
    navDispose: function() {
        var nav = _routeTab.nav;
        if (isEmptyObject(nav)) {
            return;
        }
        var mods = _routeTab.mods;
        var barH = _routeTab.barH;
        var iNI = _routeTab.iNI;

        nav.find('li').on('click', function () {
            var o = $(this);
            var index = _routeTab.iIndex = o.index();

            //目标mode
            var oo = mods.eq(index);
            var ooTop = oo.offset().top;
            var iNum = ooTop - barH - iNI * index - 5;

            $('body,html').animate({
                scrollTop: iNum
            }, 1000);
        });
    },
    fixColor: function (index) {
        var nav = _routeTab.nav;
        var lis = nav.find('li');
        lis.removeClass('on');
        lis.eq(index).addClass('on');
    },
    unitScroll: function () {
        var obj = _routeTab.obj;
        var nav = _routeTab.nav;

        if (!isEmptyObject(nav)) {
            var mods = _routeTab.mods;
            var initTop = _routeTab.nav.parent().offset().top + 20;
            var barH = _routeTab.barH;
            var iEnd = _routeTab.oEnd.offset().top - _routeTab.navH - 20;
            var iNI = _routeTab.iNI;
            var o = $(window);
            var st = o.scrollTop();

            if (st >= initTop - barH - 6 && st < iEnd - barH) {
                nav.css({
                    'position': 'fixed',
                    'top': barH + 5
                });
            } else if (st >= iEnd - barH) {
                nav.css({
                    'position': 'absolute',
                    'top': iEnd
                });
            } else {
                nav.css({
                    'position': 'static',
                    'top': 'auto'
                });
            }

            mods.each(function (k, v) {
                var oo = $(this);
                var ooTop = oo.offset().top;
                if (ooTop - barH - iNI * _routeTab.iIndex - 6 <= st) {
                    _routeTab.fixColor(k);
                }
            });
        }
    }
};

var _zyxSideOrder = {
    box: {},
    initTop: 0,
    bh: 0,
    iEnd: 0,
    initCall: function() {
        var u = location.href.toLowerCase();
        if (u.indexOf('/trip/') > -1 || u.indexOf('ziyouxing.html') > -1) {
            _zyxSideOrder.init();
            _zyxSideOrder.unitScroll();
        }
    },
    init: function() {
        _zyxSideOrder.box = $('#j_orderbox');
        if (_zyxSideOrder.box.get(0)) {
            _zyxSideOrder.initTop = _zyxSideOrder.box.offset().top;
            _zyxSideOrder.bh = _zyxSideOrder.box.height();
            _zyxSideOrder.iEnd = $('#j_products').offset().top - _zyxSideOrder.bh - 40;
        }
    },
    unitScroll: function () {
        var box = _zyxSideOrder.box;
        var initTop = _zyxSideOrder.initTop;
        var bh = _zyxSideOrder.bh;
        var iEnd = _zyxSideOrder.iEnd;
        var o = $(window);
        var st = o.scrollTop();
        var u = location.href.toLowerCase();

        if ((u.indexOf('/trip/') > -1 || u.indexOf('ziyouxing.html') > -1) && !isEmptyObject(box)) {
            if (st >= initTop && st < iEnd) {
                box.css({
                    'position': 'fixed',
                    'top': 0
                });
            } else if (st >= iEnd) {
                box.css({
                    'position': 'absolute',
                    'top': iEnd
                });
            } else {
                box.css({
                    'position': 'static',
                    'top': 'auto'
                });
            }
        }
    }
};

//弹出框
function popMod(obj, xAxis) {

    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    var pop = o.parent();

    pop.children('.mask').height(document.body.clientHeight);
    pop.show().siblings('.pop-mod').hide();
    o.show();

    o.find('.pop-close').on('click', function () {
        pop.hide();
        o.hide();
    });

    //弹出框IE6下的定位
    $(window).on("scroll", function () {
        fixIe6(obj, xAxis);
    });
}

//IE6下的定位
function fixIe6(obj, xAxis) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    if (_util.check.isIE6) {
        o.css("top", $(document).scrollTop() + xAxis);
    }
}

function askPop() {
    //点击我要咨询
    $('#j_btnAsking').on('click', function () {
        var xAxis = 50;
        var sb = [];

        sb.push("<div class='pop-mod' id='j_askPopMod'>");
        sb.push("<div id='pop-asking' class='pop-asking'>");
        sb.push("<dl class='pop-asking-inner'>");
        sb.push("<dt class='pop-asking-hd pb10 clearfix'><em class='f18 yahei fl'>我要咨询</em><a href='javascript:void(0);' class='pop-close fr lh1 mt5'>&times;</a></dt>");
        sb.push("<dd class='pop-asking-bd'>");
        sb.push("<p class='cont-item'><label for='phone' class='item-hd f14'>联系电话</label><input type='text' id='phone' class='phone f999 p5'><span class='errorInfo' style='color: Red; text-align: left;'></span></p>");
        sb.push("<div class='cont-item'>");
        sb.push("<p><label for='askCont' class='item-hd f14'>咨询内容</label><textarea id='askCont' class='txta f999 p5 j_txtA'></textarea></p>");
        sb.push("<div class='cont-item-r'>");
        sb.push("<p><input type='checkbox' id='mailInform' class='vm mr5'><label for='mailInform' class='f999'>问题解决后邮件通知您</label></p>");
        sb.push("<p class='mt10 hide' id='j_contactEMail'><label for='email' class='item-hd f14'>联系邮箱</label><input type='text' id='email' class='email p5'></p>");
        sb.push("</div>");
        sb.push("</div>");
        sb.push("<p class='cont-item tc'><a id='submitMsg' onclick='productFeedBack();' class='btn-submit white f18 yahei tc mt15'>提&nbsp;&nbsp;&nbsp;&nbsp;交</a></p>");
        sb.push("</dd>");
        sb.push("</dl>");
        sb.push("</div>");
        sb.push("<div class='mask'>&nbsp;</div>");
        sb.push("</div>");

        $('body').append(sb.join(''));

        popMod('pop-asking', xAxis);
        fixIe6('pop-asking', xAxis);

        //选中邮箱
        $('#mailInform').on('change', function () {
            var oCem = $('#j_contactEMail');
            if (oCem.hasClass('hide')) {
                oCem.removeClass('hide');
                oCem.addClass('show');
            } else {
                oCem.addClass('hide');
                oCem.removeClass('show');
            }
        });

        //关闭pop
        $('#j_askPopMod').find('.pop-close').on('click', function () {
            $('#j_askPopMod').remove();
        });

        //提交表单实例事件

    });
}

//提示poptip
function productTips() {
    try {
        $(".J_powerFloat").powerFloat({
            reverseSharp: true
        });
        $(".J_powerFloatqijia").powerFloat({
            reverseSharp: true,
            position: "7-5"
        });
    } catch (e) {

    }

}

function productTab() {

    //重要信息、酒店、图片类型tab
    _uzw.ui.tab('j_productInfoTab');
    _uzw.ui.tab('j_hotelTab');
    _uzw.ui.tab('j_picTypeTab');
    _uzw.ui.tab('j_comboPicTab', function (index,nodeObj) {
        var items = nodeObj.find('.bd').find('.item'),
           imgs = items.eq(index).find('.combo-pic-list').find('img'),
           img = imgs.eq(0);

        if (img.attr('data-original') != img.attr('src')) {
            imgs.each(function () {
                var oImg = $(this),
                    sSrc = oImg.attr('data-original');
                if (sSrc != oImg.attr('src')) {
                    oImg.attr('src', sSrc);
                }
            });
        }
    });
}

/* 旧版点评 productComment */
function productComment() {
    var pclist = $('#j_commentList');
    var ppc = $('#j_photoComment');
    var pco = $.trim($('#j_comCount').text());
    var pcoPic = $.trim($('#j_comPicCount').text());

    var pid = $("#pid").val();
    var pageSize = 8;

    var pcount = 0; //所有回复数量
    var piccount = 0; //图片回复数量
    if (pco.indexOf(',') > -1) {
        pcount = parseInt(pco.split(',')[0],10);
        piccount = parseInt(pco.split(',')[1],10);
    } else {
        pcount = parseInt(pco, 10);
    }

    if (!parseInt(pcount, 10)) {
        return;
    }

    //清除图片点评选中状态
    ppc.prop('checked', false);

    //判断是否是特卖
    var u = location.href.toLowerCase();
    if (u.indexOf('/temai-') > -1 || u.indexOf('temaihui.html') > -1) {
        return;
    }

    var oII = pclist.parents('.travel-comment').prev('.slice-mod');
    if (!oII.get(0)) {
        return;
    }
    //初始检测当前滚动点
    var ccTop = oII.offset().top; //标准点
    var ccFlag = false;
    //滑动检测
    $(window).on('scroll', function () {
        //二次校验
        if (ccFlag) {
            return;
        }

        //判断是否已加载评论
        var pcLen = pclist.find('.comment-item').length;
        if (pcLen > 0) {
            //$(window).off('scroll', '**');//移除scroll代理事件
            return;
        }

        var scTop = $(window).scrollTop();
        if (scTop >= ccTop) {
            //执行ajax
            ccFlag = true;
            _unitPKG();
        }

    });

    var _unitPKG = function () {

        //pic pager
        ppc.on('change', function () {
            var o = $(this);
            var oc = o.prop('checked');
            if (oc) {
                _unitPager(piccount, pageSize, 1);
            } else {
                _unitPager(pcount, pageSize, 0);
            }
        });

        var _unitLoadData = function (currentPage, allPage, pic) {
            //ajax 分页
            var more = pic || 0;
            var df = $.ajax({
                url: "http://sh.uzai.com/ashx/ashxCommon.ashx?type=0&pid=" + pid + "&pageSize=" + pageSize + "&more=" + more + "&indexPage=" + currentPage,
                type: 'GET',
                dataType: "jsonp",
                contentType: "application/json; charset=utf-8"
            });

            df.done(function (msg) {
                if (msg) {
                    var data = msg.data;
                    var sb = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];

                        var id = item.id;
                        var talkbackcontent = item.talkbackcontent;
                        var UsrSatisfactionLevel = item.UsrSatisfactionLevel;
                        var UsrSatisfactionRate = item.UsrSatisfactionRate;
                        var CommentImages = item.CommentImages;

                        var imgArrs = [];
                        if (CommentImages) {
                            imgArrs = CommentImages.split('^');
                        }

                        var Ucoins = item.Ucoins;
                        var num = item.num;
                        var userName = item.userName;
                        var goDate = item.goDate;
                        var UsrComentWay = item.UsrComentWay;
                        var type = item.type;

                        var UserGrade = item.UserGrade;
                        var UsrSatisfactionStar = item.UsrSatisfactionStar;
                        var UserGradePic = item.UserGradePic;
                        var ReturnDate = item.ReturnDate;
                        var Reply = item.Reply;

                        sb.push("<li class='comment-item clearfix'>");
                        sb.push("<div class='member-info fl'>");
                        //sb.push("<div class='member-icon'><img src='/content/v1/images/product/pic9.jpg' alt=''></div>");
                        sb.push("<p class='member-name f14 tc'>" + userName + "</p>");
                        sb.push("</div>");
                        sb.push("<div class='comment-side fr'><p class='f999 tc'>" + ReturnDate + "</p><p class='comment-type mt5'>" + UsrComentWay + "</p></div>");

                        sb.push("<dl class='comment-main'>");
                        sb.push("<dt>");
                        sb.push("<span class='cacsi-bar vm'><span class='progress' style='width:" + UsrSatisfactionRate + "'>&nbsp;</span><em class='text-box pl10'>满意度：<b>" + UsrSatisfactionRate + "</b></em></span>");
                        sb.push("<span class='cacsi-items vm'>" + type + "</span>");
                        sb.push("</dt>");
                        sb.push("<dd class='f666 lh2 pt10' data-tid='" + id + "'>");
                        sb.push("<p><a target='_blank' href='http://" + _ug.city + ".uzai.com/dianping/" + pid + "-" + id + ".html'>" + talkbackcontent + "</a></p>");

                        if (imgArrs.length > 0) {
                            sb.push("<div class='photo-gallery mt10'>");
                            for (var j = 0; j < imgArrs.length; j++) {
                                var ciArr = imgArrs[j].split('#');
                                if (ciArr.length > 0) {
                                    var ciID = ciArr[0];
                                    var ciSrc = ciArr[1];
                                    var ciTxt = ciArr[2];
                                    var ciHit = ciArr[3];
                                    sb.push("<div class='item'><img data-hit='" + ciHit + "'  data-id='" + ciID + "' alt='" + ciTxt + "' src='" + _uzw.domain.cdnRandom('dynamic') + "/ordercomment/" + ciSrc + "?imageView2/2/h/170' ></div>");
                                }
                            }
                            sb.push("</div>");
                        }

                        sb.push("</dd>");
                        sb.push("</dl>");
                        sb.push("</li>");

                    }
                    if (sb && sb.length > 0) {
                        pclist.find('.comment-list').html(sb.join(''));
                        picCommentControl();
                    }
                }
            });
        };

        //单元分页
        var _unitPager = function (count, ps, more) {
            $('#hjPager').uzPager({
                pageSize: ps,
                pageItems: count,
                onInit: function (allPage) {
                    _unitLoadData(1, allPage, more);
                },
                onCallback: function (currentPage, allPage) {
                    uzLazy('j_commentList');
                    skipPoint('travel-comment');
                    _unitLoadData(currentPage, allPage, more);
                }
            });
        };

        //pager
        _unitPager(pcount, pageSize, 0);

        productZixun();//载入咨询
    };

    //去点评
    commentPop();
}

/* --新版点评备份勿删
function productComment() {
    var pct = $('#j_proCommentTab');
    var pco = $.trim($('#j_comCount').text());

    var pid = $("#pid").val();
    var pageSize = 8;

    //判断是否是特卖
    var u = location.href.toLowerCase();
    if (u.indexOf('/temai-') > -1 || u.indexOf('temaihui.html') > -1) {
        return;
    }

    var oII = pct.parents('.travel-comment').prev('.slice-mod');
    if (!oII.get(0)) {
        return;
    }
    //初始检测当前滚动点
    var ccTop = oII.offset().top; //标准点
    var ccFlag = false;
    //滑动检测
    $(window).on('scroll', function () {
        //二次校验
        if (ccFlag) {
            return;
        }

        //判断是否已加载评论
        var pcLen = pct.find('.comment-item').length;
        if (pcLen > 0) {
            //$(window).off('scroll', '**');//移除scroll代理事件
            return;
        }

        var scTop = $(window).scrollTop();
        if (scTop >= ccTop) {
            //执行ajax
            ccFlag = true;
            _unitPKG();
        }

    });

    var _unitPKG = function () {

        var _unitLoadData = function (pctItem, currentPage, allPage, pic) {
            //ajax 分页
            var more = pic || 0;
            var df = $.ajax({
                url: "http://sh.uzai.com/ashx/ashxCommon.ashx?type=0&pid=" + pid + "&pageSize=" + pageSize + "&more=" + more + "&indexPage=" + currentPage,
                type: 'GET',
                dataType: "jsonp",
                contentType: "application/json; charset=utf-8"
            });

            df.done(function (msg) {
                if (msg) {
                    var data = msg.data;
                    var dLen = data.length;
                    var clHtml = ''; // 点评列表节点
                    for (var i = 0; i < dLen; i++) {
                        var item = data[i];

                        var id = item.id;
                        var talkbackcontent = item.talkbackcontent; // 点评内容
                        var UsrSatisfactionLevel = item.UsrSatisfactionLevel; // 满意度等级
                        var UsrSatisfactionRate = item.UsrSatisfactionRate; // 满意度百分值
                        var CommentImages = item.CommentImages; // 点评图片

                        var imgArrs = [];
                        var iaLen = 0;
                        if (CommentImages) {
                            imgArrs = CommentImages.split('^');
                            iaLen = imgArrs.length;
                        }

                        var Ucoins = item.Ucoins; // U币
                        var num = item.num;
                        var userName = item.userName; // 用户名
                        var goDate = item.goDate;
                        var UsrComentWay = item.UsrComentWay; // 点评来源
                        var type = item.type; // 服务项评价等级

                        var UserGrade = item.UserGrade; // 用户等级
                        var UsrSatisfactionStar = item.UsrSatisfactionStar; // 满意度星级
                        var UserGradePic = item.UserGradePic; // 用户等级图片
                        var ReturnDate = item.ReturnDate; // 点评时间
                        var Reply = item.Reply; // 回复

                        clHtml += '<li class="comment-item clearfix">';
                        clHtml += '<div class="item-side f666 tc fr">';
                        clHtml += '<p class="star-wrap">';
                        clHtml += '<span class="stars-bar vm clearfix">';
                        clHtml += '<i class="icon-star icons-member png on"></i>';
                        clHtml += '<i class="icon-star icons-member png on"></i>';
                        clHtml += '<i class="icon-star icons-member png on"></i>';
                        clHtml += '<i class="icon-star icons-member png on"></i>';
                        clHtml += '<i class="icon-star icons-member png"></i>';
                        clHtml += '</span>';
                        clHtml += '</p>';
                        clHtml += '<p class="f333">uzai***T01</p>';
                        clHtml += '<p><span>金牌会员</span><span class="ml10">北京</span></p>';
                        clHtml += '<p>2015-03-06 14:11 购买</p>';
                        clHtml += '<p>来自悠哉iPhone客户端</p>';
                        clHtml += '</div>';
                        clHtml += '<div class="item-main">';
                        clHtml += '<div class="hd-bar">';
                        clHtml += '<span class="cacsi-items f666 clearfix">';
                        clHtml += '<em class="first">餐饮住宿：很满意</em>';
                        clHtml += '<em>旅游交通：很满意</em>';
                        clHtml += '<em>行程安排：很满意</em>';
                        clHtml += '<em>导游服务：很满意</em>';
                        clHtml += '</span>';
                        clHtml += '</div>';
                        clHtml += '<div class="box-fix comment-info">';
                        clHtml += '<div class="comment-cont lh2 clearfix">';
                        clHtml += '第一次在定旅游产品，因为不太喜欢春秋的产品，虽然价钱上要比春秋的要贵，但是觉得还是值得的，可是没有想到的是，到了那里发现原来还是和春秋的拼团，让我好失望，早知道这样那我<span class="symbol">......</span><span class="hide">第一次在定旅游产品，因为不太喜欢春秋的产品，虽然价钱上要比春秋的要贵，但是觉得还是值得的，可是没有想到的是，到了那里发现原来还是和春秋的拼团，让我好失望，早知道这样那我</span>';
                        clHtml += '<span class="fr">';
                        clHtml += '<span class="f999">—2015/10/16 18:18</span>';
                        clHtml += '<span class="btn-switch pointer blue"><em class="switch-cont vm">展开全部</em><span class="arrow-mod songti lh1 ml5 vm"><em>◆</em><i>◆</i></span></span>';
                        clHtml += '</span>';
                        clHtml += '</div>';

                        if (iaLen > 0) {
                            clHtml += '<div class="photo-gallery mt10">';
                            clHtml += '<span class="gallery-inner clearfix">';
                            clHtml += '<a href="#" class="more-item blue">查看更多</a>';
                            for (var j = 0; j < iaLen; j++) {
                                var ciArr = imgArrs[j].split('#');
                                if (ciArr.length) {
                                    var ciID = ciArr[0];
                                    var ciSrc = ciArr[1];
                                    var ciTxt = ciArr[2];
                                    var ciHit = ciArr[3];
                                    clHtml += '<a href="#" class="photo-item"><img src="已经修改" alt="' + ciTxt + '" data-id="' + ciID + '" data-hit="' + ciHit + '"></a>';
                                }
                            }
                            clHtml += '</span>';
                            clHtml += '</div>';
                        }

                        clHtml += '</div>';
                        clHtml += '<div class="ft-bar">';
                        clHtml += '<span class="reply-wrap">';
                        clHtml += '<span class="btn-item f999">回复（746）</span>';
                        clHtml += '<div class="pop-reply-mod hide">';
                        clHtml += '<div class="reply-inner">';
                        clHtml += '<div class="reply-box j_messageBox">';
                        clHtml += '<p><textarea name="" id="" cols="30" rows="10" class="txta vm j_txtArea" placeholder="回复："></textarea></p>';
                        clHtml += '<p class="mt10 clearfix">';
                        clHtml += '<span class="f999 fl j_limitNum"><b>0</b>-500字</span>';
                        clHtml += '<input type="button" value="提交回复" class="btn-reply white fr">';
                        clHtml += '</p>';
                        clHtml += '</div>';
                        clHtml += '<ul class="reply-list mt10">';
                        clHtml += '<li class="list-item clearfix">';
                        clHtml += '<span class="item-hd blue">Y星空下的传说Y ：</span>';
                        clHtml += '<span class="item-bd">';
                        clHtml += '貌似还不错的，下次也去旅游玩一下。';
                        clHtml += '<span class="item-date f666">2015-10-23 16:38</span>';
                        clHtml += '</span>';
                        clHtml += '</li>';
                        clHtml += '</ul>';
                        clHtml += '</div>';
                        clHtml += '<span class="arrow-mod f26 songti lh1"><em>◆</em><i>◆</i></span>';
                        clHtml += '</div>';
                        clHtml += '</span>';
                        clHtml += '<span class="btn-item f999 ml10">赞（3879）</span>';
                        clHtml += '</div>';
                        clHtml += '</div>';
                        clHtml += '</li>';
                    }
                    if (dLen) {
                        pctItem.find('.comment-list').html(clHtml);

                        replyPop(); // 点评回复
                    }
                }
            });
        };

        //单元分页
        var _unitPager = function (pctItem, count, ps, more) {
            pctItem.find('.fn-pager').uzPager({
                pageSize: ps,
                pageItems: count,
                onInit: function (allPage) {
                    _unitLoadData(pctItem, 1, allPage, more);
                },
                onCallback: function (currentPage, allPage) {
                    skipPoint('travel-comment');
                    _unitLoadData(pctItem, currentPage, allPage, more);
                }
            });
        };

        _uzw.ui.tab('j_proCommentTab', function (index, otab) {
            var liOn = otab.children('.hd').children('li').eq(index);
            var pcCount = parseInt(liOn.find('.count-nub'), 10);
            var pctItem = otab.children('.bd').children('.item').eq(index);
            //pager
            _unitPager(pctItem, pcCount, pageSize, 0);
        });

        productZixun();//载入咨询
    };

    //去点评
    commentPop();
}*/


function picCommentControl() {
    var box, oCS, oPort, tid;
    $('#j_commentList').find('.photo-gallery').children('.item').on('click', function () {
        var oThis = $(this);
        tid = oThis.parent('.photo-gallery').parent('dd').attr('data-tid');

        initPicCommentPop(oThis);

        getCommentList(oThis);

        picCommentPop(oThis);
        picComment(oThis);

        //分享
        picShareFix(oThis);

        //顶
        picDing(oThis);
    });

    var _changeReply = function (q) {
        $('#j_replyBox').find('.item').hide();
        $('#j_replyBox').find('.item').eq(q).show();

        //绑定 data-hit值
        var oaonHit = oPort.find('a.on').attr('data-hit');
        box.find('.btn-praise').find('em.vm').text(oaonHit);
    };

    var initPicCommentPop = function (obj) {
        //点击评论列表图片
        var oIndex = obj.index();
        var oImg = obj.find('img');//当前图片
        var oImgs = obj.parent('.photo-gallery').find('img');
        var sum = oImgs.length;
        var oImgID = oImg.attr('data-id');
        var oImgHit = oImg.attr('data-hit');
        var xAxis = 50;
        var sb = [];

        sb.push('<div class="pop-mod">');
        sb.push('<div class="mask">&nbsp;</div>');
        sb.push('<div id="j_popCommentControl" class="pop-comment-control wrap-box clearfix">');
        sb.push('<div class="control-main fl">');
        sb.push('<div class="photo-viewer carousel-main">');
        sb.push('<div class="focus-photo tc">');
        sb.push('<img src="' + oImg.attr('src').replace('/h/170', '/h/500') + '" alt="" class="init-pic">');
        sb.push('<div class="text-bar">');
        sb.push('<div class="bar-mask">&nbsp;</div>');
        sb.push('<div class="text-cont f14 tc"><p class="text-ellipsis">' + oImg.attr('alt') + '</p></div>');
        sb.push('</div>');
        sb.push('</div>');
        sb.push('<div class="btn-box hide">');
        sb.push('<a href="javascript:void(0);" class="btn-prev icon-common-main png">prev</a>');
        sb.push('<a href="javascript:void(0);" class="btn-next icon-common-main png">next</a>');
        sb.push('</div>');
        sb.push('</div>');

        sb.push('<div class="slide-bar carousel-side mt10">');

        sb.push('<div class="viewport">');
        sb.push('<div class="slides_container clearfix tc">');
        sb.push('<div class="item clearfix">');
        oImgs.each(function (i) {
            var ot = $(this);
            var otID = ot.attr('data-id');
            var otHit = ot.attr('data-hit');
            var otAlt = ot.attr('alt');
            var otSrc = ot.attr('src');

            if (i > 0 && i % 5 === 0) {
                sb.push('</div>');
                sb.push('<div class="item clearfix">');
            }
            if (i == oIndex) {
                sb.push('<a href="javascript:void(0);" data-id="' + otID + '" data-hit="' + otHit + '" class="on"><img src="' + otSrc + '" data-src="' + '#picUrl' + '" alt="' + otAlt + '"></a>');
            } else {
                sb.push('<a href="javascript:void(0);" data-id="' + otID + '" data-hit="' + otHit + '"  ><img src="' + otSrc + '" data-src="' + '#picUrl' + '" alt="' + otAlt + '"></a>'); // * 5
            }
        });
        sb.push('</div>');
        sb.push('</div>');

        sb.push('<a href="javascript:void(0);" class="slide-comm-prev buttons"><div class="arrow-box f20 songti lh1"><em>◆</em><i>◆</i></div></a>');
        sb.push('<a href="javascript:void(0);" class="slide-comm-next buttons"><div class="arrow-box f20 songti lh1"><em>◆</em><i>◆</i></div></a>');

        sb.push('</div>');

        sb.push('</div>');
        sb.push('</div>');
        sb.push('<div class="centrol-side fr">');
        sb.push('<div class="centrol-toolbar clearfix">');
        sb.push('<a href="javascript:void(0);" class="btn-praise f666 f16 b fl"><i class="icon-praise mr5 vm icon-common-main png">&nbsp;</i><em class="vm">' + oImgHit + '</em></a>');
        sb.push('<ul class="share-list tc fr clearfix">');
        sb.push("<li class='list-item'><a href=\"javascript:eval(picShare('wb'));setPicFav('wb');void(0);\" class='btn-weibo'><i class='icon-weibo vm icon-common-main png'>&nbsp;</i></a></li>");
        sb.push("<li class='list-item'><a href=\"javascript:eval(picShare('qz'));setPicFav('qz');void(0);\" class='btn-qzone'><i class='icon-qzone vm icon-common-main png'>&nbsp;</i></a></li>");
        sb.push('<li class="list-item more-item">');
        sb.push('<a href="javascript:void(0);" class="btn-more"><i class="icon-more vm icon-common-main png">&nbsp;</i></a>');
        sb.push('<div class="more-box tl hide">');
        sb.push('<div class="arrow-box f20 songti lh1"><em>◆</em><i>◆</i></div>');
        sb.push('<ul class="more-share">');
        sb.push("<li><a href=\"javascript:eval(picShare('qt'));setPicFav('qt');void(0);\" class='btn-qqweibo'><i class='icon-qqweibo mr5 vm icon-common-main png'>&nbsp;</i>腾讯微博</a></li>");
        sb.push("<li><a href=\"javascript:eval(picShare('rr'));setPicFav('rr');void(0);\" class='btn-renren'><i class='icon-renren mr5 vm icon-common-main png'>&nbsp;</i>人人网</a></li>");
        sb.push('</ul>');
        sb.push('</div>');
        sb.push('</li>');
        sb.push('</ul>');
        sb.push('</div>');
        sb.push('<div class="centrol-cont-box">');
        sb.push('<div class="carousel-info f333">');
        sb.push('<span class="pager-info f22"><em class="f26">' + (oIndex + 1) + '</em>/<i>' + sum + '</i></span>');
        sb.push('<span class="info-cont ml5">' + oImg.attr('alt') + '</span>');
        sb.push('</div>');
        sb.push('<div class="message-box mt10 j_messageBox">');
        sb.push('<p class="txta-wrap"><textarea  id="txtTalkBackText" cols="30" maxlength="150" rows="10" class="txta f666 p5 j_txtArea"></textarea></p>');
        sb.push('<div class="ft-bar f999 mt5 clearfix">');
        sb.push('<div class="limit-num fl j_limitNum"><b>0</b>/150</div>');
        sb.push('<div class="bar-side fr">');
        if (_uzw.user.userid) {
            sb.push('<span class="tips-info vm mr10">' + _uzw.user.userName + '</span>');
        } else {
            sb.push('<span class="tips-info vm">回复需<a href="javascript:void(0);" class="btn-login u j_btnCommentLogin">登录</a></span>');
        }
        sb.push('<a href="javascript:void(0);" class="btn-affirm tc ml10 vm">确认</a>');
        sb.push('</div>');
        sb.push('</div>');
        sb.push('</div>');
        sb.push('</div>');
        sb.push('<div class="reply-box" id="j_replyBox">');

        for (var i = 0; i < sum; i++) {
            sb.push('<div class="item hide">');
            sb.push('<div class="total-bar pt10"><span>回复(<i>0</i>)</span></div>');

            sb.push('<div class="reply-list">');
            sb.push('<ul>');
            //sb.push('<li>');
            //sb.push('<span><em class="username">' + 'username' + '</em>：</span>');
            //sb.push('<span class="f333 pl5">' + 'txt' + '</span>');
            //sb.push('<span class="reply-time f999 pl5">' + 'timeInfo' + '</span>');
            //sb.push('</li>');
            sb.push('</ul>');
            sb.push('</div>');

            sb.push('</div>');
        }

        sb.push('</div>');
        sb.push('</div>');
        sb.push('<div class="close-wrap"><a href="javascript:void(0);" class="pop-close yahei pointer fr"><i class="close-icon">&times;</i></a></div>');
        sb.push('</div>');
        sb.push('</div>');

        $('body').append(sb.join(''));

        box = $('#j_popCommentControl');
        oCS = box.find('.carousel-side');
        oPort = oCS.find('.viewport');

        popMod('j_popCommentControl', xAxis);

        var sT = $(window).scrollTop();//滚动高度
        $('#j_popCommentControl').css({
            'margin-top': sT - 305
        });

        fixIe6('j_popCommentControl', xAxis);

        _changeReply(oIndex);
    };

    var getCommentList = function (obj) {
        var tid = obj.parent('.photo-gallery').parent('dd').attr('data-tid');

        $.ajax({
            type: 'GET',
            url: 'http://sh.uzai.com/ashx/ashxCommon.ashx?type=4&talkBackId=' + tid,
            dataType: 'jsonp',
            success: function (data) {
                var rb = $('#j_replyBox');
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var iImgID = item.ImgID;
                        var iReply = item.Reply;
                        var iLenth = iReply.length;

                        var sb = [];
                        sb.push("<div class='total-bar pt10'><span>回复(<i>" + iLenth + "</i>)</span></div>");
                        sb.push("<div class='reply-list'><ul>");

                        if (iReply && iReply.length > 0) {
                            for (var j = 0; j < iLenth; j++) {
                                var block = iReply[j];
                                var pUserName = block.UserName;
                                var pHeadUrl = block.HeadUrl;
                                var pReplyContent = block.ReplyContent;
                                var pReplyDate = block.ReplyDate;
                                sb.push("<li><span><em class='username'>" + pUserName + "</em>：</span><span class='f333 pl5'>" + pReplyContent + "</span><span class='reply-time f999 pl5'>" + pReplyDate + "</span></li>");
                            }
                        }

                        sb.push("</ul></div>");
                        rb.find('.item').eq(i).html(sb.join(''));
                    }
                }
            }, error: function () {

            }
        });
    };

    var picCommentPop = function (obj) {

        var oIndex = obj.index();

        var size = oPort.find('.item').length;
        var iCount = Math.floor(oIndex / 5);

        //缩略图滚动
        var unitCarousel = function (wrap) {
            if (!wrap.get(0)) {
                return;
            }

            if (size > 1) {
                //slide
                wrap.slides({
                    preload: true,
                    preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
                    currentClass: 'on',
                    next: 'slide-comm-next',
                    prev: 'slide-comm-prev',
                    slideSpeed: 300,
                    slideEasing: "easeOutQuad",
                    effect: 'slide',
                    hoverPause: false,
                    pause: 1000,
                    play: 0,
                    generateNextPrev: false,
                    generatePagination: false,
                    animationComplete: function (current) {

                    }
                });

                wrap.siblings('.buttons').show();
                for (var i = 0; i < iCount; i++) {
                    wrap.siblings('.slide-comm-next').click();
                }
            }
            else {
                wrap.siblings('.buttons').addClass('invalid');
            }
        };
        unitCarousel(oPort);

        //左右方向控制
        var carouselManage = function () {
            var oCM = oCS.prev('.carousel-main');
            var oTxt = oCM.find('.text-cont').find('.text-ellipsis');
            var oA = oPort.find('.slides_container').find('a');
            var iLen = oA.length;
            var oPager = box.find('.pager-info');

            if (iLen > 1) {

                oCM.on('mouseover', function () {
                    var oThis = $(this);
                    oThis.find('.btn-box').show();
                }).on('mouseout', function () {
                    var oThis = $(this);
                    oThis.find('.btn-box').hide();
                });

                oCM.find('.btn-box').find('a').on('click', function () {
                    var oThis = $(this);
                    var aOn = oPort.find('a.on');
                    var iIndex = oA.index(aOn);

                    //前
                    if (oThis.text() == 'prev' && iIndex > 0) {
                        if (iIndex % 5 === 0) {
                            oCS.find('.slide-comm-prev').click();
                        }
                        oA.eq(iIndex - 1).click();
                        oPager.find('em').text(iIndex);
                    }
                        //后
                    else if (oThis.text() == 'next' && iIndex + 1 < iLen) {
                        if ((iIndex + 1) % 5 === 0) {
                            oCS.find('.slide-comm-next').click();
                        }
                        oA.eq(iIndex + 1).click();
                        oPager.find('em').text(iIndex + 2);
                    }



                });
            }

            if (!oTxt.text()) {
                //文本遮罩层隐藏
                oCM.find('.text-bar').hide();
            }

            //oPager.find('i').text(iLen);

            //点击缩略图
            oA.on('click', function () {
                var o = $(this);
                var oImg = o.find('img');
                var opic = oImg.attr('src');
                var otxt = oImg.attr('alt');
                var os = o.parents('.viewport').find('a');
                var iIndex = os.index(o);

                var ohit = o.attr('data-hit');
                var oid = o.attr('data-id');

                os.removeClass('on');
                o.addClass('on');

                oCM.find('.init-pic').attr('src', opic.replace('/h/170', '/h/500'));
                oPager.find('em').text(iIndex + 1);
                box.find('.carousel-info').find('.info-cont').text(otxt);

                if (!otxt) {
                    oCM.find('.text-bar').hide();
                } else {
                    oCM.find('.text-bar').show();
                    oTxt.text(otxt);
                }

                //切换回复版块
                _changeReply(iIndex);

                // 处理ding 值
                var obpv = box.find('.centrol-toolbar').find('.btn-praise');
                if (ohit != '0') {
                    obpv.find('em').text(ohit);
                }

                return false;
            });
        };
        carouselManage();

        //分享
        box.find('.share-list').find('.more-item').on('mouseover', function () {
            var oThis = $(this);
            oThis.find('.more-box').show();
        }).on('mouseout', function () {
            var oThis = $(this);
            oThis.find('.more-box').hide();
        });

        //关闭box
        box.find('.pop-close').on('click', function () {
            box.parents('.pop-mod').remove();
        });
    };

    var picComment = function (obj) {
        //点击登录
        $('.j_btnCommentLogin').on('click', function () {
            _uzw.iframe.pop(_uzw.domain.u + '/QuickLoginV1?actionName=dianPingCB');
        });

        //提交评论
        $('#j_popCommentControl').find('.btn-affirm').on('click', function () {
            var o = $(this);
            if (!_uzw.user.userid) {
                $('.j_btnCommentLogin').click();//未登录
            } else {

                var imgID = oPort.find('a.on').attr('data-id');
                var cont = $.trim($('#txtTalkBackText').val());
                if (cont.length <= 0) {
                    alert('请填写点评！');
                    return;
                }

                //ajax 数据
                $.ajax({
                    type: 'GET',
                    url: 'http://sh.uzai.com/ashx/ashxCommon.ashx?type=5&talkBackId=' + tid + '&imageId=' + imgID + '&content=' + escape(cont),
                    dataType: 'jsonp',
                    success: function (data) {
                        alert("回复成功，待审核通过后展示！");
                    },
                    error: function () {

                    }
                });
            }
        });

        textareaLimit();//输入文字倒计时
    };

    var picDing = function (obj) {

        //ajax
        $('.btn-praise').on('click', function () {
            var o = $(this);
            var oimg = oPort.find('.slides_container').find('a.on');

            var ot = parseInt($.trim(o.find('.vm').text()), 10);
            var oid = oimg.attr('data-id');

            if (checkDingStatus(oid)) {
                //已经点过赞
                return;
            }

            $.ajax({
                type: 'GET',
                url: 'http://sh.uzai.com/ashx/ashxCommon.ashx?type=6&imageId=' + oid,
                dataType: 'jsonp',
                success: function (data) {
                    if (data) {
                        writeDingPic(oid);//写入cookie
                        if (data.result == 'success') {
                            //点赞成功
                            o.find('em.vm').text(ot + 1);

                        } else if (data.result == 'much') {
                            //已赞
                        }

                        var nv = o.find('em.vm').text();
                        //处理当前pop窗口的data-hit值
                        oPort.find('a.on').attr('data-hit', nv);

                        //处理详细页面的data-hit值
                        $('#j_commentList').find('.item').find("img[data-id='" + oid + "']").attr('data-hit', nv);

                    }
                }, error: function () {

                }
            });


        });

        function writeDingPic(picid) {
            var dingpic = _uzw.cookie.get("uzwDingPics");
            if (!dingpic) {
                _uzw.cookie.set("uzwDingPics", picid, 1);
            }
            else {
                dingpic = dingpic + "|" + picid;
                var dingArrN = _util.array.unique(dingpic.split('|'));
                _uzw.cookie.set("uzwDingPics", dingArrN.join('|'), 1);
            }
        }

        //pic id 是否在数组中 picid 为string，非int
        function checkDingStatus(picid) {
            var flag = false;
            var ck = _uzw.cookie.get("uzwDingPics");
            if (ck) {
                var ckList = ck.split('|');
                var b = $.inArray(picid, ckList);
                if (b > -1) {
                    flag = true;
                }
            }
            return flag;
        }
    };
}

function productLatest() {
    var obj = $("#j_latestOrder");
    if (obj.get(0)) {
        setInterval(function () {
            var height = obj.find("ul li").height();
            obj.find("ul").animate({
                marginTop: "0px"
            }, 1000, 'easeInQuad', function () {
                $(this).find("li:last").prependTo(this);
                $(this).css({
                    marginTop: -height + "px"
                });
                var html = obj.html();
                obj.html(html);
            });
        }, 5000);
    }
}

function skipPoint(obj) {
    var o = $('#' + obj);
    if (!o.get(0)) {
        o = $('.' + obj);
    }
    var tp = o.offset().top;
    $('body,html').animate({
        scrollTop: tp
    }, 800);
}

/* 新旧版点评通用 productZixun ，有些旧版专用代码 */
function productZixun() {
    var pcount = parseInt($('#j_zuxunCount').text(), 10);
    pcount = pcount || 0;
    if (pcount === 0) {
        return;
    }

    var code = $("#pcode").val();
    var pageSize = 5;

    var _unitLoadData = function (currentPage, allPage) {
        var df = $.ajax({
            url: "http://sh.uzai.com/ashx/ashxCommon.ashx?type=3&pcode=" + code + "&pageSize=" + pageSize + "&indexPage=" + currentPage + "",
            type: 'GET',
            dataType: "jsonp",
            contentType: "application/json; charset=utf-8"
        });

        df.done(function (msg) {
            //console.log(msg);
            if (msg) {
                var data = msg.data;
                var sb = [];
                sb.push("<ul>");
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];

                    var id = item.id;
                    var userName = item.userName;
                    var mContent = item.mContent;
                    var editTime = item.editTime;
                    var aContent = item.aContent;

                    sb.push("<li>");
                    sb.push("<div class='advisory-hd clearfix'><div class='item-hd fl'><i class='icon-ask mr10 vm icon-product png'>&nbsp;</i><span class='hd-cont'>咨询内容：</span></div><div class='item-bd'><em class='ask-cont'>" + mContent + "</em><span class='date-box f999'>" + editTime + "</span></div></div>");
                    sb.push("<div class='advisory-bd pt10 clearfix'>");
                    sb.push("<div class='item-hd fl'><i class='icon-answer mr10 vm icon-product png'>&nbsp;</i><span class='hd-cont'>悠哉客服：</span></div>");
                    sb.push("<div class='item-bd'><em class='answer-cont'>" + aContent + "</em></div>");
                    sb.push("</div>");
                    sb.push("</li>");
                }
                sb.push("</ul");
                $('#j_zixunList').html(sb.join(''));
            }
        });
    };
    //pager
    $('#zxPager').uzPager({
        pageSize: pageSize,
        pageItems: pcount,
        onInit: function (allPage) {
            _unitLoadData(1, allPage);
        },
        onCallback: function (currentPage, allPage) {
            uzLazy('j_commentList'); // 旧版点评专用，新版点评删除
            skipPoint('advisory-mod');
            //ajax 分页
            _unitLoadData(currentPage, allPage);
        }
    });
}

// 回访 新旧版点评通用 commentPop
function commentPop() {
    var pid = $("input#pid").val();
    $('#j_btnRemark').on('click', function () {

        var asyncPop = function () {
            var sb = [];
            var pid = $.trim($("#pid").val());
            sb.push('<div id="j_commentPopMod" class="pop-mod">');
            sb.push('<div class="pop-comment">');
            sb.push('<a href="javascript:void(0);" class="pop-close lh1">&times;</a>');
            sb.push('<div class="warn-box tc pt5"><i class="icon-warn icon-product png">&nbsp;</i></div>');
            sb.push('<div class="f18 yahei warn-tit"><em class="p10">您暂不能对该线路进行点评</em></div>');
            sb.push('<ul class="warn-cont f14 lh2">');
            if (!_uzw.user.userid) {
                sb.push('<li>您还未登录<a href="https://u.uzai.com/reguser?referUrl=/youlun/' + pid + '.html" class="space songti">立即登录&gt;&gt;</a></li>');
            }
            sb.push('<li>您可能没有在悠哉预订过该线路</li>');
            sb.push('<li>您已经评价过该线路</li>');
            sb.push('<li>您还未出行或归来</li>');
            sb.push('</ul>');
            sb.push('</div>');
            sb.push('<div class="mask">&nbsp;</div>');
            sb.push('</div>');

            $('body').append(sb.join(''));
            var xAxis = 50;
            popMod('pop-comment', xAxis);
            fixIe6('pop-comment', xAxis);

            //关闭pop
            $('#j_commentPopMod').find('.pop-close').on('click', function () {
                $('#j_commentPopMod').remove();
            });
        };

        if (!_uzw.user.userid) {
            asyncPop();
        } else {

            //国双统计代码【我要点评】
            if (typeof _gsq == 'object') {
                _gsq.push(["T", "GWD-002793", "trackEvent", "产品详情页", "页面下", "我要点评"]);
            }

            var df = $.ajax({
                url: "http://sh.uzai.com/ashx/ashxCommon.ashx?type=7&pid=" + pid,
                type: 'GET',
                dataType: "jsonp",
                contentType: "application/json; charset=utf-8"
            });

            df.done(function (msg) {
                if (msg && msg.result != "15249376900FD7FB") {
                    window.location.href = _uzw.domain.u + "/manage/tour-record?oid=" + msg;
                } else {
                    asyncPop();
                }
            });
        }

    });
}

/* --新版点评备份勿删
function replyPop() {
    var pct = $('#j_proCommentTab');

    pct.find('.reply-wrap').on('click', '.btn-item', function () {
        var oThis = $(this);
        var prm = oThis.siblings('.pop-reply-mod');

        if (prm.hasClass('hide')) {
            prm.removeClass('hide');
        } else {
            prm.addClass('hide');
        }
    });

    textareaLimit();//输入文字倒计
}*/

/* --新版点评备份勿删
// 点评详细图片页面
function commentGallery() {
    var cg = $('#j_commentGallery');

    if (cg.get(0)) {
        var ca = $('#j_commentAside');
        var thumb = cg.find('.thumbnails');
        var pv = cg.find('.photo-viewer');
        var pvImg = pv.find('img');
        var resizeLock = false;
        var db = document.body;

        if (_util.check.isIE6) {
            var cgw = cg.width();
            var cgh = cg.height();
            pv.width(cgw - 40);
            pv.height(cgh - 40);
        }

        pv.find('img').fitImage({ 'enlarge': false }, function() {
            $(this).fadeIn(100);
            pv.hasClass('loading') && pv.removeClass('loading');
        });
        $(window).resize(function(){ // reset image size when window resizes
            clearTimeout(resizeLock);
            resizeLock = setTimeout(function(){
                var fiData = {};
                if (_util.check.isIE6) {
                    fiData = { 'enlarge': false, 'height': db.offsetHeight - 40, 'width': db.offsetWidth - 380 };
                } else {
                    fiData = { 'enlarge': false };
                }
                pv.find('img').fitImage(fiData);
            }, 50);
        });

        // 缩略图
        thumb.on('click', 'li', function () {
            var o = $(this);
            var oImg = o.find('img');
            var opic = oImg.attr('src');
            var os = o.siblings('li');
            var iIndex = o.index();
            var ohit = oImg.attr('data-hit');
            var oid = oImg.attr('data-id');
            var liLen = thumb.find('li').length;
            var pp = cg.find('.photo-prev');
            var pn = cg.find('.photo-next');

            os.removeClass('on');
            o.addClass('on');

            pv.addClass('loading').empty().append('<img src="' + opic.replace('/h/170', '/h/700') + '" alt="">').imagesLoaded(function () {
                var oThis = $(this);
                oThis.width();
                oThis.fitImage({ 'enlarge': false, 'realHeight': oThis.height(), 'realWidth': oThis.width() }, function() {
                    $(this).fadeIn(100);
                    pv.hasClass('loading') && pv.removeClass('loading');
                });
            });

            // 处理按钮
            if (iIndex <= 0) {
                pp.addClass('hide');
                pn.hasClass('hide') && pn.removeClass('hide');
            } else if (iIndex >= liLen - 1) {
                pn.addClass('hide');
                pp.hasClass('hide') && pp.removeClass('hide');
            } else {
                pn.hasClass('hide') && pn.removeClass('hide');
                pp.hasClass('hide') && pp.removeClass('hide');
            }

            // 处理点赞值
            var obp = ca.find('.aside-toolbar').find('.btn-praise');
            if (ohit) {
                obp.find('em').text(ohit);
            }
        }).on('mouseenter', function () {
            var oThis = $(this);
            if (!oThis.hasClass('thumbnails-on')) {
                oThis.addClass('thumbnails-on');
            }
        }).on('mouseleave', function () {
            var oThis = $(this);
            oThis.removeClass('thumbnails-on');
        }).find('img').each(function () {
            var oThis = $(this);
            if (oThis.width() > 90) {
                oThis.cutImage({ 'enlarge': false });
            }
        });

        // 上下图片按钮
        cg.find('.btn-photo').on('click', function () {
            var oThis = $(this);
            var liLen = thumb.find('li').length;
            var liOn = thumb.find('li.on');
            var onIndex = liOn.index();
            var pp = cg.find('.photo-prev');
            var pn = cg.find('.photo-next');

            if (oThis.hasClass('photo-prev') && onIndex) {
                liOn.prev('li').trigger('click');
                onIndex === 1 && oThis.addClass('hide');
                pn.hasClass('hide') && pn.removeClass('hide');
            } else if (oThis.hasClass('photo-next') && onIndex < liLen - 1) {
                liOn.next('li').trigger('click');
                onIndex === liLen - 2 && oThis.addClass('hide');
                pp.hasClass('hide') && pp.removeClass('hide');
            }
        });

        likeCommentPhoto(); // 点赞
    }
}*/

/* --新版点评备份勿删
// 点评图片点赞
function likeCommentPhoto() {
    var cg = $('#j_commentGallery');
    var thumb = cg.find('.thumbnails');
    var lcpCKName = 'uzwDingPics';
    var _writeDingPic = function (picid) {
        var dingpic = _uzw.cookie.get(lcpCKName);
        if (!dingpic) {
            _uzw.cookie.set(lcpCKName, picid, 1);
        }
        else {
            dingpic = dingpic + "|" + picid;
            var dingArrN = _util.array.unique(dingpic.split('|'));
            _uzw.cookie.set(lcpCKName, dingArrN.join('|'), 1);
        }
    };
    //pic id 是否在数组中 picid 为string，非int
    var _checkDingStatus = function (picid) {
        var flag = false;
        var ck = _uzw.cookie.get(lcpCKName);
        if (ck) {
            var ckList = ck.split('|');
            var b = $.inArray(picid, ckList);
            if (b > -1) {
                flag = true;
            }
        }
        return flag;
    };

    //ajax
    $('#j_commentAside').find('.btn-praise').on('click', function () {
        var o = $(this);
        var oimg = thumb.find('.on').find('img');

        var ot = parseInt($.trim(o.find('.vm').text()), 10);
        var oid = oimg.attr('data-id');

        if (_checkDingStatus(oid)) {
            //已经点过赞
            return;
        }

        $.ajax({
            type: 'GET',
            url: 'http://sh.uzai.com/ashx/ashxCommon.ashx?type=6&imageId=' + oid,
            dataType: 'jsonp',
            success: function (data) {
                if (data) {
                    _writeDingPic(oid);//写入cookie
                    if (data.result == 'success') {
                        //点赞成功
                        o.find('em.vm').text(ot + 1);

                    } else if (data.result == 'much') {
                        //已赞
                    }

                    var nv = o.find('em.vm').text();
                    //处理当前pop窗口的data-hit值
                    oimg.attr('data-hit', nv);

                }
            }, error: function () {

            }
        });


    });
}*/

function productFocus() {
    var unitCarousel = function (wrap) {
        if (!wrap.get(0)) {
            return;
        }
        var size = wrap.find('li').length;
        if (size > 4) {
            //slide
            wrap.tinycarousel({
                axis: 'y',
                infinite: false
            });
        } else {
            wrap.find('.buttons').hide();
        }

        //change
        wrap.find('.overview').find('li').on('click', function () {
            var o = $(this);
            var opic = o.find('img').attr('data-src');
            var os = o.siblings('li');
            var oCM = wrap.prev('.carousel-main');
            os.removeClass('on');
            o.addClass('on');

            if (oCM.get(0)) {
                oCM.find('img').attr('src', opic);
            } else {
                wrap.parents('#j_sliderZyxCodeFocus').prev('.carousel-main').find('img').attr('src', opic);
            }
            return false;
        });
    };
    var unitCarouselX = function (wrap) {
        if (!wrap.get(0)) {
            return;
        }
        var size = wrap.find('li').length;
        if (size > 4) {
            //slide
            wrap.tinycarousel({
                axis: 'x',
                infinite: false
            });
        } else {
            wrap.find('.buttons').hide();
        }

        //change
        wrap.find('.overview').find('li').on('click', function () {
            var o = $(this);
            var opic = o.find('img').attr('data-src');
            var os = o.siblings('li');
            var oFP = wrap.prev('.focus-pic');
            os.removeClass('on');
            o.addClass('on');

            if (oFP.get(0)) {
                oFP.find('img').attr('src', opic);
            }
            return false;
        });
    };

    var box = $('#j_sliderCodeFocus');
    if (box.get(0)) {
        unitCarousel(box);
    }

    var zyxBox = $('#j_sliderZyxCodeFocus');
    if (zyxBox.get(0)) {
        var item = zyxBox.find('.item').eq(0);
        unitCarousel(item);

        //tab
        zyxBox.find('.hd').find('li').click('on', function () {
            var o = $(this);
            var os = o.siblings('li');
            var index = o.index();
            var items = o.parents('.hd').next('.bd').children('.item');
            var item = items.eq(index);
            var sSrc = item.find('.on').find('img').attr('data-src');
            var oImg = zyxBox.prev('.carousel-main').find('img');

            os.removeClass('on');
            o.addClass('on');

            items.hide();
            item.show();
            oImg.attr('src', sSrc);
            if (index > 0) {
                unitCarousel(item);
            }
        });
    }

    var sdbBox = $('#j_sdbCarousel');
    if (sdbBox.get(0)) {
        (function(wrap) {
            var items = wrap.find('.select-items'),
                oLi = items.find('li'),
                size = items.length,
                iWW = wrap.width();

            wrap.find('.viewport').width(iWW);
            items.width(iWW);

            if (size > 1) {
                //slide
                wrap.tinycarousel({
                    axis: 'x',
                    infinite: false
                });
            } else {
                wrap.find('.buttons').hide();
            }

            //change
            oLi.on('click', function () {
                var o = $(this);
                oLi.removeClass('on');
                o.addClass('on');
            });
        }(sdbBox));
    }

    var oCB = $('#j_carouselBar');
    if (oCB.get(0)) {
        var ow = screen.width;

        if (ow <= 1152) {
            oCB.find('.overview').find('li').css({'width': 110, 'margin-right': 12});
        }
        unitCarouselX(oCB);
    }
}

function latestOrderScroll() {
    var id = $.trim($("#pid").val());

    //最新动态 jsonp
    var obj = $('#j_orderInfoBox');

    if (!obj.get(0)) {
        return;
    }

    var objUl = obj.find('ul');

    var _scroll = function () {
        if (objUl.find('li').length) {
            var Hotnews = function () {
                var height = objUl.find('li').eq(0).outerHeight();
                objUl.animate({
                    marginTop: -height + 'px'
                }, 500, function () {
                    var ofirst = objUl.find("li:first");
                    objUl.css({
                        'margin-top': '0'
                    });
                    objUl.append(ofirst); //如果一个被选中的元素被插入到另外一个地方，这是移动而不是复制：
                });
            };
            var Utimer = setInterval(Hotnews, 4000);
            obj.hover(function () {
                if (Utimer) {
                    clearInterval(Utimer);
                    Utimer = null;
                }
            }, function () {
                Utimer = setInterval(Hotnews, 4000);
            });
        }
    };

    $.ajax({
        type: "GET",
        url: "/youlun/ashx/ashx_LvyoucnNewBooking.ashx?pid=" + id,
        dataType: "json",
        success: function (msg) {
            if (msg && msg != "]") {
                var sb = [];
                var query = msg;
                for (var i = 0; i < query.length; i++) {
                    sb.push("<li>" + query[i].phone + "&nbsp;预订" + query[i].num + "人出游(" + query[i].date + "前)</li>");
                }
                objUl.html(sb.join(''));
                _scroll();
            }
        }
    });
}

//单元slide
var unitSlide = function (obj, item, index) {

    var key = item.data('slide');
    if (key >= 0) {
        return;
    }
    var oRPL = obj;
    if (oRPL.get(0)) {

        oRPL.each(function (i) {
            var oThis = $(this);
            var iLen = oThis.find('.item').length;
            if (iLen > 1) {
                oThis.find('.slides-prev').show();
                oThis.find('.slides-next').show();

                oThis.slides({
                    preload: true,
                    preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
                    currentClass: 'on',
                    next: 'slides-next',
                    prev: 'slides-prev',
                    slideSpeed: 300,
                    slideEasing: "easeOutQuad",
                    effect: 'slide',
                    hoverPause: false,
                    pause: 1000,
                    play: 0,
                    generateNextPrev: false,
                    generatePagination: false,
                    slidesLoaded: function (idx) {
                        //处理延迟
                        var btns = oThis.find('.slides-prev,.slides-next');
                        btns.on('click', function () {
                            var oT = $(this);
                            var osc = oT.parents().find('.slides_container');
                            var imgs = osc.find('img');
                            imgs.each(function () {
                                var oImg = $(this);
                                var ooSrc = oImg.attr('data-original');
                                if (ooSrc != oImg.attr('src')) {
                                    oImg.attr('src', ooSrc);
                                }
                            });
                        });
                    }
                });
            }
        });

        imgPreview(oRPL, 'data-original');
        fixScreen();
    }

    item.data('slide', index);
};

function productSlides() {

    //产品行程
    //判断是第几屏行程
    var tab = $('#j_routeTab');
    var tabIndex = tab.children('.hd').find('.on').index();
    var tabItem = tab.children('.bd').children('.item').eq(tabIndex);
    var tagSlide = tabItem.find('.j_routePhotoList');
    unitSlide(tagSlide, tabItem, tabIndex);

    var ylSlides = $('.j_youlunPhotoList');
    unitSlide(ylSlides, ylSlides, -1);

    var oPIL = $('.j_productImageList');
    if (oPIL.get(0)) {
        oPIL.slides({
            preload: true,
            preloadImage: '//r.uzaicdn.com/content/v1/images/common/preload.gif',
            currentClass: 'on',
            next: 'slides-next',
            prev: 'slides-prev',
            slideSpeed: 300,
            slideEasing: "easeOutQuad",
            effect: 'slide',
            hoverPause: false,
            pause: 1000,
            play: 0,
            generateNextPrev: false,
            generatePagination: false,
            animationComplete: function (current) {
                //处理延迟
                oPIL.each(function () {
                    var oo = $(this);
                    var osc = oo.find('.item');
                    var imgs = osc.find('img');
                    imgs.each(function () {
                        var oo = $(this);
                        var ooSrc = oo.attr('data-original');
                        oo.attr('src', ooSrc);
                    });

                });

            }
        });
    }
    fixScreen();

}

function fixScreen() {
    var ow = screen.width,

        oRPL = $('.j_routePhotoList'),
        rplItem = oRPL.find('.slides_container').find('.item'),
        rplWidth = oRPL.eq(0).width(),

        oHPL = $('.j_hotelPhotoList'),
        hplItem = oHPL.find('.slides_container').find('.item'),
        hplWidth = oHPL.eq(0).width(),

        oYPl = $('.j_youlunPhotoList'),
        yplItem = oYPl.find('.slides_container').find('.item'),
        yplWidth = oYPl.eq(0).width(),

        oPIL = $('.j_productImageList'),
        pilItem = oPIL.find('.slides_container').find('.item');

    if (ow <= 1152) {
        rplWidth && rplItem.width(rplWidth + 4);
        hplWidth && hplItem.width(hplWidth + 4);
        pilItem.width('954px');
    } else {
        rplWidth && rplItem.width(rplWidth + 5);
        hplWidth && hplItem.width(hplWidth + 5);
        pilItem.width('1153px');
    }
    yplWidth && yplItem.width(yplWidth + 5);
}

//日历隐藏div
var yhTips = function (block, tipBox) {

    var tags = function (obj) {
        var str = [];
        if (obj.get(0)) {
            var item = obj.find('.cheap-item');
            item.each(function () {
                var oo = $(this);
                var dprice = parseInt(oo.attr('data-price'), 10);
                var max = oo.attr('data-max');
                var desc = oo.attr('data-desc');
                var tag = oo.attr('data-tag');
                var txtTrim = "";
                if (dprice) {
                    txtTrim = "<p><b class='t" + max + "'>立减￥" + dprice + "</b></p>";
                }
                str.push("<div class='clearfix item'><div class='fl mr10'><i>" + tag + "</i></div><div class='fl'>" + txtTrim + "<p>" + desc + "</p></div></div>");
            });
        }

        if (str.length) {
            return "<div class='cheap-items'>" + str.join('') + "</div>";
        }

        return "";
    };

    var price = parseInt($.trim(block.find('.price').text().replace('￥', '')), 10);
    var pricecheap = parseInt($.trim(block.find('.price-cheap').text()), 10);
    var cheaptag = block.find(".cheap-ext").html();

    var date = $.trim(block.find(".date").text());
    var eDate = $.trim(block.find(".end-date").text()); //结束日期
    var eTime = $.trim(block.find(".end-time").text()); //结束时间

    var sb = [];

    if (pricecheap) {
        sb.push("<p>优惠价<b>" + (price - pricecheap) + "</b>元 = 悠哉价<b>" + price + "</b>元 - 最大优惠价格<b>" + pricecheap + "</b>元</p>");
    }

    if (cheaptag) {
        sb.push(tags(block.find('.cheap-ext')));
    }



    if (eDate) {
        var aop = "上午";
        if (parseInt(eTime.substring(0, 2), 10) > 12) {
            aop = "下午";
        }
        var top = block.offset().top + 45;
        var left = block.offset().left;
        sb.push("<p>" + date + "出发团队</p>");
        sb.push("<p>" + eDate + aop + eTime + "截止收取签证材料</p>");
    }


    if (sb.length) {
        tipBox.html(sb.join(''));
    } else {
        $.powerFloat.hide();
    }
};

function skipToCalendar() {
    var point = $('#j_smartCalendar').offset().top;
    $('body,html').animate({
        scrollTop: point
    }, 500);
    return false;
}

//数量加减
function tmNumControl() {

    var unitNumControl = function (obj) {
        if (obj.get(0)) {
            obj.find('a').on('click', function () {
                var o = $(this);
                var t = o.siblings('input');
                var v = parseInt(t.val(), 10);
                if (o.hasClass('btn-up')) {
                    //加操作
                    if (v <= 99) {
                        t.val(v + 1);
                    }
                } else if (o.hasClass('btn-down')) {
                    //减操作
                    if (v >= 1) {
                        t.val(v - 1);
                    }
                }

                return false;
            });
        }
    };

    //特卖
    var tm = $('#j_numControl');
    unitNumControl(tm);

    //跟团, 自由行
    var gt = $('.j_gtNumControl');
    unitNumControl(gt);
}

/*smart calendar*/
function smCalendar() {

    var pid = $('#pid').val();
    if (!pid) {
        return;
    }

    var ct = new Date();
    var cty = ct.getFullYear();
    var ctm = ct.getMonth() + 1;
    var ctd = ct.getDate();

    var firstDay = $('#hidFirstDay').val() || (cty + '-' + ctm + '-' + ctd);

    //点击事件
    var rlEvent = function (l, t, date) {
        var rbox = $('#j_rlOrderBox');
        var bw = rbox.width();
        var bh = rbox.height();
        if (date) {
            rbox.css({
                "left": l,
                "top": t + 51
            }).show();

            //事件元数据绑定
            //程序员

        }

        //绑定关闭事件
        rbox.find('.close').on('click', function () {
            rbox.hide();
            return false;
        });

        //hover 显示收取材料描述


        //点击文档关闭
        blankFix('j_blankFix', 'j_rlOrderBox'); //点击其它部分隐藏
    };

    var box = $('#j_smartCalendar');

    var cfg = {

        jsonpUrl: 'http://localhost:9288/ashx/ashx_Calendar.ashx?pid=' + pid + '&type=1',
        isSmart: true,
        latestDate: firstDay,
        extCallBack: function (year, month) { //扩展方法
            //trigger
            var items = box.find('.item');
            var ablock = box.find('a.block');

            var utag = location.href.toLowerCase();
            var isGenTuan = utag.indexOf('/tour') > -1;
            var isZiYouXin = utag.indexOf('/trip/') > -1;

            if (isGenTuan) {
                //跟团游
                if (box.length) {
                    ablock.powerFloat({
                        reverseSharp: true,
                        position: "7-5",
                        target: "#j_smCalendarTipBox",
                        showCall: function (e) {
                            yhTips($(this), e);
                        }
                    });
                }
            }

            if (ablock.length) {
                items.each(function (k, v) {
                    var o = $(this);
                    var oa = o.find('a.block');
                    var d = o.attr('data-day');
                    var m = o.attr('data-month');
                    var y = o.attr('data-year');
                    var date = y + '-' + m + '-' + d;

                    if (oa.get(0)) {
                        //有线路
                        o.on('click', function () {
                            if (isGenTuan) {
                                //跟团游
                                var oo = $(this);
                                var l = oo.offset().left;
                                var t = oo.offset().top;
                                rlEvent(l, t, date);

                                //出发日期同步

                                var sd1 = $('#j_rlOrderBox').find('.j_startDate');
                                var sd2 = $('.product-intro-cont').find('.j_startDate');

                                var sdH = sd1.find("li[date=" + date + "]").html();

                                sd1.find('.selected-date').html(sdH);
                                sd2.find('.selected-date').html(sdH);

                                //存值
                                $("#hidGodate").val(date);
                            } else if (isZiYouXin) {
                                //自由行
                                //程序代码部分：
                                skipToCalendar();
                                date = y + '-' + (m.length == 1 ? ("0" + m) : m) + '-' + (d.length == 1 ? ("0" + d) : d);
                                $("#txtGoDate").val(date);
                                $("#spanGodate").text(date);
                                getContentTab_Modify(1);
                            }
                            return false;//阻止冒泡
                        });
                    }
                });
            } else {
                //box.find('.calendarBar').find('.next').click();
            }
        },
        preCallback: function (year, month) { //回调方法

        }
    };


    if (box.get(0)) {
        var _atomEvent = function () {
            box.jsonCalendar(cfg);
        };
        checkServerCDN(_atomEvent);
    }
}

//出发日期选择框
function startDate() {
    var oSD = $('.j_startDate');

    oSD.on('mouseenter', function () {
        var o = $(this);
        var tg = o.find('.date-list');
        tg.show();
    }).on('mouseleave', function () {
        var o = $(this);
        var tg = o.find('.date-list');
        tg.hide();
    });

    //trigger 两个同步
    oSD.on('click', 'li', function () {

        var o = $(this);
        var op = o.parents('#j_rlOrderBox');
        var os = o.siblings('li');
        var oa = o.html();
        var odate = o.attr('date');

        var ov = o.parent('.date-list').siblings('.selected-date');

        os.removeClass('on');
        o.addClass('on');

        ov.html(oa);
        o.parent('.date-list').hide();

        if (op.get(0)) {
            $('.product-intro-cont').find('.selected-date').html(oa);
        } else {
            $('#j_rlOrderBox').find('.selected-date').html(oa);
        }

        $("#hidGodate").val(odate);
    });
}

//展开收起内容
function contentSwitch() {
    var prdct = $('#j_products'),
        wrap = $('#J_neatenInfo'),
        oRB = $('#j_recommBox'),
        num = wrap.hasClass('freedom-neaten-info') ? 120 : 96,
        oUl = wrap.find('.info-bd-main').children('ul');

    var bdles = wrap.children().length;
    if (bdles === 2) {
        num += 150;
        wrap.find('.info-bd-main').height(num);
    }

    oUl.each(function () {
        var oThis = $(this);
        var oSwitch = oThis.parents('.info-bd').find('.switch');

        if (oThis.height() <= num) {
            oSwitch.hide();
        }
    });
    wrap.find('.switch').on('click', function () {
        var o = $(this);
        var oCont = o.parents('.info-bd').find('.info-bd-main');

        if (o.text() === '[ 收起 ]') {
            oCont.css('height', num);
            o.text('[ 更多 ]');
        } else {
            oCont.css('height', 'auto');
            o.text('[ 收起 ]');
        }
    });

    //相关目的地推荐
    var oCS = $('#j_correlateScenic');

    oCS.find('.scenic-items').each(function (i) {
        var oThis = $(this);
        var oItems = oThis.find('a');
        var len = oItems.length;
        if (len > 15) {
            oThis.next('.switch').show();
            oItems.each(function (i) {
                if (i >= 15) {
                    oItems.eq(i).hide();
                }
            });
        }
    });
    oCS.find('.switch').on('click', function () {
        var o = $(this);
        var oItems = o.prev('.scenic-items').find('a');

        if (o.text() === '[ 收起 ]') {
            oItems.each(function (i) {
                if (i >= 15) {
                    oItems.eq(i).hide();
                }
            });
            o.text('[ 更多 ]');
        } else {
            oItems.each(function (i) {
                if (i >= 15) {
                    oItems.eq(i).show();
                }
            });
            o.text('[ 收起 ]');
        }
    });

    var oHIB = prdct.find('.combo-hotel-info').find('.hotel-intro-box');
    oHIB.find('.switch').on('click', function() {
        var o = $(this);
        var oHC = o.prev('.hidden-cont');

        if (o.text() === '收起') {
            oHC.hide();
            o.text('展开更多');
        } else {
            oHC.show();
            o.text('收起');
        }
    });

    var oHII = prdct.find('.hotel-info-items'),
        oIL = oHII.find('.item-listing'),
        showLen = 14;
    oIL.each(function() {
        var oThis = $(this),
            liLen = oThis.find('li').length;
        if (liLen > 15) {
            oThis.find('li:gt(' + showLen + ')').hide();
            oThis.next('.switch-bar').show();
        }
    });
    oHII.find('.switch').on('click', function() {
        var o = $(this),
            il = o.parent().prev('.item-listing');

        if (o.text() === '收起') {
            il.find('li:gt(' + showLen + ')').hide();
            o.text('展开更多');
        } else {
            il.find('li:gt(' + showLen + ')').show();
            o.text('收起');
        }
    });

    var rContH = oRB.find('.recomm-cont').height();
    if (oRB.get(0) && rContH > 72) {
        var oArr = oRB.find('.arrow');

        oArr.show();
        oRB.find('.recomm-inner').on('mouseenter', function () {
            var o = $(this);
            o.css('height','auto');
            oArr.addClass('arrow-on');
        }).on('mouseleave', function () {
            var o = $(this);
            o.css('height', 72);
            oArr.removeClass('arrow-on');
        });
    }

    $('#j_proCommentTab').find('.comment-item').on('click', '.btn-switch', function () {
        var oThis = $(this);
        var oAM = oThis.find('.arrow-mod');
        var oCont = oThis.find('.switch-cont');
        var oSymbol = oThis.parents('.comment-cont').find('.symbol');
        var oHide = oThis.parents('.comment-cont').find('.hide');

        if (oAM.hasClass('on')) {
            oAM.removeClass('on');
            oCont.text('展开全部');
            oHide.hide();
            oSymbol.show();
        } else {
            oAM.addClass('on');
            oCont.text('收起');
            oHide.show();
            oSymbol.hide();
        }
    });

}

function selectList(obj) {
    var box = $('#' + obj);
    if (!box.get(0)) {
        box = $('.' + obj);
    }
    var oSLB = box.find('.select-list-box');
    if(oSLB.get(0)){
        oSLB.on('mouseenter', function () {
            var o = $(this);
            o.css('zIndex', 1).find('.select-list').show();
        }).on('mouseleave', function () {
            var o = $(this);
            o.css('zIndex', 'auto').find('.select-list').hide();
        });

        oSLB.on('click', 'li', function () {
            var o = $(this);
            var ot = o.text();
            var op = o.parent('.select-list');
            var onb = op.prev('.num-box');

            op.hide();
            onb.val(ot);
        });
    }
}

function imgPreview(obj, srcAttr) {
    var $container;

    if ($('#imgPreviewContainer').get(0)) {
        $container = $('#imgPreviewContainer');
    } else {
        $container = $('<div/>').attr('id', 'imgPreviewContainer').append('<img/>').hide().css('position', 'absolute').appendTo('body');
    }

    var $img = $('img', $container),
        $imgs = obj.find('img[' + srcAttr + ']');

    $imgs.on('mousemove', function (e) {
        var iX = $(window).width() - $container.width() - 50;
        var xAxis = e.pageX > iX ? iX : e.pageX + 10;
        $container.css({
            top: e.pageY + 10,
            left: xAxis,
            zIndex: 99
        });
    }).hover(function () {
        var oThis = $(this);
        $container.show();
        $img.load(function () {
            $img.show().animate({
                opacity: 1
            }, 300);
        }).attr('src', oThis.attr(srcAttr));
    }, function () {
        $container.hide();
        $img.unbind('load').attr('src', '').hide().stop().css({
            opacity: 0
        });
    });
}

// 处理点评分享内容 旧版点评 picShareFix
function picShareFix(obj) {
    var pg = obj.parent('.photo-gallery');
    var pgImgs = pg.find('img');
    var pgA = pg.siblings('p').find('a');
    var pgT = pgA.text();
    share_dianping = pgT.length > 30 ? pgT.substr(0, 30) : pgT;
    share_content = share_content.replace('{picdianping}', share_dianping);
    share_url = pgA.attr("href");
    share_pic = [];
    pgImgs.each(function () {
        var item = $(this);
        var iSrc = item.attr('src');
        share_pic.push(iSrc.replace('/h/170', '/h/500'));
    });
    share_pic = share_pic.length > 0 ? share_pic.join('||') : '';
}

/* --新版点评备份勿删
//处理点评分享内容
function picShareFix() {
    var thumb = $('#j_commentGallery').find('.thumbnails');
    var thImgs = thumb.find('img');
    var ccT = $('#j_commentAside').find('.comment-cont').text();
    share_dianping = ccT.length > 30 ? ccT.substr(0, 30) : ccT;
    share_content = share_content.replace('{picdianping}', share_dianping);
    share_url = location.href;
    share_pic = [];
    thImgs.each(function () {
        var item = $(this);
        var iSrc = item.attr('src');
        share_pic.push(iSrc.replace('/h/170', '/h/500'));
    });
    share_pic = share_pic.length > 0 ? share_pic.join('||') : '';
}*/

/* 旧版点评 picShare */
function picShare(key) {
    var title = share_title;
    var content = share_content;
    var url = share_url;
    var pic = share_pic;

    var u = "";
    if (key == 'wb') {
        //新浪微博
        u = "http://service.weibo.com/share/share.php?title=" + encodeURIComponent(content) + "&pic=" + encodeURIComponent(pic) + "&searchPic=false&url=" + encodeURIComponent(url);
    } else if (key == 'qz') {
        //QQ空间
        u = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" + encodeURIComponent(title) + "&summary=" + encodeURIComponent(content) + "&desc=" + encodeURIComponent(content) + "&site=悠哉旅行网&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic);
    } else if (key == 'qt') {
        //腾讯微博
        u = "http://share.v.t.qq.com/index.php?c=share&a=index&url=" + encodeURIComponent(url) + "&pic=" + encodeURIComponent(pic) + "&title=" + encodeURIComponent(content);
    } else if (key == 'rr') {
        //人人网
        u = "http://widget.renren.com/dialog/share?resourceUrl=" + encodeURIComponent(url) + "&images=" + encodeURIComponent(pic) + "&title=" + encodeURIComponent(title) + "&description=" + encodeURIComponent(content) + "&charset=UTF-8";
    }
    return "window.open('" + u + "', '_blank', 'scrollbars=no,width=700,height=680,left=75,top=20,status=no,resizable=no,menubar=no,toolbar=no,scrollbars=no,location=yes');";
}

/* 旧版点评 setPicFav */
function setPicFav(flag) {
    _uzw.cookie.set("uzaisharefav", 7);
}

/* --新版点评备份勿删
function picShare(key) {
    picShareFix();

    var sTitle = share_title;
    var sContent = share_content;
    var sUrl = share_url;
    var sPic = share_pic;

    _uzw.cookie.set("uzaisharefav", 7);

    var u = "";
    if (key == 'wb') {
        //新浪微博
        u = "http://service.weibo.com/share/share.php?title=" + encodeURIComponent(sContent) + "&pic=" + encodeURIComponent(sPic) + "&searchPic=false&url=" + encodeURIComponent(sUrl);
    } else if (key == 'qz') {
        //QQ空间
        u = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title=" + encodeURIComponent(sTitle) + "&summary=" + encodeURIComponent(sContent) + "&desc=" + encodeURIComponent(sContent) + "&site=悠哉旅行网&url=" + encodeURIComponent(sUrl) + "&pic=" + encodeURIComponent(sPic);
    } else if (key == 'qt') {
        //腾讯微博
        u = "http://share.v.t.qq.com/index.php?c=share&a=index&url=" + encodeURIComponent(sUrl) + "&pic=" + encodeURIComponent(sPic) + "&title=" + encodeURIComponent(sContent);
    } else if (key == 'rr') {
        //人人网
        u = "http://widget.renren.com/dialog/share?resourceUrl=" + encodeURIComponent(sUrl) + "&images=" + encodeURIComponent(sPic) + "&title=" + encodeURIComponent(sTitle) + "&description=" + encodeURIComponent(sContent) + "&charset=UTF-8";
    }
    return "window.open('" + u + "', '_blank', 'scrollbars=no,width=700,height=680,left=75,top=20,status=no,resizable=no,menubar=no,toolbar=no,scrollbars=no,location=yes');";
}*/

/* 新旧版点评通用 _lm */
var _lm = {
    divName: "j_messageBox", //外层容器的class
    textareaName: "j_txtArea", //textarea的class
    numName: "j_limitNum", //数字的class
    num: 500, //数字的最大数目
    checkChinese: true //检查中文
};

/* 新旧版点评通用 textareaLimit */
var textareaLimit = function () {
    //定义变量

    var $onthis; //指向当前
    var $divname = _lm.divName; //外层容器的class
    var $textareaName = _lm.textareaName; //textarea的class
    var $numName = _lm.numName; //数字的class
    var $num = _lm.num; //数字的最大数目
    var $ckChinese = _lm.checkChinese;
    var $b, $par;

    function isChinese(str) {  //判断是不是中文
        var reCh = /[u00-uff]/;
        return !reCh.test(str);
    }
    function numChange() {
        var strlen = 0; //初始定义长度为0
        var txtval = $.trim($onthis.val());
        if (txtval) {
            for (var i = 0; i < txtval.length; i++) {
                if (isChinese(txtval.charAt(i)) === true) {
                    if ($ckChinese) {
                        strlen = strlen + 2; //中文为2个字符
                    }
                    else {
                        strlen = strlen + 1;
                    }
                } else {
                    strlen = strlen + 1; //英文一个字符
                }
            }
            strlen = Math.ceil(strlen / 2); //中英文相加除2取整数
            if ($num - strlen < 0) {
                $par.html("<b style='color:red;' class=" + $numName + ">" + Math.abs($num - strlen) + "</b>" + "/" + $num); //超出的样式
            }
            else {
                $par.html("<b class=" + $numName + ">" + (strlen) + "</b>" + "/" + $num); //正常时候
            }
            $b.html($num - strlen);
        }
    }
    $("." + $textareaName).on("keyup", function () {
        $b = $("." + $divname).find("." + $numName).find('b'); //获取当前的数字
        $par = $b.parent();
        $onthis = $(this); //获取当前的textarea
        var setNum = setInterval(numChange, 500);
    });
};

function clickJump() {
    $('#aBooking').on('click', function () {
        skipPoint('j_bookingInfo');
    });
}

// 点评回调事件 新旧版点评通用 dianPingCB
function dianPingCB() {
    _uzw.user.refresh();
    if (_uzw.user.userid) {
        $('#j_popCommentControl').find('.tips-info').html(_uzw.user.userName);
    }
}

//uzai product
var _up = {
    collect: {
        check: function () {
            var pid = $('#pid').val();
            var ck = _uzw.cookie.get('uzwRouteFav');
            if (ck) {
                var ckArr = ck.split('|');
                var b = $.inArray(pid, ckArr);
                if (b > -1) {
                    $("#addFav").hide();
                    $("#haveFav").show();
                } else {
                    if (_uzw.user.userid) {
                        $.ajax({
                            type: "GET",
                            url: "http://sh.uzai.com/ashx/ashx_Favourite.ashx?type=1&pid=" + pid,
                            dataType: 'jsonp',
                            success: function (msg) {
                                if (msg && msg == "1") {   //已收藏
                                    $("#addFav").hide();
                                    $("#haveFav").show();
                                    ckArr.push(pid);
                                    _uzw.cookie.set('uzwRouteFav', ckArr.join('|'));
                                }
                            },
                            error: function () {
                                //alert();
                            }
                        });
                    }
                }
            }
        },
        add: function () {
            var pid = $('#pid').val();
            _uzw.user.refresh();
            var code = $("#pcode").val();
            var pName = $("h1.product-hd").text();
            var cid = $("#tClass").val();
            var uzaiprice = $(".J_uzaiprice").find("em").text();
            var ck = _uzw.cookie.get('uzwRouteFav');

            //国双统计代码【收藏线路】
            if (typeof _gsq == 'object') {
                _gsq.push(["T", "GWD-002793", "trackEvent", window.location, "收藏路线", pName]);
            }

            $.ajax({
                type: "GET",
                url: "http://sh.uzai.com/ashx/ashx_Favourite.ashx?type=2&pid=" + pid + '&pCode=' + code + '&price=' + uzaiprice + '&tid=' + cid + '&pName=' + escape(pName),
                dataType: 'jsonp',
                success: function (msg) {
                    if (msg && (parseInt(msg.result, 10) > 0 || parseInt(msg.result, 10) == -1)) {
                        //收藏成功 || 已收藏
                        productInterest(2); //猜你喜欢收集我的收藏数据
                        $("#addFav").hide();
                        $("#haveFav").show();
                        if (ck) {
                            var ckArr = ck.split('|');
                            ckArr.push(pid);
                            _uzw.cookie.set('uzwRouteFav', ckArr.join('|'));

                        } else {
                            _uzw.cookie.set('uzwRouteFav', pid);
                        }

                    }
                    else {
                        alert("对不起，收藏失败，请重新收藏！");
                    }
                },
                error: function () {
                    alert("对不起，收藏失败，请重新收藏！");
                }
            });
        },
        cancle: function () {
            _uzw.user.refresh();
            var pid = $('#pid').val();
            var ck = _uzw.cookie.get('uzwRouteFav');

            $.ajax({
                type: "GET",
                url: "http://sh.uzai.com/ashx/ashx_Favourite.ashx?type=3&pid=" + pid,
                dataType: 'jsonp',
                success: function (msg) {
                    if (msg && (parseInt(msg.result, 10) > 0 || parseInt(msg.result, 10) == -1)) {   //取消收藏成功
                        $("#addFav").show();
                        $("#haveFav").hide();

                        if (ck) {
                            var ckArr = ck.split('|');
                            var b = $.inArray(pid, ckArr);
                            if (b > -1) {
                                ckArr.splice(b, 1); //删除取消值
                                _uzw.cookie.set('uzwRouteFav', ckArr.join('|'));
                            }
                        }
                    }
                    else {
                        alert("取消收藏失败，请重试！");
                    }
                }
            });
        }
    }
};

//猜你喜欢收集
function productInterest(type) {
    if (_uzw.user.userid) {
        var paras = {
            "userId": _uzw.user.userid,//用户ID
            "city": 0,//发起请求的城市站点，为0时取产品的出发城市
            "channel": 1,//信息渠道：1 PC、2 IPhone、3 Ipad、4 Android、5 M站
            "type": type, //来源类型：1浏览历史、2我的收藏、3我的咨询、4意向订单、5支付订单
            "productIds": $("#pid").val()//productIds：相关产品ID，多个产品ID可以用","分隔
        };
        $.ajax({
            type: 'post',
            url: _uzw.domain.wapi + "/api/UzaiInterest/InsertUserInterest",
            data: paras,
            dataType: 'jsonp',
            success: function (msg) { },
            error: function () { }
        });
    }
}

function productShouCang() {

    //检测收藏
    _up.collect.check();

    //添加收藏
    $('#addFav').click(function () {
        if (!_uzw.user.userid) {
            _uzw.iframe.pop(_uzw.domain.u + "/QuickLoginV1?actionName=_up.collect.add");
        }
        else {
            _up.collect.add();
        }
    });

    //取消
    $('#haveFav').click(function () {
        if (!_uzw.user.userid) {
            _uzw.iframe.pop(_uzw.domain.u + "/QuickLoginV1?actionName=_up.collect.cancle");
        }
        else {
            _up.collect.cancle();
        }
    });

    $('#haveFav').on('mouseenter', function () {
        var o = $(this);
        o.find('span').text('取消收藏');
    }).on('mouseleave', function () {
        var o = $(this);
        o.find('span').text('已收藏');
    });
}

function productFeedBack() {
    var phone = $.trim($('#phone').val()); //手机
    var content = $.trim($('#askCont').val()); //留言内容
    var email = $.trim($('#email').val()); //邮箱
    var pName = $("h1.product-hd").text(); //产品名称
    var pcode = $("#pcode").val(); //产品code
    var url = document.location.hostname + document.location.pathname; //产品URL
    var pid = $("#pid").val(); //产品Id

    //检验留言
    var checkMsgValidate = function () {
        $(".errorInfo").text("");
        var ck = $('#mailInform');
        var o1 = $.trim($('#phone').val()); //手机
        var o2 = $.trim($('#askCont').val()); //留言内容
        var o3 = $.trim($('#email').val()); //邮箱
        var regexMobile = _uzw.regex.mobile; //手机
        var regexEmail = _uzw.regex.email; //邮箱

        if (o1.length < 1) {
            $(".errorInfo").text("(*)请输入手机号");
            return false;
        }

        var isValidateMobile = new RegExp(regexMobile).test(o1);
        if (!isValidateMobile) {
            $(".errorInfo").text("(*)请输入正确的手机号");
            return false;
        }

        if (o2.length < 1) {
            $(".errorInfo").text("(*)请输入留言内容");
            return false;
        } else if (o2.length > 500) {
            $(".errorInfo").html("(*)最多输入500个字");
            return false;
        }

        //留言输入字数限制
        var isValidateEmail = new RegExp(regexEmail).test(o3);

        if (ck.prop("checked")) {
            if (o3.length < 1) {
                $(".errorInfo").text("(*)请输入您的邮箱");
                return false;
            }
            else if (!isValidateEmail) {
                $(".errorInfo").text("(*)请输入正确的邮箱");
                return false;
            }
        }

        return true;
    };

    if (checkMsgValidate()) {
        $("#submitMsg").attr("disabled", "disabled"); //不可点击

        $.ajax({
            type: 'GET',
            url: "http://sh.uzai.com/ashx/ashxCommon.ashx?type=8&phone=" + phone + '&content=' + encodeURI(content) + '&pname=' + encodeURI(pName) + '&email=' + email + '&pcode=' + pcode + '&url=' + url + '&pid=' + pid,
            dataType: 'jsonp',
            success: function (data) {
                if (data) {
                    var msg = eval(data);
                    if (msg.result == "success") {
                        productInterest(3);//猜你喜欢收集咨询产品数据
                        alert("您的留言已提交成功，悠哉客服将尽快帮您解答！");
                        //关闭弹窗口
                        $('#j_askPopMod').remove();
                    }
                    else if (msg.result == "much") {
                        alert("您的留言过于频繁，请稍后再试");
                    }
                    else {
                        alert("留言失败，请重试！");
                    }
                }
                else {
                    alert("留言失败，请重试！");
                }
                $("#submitMsg").removeAttr("disabled");
            },
            error: function () {
                alert("留言失败，请重试！");
                $("#submitMsg").removeAttr("disabled");
            }
        });

    }


}

function isEmptyObject(obj) {
    for (var n in obj) {
        if (obj.get(0)) {
            return false;
        }
    }
    return true;
}

//图片已加载
$.fn.imagesLoaded = function(callback) {
    var elems = this.find('img'),
        len = elems.length;
    elems.bind('load', function() {
        if (--len <= 0) {
            callback.call(elems, this);
        }
    }).each(function() {
        // cached images don't fire load sometimes, so we reset src.
        if (this.complete || this.complete === undefined) {
            var src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            this.src = src;
        }
    });

    return this;
};

function productUB() {
    var oub = $('#J_popDisong');

    if (!_uzw.user.userid) {
        return;
    }
    if (oub.get(0)) {

        oub.find('.pLogin').hide();
        var p = oub.find('.pReg');
        var uop = $('#j_newHeader').find(".userOrderPart2");

        p.html("<span><b>" + _uzw.user.userName + "</b>，您现在剩余可用U币数为：<b>" + uop.attr('data-userUB') || 0 + "</b></span>");
        p.show();

    }
}

function hotelComboOrder(){
    var oCS = $('#j_cobSide'),
        oMCB = oCS.find('.mobile-code-box');

    oCS.on('mouseleave', function() {
        oMCB.hide();
    }).find('.mobile-order-box').on('mouseenter', function() {
        oMCB.show();
    });
}

// 站点内部统计
function productLoadTJ() {
    var hash = location.hash;
    var vh = _util.string.replaceAll(hash, '#', '');
    _uzw.cookie.set('uzwSiteInnerTJ', vh || '');
}

function countdown() {
    var df = _util.apis.getServerDate();
    var nowTime = 0;

    // 获取服务器日期
    df.done(function (tm) {
        tm = tm.replace(/-/g, '/');
        nowTime = parseInt(Date.parse(tm), 10);

        (function() {
            var oCB = $('#j_countdownBar');
            var time = nowTime;
            if (oCB.get(0)) {
                var oState = $('#startState');
                var oTian = oCB.find('.num-day');
                var oShi = oCB.find('.num-hour');
                var oFen = oCB.find('.num-minute');
                var oMiao = oCB.find('.num-second');
                var endTime = parseInt(Date.parse(oCB.attr('data-endTime')), 10);
                var startTime = parseInt(Date.parse(oCB.attr('data-startTime')), 10);
                var _unitCountdown = function () {
                    var iValue = endTime - time;
                    var iValue1 = startTime - time;
                    var timeout = setTimeout(_unitCountdown, 1000);
                    var _unitCD = function (cha) { //单元处理
                        var seconds = cha / 1000;
                        var minutes = Math.floor(seconds / 60);
                        var hours = Math.floor(minutes / 60);
                        var days = Math.floor(hours / 24);

                        oTian.text(days);
                        oShi.text(hours % 24);
                        oFen.text(minutes % 60);
                        oMiao.text(Math.floor(seconds % 60));
                    };

                    time += 1000;

                    if (iValue1 > 0 && iValue > 0) {
                        _unitCD(iValue1);
                        oState.text('开始');
                    } else if (iValue1 === 0) {
                        oState.text('结束');
                        var hv = $('#hidGodate').val();
                        $('.order-box').find('.j_startDate').find('.date-list').find("li[date='" + hv + "']").click();
                    } else if (iValue1 < 0 && iValue > 0) {
                        _unitCD(iValue);
                        oState.text('结束');
                    } else if (iValue1 < 0 && iValue === 0) {
                        clearTimeout(timeout);
                        window.location.reload();
                    }
                };

                _unitCountdown();
            }
        })();

        (function() {
            var wrap = $('.pro-seckill');
            var timers = wrap.find('.timer');
            var introBox = $('.intro-top-box');
            var bOrder = $('.product-main-box').find('.btn-order');  
            var time = nowTime;
            if (timers.get(0)) {
                var _unitCountdown = function (o) {
                    var oTian = o.find('.tian');
                    var oShi = o.find('.shi');
                    var oFen = o.find('.fen');
                    var oMiao = o.find('.miao');
                    // var secPrev = $('.sec-prev');
                    // var secIng = $('.sec-ing');
                    // var secOver = $('.sec-over');

                    var endTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-endtime'), '-', '/')), 10);
                    var startTime = parseInt(Date.parse(_util.string.replaceAll(o.attr('data-starttime'), '-', '/')), 10);
                    var valueE = endTime - time;
                    var valueS = startTime - time;
                    var _unitCD = function (cha) { //单元处理
                        var seconds = cha / 1000;
                        var minutes = Math.floor(seconds / 60);
                        var hours = Math.floor(minutes / 60);
                        var days = Math.floor(hours / 24);

                        oTian.text(days);
                        oShi.text(hours % 24);
                        oFen.text(minutes % 60);
                        oMiao.text(Math.floor(seconds % 60));
                    };

                    time += 1000;

                    if (valueS > 0 && valueE > 0) {
                        _unitCD(valueS);
                        introBox.find('.btn-order').text('补充出游人信息');
                            bOrder.on('click',function(){
                                if (!_uzw.user.userid) {
                                    location.href = _uzw.domain.u + "/reguser?reUrl=" + location.href;
                                }else{
                                    location.href = _uzw.domain.u + "/manage/tourist-manage";
                                }
                            });

                    } else if (valueS <= 0 && valueE > 0) {
                        _unitCD(valueE);
                        introBox.addClass('sec-ing').removeClass('sec-prev');
                        introBox.find('.btn-order').text('立即预订');
                        introBox.find('.clock').find('p').text('距离结束时间：');
                        // $.ajax({
                        //     url: "",
                        //     data: {},
                        //     dataType: "jsonp",
                        //     success: function(res) {
                        //         if (res) {
                        //             if (res.code === 1) {
                        //                 // 有库存
                        //                 introBox.addClass('sec-ing').removeClass('sec-prev');
                        //                 introBox.find('.btn-order').text('立即预订');
                        //                 introBox.find('.clock').find('p').text('距离结束时间');
                        //             } else {
                        //                 // 已售罄
                        //                 introBox.addClass('sec-over').removeClass('sec-ing');
                        //                 bOrder.text('秒杀已结束').removeAttr('onclick');
                        //                 clearTimeout(si);
                        //             }
                        //         }
                        //     },
                        //     error: function(res) {}
                        // });
                    } else if (valueS < 0 && valueE <= 0) {
                        valueE === 0 && _unitCD(valueE);
                        introBox.addClass('sec-over').removeClass('sec-ing sec-prev');
                        // alert(bOrder);
                        bOrder.text('秒杀已结束').removeAttr('onclick');
                        // alert('2222');
                        clearTimeout(si);
                    }

                };

                var si = setInterval(function () {
                    _unitCountdown(timers);
                }, 1000);
            }
        })();
    });
}



//更新产品浏览记录
function updateRouteHistory(obj) {
    $.ajax({
        url: '//aj.uzai.com/api/UzaiScanRecords/AddRecord',
        type: 'GET',
        dataType: 'jsonp',
        data: obj
    });
}

function activityBX() {
    var uztype = _util.url.get('uztype');
    if (uztype === 'manager') {
        return;
    }

    var aside = $('#j_commentAside');
    if (_ug.city != 'sh' || aside.get(0)) { // 非上海站或为产品点评详情页面
        return;
    }
    var uid = 0;
    _uzw.user.userid && (uid = _uzw.user.userid);



    $.ajax({
        type: 'GET',
        url: '//wapi.uzai.com/api/uzaibox/showKey',
        data: { 'userId': uid },
        dataType: 'jsonp',
        success: function (data) {
            if (data) {
                var sb = '';
                var bxUrl = '//www.uzai.com/subject/mlbx'; // 宝箱页面链接
                sb += '<div id="j_popKeyA" class="pop-key-a bx-pop yahei hide">';
                sb += '<div class="pop-cont tc">';
                sb += '<a href="' + bxUrl + '" class="btn-item"></a>';
                sb += '</div>';
                sb += '<span class="pop-close j_popClose"></span>';
                sb += '</div>';
                sb += '<div id="j_popKeyB" class="pop-key-b bx-pop yahei hide">';
                sb += '<span class="pop-close j_popClose"></span>';
                sb += '</div>';
                sb += '<div id="j_popTipsFailure" class="pop-tips-failure ui-pop yahei hide">';
                sb += '<div class="pop-bd red f18 tc">获取失败！</div>';
                sb += '<span class="pop-close pointer lh1 j_popClose"><i class="close-icon">&times;</i></span>';
                sb += '</div>';
                sb += '<div id="j_fixedKey" class="fixed-key"></div>';

                $('body').append(sb);

                var fk = $('#j_fixedKey');
                var url = '//r.uzaicdn.com/content/subject/womenll151123/pc/images/k1.png';
                var rd = Math.floor(Math.random() * 6 + 1);

                if (rd >= 1 && rd <= 6) {
                    url = url.replace('/k1.', '/k' + rd + '.');
                }

                fk.css({ 'background-image': 'url(' + url + ')' }).on('click', function () {
                    if (_uzw.user.userid) {
                        refreshUserBX();
                    } else {
                        _uzw.iframe.pop(_uzw.domain.u + '/QuickLoginV1?actionName=refreshUserBX', 640, 280); // 快速登录
                    }
                });

                //IE6下的定位
                if (_util.check.isIE6) {
                    var ih = $(window).height() - fk.height() - 230;
                    fk.css('top', $(document).scrollTop() + ih);
                    $(window).on('scroll', function () {
                        fk.css('top', $(document).scrollTop() + ih);
                    });
                }
            }
        }
    });
}

// 行程详情导航修复
function routeDetailFix() {
    var items = $('#j_routeDetail').children('.item');
    if (items.get(0)) {
        items.each(function () {
            var oThis = $(this);
            var iconLeft = oThis.find('.route-tag-nav').find('.nav-item').eq(0).find('.icon-left');
            iconLeft.get(0) && iconLeft.attr('class', 'left-part vm');
        });
    }
}

// 商户信息收集
function shopVisit() {
    var sPid = $("#pid").val();
    $.ajax({
        type: "get",
        url: "http://aj.uzai.com/producthost.ashx?pid=" + sPid,
        cache: true,
        dataType: "jsonp",
        success: function (msg) {
        }
    });
}