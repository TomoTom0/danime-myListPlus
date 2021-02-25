$(function () {
    headerArea = $(".mypageHeader")
    btnArea = $("<div>", { class: "btnArea btnOpenAddMyList", style: "display:inline-block;position:relative;top:-6px;vertical-align:middle;padding:0;visibility:hidden;" })
    addBtn = $("<a>", { href: "javascript:void(0)", class: "btn" }).append("マイリストに追加する")
    headerArea.append(btnArea.append(addBtn))
})

document.addEventListener("click", async function (e) {
    const IsEditMode = ($("body").attr("class").indexOf("editMode") != -1);
    if ($(e.target).attr("class")){
        if ($(e.target).attr("class").indexOf("btnEdit") != -1 && !IsEditMode) {
            $(".mypageHeader div.btnOpenAddMyList").css({ visibility: "visible" })
        } else if ($(e.target).attr("class").indexOf("btnEditCancel") != -1 && IsEditMode) {
            $(".mypageHeader div.btnOpenAddMyList").css({ visibility: "hidden" })
        } else if ($(e.target).attr("class").indexOf("btnOpenAddMyList") != -1 && IsEditMode) {
            await addMylistModal();
        } else if ($(e.target).attr("class").indexOf("btnAddMyList") != -1) {
            const workIds=$(".contentsWrapper .itemWrapper .itemModule.selected input").map((ind,obj)=>$(obj).val());
            const sharelistIds=$(".sharelistId.on").map((ind,obj)=>$(obj).data("sharelistid")).toArray();
            for (const  workId of workIds) {
                editMyList(workId, sharelistIds, []);
            };
            $("modal.addMyListDialog").remove();
            $("body").toggleClass("editMode");
        }
    }
})

// 作品のマイリスト登録状況を編集(追加削除)する
function editMyList (workId, regShareListIdList, delShareListIdList, isEdit, callback) {
    window.COMMON.restPost(window.COMMON.RESTAPI_ENDPOINT.registWorkToShareList, {
        workId: workId,
        regShareListIdList: regShareListIdList,
        delShareListIdList: delShareListIdList
    }).done(function () {
        if (typeof callback === "function") {
            callback(true);
        }
    }).fail(function (errorCode) {
        switch (errorCode) {
            case "22": // 公開リスト作品件数超過
                window.COMMON.showToast("エラーが発生しました");
                break;
            case "23": // マイリスト作品件数超過
                window.COMMON.showToast("マイリストの上限数に達しましたので、設定できません");
                break;
            case "24": // 公開期間外
                window.COMMON.showToast("この作品は現在公開されておりません");
                break;
            case "82": // 要アプリバージョンアップ
                window.location.href = "/animestore/iosapp_ver_warn";
                break;
            case "83": // 非対応機種
                window.location.href = "/animestore/uncov_m";
                break;
            case "84": // 要アプリ起動
                window.location.href = "/animestore/dapp_warn?next_url=" + encodeURIComponent(window.location.href);
                break;
            case "85": // 海外UA
                window.location.href = "/animestore/os_warn";
                break;
            case "86": // 未認証
            case "87": // 非会員
                window.doLogin(null, {
                    type: "edit_mylist",
                    data: {workId: workId, regShareListIdList: regShareListIdList, delShareListIdList: delShareListIdList, isEdit: isEdit},
                    timing: "load pageshow"
                });
                break;
            default:
                window.COMMON.showToast("エラーが発生しました");
                break;
        }
        if (typeof callback === "function") {
            callback(false);
        }
    });
}

async function addMylistModal(){
    const workIds=$(".contentsWrapper .itemWrapper .itemModule.selected input").map((ind,obj)=>$(obj).val());
    if (workIds.length==0) return;
    const shareList=await window.COMMON.restGet(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d=>d.shareList);
    const modalId=`DIALOG${Date.now()}`
    const modalAddMyList=`
    <modal id="${modalId}" class="modalDialog addMyListDialog" style="">
    <div class="modalOverlay"></div>
    <div class="generalModal" style="left: 258px; top: 106px;">
        <div class="titleArea">
            <div class="title">マイリストに追加</div>
            <div class="closeBtn btnCloseModal"><a href="javascript:$('#${modalId}').remove();"><i class="icon iconCircleClose"></i></a></div>
        </div>
        <div class="modalAddMyListIn">
            <p>各リストに最大50件まで作品を追加することができます</p>
            <div class="formContainer">
                <div class="formContainerWrapper">
                    <div class="formContainerCover"></div>
                    <div class="formContainerIn webkitScrollbar vertical">
                        <form>
                            ${shareList.map((list, ind)=>{
                                return `
                                <div class="checkboxList clearfix">
                                    <div class="checkbox sharelistId sharelist_${ind}" data-sharelistid="${list.shareListId}">
                                        <a href="javascript:$('.sharelist_${ind}').toggleClass('on');"><i class="sharelist_${ind}"></i></a>
                                    </div>
                                    <div class="label">
                                        <p class="title line1">
                                            <span>${list.shareListName}</span>
                                            <span class="comment onlyMax">最大50件登録済みです</span>
                                            <span class="comment onlyAdded">すでに登録済みです</span>
                                            <span class="comment onlyDel">このリストから削除されます</span>
                                            <span class="comment onlyAdd">このリストに追加されます</span>
                                        </p>
                                        <span class="count">(${list.count})</span>
                                    </div>
                                </div>`
                            }).join("\n")}
                        </form>
                        <div class="btnNewMyList">新しいマイリストを作成<i class="icon iconCircleAdd"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnArea" style="vertical-align:middle;padding:0;">
            <span><a href="javascript:void(0);" class="btnAddMyList">マイリストに追加する(${workIds.length})</a></span>
        </div>
    </div>
    </modal>`
    $("body").append(modalAddMyList);
}

<div class="btnEditCancel" style="position:relative;"><a href="javascript:void(0);">キャンセル<i class="icon iconEdit"></i></a></div>

    //const headerArea = (url_mode == "editList") ? $(".mypageHeader span.sortComment").empty().css({ color: "transparent" }) : $(".mypageHeader");
    //const btnArea = $("<div>", { class: "btnArea btnOpenAddMyListArea", style: "visibility:hidden;display:flex;" });
    //const addBtn = $("<a>", { href: "javascript:void(0)", class: "btn btnOpenAddMyList" }).append("マイリストに追加する");
    //headerArea.append(btnArea.append(addBtn));


    7r8sWf9OAKxl8DRW