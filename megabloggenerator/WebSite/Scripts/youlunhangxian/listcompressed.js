/*! uzai - v0.1.11 - 2016 */
"use strict";function initPage(){$("#j_listSortBar").find("input").prop("checked",!1)}function slideBarFilter(){var a=$("#j_sideSizer");a.children(".list-item").on("mouseenter",function(){var a=$(this),b=a.children(".item-cont"),c=a.children(".sub-pop"),d=$.trim(b.find(".item-bd").text()),e=a.find(".arrow-mod");e.find(".i-arrow").hide(),d?e.find("i[class^=i-close]").removeAttr("class").addClass("i-close-white").show():e.find("i[class^=i-close]").hide(),c.show()}).on("mouseleave",function(){var a=$(this),b=a.children(".item-cont"),c=a.children(".sub-pop"),d=$.trim(b.find(".item-bd").text()),e=a.find(".arrow-mod");d?(e.find(".i-arrow").hide(),e.find("i[class^=i-close]").removeAttr("class").addClass("i-close-black").show()):(e.find(".i-arrow").show(),e.find("i[class^=i-close]").hide()),c.hide()}),a.find(".arrow-mod").find("i[class^=i-close]").on("click",function(){isUrlJump=!0;var b=$(this),c=b.parent(".arrow-mod").prev(".item-bd");-1!=c.attr("data-v").lastIndexOf("data-brand")&&$(".yl-intro-bar ").css("display","none"),c.text(""),c.removeAttr("data-v"),b.hide(),a.children(".list-item").unbind("mouseenter").unbind("mouseleave"),pageSelectionChange()});var b=a.find(".sub-pop").find(".sizer-item");b.on("click",function(){isUrlJump=!0;var b=$(this);if(!b.hasClass("sizer-off")){var c=(b.attr("data-v"),b.parents(".sub-pop")),d=c.siblings(".item-cont").find(".item-bd");b.html().length>10?d.text(b.html().substring(b.html().length-10,b.html().length)):d.text(b.html()),d.attr("data-v",b.attr("data-v")),c.hide(),a.children(".list-item").unbind("mouseenter").unbind("mouseleave"),pageSelectionChange()}})}function chooseSorter(){var a=$("#j_listSortBar");a.find(".menu-wrap").on("click",function(){var b=$(this),c=b.siblings(".menu-wrap"),d=b.find(".sub-menu");d.get(0)||(a.find(".menu-wrap[data-tag=price]").find(".menu-hd").find("em").text("价格"),a.find(".menu-wrap[data-tag=date]").find(".menu-hd").find("em").text("出发日期"),a.find(".list-item").removeClass("list-item-on"),a.find(".icon-item").removeClass("icon-asc").removeClass("icon-desc").addClass("icon-desc"),c.removeClass("on"),b.addClass("on"),$("#j_sortList_loader").get(0)&&window.alert("请稍等"),pageSelectionChange())}),a.find(".menu-wrap").on("mouseenter",function(){var a=$(this),b=a.find(".sub-menu");b.show(),b.get(0)&&a.addClass("menu-wrap-on")}).on("mouseleave",function(){var a=$(this);a.removeClass("menu-wrap-on").find(".sub-menu").hide()}),a.find(".sub-menu").find(".list-item").on("click",function(){var b=$(this),c=b.parents(".sub-menu"),d=b.parents(".menu-wrap"),e=d.siblings(".menu-wrap"),f=d.attr("data-tag");if(c.hide(),e.removeClass("on"),"price"===f||"date"===f){a.find(".list-item").removeClass("list-item-on"),a.find(".icon-item").removeClass("icon-asc").removeClass("icon-desc");var g=b.index(),h=d.find(".icon-item");h.addClass("icon-"+(0===g?"desc":"asc")),d.addClass("on"),"price"===f?a.find(".menu-wrap[data-tag=date]").find(".menu-hd").find("em").text("出发日期"):"date"===f&&a.find(".menu-wrap[data-tag=price]").find(".menu-hd").find("em").text("价格"),d.find(".menu-hd").find("em").text(b.text()),b.addClass("list-item-on")}else if("coupon"===f){var i=c.find("input:checked"),j=[];i.each(function(a,b){var c=$(this);j.push($.trim(c.parent().text()))}),d.find(".sale-bar").find("s").text(j.length?j.join("，"):"选择优惠")}$("#j_sortList_loader").get(0),pageSelectionChange()})}function getFilteredParams(){var a=[],b=$("#j_sideSizer").find("span.item-bd[data-v]");b.each(function(b,c){var d=$(this);d.attr("data-v")&&a.push(d.attr("data-v"))});var c=$("#j_listSortBar").find("input:checked");return c.each(function(b,c){var d=$(this),e=d.parents(".list-item");e.attr("data-v")&&a.push(e.attr("data-v"))}),a.join(",")}function unitFilter(){var a=($("#j_sideSizer"),$("#j_listSortBar")),b=getFilteredParams(),c=a.children(".bar-main").children(".on"),d=c.find(".sub-menu"),e=c.attr("rel"),f="asc";d.get(0)&&c.find(".icon-desc").get(0)&&(f="desc"),isUrlJump||initSorter(b,e,f)}function initSorter(a,b,c){var d=$("#j_sortList");if(("data-index"==b||"data-hot"==b)&&(c="desc"),console.log(a,"~",b,"~",c),$("#j_sortList_null").remove(),d.get(0)){if(_util.check.isIE6)return;d.uzSorter({sortBy:a||"",sortAscTag:b||"",sortAscKey:c||"asc",targetNull:"<div class='box-fix'><div class='fruitless-box tc'><i class='icon-item mr10 vm icon-common-bulky png'></i><span class='fb-cont f16 tl vm'><p>未找到<em class='blue f18 b'>XXX</em>相关的邮轮产品，您可以尝试其他关键字搜索</p><p>您也可以在<b class='red f18'>9：00~21：00</b>拨打<b class='red f18'>1010-9898</b>联系客服，我们将竭诚为您服务。</p></span></div></div>",tragetAjaxText:"",onInit:function(){},onCallback:function(){listPager()}})}}function listPager(){var a=$(".fn-pager");a.get(0)&&a.each(function(){var a=$(this),b=parseInt(a.attr("data-pagesize"),10),c=parseInt(a.attr("data-counts"),10);c%b===0?c/b:Math.floor(c/b)+1;a.uzPager({pageSize:b,pageItems:c,targetNode:a.siblings(".pager-target-node"),onInit:function(b){var c=$("#j_paging"),d=c.find(".btn-prev"),e=c.find(".btn-next");c.find(".paging-cont").html("<span class='paging-cont vm'><i class='red'>1</i>/"+b+"页</span>"),d.on("click",function(){var b=$(this);b.hasClass("off")||a.find(".prev").trigger("click")}),e.on("click",function(){var b=$(this);b.hasClass("off")||a.find(".next").trigger("click")})},onCallback:function(a,b){skipToPoint();var c=$("#j_paging"),d=c.find(".btn-prev"),e=c.find(".btn-next");c.find(".paging-cont").html("<span class='paging-cont vm'><i class='red'>"+a+"</i>/"+b+"页</span>"),1===parseInt(a,10)?(d.addClass("off"),e.removeClass("off")):parseInt(a,10)===parseInt(b,10)?(e.addClass("off"),d.removeClass("off")):(d.removeClass("off"),e.removeClass("off"))}})}),resetFilterItems()}function skipToPoint(){var a=$("#j_youlunList");a.get(0)&&$("body,html").animate({scrollTop:a.offset().top},800)}function scrollFloat(){var a=$(window),b=$("#j_sideBar"),c=b.outerHeight(!0),d=$("#j_sideSizer");a.on("scroll",function(){var e=a.scrollTop(),f=b.offset().top,g=$("#j_sortList").siblings(".fn-pager").offset().top;e>f&&g-c>e?d.addClass("side-sizer-on").css({position:"fixed",top:0}):e>=g-c?d.css({position:"absolute",top:g-c}):d.removeClass("side-sizer-on").css({position:"static"})}),a.trigger("scroll")}function generateUrl(){var a=(window.location.href,window.location.href.split("youlun/")[0]),b=getFilteredParams(),c=b.split(","),d="youlun/",e="r",f="c",g="cc",h="cr",i="dd",j="x";for(var k in c){if(-1!=c[k].lastIndexOf("data-route")){var l=c[k].split("_")[1];e="r"+l}if(-1!=c[k].lastIndexOf("data-port")){var m=c[k].split("_")[1];f="c"+m}if(-1!=c[k].lastIndexOf("data-company")){var n=c[k].split("_")[1];g="cc"+n}if(-1!=c[k].lastIndexOf("data-brand")){var o=c[k].split("_")[1];g="cc"+getCompanyCodeByShip(o),h="cr"+o}if(-1!=c[k].lastIndexOf("data-date")){var p=c[k].split("_")[1];i="dd"+p}if(-1!=c[k].lastIndexOf("data-day")){var q=c[k].split("_")[1];"3"==q&&(q="35"),"6"==q&&(q="68"),"9"==q&&(q="912"),"13"==q&&(q="1315"),"16"==q&&(q="1618"),"19"==q&&(q="19"),j="x"+q}}var r="00",s="0",t="00",u=$("#j_listSortBar"),v=u.children(".bar-main").children(".on"),w=v.find(".sub-menu"),x=v.attr("rel"),y="asc";w.get(0)&&v.find(".icon-desc").get(0)&&(y="desc");var z=x+y;return"data-pricedesc"==z?r="o0":"data-priceasc"==z?r="o1":"data-hotasc"==z?s="a":"data-date-scaledesc"==z?t="o5":"data-date-scaleasc"==z&&(t="d1"),d+=e+"-"+f+"-"+g+"-"+h+"-"+i+"-"+j+"-"+r+"-"+s+"-"+t,a+d+".html"}function getCompanyCodeByShip(a){var b=$(".youlun-list #j_sideSizer .list-item-3 .sizer-items .si-item .sizer-item[data-v='data-brand=_"+a+"']").parent().prev().find("span").attr("data-v");return b.split("_")[1]}function changeUrl(a){window.location.href=a}function pageSelectionChange(){changeUrl(generateUrl())}function resetFilterItems(){var a=[];$("#j_sideSizer .sizer-item").each(function(b,c){$(this).attr("data-v")&&a.push($(this).attr("data-v"))});var b=$("#j_sortList .line-list .list-item").length,c=[];$("#j_sortList .line-list .list-item").each(function(){var b=$(this);for(var d in a){var e=a[d].split("=")[0],f=a[d].split("=")[1];b.attr(e)==f&&-1==$.inArray(a[d],c)&&c.push(a[d])}}),$(".nosizer-item").each(function(){12===$(this).parent().next().find(".sizer-item.sizer-off").length&&$(this).css("display","none")});for(var d in a){var e=!1;for(var f in c)a[d]==c[f]&&(e=!0);e||0===b||$("#j_sideSizer  .sizer-item[data-v='"+a[d]+"']").css("display","none")}slideBarFilter()}function dispShip(){var a=$("#j_sideSizer .list-item-3 .item-bd.fr").text();$(".yl-intro-bar").css("display","none"),$("#intro-bar-"+a).css("display","block")}function dispList(){var a=$("#j_listSortBar").children(".bar-main").children(".on");("price"==a.attr("data-tag")||"date"==a.attr("data-tag"))&&a.find(".menu-hd .mr5.vm").text(a.find(".list-item-on").text()),$("#j_listSortBar").css("display",""),$("#j_sortList").css("display","")}var isUrlJump=!1;$(function(){isUrlJump||(initPage(),uzLazy(["line-list"]),unitFilter(),chooseSorter(),scrollFloat(),dispShip(),dispList())});