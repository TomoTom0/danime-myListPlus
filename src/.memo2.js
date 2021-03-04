async function dragItemEditMode(){
    let compY=640;
    $().transitionStop();
    const _ = window.COMMON.pointerEvent;
    const normalizeEvent = (e) => {
        const event = e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length ? e.originalEvent.touches[0] : e;
        e.clientX = e.clientX || event.clientX;
        e.clientY = e.clientY || event.clientY;
        e.pageX = e.pageX || event.pageX;
        e.pageY = e.pageY || event.pageY;
        e.screenX = e.screenX || event.screenX;
        e.screenY = e.screenY || event.screenY;
        return Object.assign(e, event);
    };
    const copyEvent = (e) => {
        return $.Event(e.type, e);
    };
    const requestAnimationFrame =
            // window.requestAnimationFrame ||
            // window.webkitRequestAnimationFrame ||
            // window.mozRequestAnimationFrame ||
            window.setTimeout;
    const cancelAnimationFrame =
            // window.cancelAnimationFrame ||
            // window.mozCancelAnimationFrame ||
            window.clearTimeout;
    const contentRoot=$("modal .contentWrapper")
    const itemModuleTmp = $(".itemModule", contentRoot);
    const editFooter = $(".editFooter", contentRoot);
    const mybestHeader = $("modal .mypageHeader.mybest");
    itemModuleTmp.each((index, el) => {
        const $el = $(el);
        if (!$el.hasClass("edit")) {
            $el.attr("data-sort-index", index).addClass($("body").hasClass("selectAll") ? "selected" : "notSelected");
        }
    });
    const itemModule = itemModuleTmp.filter(":not(.edit)").addClass("edit");

    itemModule.filter(".mybest").on(_.addLabel(_.addMouseEventName(_.start), ".editmode"), (e) => {
        let event1=normalizeEvent(e);
        const list = $(event1.target).closest(".itemModule");
        if (list.data("isTouch") === true) {
            return;
        }
        list.data("isTouch", true);
        let basePos = [event1.pageX, event1.pageY];
        const listEl = list[0];
        const listWidth = list.outerWidth();
        const listHeight = list.outerHeight();
        let windowHeight = window.innerHeight;
        let documentHeight = $(document).height();
        const editFooterHeight = editFooter.height();
        const SCROLL_DISTANCE = 15;
        const SCROLL_INTERVAL = 30;
        const THROTTLE_INTERVAL = 20;
        const THRESHOLD = 80;
        const THRESHOLD_BOTTOM = windowHeight - editFooterHeight - THRESHOLD;
        const SWAP_ANIME_DURATION = 500;
        let lastEventTimestamp = 0;
        let intervalTimerId = null;
        const NOANIME_PARAMS = {duration: 0};
        let centerPointList = [];
        const scrollTmp = window.scrollY || window.pageYOffset;
        let distanceCheck = false;
        list.data("isMove", false);

        const scrollFunc = function (diff, direction, rate) {
            const scrollY = window.scrollY || window.pageYOffset;
            const isLimit = direction === "up" ? (scrollY > SCROLL_DISTANCE) : (documentHeight - windowHeight - scrollY > SCROLL_DISTANCE);
            
            if (isLimit) {
                const distanceIn = (SCROLL_DISTANCE + Math.floor(Math.log(Math.pow(diff, 2)))) * (direction === "up" ? 1 : -1);
                const distance = Math.floor(distanceIn * (rate || 1));
                window.scrollTo(0, scrollY - distance);
                return distance;
            } else return 0;
        };
        const getOffsetX = function (el) {
            return (el.offsetLeft||0) - parseInt(el.style.left || 0, 10);
        };
        const getOffsetY = function (el) {
            return (el.offsetTop ||0) - parseInt(el.style.top || 0, 10);
        };

        const initPointList = () => {
            return contentRoot.find(".itemModule").map((index, el) => { // centerPointList=
                const pos = $(el).data("index", index).offset();
                return [[pos.left + listWidth / 2, pos.top + listHeight / 2, index]];
            }).toArray();
        };

        $(window).on("appenditem.mylist.editmode", function () {
            windowHeight = window.innerHeight;
            documentHeight = $(document).height();
            centerPointList=initPointList();
        });
        centerPointList=initPointList();

        $(window).on(_.addLabel(_.addMouseEventName(_.move), ".drag.editmode"), (e) => {
            if (e.originalEvent && e.originalEvent.movementX === 0 && e.originalEvent.movementY === 0) {
                // マウスが実際に移動していない場合は処理しない
                return;
            }
            let event = normalizeEvent(e);
            const mouseX = event.pageX - basePos[0];
            const mouseY = event.pageY - basePos[1];
            if (mouseX === 0 && mouseY === 0) {
                // マウスが実際に移動していない場合は処理しない
                return;
            }
            list.addClass("drag");
            // イベント処理を間引く処理
            const now = Date.now();
            // スクロール処理ではない(ドラッグ処理)、かつイベント間隔が短い場合
            if (!event.isTrigger && now - lastEventTimestamp < THROTTLE_INTERVAL) {
                // スクロールタイマーが発行されている場合、一旦解除し、
                // ドラッグの際のマウス座標をコピーして再度スクロールタイマーを発行する
                if (intervalTimerId) {
                    const ev = copyEvent(event);
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

            list.data("isMove", true);
            // 画面上下にドラッグした場合にスクロール追従させる
            distance = 0;
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
            /* if (window.COMMON.naviDevice1 == "3") {
                if (scrollTmp == (window.scrollY || window.pageYOffset) || distanceCheck) {
                    $list.transitStop(true).transit({x: mouseX + "px", y: mouseY + "px"}, NOANIME_PARAMS);
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
            else {*/
                list.transitStop(true).transit({x: mouseX + "px", y: mouseY + "px"}, NOANIME_PARAMS);
            //}
            // マウスカーソルにドラッグ中要素を追従させるここまで

            // ドラッグ中要素に重なっている要素を算出
            const centerPos = centerPointList[list.data("index")];
            const centerX = centerPos[0] + mouseX;
            const centerY = centerPos[1] + mouseY;
            const list2 = centerPointList.filter(val => 
                Math.abs(centerY - val[1]) < listHeight && Math.abs(centerX - val[0]) < listWidth
            );
            // ドラッグ中要素に重なっている要素を算出ここまで

            // ドラッグ中要素に重なっている要素から一番近い要素を算出
            const target=list2.reduce((acc, val, index) => {
                if (acc.length>0) {
                    const minDistance = acc[acc.length - 1];
                    const distanceTmp = Math.pow(centerX - val[0], 2) + Math.pow(centerY - val[1], 2);
                    if (minDistance > distanceTmp) {
                        return [val, distanceTmp];
                    } else return acc;
                } else {
                    return [val, Math.pow(centerX - val[0], 2) + Math.pow(centerY - val[1], 2)];
                }
            }, []);
            // ドラッグ中要素に重なっている要素から一番近い要素を算出ここまで

            if (target) {
                const allList = contentRoot.find(".itemModule");
                const targetIndex = target[0][2];
                const $target = allList.eq(targetIndex);
                const targetEl = $target[0];
                const listIndex = allList.index(list);
                if (!$target.is(list)) {
                    // 移動が必要な要素の座標を、要素入れ替え前に保存しておく
                    const $tmp = listIndex > targetIndex ? allList.slice(targetIndex, listIndex) : $(allList.slice(listIndex + 1, targetIndex + 1).get().reverse());
                    $tmp.each((i, el) => {
                        const $el = $(el);
                        $el.data("index", $el.data("index") + (listIndex > targetIndex ? 1 : -1));
                        const offset = $el.offset();
                        $el.data("pos", [offset.left, offset.top-compY]); // なぜかずれるので-540?
                    });
                    // 移動が必要な要素の座標を、要素入れ替え前に保存しておくここまで

                    // 要素を入れ替えるとドラッグ基準点がずれるので、予め入れ替えた先の座標を元にドラッグ基準点を調整
                    const diffX = getOffsetX(targetEl) - getOffsetX(listEl);
                    const diffY = getOffsetY(targetEl) - getOffsetY(listEl);
                    basePos[0] += diffX;
                    basePos[1] += diffY;
                    const moveX = event.pageX - basePos[0];
                    const moveY = event.pageY - basePos[1];
                    console.log(event.pageX, event.pageY)
                    list.transitStop(true).transit({x: moveX + "px", y: moveY + "px"}, NOANIME_PARAMS);
                    // 要素を入れ替えるとドラッグ基準点がずれるので、予め入れ替えた先の座標を元にドラッグ基準点を調整ここまで

                    // 要素入れ替え
                    $target[listIndex > targetIndex ? "before" : "after"](list);
                    list.data("index", targetIndex);
                    // 要素入れ替えここまで

                    // 要素入れ替えによって、移動が必要な要素の座標が一気にずれてしまうため、
                    // 保存しておいた座標に一時的に移動させてから、元に戻すアニメーションを行う
                    $tmp.each( (i, el) => {
                        el.style.willChange = "transform";
                        const $el = $(el);
                        const beforePosTmp = $el.data("pos");
                        const moveXTmp = beforePosTmp[0] - getOffsetX(el);
                        const moveYTmp = beforePosTmp[1] - getOffsetY(el);
                        $el.removeData("pos");
                        $el.transitStop(true)
                            .transit({x: moveXTmp + "px", y: moveYTmp + "px"}, NOANIME_PARAMS)
                            .transit({x: 0, y: 0}, {duration: SWAP_ANIME_DURATION, complete: () => {
                                //el.removeAttribute("style");
                        }});
                    });
                    // 要素入れ替えによって、移動が必要な要素の座標が一気にずれてしまうため、
                    // 保存しておいた座標に一時的に移動させてから、元に戻すアニメーションを行うここまで
                }
            }        

            if (distance) {
                const eventTmp = copyEvent(event);
                const animationStartTime = (new Date()).getTime();
                intervalTimerId = requestAnimationFrame(function () {
                    eventTmp.rate = (new Date().getTime() - animationStartTime) / SCROLL_INTERVAL;
                    intervalTimerId = null;
                    // マウスイベントを強制発行することで自動スクロールを実現する
                    $(window).trigger(eventTmp);
                }, SCROLL_INTERVAL);
            }
            return false;
        }).one(_.addLabel(_.addMouseEventName(_.end), ".drag.editmode"), function (e) {
            clearInterval(intervalTimerId);
            list.transitStop(true).transit({x: 0, y: 0, scale: 1}, {duration: 300, complete: function () {
                //listEl.removeAttribute("style");
                list.removeClass("drag");
            }});
            $(window).off(".drag.editmode appenditem.mylist.editmode");
            list.removeData("isTouch");
        });
    })

}