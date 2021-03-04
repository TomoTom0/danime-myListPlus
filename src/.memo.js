await Promise.all([a].map(async listId=>await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + `?shareListId=${listId}`)
    .then(d => d.json())
    .then(d => d.data.workList.map(work=>work.workId))))

a="47q7GzYJzMQsT2cy"
b=await Promise.all([a].map(async (listId, ind)=>Object({[ind]:await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + `?shareListId=${listId}`)
        .then(d => d.json())
        .then(d => d.data.workList.map(work=>work.workId))})))
    .then(d=>Object.assign(...d))

lists=[{count: 50,
shareListId: "47q7GzYJzMQsT2cy",
shareListName: "good__bbb51e"}]

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getFavorite)
.then(d => d.json())

ul=$(".pageWrapper ul.onlyPcLayout");
pageLength=$("li:last", ul).text().match(/\d+/);
urlTmp=location.href.replace(/(?<=\?.*)selectPage=\d+/, "")
urlBase= urlTmp+ (/[\?&]$/.test(urlTmp) ? "" : "?") + "selectPage=";

content=await fetch(urlBase+"4").then(d=>d.body)
.then(d=>d.getReader())
.then(reader=>reader.read())
.then(res=>new TextDecoder("utf-8").decode(res.value))

a=$("div.itemWrapper", content)

itemHTMLs=await Promise.all([...Array(pageLength-1).keys()].map(d=>d+2).map(async pageNum=>{
    const content=await fetch(`${urlBase}${pageNum}`).then(d=>d.body)
        .then(d=>d.getReader())
        .then(reader=>reader.read())
        .then(res=>new TextDecoder("utf-8").decode(res.value));
    return $("div.itemWrapper.clearfix", content).html();
}))
$(".pageWrapper div.itemWrapper.clearfix").append(itemHTMLs.join("\n"))

const _restPost = async function (url, json) {
    const headers = {
        "Content-Type": "application/json",
        timeout: window.COMMON.API_WEB_TIMEOUT
    };
    const opts = { method: "post", body: JSON.stringify(json), cache: "no-cache", headers: headers };
    return await fetch(url, opts)
        .then(resIn => {
            return (resIn.ok) ? resIn.json() : {}
        }) //dataがnullの場合の回避
        .then(res => {
            if (res.resultCd === "00" || res.resultCd === "01") {
                return res.data;
            } else {
                return {error:((res.error) ? res.error.code : "unknown")};
            }
        }).catch(errorMessage => {
            console.log(errorMessage);
        });
};




res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList=24439_24410").then(d=>d.json())

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=11").then(d=>d.json())


workIdLists=[...Array(1401).keys()].map(d=>d+20000).join("_")
res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList="+workIdLists).then(d=>d.json()).then(d=>d.data.statusList)
res2=res.filter(d=>d.favoriteStatus=="1")


res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList=24439").then(d=>d.json()).then(d=>d.data.statusList)

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus).then(d=>d.json()).then(d=>d.data)
res=await fetch("/animestore/CN/CN00000001").then(d=>d.json()).then(d=>d.data)

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus).then(d=>d.json())
res=await fetch("https://anime.dmkt-sp.jp/animestore/rest/WS100124?campaignId=&_=1614685318665"
).then(d=>d.json())

res=await fetch("https://anime.dmkt-sp.jp/animestore/rest/WS100124?campaignId=1614685318665"
).then(d=>d.json())

const obtainStreamBody = async (url) => {
    for (const count of Array(3)) {
        try {
            const content = await fetch(url).then(d => d.body)
                .then(d => d.getReader())
                .then(reader => reader.read())
                .then(res => new TextDecoder("utf-8").decode(res.value));
            return content;
        } catch { continue; }
    }
    return "";
}
const urlFav = "https://anime.dmkt-sp.jp/animestore/mpa_fav_pc";
const htmlContent=await obtainStreamBody(urlFav);
const itemFirst=$("div.itemWrapper.clearfix", htmlContent);
const ul=$("ul.onlyPcLayout", htmlContent);
const pageLength=$(`li:last`, ul).text().match(/\d+/)-0;
const urlBase=`${urlFav}?selectPage=`;
const pageRange={first:2, length:pageLength-1};
const itemHTMLs_tmp = await Promise.all([...Array(pageRange.length).keys()]
    .map(d => d + pageRange.first).map(async pageNum => {
        const content = await obtainStreamBody(`${urlBase}${pageNum}`);
        return $("div.itemWrapper.clearfix", content);
}));
const itemHTMLs=[itemFirst, ...itemHTMLs_tmp];
itemHTMLs.map(wrapper=>$(".itemModule input", wrapper).map((ind, obj)=>$(obj).val()).toArray()).flat();

workIdsDic={"yellow":["24410", "23657"], "lightgreen":["24410", "23657"], "lightblue":["24410"]}
itemModules=$(".itemModule")
itemModules.each((ind,obj)=>{
    workIdTmp=$("input", obj).val();
    const colors=Object.entries(workIdsDic).filter(kv=>kv[1].indexOf(workIdTmp)!=-1).map(kv=>kv[0]);
    if (colors){
        $(obj).css({background:`linear-gradient(-135deg, ${colors.join(",")}, 60%, white 100%)`})
    }
})

workIds=$(".itemModule.list").map((ind,obj)=>$("input", obj).val()).toArray();
res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus+"?targetFlag=10&workIdList="+workIds.join("_")).then(d=>d.json()).then(d=>d.data.statusList)
favWorkIds=res.filter(d=>d.favoriteStatus=="1").map(d=>d.workId)
shareWorkIds=res.filter(d=>d.myListStatus!=null).map(d=>d.workId)

res=await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyList).then(d=>d.json()).then(d=>d.data.workList)
shareWorkIds=res.map(d=>d.workId)























const itemsClone=$("modal.viewCacheListDialog .itemModule.list")
    .sort((a,b)=>$(a).data("sort-index")-$(b).data("sort-index")).clone()
$("modal.viewCacheListDialog .itemModule.list").each((ind,obj)=>{
    const indexTmp=$(obj).data("sort-index");
    console.log(indexTmp, ind)
    if (indexTmp!=ind) $(obj).replaceWith(itemsClone[ind]);
})



$("modal.viewCacheListDialog .itemModule.list>input.workId").map((ind,obj)=>$(obj).val()).toArray()
$("modal.viewCacheListDialog .itemModule.list").map((ind,obj)=>$(obj).data("sort-index")).toArray()



$(".itemModule").map((index, el) => { // centerPointList=
    const pos = $(el).data("index", index).offset();
    return [[pos.left , pos.top , index]];
});


   
/////////



var _ = window.COMMON.pointerEvent;
var normalizeEvent = function (e) {
    var event = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0] : e;
    e.clientX = e.clientX || event.clientX;
    e.clientY = e.clientY || event.clientY;
    e.pageX = e.pageX || event.pageX;
    e.pageY = e.pageY || event.pageY;
    e.screenX = e.screenX || event.screenX;
    e.screenY = e.screenY || event.screenY;
};
var copyEvent = function (e) {
    return $.Event(e.type, e);
};
var requestAnimationFrame =
        // window.requestAnimationFrame ||
        // window.webkitRequestAnimationFrame ||
        // window.mozRequestAnimationFrame ||
        window.setTimeout;
var cancelAnimationFrame =
        // window.cancelAnimationFrame ||
        // window.mozCancelAnimationFrame ||
        window.clearTimeout;


var $itemModule = (".itemModule");
$itemModule.each(function(index, el) {
    var $el = $(el);
    if (!$el.hasClass("edit")) {
        $el.attr("data-sort-index", index).addClass($("body").hasClass("selectAll") ? "selected" : "notSelected");
    }
});
$itemModule = $itemModule.filter(":not(.edit)").addClass("edit");
$itemModule.filter(".mybest").on(_.addLabel(_.addMouseEventName(_.start), ".editmode"), function (event) {
    normalizeEvent(event);
    var $list = $(event.target).closest(".itemModule");
    if ($list.data("isTouch") === true) {
        return;
    }
    $list.data("isTouch", true);
    var basePos = [event.pageX, event.pageY];
    var listEl = $list[0];
    var listWidth = $list.outerWidth();
    var listHeight = $list.outerHeight();
    var windowHeight = window.innerHeight;
    var documentHeight = $(document).height();
    var editFooterHeight = $editFooter.height();
    var SCROLL_DISTANCE = 15;
    var SCROLL_INTERVAL = 30;
    var THROTTLE_INTERVAL = 20;
    var THRESHOLD = 80;
    var THRESHOLD_BOTTOM = windowHeight - editFooterHeight - THRESHOLD;
    var SWAP_ANIME_DURATION = 500;
    var lastEventTimestamp = null;
    var intervalTimerId = null;
    var NOANIME_PARAMS = {duration: 0};
    var centerPointList = [];
    var scrollTmp = window.scrollY || window.pageYOffset;
    var distanceCheck = false;
    $list.data("isMove", false);
    var scrollFunc = function (diff, direction, rate) {
        var scrollY = window.scrollY || window.pageYOffset;
        var isLimit = direction === "up" ? (scrollY > SCROLL_DISTANCE) : (documentHeight - windowHeight - scrollY > SCROLL_DISTANCE);
        var distance = 0;
        if (isLimit) {
            distance = (SCROLL_DISTANCE + Math.floor(Math.log(Math.pow(diff, 2)))) * (direction === "up" ? 1 : -1);
            distance = Math.floor(distance * (rate || 1));
            window.scrollTo(0, scrollY - distance);
        }
        return distance;
    };
    var getOffsetX = function (el) {
        return el.offsetLeft - parseInt(el.style.left || 0, 10);
    };
    var getOffsetY = function (el) {
        return el.offsetTop - parseInt(el.style.top || 0, 10);
    };

    var initPointList = function () {
        centerPointList.splice(0, centerPointList.length);
        $contentRoot.find(".itemModule").each(function (index, el) {
            var pos = $(el).data("index", index).offset();
            centerPointList.push([pos.left + listWidth / 2, pos.top + listHeight / 2, index]);
        });
    };
    $(window).on("appenditem.mylist.editmode", function () {
        windowHeight = window.innerHeight;
        documentHeight = $(document).height();
        initPointList();
    });
    initPointList();

    $(window).on(_.addLabel(_.addMouseEventName(_.move), ".drag.editmode"), function (event) {
        // iosで並び替えできない不具合の解消
        if (window.COMMON.naviDevice1 == "3") {
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
        }
        if (event.originalEvent && event.originalEvent.movementX === 0 && event.originalEvent.movementY === 0) {
            // マウスが実際に移動していない場合は処理しない
            return;
        }
        normalizeEvent(event);
        var moveX = event.pageX - basePos[0];
        var moveY = event.pageY - basePos[1];
        if (moveX === 0 && moveY === 0) {
            // マウスが実際に移動していない場合は処理しない
            return;
        }
        $list.addClass("drag");
        // イベント処理を間引く処理
        var now = Date.now();
        // スクロール処理ではない(ドラッグ処理)、かつイベント間隔が短い場合
        if (!event.isTrigger && lastEventTimestamp && now - lastEventTimestamp < THROTTLE_INTERVAL) {
            // スクロールタイマーが発行されている場合、一旦解除し、
            // ドラッグの際のマウス座標をコピーして再度スクロールタイマーを発行する
            if (intervalTimerId) {
                var ev = copyEvent(event);
                cancelAnimationFrame(intervalTimerId);
                intervalTimerId = requestAnimationFrame(function () {
                    intervalTimerId = null;
                    $(window).trigger(ev);
                }, SCROLL_INTERVAL);
            }
            return false;
        }
        lastEventTimestamp = now;
        // イベント処理を間引く処理ここまで

        // スクロール処理ではない場合(ドラッグ処理の場合)は、スクロールタイマーを解除する(あとで再発行される)
        if (!event.isTrigger) {
            cancelAnimationFrame(intervalTimerId);
            intervalTimerId = null;
        }
        // スクロール処理ではない場合(ドラッグ処理の場合)は、スクロールタイマーを解除する(あとで再発行される)ここまで

        $list.data("isMove", true);

        // 画面上下にドラッグした場合にスクロール追従させる
        var distance = 0;
        if (event.clientY < THRESHOLD || event.clientY > THRESHOLD_BOTTOM) {
            cancelAnimationFrame(intervalTimerId); intervalTimerId = null;
            distance = event.clientY < THRESHOLD ? scrollFunc(THRESHOLD - event.clientY, "up", event.rate) : scrollFunc(event.clientY - THRESHOLD_BOTTOM, "down", event.rate);
            event.pageY -= distance;
            distanceCheck = true;
        } else {
            cancelAnimationFrame(intervalTimerId); intervalTimerId = null;
        }
        // 画面上下にドラッグした場合にスクロール追従させるここまで

        // マウスカーソルにドラッグ中要素を追従させる
        if (window.COMMON.naviDevice1 == "3") {
            if (scrollTmp == (window.scrollY || window.pageYOffset) || distanceCheck) {
                $list.transitStop(true).transit({x: moveX + "px", y: moveY + "px"}, NOANIME_PARAMS);
            }
            else {
                clearInterval(intervalTimerId);
                $list.transitStop(true).transit({x: 0, y: 0, scale: 1}, {duration: 0, complete: function () {
                    listEl.removeAttribute("style");
                    $list.removeClass("drag");
                }});
                window.removeEventListener('touchmove', handleTouchMove, { passive: false });
                $(window).off(".drag.editmode appenditem.mylist.editmode");
                $list.removeData("isTouch");
                return false;
            }
        }
        else {
            $list.transitStop(true).transit({x: moveX + "px", y: moveY + "px"}, NOANIME_PARAMS);
        }
        // マウスカーソルにドラッグ中要素を追従させるここまで

        // ドラッグ中要素に重なっている要素を算出
        var centerPos = centerPointList[$list.data("index")];
        var centerX = centerPos[0] + moveX;
        var centerY = centerPos[1] + moveY;
        var list = $.grep(centerPointList, function (val) {
            return Math.abs(centerY - val[1]) < listHeight && Math.abs(centerX - val[0]) < listWidth;
        });
        // ドラッグ中要素に重なっている要素を算出ここまで

        // ドラッグ中要素に重なっている要素から一番近い要素を算出
        var target = null;
        $.each(list, function (index, val) {
            if (target) {
                var minDistance = target[target.length - 1];
                var distance = Math.pow(centerX - val[0], 2) + Math.pow(centerY - val[1], 2);
                if (minDistance > distance) {
                    target = [val, distance];
                }
            } else {
                target = [val, Math.pow(centerX - val[0], 2) + Math.pow(centerY - val[1], 2)];
            }
        });
        // ドラッグ中要素に重なっている要素から一番近い要素を算出ここまで

        if (target) {
            var $allList = $contentRoot.find(".itemModule");
            var targetIndex = target[0][2];
            var $target = $allList.eq(targetIndex);
            var targetEl = $target[0];
            var listIndex = $allList.index($list);
            if (!$target.is($list)) {
                // 移動が必要な要素の座標を、要素入れ替え前に保存しておく
                var $tmp = listIndex > targetIndex ? $allList.slice(targetIndex, listIndex) : $($allList.slice(listIndex + 1, targetIndex + 1).get().reverse());
                $tmp.each(function (i, el) {
                    var $el = $(el);
                    $el.data("index", $el.data("index") + (listIndex > targetIndex ? 1 : -1));
                    var offset = $el.offset();
                    $el.data("pos", [offset.left, offset.top]);
                });
                // 移動が必要な要素の座標を、要素入れ替え前に保存しておくここまで

                // 要素を入れ替えるとドラッグ基準点がずれるので、予め入れ替えた先の座標を元にドラッグ基準点を調整
                var diffX = getOffsetX(targetEl) - getOffsetX(listEl);
                var diffY = getOffsetY(targetEl) - getOffsetY(listEl);
                basePos[0] += diffX;
                basePos[1] += diffY;
                moveX = event.pageX - basePos[0];
                moveY = event.pageY - basePos[1];
                $list.transitStop(true).transit({x: moveX + "px", y: moveY + "px"}, NOANIME_PARAMS);
                // 要素を入れ替えるとドラッグ基準点がずれるので、予め入れ替えた先の座標を元にドラッグ基準点を調整ここまで

                // 要素入れ替え
                $target[listIndex > targetIndex ? "before" : "after"]($list);
                $list.data("index", targetIndex);
                // 要素入れ替えここまで

                // 要素入れ替えによって、移動が必要な要素の座標が一気にずれてしまうため、
                // 保存しておいた座標に一時的に移動させてから、元に戻すアニメーションを行う
                $tmp.each(function (i, el) {
                    el.style.willChange = "transform";
                    var $el = $(el);
                    var beforePos = $el.data("pos");
                    moveX = beforePos[0] - getOffsetX(el);
                    moveY = beforePos[1] - getOffsetY(el);
                    $el.removeData("pos");
                    $el.transitStop(true).transit({x: moveX + "px", y: moveY + "px"}, NOANIME_PARAMS).transit({x: 0, y: 0}, {duration: SWAP_ANIME_DURATION, complete: function () {
                        el.removeAttribute("style");
                    }});
                });
                // 要素入れ替えによって、移動が必要な要素の座標が一気にずれてしまうため、
                // 保存しておいた座標に一時的に移動させてから、元に戻すアニメーションを行うここまで
            }
        }
        if (distance) {
            var e = copyEvent(event);
            var animationStartTime = (new Date()).getTime();
            intervalTimerId = requestAnimationFrame(function () {
                e.rate = (new Date().getTime() - animationStartTime) / SCROLL_INTERVAL;
                intervalTimerId = null;
                // マウスイベントを強制発行することで自動スクロールを実現する
                $(window).trigger(e);
            }, SCROLL_INTERVAL);
        }
        return false;
    }).one(_.addLabel(_.addMouseEventName(_.end), ".drag.editmode"), function (event) {
        clearInterval(intervalTimerId);
        $list.transitStop(true).transit({x: 0, y: 0, scale: 1}, {duration: 300, complete: function () {
            listEl.removeAttribute("style");
            $list.removeClass("drag");
        }});
        if (window.COMMON.naviDevice1 == "3") {
            window.removeEventListener('touchmove', handleTouchMove, { passive: false });
        }
        $(window).off(".drag.editmode appenditem.mylist.editmode");
        $list.removeData("isTouch");
    });
});
if (window.COMMON.naviDevice1 === "3") {
    // iOS10からtouchstart中にtouchmove傍受開始してもスクロール制御が効かない
    // けど、とりあえず登録しておけば整合性がとれるっぽい
    $(window).on("touchmove.editmode", function () {});
}

$list=$(".itemModule:first")
var listWidth = $list.outerWidth();
var listHeight = $list.outerHeight();
centerPointList=[];
$("modal").find(".itemModule").each(function (index, el) {
    console.log(index)
    var pos = $(el).data("index", index).offset();
    centerPointList.push([pos.left + listWidth / 2, pos.top + listHeight / 2, index]);
});
console.log(centerPointList)