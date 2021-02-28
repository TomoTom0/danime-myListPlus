const GLOBAL_cache_prefix = "cache_";

const obtainUrlMode = () => {
    const url_mode = (Object.entries({
        viewList: "https://anime.dmkt-sp.jp/animestore/mpa_mylists_pc",
        editList: "https://anime.dmkt-sp.jp/animestore/mpa_shr_pc",
        viewNext: "https://anime.dmkt-sp.jp/animestore/mp_viw_pc",
        viewFav: "https://anime.dmkt-sp.jp/animestore/mpa_fav_pc",
        viewedAnime: "https://anime.dmkt-sp.jp/animestore/mpa_hst_pc",
        viewedComp: "https://anime.dmkt-sp.jp/animestore/mpa_cmp_pc",
        viewedRent: "https://anime.dmkt-sp.jp/animestore/mp_hst_pc",
        viewedLimit: "https://anime.dmkt-sp.jp/animestore/mpa_lmt_pc",
        viewAllList: "https://anime.dmkt-sp.jp/animestore/mpa_rsv_pc"
    }).filter(kv => location.href.indexOf(kv[1]) != -1)[0] || [""])[0];
    const modalClass = $("modal").map((ind, obj) => $(obj).attr("class").split(" ").filter(d => /Dialog$/.test(d) && d != "modalDialog").join(" "))
        .toArray().map(d => d.replace(/Dialog$/, "")).join(" ");
    return [url_mode, modalClass].join(" ");
}
const obtainContainer = (url_mode) => {
    if (["viewCacheList"].some(d => url_mode.indexOf(d) != -1)) {
        return $(`modal.viewCacheListDialog`);
    } else return $(".pageWrapper");
}

$(async function () {
    await addInitialButton();

    document.addEventListener("click", async function (e) {
        const url_mode = obtainUrlMode();
        const container = obtainContainer(url_mode);
        const IsEditMode = $("body").is(".editMode");
        if ($(e.target).is(".itemModule.openCacheList *")) {
            const cacheListId = $(e.target).parents("a:eq(0)").data("cachelistid").toString();
            await viewWorksOfCacheListModal(cacheListId);
        } else if ($(e.target).is(".btnOpenAddMyList")) {
            await addMyListModal(container);
        } else if ($(e.target).is(".btnOpenNewMyList")) {
            createMyListModal();
        } else if ($(e.target).is(".btnNewMyList")) {
            const newMyListName = $("#newMyListName").val();
            await createNewList(newMyListName);
            $(`modal.newMyListDialog`).remove();
            await remakeAddMyListModal();
        } else if ($(e.target).is(".editFooter .btnCopyList")) {
            await copyList($(e.target).is(".aboutCache"));
            toggleEdit(container, false);
            location.reload();
        } else if ($(e.target).is(".editFooter .btnDeleteCacheList")) {
            const selectedCacheLists = $(".contentsWrapper .itemWrapper .itemModule.selected>input.cacheListId");
            if (selectedCacheLists.length == 0) return;
            const selectedCacheIds = selectedCacheLists.map((ind, obj) => $(obj).val()).toArray();
            await deleteCacheList(selectedCacheIds);
            toggleEdit(container, false)
            await showCacheList();
        } else if ($(e.target).is(".btnOtherMenu")) {
            const IsViewList = $(e.target).is(".aboutViewList");
            const workIsSelected = $(".itemModule.selected>input", container).length > 0;
            otherMenuModal({ IsViewList, workIsSelected });
        } else if ($(e.target).is("modal.modalDialogChEx *")) {
            const modal = $(e.target).parents("modal");
            if ($(e.target).is(".closeBtn *, .closeBtn")) {
                if (IsEditMode) toggleEdit(container, false);
                modal.remove();
            } else if ($(e.target).is(".btnAddMyList")) {
                const workIdsTmp = $(".itemModule.selected", container).map((ind, obj) => $(obj).data("workid"));
                const workIds = (workIdsTmp.length > 0) ? workIdsTmp.toArray().map(d => d.toString()) : $(".itemModule.selected>input", container).map((ind, obj) => $(obj).val().toString()).toArray();
                const sharelistIds = $(".sharelistId.on", modal).map((ind, obj) => $(obj).data("sharelistid").toString()).toArray();
                const cachelistIds = $(".cachelistId.on", modal).map((ind, obj) => $(obj).data("cachelistid").toString()).toArray();
                await addWorkToLists(workIds, { cache: cachelistIds, share: sharelistIds });
                $("modal.addMyListDialog").remove();
                toggleEdit(container, false);
                if (["viewList"].indexOf(url_mode) != -1) await showCacheList();
                console.log("add works to my list");
            } else if ($(e.target).is($(".btnEdit *,.btnEditCancel *"))) {
                // toggle Edit mode for new Module
                toggleEdit($(e.target).parents(".formContainerIn"), $(e.target).is(".btnEdit *"))
                const selectedWorks = $(".formContainerIn .itemModule.selected", modal);
                $(".btnDelete span", modal).html(selectedWorks.length);
            } else if (IsEditMode && $(e.target).is(".btnSelectToggle *, .btnSelectToggle")) {
                const toggleArea = $(e.target).parents(".btnSelectToggle");
                toggleArea.toggleClass("checked");
                $(".itemModule", $(e.target).parents(".formContainerIn")).map((ind, obj) => {
                    if (toggleArea.is(".checked")) $(obj).addClass("selected").removeClass("notSelected");
                    else $(obj).removeClass("selected").addClass("notSelected");;
                });
                const selectedWorks = $(".formContainerIn .itemModule.selected", modal);
                $(".btnDelete span", modal).html(selectedWorks.length);
            } else if (IsEditMode && $(e.target).is(".itemModule *")) {
                const itemModule = $(e.target).parents(".itemModule");
                $(itemModule).toggleClass("selected").toggleClass("notSelected");
                const selectedWorks = $(".formContainerIn .itemModule.selected", modal);
                $(".btnDelete span", modal).html(selectedWorks.length);
            } else if (IsEditMode && $(e.target).is(".editFooter *")) {
                const cacheListId = modal.data("cachelistid").toString();
                if ($(e.target).is(".btnCancel")) {
                    toggleEdit(modal, false);
                } else if ($(e.target).is(".btnDelete")) {
                    const selectedWorks = $(".formContainerIn .itemModule.selected", modal);
                    if (selectedWorks.length == 0) return;
                    const selectedWorkIds = selectedWorks.map((ind, obj) => $(obj).data("workid").toString()).toArray();
                    await deleteFromCacheList(cacheListId, selectedWorkIds);
                    toggleEdit(modal, false);
                    await remakeWorksOfCacheListModal();
                    await showCacheList();
                } else if ($(e.target).is(".btnRenameCacheList")) {
                    let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(d => JSON.parse(d.lists));
                    const newName = GLOBAL_cache_prefix + $("#editMyListName").val();
                    lists[cacheListId].name = newName;
                    await setSyncStorage({ lists: JSON.stringify(lists) });
                    await remakeWorksOfCacheListModal();
                    toggleEdit(modal, false);
                    await showCacheList();
                }
            } else if ($(e.target).is("modal.otherMenuDialog *")) {
                const otherMenuModal = $("modal.otherMenuDialog");
                const otherMenuPar = otherMenuModal.attr("class").match(/(?<=otherMenu)\d+/)[0];
                if ($(e.target).is(".btnExportCacheList")) {
                    const format = $(".selectExportCacheList", $(e.target).parents(".generalModal")).val();
                    const obtainExportIds = {
                        "10": async () => Object({
                            cache: await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists).map(list => list.listId)),
                            share: []
                        }),
                        "11": async () => Object.assign(...["cache", "share"]
                            .map(key => Object({ [key]: $(`.pageWrapper .itemModule.selected>input.${key}ListId`).map((ind, obj) => $(obj).val().toString()).toArray() }))),
                        "00": async () => Object({ cache: $("modal.viewCacheListDialog").data("cachelistid").toString(), share: [] }),
                        "01": async () => Object({ cache: $("modal.viewCacheListDialog").data("cachelistid").toString(), sahre: [] })
                    }
                    await exportList(await obtainExportIds[otherMenuPar](), format);
                } else if ($(e.target).is(".btnImportCacheList")) {

                    const inputFiles = await $(".inputImportCacheList", $(e.target).parents(".generalModal")).prop("files");
                    if (inputFiles.length==0) return;
                    const importTarget=$(".check_importToSelectedList", $(e.target).parents(".generalModal")).val();
                    const obtainImportIds={
                        present: ()=>Object({ cache: $("modal.viewCacheListDialog").data("cachelistid").toString(), share: [] }),
                        selected: () => Object.assign(...["cache", "share"]
                            .map(key => Object({ [key]: $(`.pageWrapper .itemModule.selected>input.${key}ListId`)
                                .map((ind, obj) => $(obj).val().toString()).toArray() }))),
                        cache: ()=>Object({new:"cache"}),
                        share: ()=>Object({new:"share"})
                    };
                    const importIds=await obtainImportIds[importTarget]();
                    for(const ind of [...Array(inputFiles.length).keys()]){
                        await importList(await inputFiles[ind].text(), importIds);
                    };
                    if (url_mode.indexOf("viewList")==-1) await remakeWorksOfCacheListModal();
                    toggleEdit(container, false);
                    otherMenuModal.remove();
                    await showCacheList();
                }
            }
        }
    })

    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.attributeName == "class") {
                const attrVal = $(record.target).attr(record.attributeName);
                $(".mypageHeader div.btnOpenAddMyListArea").css({ visibility: attrVal.indexOf("editMode") != -1 ? "visible" : "hidden" })
            }
            if (record.type == "childList") {
                $("html").css({ "overflow-y": $("body modal").length > 0 ? "hidden" : "" })
            }
        }
    });
    const config = { attributes: true, childList: true };
    observer.observe($("body")[0], config);
})


// ----------------- edit List --------------------

async function copyList(IsCached) {
    const selectedLists = $(".pageWrapper .itemWrapper .itemModule.selected");
    if (selectedLists.length == 0) return;
    const listIds = Object.assign(...["share", "cache"].map(key => Object({ [key]: selectedLists.map((ind, obj) => $(obj).data(`${key}listid`)).toArray().filter(d => d) })));
    const workIdsShare = (listIds.share.length == 0) ? [] : await Promise.all(listIds.share.map(async shareListId =>
        await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + "?shareListId=" + shareListId.toString())
            .then(d => d.json())
            .then(d => d.data)))
        .then(shareLists => shareLists.map(list => list.workList.map(work => work.workId)).flat());
    const workIdsCache = (listIds.cache.length == 0) ? [] : await getSyncStorage({ lists: JSON.stringify({}) })
        .then(items => JSON.parse(items.lists))
        .then(cacheLists => Object.values(cacheLists)
            .filter(cacheList => listIds.cache.indexOf(cacheList.listId) != -1)
            .map(cacheList => cacheList.workIds).flat());
    const workIds = Array.from(new Set([...workIdsShare, ...workIdsCache]));
    //console.log(lists, workIds);
    await autoSplitedList($("h3 .ui-clamp", selectedLists[0]).text() + `@${new Date().toLocaleDateString().match(/[\d\/]+/)[0]}`, workIds, IsCached);
}

async function autoSplitedList(coreNameIn, workIds, IsCached = false) {
    //console.log(workIds, IsCached)
    const cycleNum = Math.floor(workIds.length / 50 + 1);
    const coreName = (IsCached ? GLOBAL_cache_prefix : "") + coreNameIn.replace(RegExp(`^${GLOBAL_cache_prefix}`), "");
    const dateNum = Date.now() - 0;
    if (IsCached) {
        const lists_res = await createNewList(coreName);
        let lists = lists_res.lists;
        lists[lists_res.listId].workIds.push(...workIds);
        await setSyncStorage({ lists: JSON.stringify(lists) });
    }
    else {
        const sharelistIds = Promise.all([...Array(cycleNum).keys()].map(async cycle => {
            const listName = coreName.slice(0, 10) + "__" + (dateNum + cycle).toString().slice(6, 20);
            return await createNewList(listName).then(d => d.listId);
        }))
        for (const cycle of [...Array(cycleNum).keys()]) {
            const sharelistId = sharelistIds[cycle];
            const workIdsTmp = workIds.slice(50 * cycle, 50 * (cycle + 1));
            for (const workId of workIdsTmp) {
                await _editMyList(workId, [sharelistId], []);
            }
        }
    }
}

async function deleteFromCacheList(cacheListId, workIds) {
    let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(d => JSON.parse(d.lists));
    if (!lists[cacheListId]) return;
    lists[cacheListId].workIds = lists[cacheListId].workIds.filter(workId => workIds.indexOf(workId) == -1);
    await setSyncStorage({ lists: JSON.stringify(lists) });
}

// ----------------- lists in cache ----------------

async function createNewList(listName = "") {
    if (RegExp(`^${GLOBAL_cache_prefix}`).test(listName)) {
        const items = await getSyncStorage({ lists: JSON.stringify({}) });
        let lists = JSON.parse(items.lists);
        const listId = `${GLOBAL_cache_prefix}${Date.now()}`;
        const newList = { madeDate: Date.now(), name: listName, exportIds: [], workIds: [], listId: listId };
        lists[listId] = newList;
        await setSyncStorage({ lists: JSON.stringify(lists) });
        return { listId, lists };
    } else {
        return await _createShareList(listName, true, "").then(d => Object({ listId: d.shareListId }));
    }
}

async function deleteCacheList(selectedCacheIds) {
    let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    selectedCacheIds.forEach(key => delete lists[key]);
    //console.log(lists)
    await setSyncStorage({ lists: JSON.stringify(lists) });
}

async function addWorkToLists(workIds, listsDic) {
    const sharelistIds = listsDic.share;
    const cachelistIds = listsDic.cache;
    if (sharelistIds.length > 0) {
        for (const workId of workIds) {
            const res = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList + "?workId=" + workId).then(d => d.json());
            const sharelistStatuses = res.data.shareList;
            const sharelistLimited = sharelistStatuses.filter(d => d.status == 0 && sharelistIds.indexOf(d.shareListId) != -1);
            if (sharelistLimited.length == 0) continue;
            await _editMyList(workId, sharelistLimited.map(d => d.shareListId), []);
        };
    }
    if (cachelistIds.length > 0) {
        let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
        for (const cachelistId of cachelistIds) {
            if (!lists[cachelistId]) continue;
            lists[cachelistId].workIds = Array.from(new Set([...lists[cachelistId].workIds, ...workIds]));
        }
        await setSyncStorage({ lists: JSON.stringify(lists) });
    }
}

// ------------------ import / export------------


async function exportList(listIds = { cache: {}, share: {} }, formatIn = null) {
    const format = formatIn || "json";
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const shareLists = await await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const validLists = {
        cache: Object.assign(...Object.values(cacheLists).filter(list => listIds.cache.indexOf(list.listId) != -1)
            .map(list => Object({ [list.listId]: { name: list.name, workIds: list.workIds } }))),
        share: Object.assign(...shareLists.filter(list => listIds.share.indexOf(list.shareListId) != -1)
            .map(list => Object({ [list.shareListId]: { name: list.shareListName, workIds: list.workIds } })))
    }

    const obtainContent = {
        json: lists => JSON.stringify(lists),
        csv: lists => Object.values(lists).map(list => list.workIds.join(",")).flat(),
        txt: lists => Object.values(lists).map(list => list.workIds.join("\n")).flat()
    }
    const validListsCombined = Object.assign(validLists.cache, validLists.share);

    if (Object.keys(obtainContent).indexOf(format) == -1 || Object.keys(validListsCombined) == 0) return;
    const content = obtainContent[format](validListsCombined);
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = Object.values(validListsCombined)[0].name + "_" + new Date().toLocaleDateString().match(/[\d\/]+/)[0].replace(/\//g, "-") + "." + format;
    a.href = url;
    a.click();
    a.remove();
}

async function importList(textIn, listIds = { cache: [], share: [] }) {
    const obtainParse = (text) => {
        try { return JSON.parse(text); }
        catch { return null; }
    }
    const jsoned = obtainParse(textIn);
    if (!jsoned) return;
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const shareLists = await await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const validListIds = {
        cache: Object.values(cacheLists).filter(list => (listIds.cache||[]).indexOf(list.listId) != -1)
            .map(list => list.listId),
        share: shareLists.filter(list => (listIds.share||[]).indexOf(list.shareListId) != -1)
            .map(list => list.shareListId)
    }
    for (const list of Object.values(jsoned)) {
        if (!["workIds"].every(key => Object.keys(list).indexOf(key) != -1)) continue;
        const workIds = list.workIds.filter(workId => workId.match(/\d{5}/)) || [];
        if ([...validListIds.cache, ...validListIds.share].length > 0) {
            await addWorkToLists(workIds, validListIds);
            return;
        } else if (listIds.new && listIds.new=="cache") {
            await autoSplitedList(GLOBAL_cache_prefix + (list.name || `list_${new Date().toLocaleDateString()}`).replace(RegExp(`^${GLOBAL_cache_prefix}`), ""),
                Array.from(new Set(workIds.map(workId => workId.toString()))), true);
        } else if (listIds.new=="share") {
            await autoSplitedList(`list_@${new Date().toLocaleDateString().match(/[\d\/]+/)[0]}`,
                Array.from(new Set(workIds.map(workId => workId.toString()))), false);
        }
    }

}

// ------------------ initial --------------------

async function addInitialButton(url_modeIn = null, area = $(".pageWrapper")) {
    const url_mode = url_modeIn || obtainUrlMode();
    const editArea = $("div.editFooterIn", area);
    $(`a.btnChEx1`, editArea).each((ind, obj) => $(obj).remove());
    if (["viewCacheList"].indexOf(url_mode) != -1) {
        const addBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOpenAddMyList" })
            .append("マイリストに追加").css({ width: "17%" });
        const otherBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOtherMenu aboutCacheList" })
            .append("その他").css({ width: "15%" });
        const renameBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnRenameCacheList" })
            .append("名前変更").css({ width: "15%" });

        editArea.append(addBtn).append(renameBtn).append(otherBtn);
        $("a.btnDelete", editArea).css({ width: "13%", float: "left" });
        $("a.btnCancel", editArea).css({ width: "13%" });
    } else if (["viewList"].some(d => url_mode.indexOf(d) != -1)) {
        const copyBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnCopyList" })
            .append("合成").css({ width: "10%" });
        const copyCacheBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnCopyList aboutCache" })
            .append("合成(Cache)").css({ width: "13%" });
        const deleteBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnDeleteCacheList" })
            .append("削除(Cache)").css({ width: "13%", float: "right" });
        const otherBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOtherMenu aboutViewList" })
            .append("その他").css({ width: "10%" });

        editArea.append(otherBtn).append(copyCacheBtn).append(deleteBtn).append(copyBtn);
        $("a.btnDelete", editArea).css({ width: "13%", float: "left" });
        $("a.btnCancel", editArea).css({ width: "13%" });
        await showCacheList();
    } else {
        const addBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOpenAddMyList" })
            .append("マイリストに追加");
        editArea.append(addBtn);
        $("a.btnDelete", editArea).css({ width: "27%", float: "left" });
        $("a.btnCancel", editArea).css({ width: "27%" });
    }
}

async function showCacheList(containerIn = null, IsPrepended = true) {
    const container = containerIn || $(".pageWrapper");
    $("div.openCacheList.itemModule").each((ind, obj) => $(obj).remove());
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    Object.values(cacheLists).forEach(cacheList => {
        const wrapper = $("div.itemWrapper", container);
        const pngHTMLs = (cacheList.workIds || []).slice(0, 4)
            .map(workId => `https://cs1.anime.dmkt-sp.jp/anime_kv/img/${workId.slice(0, 2)}/${workId.slice(2, 4)}/${workId.slice(4, 5)}/${workId}_1_5.png`)
            .map(link => `<img class="  lazyloaded" src="${link}" data-src="${link}" alt="パッケージ画像">`)
            .concat(Array(4).fill(`<img class="spacer" src="/img/img_lazySpace.gif">`));
        const itemHTML = `
        <div class="itemModule openCacheList mylist " data-cachelistid="${cacheList.listId}" style="background:lightgreen;">
            <input type="hidden" name="cacheListId" value="${cacheList.listId}" class="cacheListId">
            <section class="clearfix">
                <a href="javascript:void(0);" class="openCacheList" data-cachelistid="${cacheList.listId}">
                    <div class="thumbnailContainer">
                        <div class="imgWrap16x9 grid2x2">
                        ${pngHTMLs.slice(0, 4).join("\n")}
                        </div>
                    </div>
                    <h3 class="line2">
                        <span class="ui-clamp webkit2LineClamp">${cacheList.name}</span>
                        <p class="count">${cacheList.workIds.length}</p>
                    </h3>
                </a>
            </section>
            <div class="selectedImg">マイリストを削除</div>
        </div>`
        if (IsPrepended) wrapper.prepend(itemHTML);
        else wrapper.append(itemHTML)
    })
}

function toggleEdit(container, editMode) {
    // toggle Edit mode for new Module
    if (editMode) $("body").addClass("editMode");
    else $("body").removeClass("editMode");
    $(".itemModule", $(container)).map((ind, obj) => {
        if (!editMode) { $(obj).removeClass("selected").removeClass("notSelected"); $(obj).removeClass("edit"); }
        else { $(obj).addClass("notSelected"); $(obj).removeClass("edit"); }
    });
}

// ------------------ about Modal -------------------

async function otherMenuModal(args = { IsViewList: false, workIsSelected: false }) {
    const argsStr = Object.values(args).map(d => d - 0).join("");
    const obtainVariable = {
        "10": { textEx: `すべてのCacheリストをエクスポートします。`, optionIm: [] },
        "11": { textEx: `指定されたCacheリストをエクスポートします。`, optionIm: [["selected", "選択されたリストに"]] },
        "00": { textEx: `現在のCacheリストをエクスポートします。`, optionIm: [["present", "現在のリストに"]] },
        "01": { textEx: `現在のCacheリストをエクスポートします。`, optionIm: [["present", "現在のリストに"]] }
    }
    // for Export Button
    const divExport = $("<li>", { style: "padding:10px;" });
    const headingExport = $("<p>", { class: "h2", style: "text-align:-10px" }).append($("<b>").append("Export List"));
    const btnExport = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnExportCacheList" }).append("エクスポート");
    const textExport = $("<p>", { class: "" }).append(obtainVariable[argsStr].textEx);
    const selectExport = $("<select>", { class: "selectExportCacheList" });
    const optionsContentExport = [["json (インポート可能) で", "json"], ["csv (work Idのみ) で", "csv"], ["text (work Idのみ) で", "txt"]];
    optionsContentExport.forEach(tv => {
        const option = $("<option>").text(tv[0]).val(tv[1]);
        selectExport.append(option);
    });
    divExport.append(headingExport).append(btnExport).append(textExport).append(selectExport);

    // for Import Button
    const divImport = $("<li>", { style: "padding:10px;" });
    const headingImport = $("<p>", { class: "h2", style: "text-align:-10px" }).append($("<b>").append("Import List"));
    const textImport = $("<span>").append(`jsonからCacheリストをインポートします。`);
    const btnImport = $("<a>", { href: "javascript:void(0);", class: "btnChEx1 btnImportCacheList" }).append("インポート");
    const importFile = $("<input>", { type: "file", accept: "*.json", class: "inputImportCacheList", mulitple: "" });
    const selectImport = $("<select>", { class: "check_importToSelectedList" });
    const optionContentImport = [["cache", "新しいCacheリストに"], ["share", "新しいマイリストに"]];
    const additionnalOptions = obtainVariable[argsStr].optionIm;
    [...optionContentImport, ...additionnalOptions].forEach(vt => {
        const option = $("<option>").val(vt[0]).text(vt[1]);
        selectImport.append(option);
    })
    divImport.append(headingImport).append(btnImport).append(textImport).append("<br>").append(importFile).append("<br>").append(selectImport);

    // modal
    const modalId = `DIALOG${Date.now()}`
    const modalHTML = $(`
    <modal id="${modalId}" class="modalDialog modalDialogChEx otherMenuDialog otherMenu${argsStr}" style="overflow-y:scroll;">
        <div class="modalOverlay"></div>
        <div class="generalModal" style="left: 25vw; top: 5vh; width:50vw;overflow-y:scroll;">
            <div class="titleArea">
                <div class="title">その他メニュー</div>
                <div class="closeBtn btnCloseModal"><i class="icon iconCircleClose"></i></div>
            </div>
            <div class="formContainerWrapper">
            <div class="formContainerCover"></div>
            <div class="formContainerIn webkitScrollbar vertical">
            <ul style="text-align:start;">
            </ul>
            </div>
            </div>
            </div>
        </div>
    </modal>`)
    $("ul", modalHTML).append(divExport).append(divImport);
    $("body").append(modalHTML);
    $(`#${modalId} .modalOverlay`).height(Math.max($(`#${modalId} .generalModal`).height(), window.innerHeight));
    return modalId;
}


const work2item = async (workId) => {
    const obtainWorkInfo = async (workId = null) => {
        let count = 0;
        while (workId != null && count++ < 10) {
            const res = await fetch(window.COMMON.RESTAPI_ENDPOINT.partInfo + `?partId=${workId}001`).then(d => d.json());
            if (res.workTitle != null) return res;
        }
        return { workTitle: "" };
    }
    const workInfo = await obtainWorkInfo(workId);
    //console.log(workInfo)
    return `
    <div class="itemModule list mybest" data-workid="${workId}">
        <input type="hidden" name="workId" value="${workId}" class="workId">
        <section class="itemModuleSection">
            <a href="https://anime.dmkt-sp.jp/animestore/ci_pc?workId=${workId}" class="itemModuleIn">
                <div class="thumbnailContainer">
                    <div class="imgWrap16x9"><img class="lazyloaded verticallyLong"
                            src="https://cs1.anime.dmkt-sp.jp/anime_kv/img/${workId.slice(0, 2)}/${workId.slice(2, 4)}/${workId.slice(4, 5)}/${workId}_1_5.png"
                            data-src="https://cs1.anime.dmkt-sp.jp/anime_kv/img/${workId.slice(0, 2)}/${workId.slice(2, 4)}/${workId.slice(4, 5)}/${workId}_1_5.png"
                            width="288" height="162" alt="${workInfo.workTitle}_1"></div>
                </div>
                <div class="textContainer">
                    <div class="textContainerIn">
                        <h3 class="line2"><span class="ui-clamp webkit2LineClamp">${workInfo.workTitle}</span></h3>
                    </div>
                    <!--<ul class="iconContainer">
                        <li><i class="icon iconTextComplete"></i></li>
                    </ul>-->
                </div>
            </a>
            <div class="addMyList edit listen" data-workid="${workId}"><input type="checkbox"
                checked="checked"><label>編集</label></div>
            <ul class="option"></ul>
        </section>
        <!--<div class="selectedImg">選択</div>
        <div class="sortBtnArea onlyLegacySp">
            <div class="btnSort btnSortUp">上へ</div>
            <div class="btnSort btnSortDown">下へ</div>
        </div>
        <div class="dragBtnArea notLegacySp">
            <div class="btnDrag"></div>
        </div>-->
    </div>`
}

async function viewWorksOfCacheListModal(cacheListId) {
    const lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const cacheList = lists[cacheListId];
    if (!cacheList) return;

    const modalId = `DIALOG${Date.now()}`
    const modalHTML = `
    <modal id="${modalId}" class="modalDialog modalDialogChEx viewCacheListDialog" data-cachelistid="${cacheListId}" style="overflow-y:scroll;">
    <div class="modalOverlay" style="overflow-y:hidden;"></div>
    <div class="generalModal" style="left: 3vw; width: 85vw; top:2vh;height:90vh;overflow-y:scroll;">
        <div class="titleArea">
            <div class="title">リスト</div>
            <div class="closeBtn btnCloseModal"><i class="icon iconCircleClose"></i></div>
        </div>
        <div class="formContainerWrapper">
            <div class="formContainerCover"></div>
            <div class="formContainerIn webkitScrollbar vertical">
                <div class="mypageHeader mybest clearfix">
                    <h2 id="myListName" class="listTitle visible"><span class="text">${cacheList.name}</span><span class="count">${cacheList.workIds.length}</span></h2>
                    <div class="editHeader">
                        <form>
                            <label for="editMyListName">${GLOBAL_cache_prefix}</label>
                            <input id="editMyListName" type="text" placeholder="好きな名前を入力して下さい" value="${cacheList.name.replace(RegExp(`^${GLOBAL_cache_prefix}`), '')}">
                        </form>
                    </div>
                    <script>
                        $("#editMyListName").on("keydown", function (e) {
                            if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
                                return false;
                            } else {
                                return true;
                            }
                        });
                    </script>
                    <div class="btnSelectToggle formContainer">
                        <div class="checkboxInnerwrap clearfix">
                            <div class="checkboxList"><input type="checkbox"><label><span>すべて選択</span><span
                                        class="count">${cacheList.workIds.length}</span></label></div>
                        </div>
                    </div>
                    <div class="btnEditCancel"><a href="javascript:void(0);">キャンセル<i class="icon iconEdit"></i></a></div>
                    <div class="btnEdit"><a href="javascript:void(0);">編集する<i class="icon iconEdit"></i></a></div>
                </div>
                <div class="itemWrapper clearfix">
                    ${await Promise.all(cacheList.workIds.map(async workId => await work2item(workId))).then(d => d.join("\n"))}
                </div>
                <div id="loader" class="loader" style="display: none;"><span></span></div>
                <div class="btnSubscript">
                    <div class="btnArea">
                        <a href="mpa_mylists" class="btnPageBack"><i class="icon iconArrowOrangeLeft"></i>マイリスト一覧へ</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </modal>`
    $("body").append(modalHTML);
    const modalGeneral = $(`#${modalId} .generalModal`);
    modalGeneral.append($(".editFooter").clone());
    addInitialButton("viewCacheList", modalGeneral);
    $(`#${modalId} .modalOverlay`).height(Math.max(modalGeneral.height() + 250, window.innerHeight));
}

async function remakeWorksOfCacheListModal(cacheListIdIn = null) {
    const modal = $("modal.viewCacheListDialog");
    const cacheListId = cacheListIdIn || modal.data("cachelistid").toString();

    const lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const cacheList = lists[cacheListId];
    if (!cacheList) return;

    $(".itemWrapper", modal).empty();
    $(".itemWrapper", modal).append(await Promise.all(cacheList.workIds.map(async workId => await work2item(workId))).then(d => d.join("\n")));
    $("#myListName span.text").html(cacheList.name);
    $("#myListName span.count").html(cacheList.workIds.length);

}

const obtainList2HTML = (key, lists) =>
    (lists || []).map((list, ind) => {
        const IsShare = (key == "share");
        const listId = (IsShare) ? list.shareListId : list.listId;
        const listName = (IsShare) ? list.shareListName : list.name;
        const listCount = (IsShare) ? list.count : list.workIds.length;
        return `
    <div class="checkboxList clearfix">
        <a href="javascript:$('.${key}list_${ind}').toggleClass('on');">
            <div class="checkbox ${key}listId ${key}list_${ind}" data-${key}listid="${listId}">
                <i class="${key}list_${ind}"></i>
            </div>
            <div class="label">
                <p class="title line1">
                    <span>${listName}</span>
                    <span class="comment onlyMax">最大50件登録済みです</span>
                    <span class="comment onlyAdded">すでに登録済みです</span>
                    <span class="comment onlyDel">このリストから削除されます</span>
                    <span class="comment onlyAdd">このリストに追加されます</span>
                </p>
                <span class="count">(${listCount})</span>
            </div>
        </a>
    </div>
        `}).join("\n");

async function addMyListModal(container = $(".pageWrapper")) {
    const workIdsTmp = $(".itemModule.selected", container).map((ind, obj) => $(obj).data("workid"));
    const workIds = (workIdsTmp.length > 0) ? workIdsTmp : $(".itemModule.selected>input", container).map((ind, obj) => $(obj).val());
    if (workIds.length == 0) return;
    const shareLists = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));


    // modalAddMyListInが必要
    const modalId = `DIALOG${Date.now()}`
    const modalAddMyList = `
    <modal id="${modalId}" class="modalDialog modalDialogChEx addMyListDialog" style="overflow-y:scroll;">
    <div class="modalOverlay"></div>
    <div class="generalModal" style="left: 25vw; top: 5vh; width:50vw;overflow-y:scroll;">
        <div class="titleArea">
            <div class="title">マイリストに追加</div>
            <div class="closeBtn btnCloseModal"><i class="icon iconCircleClose"></i></div>
        </div>
        <div class="modalAddMyListIn">
            <p>各リストに作品を追加することができます</p>
            <div class="formContainer">
                <div class="formContainerWrapper">
                    <div class="formContainerCover"></div>
                    <div class="formContainerIn webkitScrollbar vertical">
                        <form>
                            ${obtainList2HTML("share", shareLists)}
                            ${obtainList2HTML("cache", Object.values(cacheLists))}
                        </form>
                        <div><a href="javascript:void(0);" class="btnArea btnOpenNewMyList">新しいマイリストを作成</a><i class="icon iconCircleAdd"></i></div>
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
    $(`#${modalId} .modalOverlay`).height(Math.max($(`#${modalId} .generalModal`).height(), window.innerHeight));
    return modalId;
}

async function remakeAddMyListModal() {
    const shareLists = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const modal = $(`modal.addMyListDialog`);
    const form = $("div.formContainerIn form", modal);
    form.empty();
    form.append(obtainCacheListHTML("share", shareLists))
        .append(obtainCacheListHTML("cache", Object.values(cacheLists)));
}

function createMyListModal() {
    const modalId = `DIALOG${Date.now()}`;
    const modalCreateMyList = `
    <modal id="${modalId}" class="modalDialog modalDialogChEx createMyListDialog" style="">
    <div class="modalOverlay"></div>
    <div class="generalModal" style="left: 258px; top: 229.6px;">
        <div class="titleArea">
            <div class="title">新しいマイリストを作成</div>
            <div class="closeBtn btnCloseModal"><i class="icon iconCircleClose"></i></div>
        </div>
        <div class="modalNewMyListIn">
            <p>好きな名前のリストを作って作品を追加できます(最大20件まで)</p>
            <br>
            <p><code>${GLOBAL_cache_prefix}</code>から始まる名前なら、拡張機能内リストとして保存されます。</p>
            <form><input id="newMyListName" type="text" placeholder="好きな名前を入力して下さい"></form>
        </div>
        <script>$("#newMyListName").on("keydown", function(e) {if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {return false;} else {return true;}});</script>
        <div class="btnSingleArea btnArea">
            <a href="javascript:void(0);" class="btnNewMyList">作成する</a>
        </div>
    </div>`
    $("body").append(modalCreateMyList);
    $(`#${modalId} .modalOverlay`).height($(`#${modalId} .generalModal`).height());
    return modalId;

}

//---------others -----------------

const getSyncStorage = (key = null) => new Promise(resolve => {
    chrome.storage.sync.get(key, resolve);
});

const setSyncStorage = (key = null) => new Promise(resolve => {
    chrome.storage.sync.set(key, resolve);
});

//------------------ modified from from common.js -------------

// 作品のマイリスト登録状況を編集(追加削除)する
async function _editMyList(workId, regShareListIdList, delShareListIdList, isEdit) {
    return await _restPost(window.COMMON.RESTAPI_ENDPOINT.registWorkToShareList, {
        workId: workId,
        regShareListIdList: regShareListIdList,
        delShareListIdList: delShareListIdList
    }).catch(function (errorCode) {
        switch (errorCode) {
            case "22": // 公開リスト作品件数超過
                window.COMMON.showToast("公開リスト作品件数が超過しました");
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
                    data: { workId: workId, regShareListIdList: regShareListIdList, delShareListIdList: delShareListIdList, isEdit: isEdit },
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


async function _createShareList(shareListName, isEdit, workId) {
    if (shareListName) {
        // サロゲートペア文字存在チェック
        if (shareListName.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g)) {
            window.COMMON.showToast("使用できない文字が含まれています");
            if (typeof callback === "function") {
                callback(false);
            }
            return;
        }

        // 入力文字数チェック（最大：半角20文字相当※マルチバイト文字は2文字扱い）
        var len = 0;
        for (var i = 0; i < shareListName.length; i++) {
            // パーセントエンコード
            var encodedName = encodeURI(shareListName.charAt(i));
            // 2文字以上になったか？
            if (encodedName.length > 1) {
                // 半角2文字扱いとして加算
                len += 2;
            } else {
                len += 1;
            }
        }

        if (len > 20) {
            window.COMMON.showToast("リスト名は10文字以内で入力してください");
            if (typeof callback === "function") {
                callback(false);
            }
            return;
        }

        return await _restPost(window.COMMON.RESTAPI_ENDPOINT.registShareList, {
            "shareListId": null,
            "shareListName": shareListName,
            "updateType": "1"
        }).catch(function (errorCode) {
            switch (errorCode) {
                case "22": // 公開リスト件数超過
                    window.COMMON.showToast("上限数に達しましたので、作成できません");
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
                        type: "create_shareList",
                        data: { shareListName: shareListName, isEdit: isEdit, workId: workId },
                        timing: "load pageshow"
                    });
                    break;
                default:
                    console.log(errorCode)
                    window.COMMON.showToast("エラーが発生しました");
                    break;
            }
            if (typeof callback === "function") {
                return callback(false);
            }
        });
    } else {
        window.COMMON.showToast("名前が入力されていません");
        if (typeof callback === "function") {
            return callback(false);
        }
    }
}

_restPost = async function (url, json) {
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
                return ((res.error) ? res.error.code : "unknown");
            }
        }).catch(errorMessage => {
            console.log(errorMessage);
        });
};

// -------------- from common.js ----------------


/* 
restPost2 = function (url, json) {
    var deferred = new $.Deferred();
    var func = function (dfd) {
        var args = (typeof url === "string") ? {"url": url, "data": JSON.stringify(json)} : url;
        var param = $.extend({
            type: "post",
            contentType: "application/json",
            dataType: "json",
            cache: false,
            async: true,
            timeout: window.COMMON.API_WEB_TIMEOUT
        }, args);
        var count = 0;
        var self = function() {
            if (!param || !param.url) {
                window.setTimeout(function () {
                    dfd.reject("empty url");
                }, 0);
                return;
            }
            $.ajax(param).done(function (data) {
                //console.log(data)
                data = data || {}; //dataがnullの場合の回避
                if (data.resultCd === "00" || data.resultCd === "01") {
                    dfd.resolve(data.data);
                } else {
                    dfd.reject((data.error) ? data.error.code : "unknown");
                }
            }).fail(function (jqXHR) {
                if (jqXHR.status === 0) {
                    if (++count > window.COMMON.API_RETRY_MAX_COUNT) {
                        dfd.reject("OverRetryCount");
                    } else {
                        window.setTimeout(self, window.COMMON.API_RETRY_INTERVAL);
                    }
                } else {
                    dfd.reject(jqXHR.status);
                }
            });
        };
        return self;
    };
    func(deferred)();
    return deferred.promise();
};
*/

window.COMMON = {
    cookieMap: {},			// cookieをオブジェクト形式で保存したもの
    naviDevice: "",			// デバイス判定用
    naviDevice1: "",		// デバイス判定用2桁目
    naviDevice2: "",		// デバイス判定用1桁目
    memberStatus: "",		// 会員情報
    browser: "",			// UA判定結果
    isTouchDevice: false,	// タッチデバイス判定
    THRESHOLD: 960,			// レイアウト切り替え幅
    API_RETRY_MAX_COUNT: 3,
    API_RETRY_INTERVAL: 500,
    API_NATIVE_TIMEOUT: 1500,
    API_WEB_TIMEOUT: 10000,
    ESCAPED_FRAGMENT: "#!"
};

window.jsUrl = window.jsUrl || "/js/cms/";
window.cssUrl = window.cssUrl || "/css/cms/";

window.COMMON.EXTERNAL_URL = {
    "PlayMovie.js": "/js/PlayMovie.js",								// 動画再生用
    "truncate.min.js": window.jsUrl + "truncate.min.js",			// 複数行省略処理用
    "lazysizes.min.js": window.jsUrl + "lazysizes.min.js",			// 画像遅延読み込み用
    "jquery.minimalect.min.js": window.jsUrl + "jquery.minimalect.custom.min.js",	// カスタムセレクトボックス用
    "modal-general.js": window.jsUrl + "modal-general.js",			// ダイアログ・トースト表示用
    "modal.css": window.cssUrl + "modal.css?3",						// ダイアログ・トースト表示用
    "jquery.transit.min.js": window.jsUrl + "jquery.transit.min.js",	// アニメーション用
    "jquery-ui.min.js": window.jsUrl + "jquery-ui.min.js",			// ツールチップ・オートコンプリート表示用
    "suggest.css": window.cssUrl + "suggest.css",					// オートコンプリート表示用
    "swiper.custom.min.js": window.jsUrl + "swiper.custom.min.js",	// スライダー用
    "swiper.css": window.cssUrl + "swiper.css"						// スライダー用
};

///////////////////////////////////////////////////


// Api関連
///////////////////////////////////////////////////
window.apiUrl = window.apiUrl || "/animestore/rest/";
window.apiOldUrl = window.apiOldUrl || "/animestore/rest/";
window.apiSugotokuUrl = window.apiSugotokuUrl || "/sugotoku/rest/";
window.jsonCfUrl = window.jsonCfUrl || "/html/CF/";
window.jsonBfUrl = window.jsonBfUrl || "/html/BF/";
window.jsonCmsUrl = window.jsonCmsUrl || "/js/cms/";

window.COMMON.RESTAPI_NEW_ENDPOINT = {
    "getRankingWorkList": window.apiUrl + "WS000103", // 指定されたランキングの作品一覧を返却する。
    "getThematicRecommendList": window.apiUrl + "WS000104", // 指定されたテーマ別オススメの作品一覧を返却する。
    "getWordWorkList": window.apiUrl + "WS000105", // 指定されたワードでの検索結果を返却する。
    "getTagWorkList": window.apiUrl + "WS000106", // 指定されたタグに紐付く作品一覧を返却する。
    "getGenreWorkList": window.apiUrl + "WS000107", // 指定されたジャンルに紐付く作品一覧を返却する。
    "getInitialWorkList": window.apiUrl + "WS000108", // 指定されたイニシャルで始まる作品一覧を返却する。
    "getInitialTagList": window.apiUrl + "WS000110", // 指定されたカテゴリに紐付くタグ一覧を返却する。
    "getSeriesWorkList": window.apiUrl + "WS000111", // 指定されたシリーズに紐付く作品一覧を返却する。

    "getPlaylist": window.apiUrl + "WS000113", // プレイリスト一覧を返却する。
    "getPlaylistPartList": window.apiUrl + "WS000114", // 指定されたプレイリストに紐付く話一覧を返却する。
    "getSpecialPointWork": window.apiUrl + "WS000115", // 指定された作品が特定ポイント付与対象か判定する。

    "getTvProgram": window.apiUrl + "WS000118", // TV連動作品の情報を返却する。

    "getClassRecommendList": window.apiUrl + "WS000109", // ユーザのクラスに紐付く作品一覧を返却する。
    "getPlayParam": window.apiUrl + "WS010105", // 引数で指定された動画の再生用パラメータを返却する。
    "pushPermissionUpdate": window.apiUrl + "WS100309", // SUIDとpushID・oldPushIDを基に、サーバ側のPush通知設定を登録状態に更新する。

    "getTutorialWork": window.apiUrl + "WS080101", // 引管理ポータルから登録された「アンケート対象の作品」を返却するAPI
    "registTutorial": window.apiUrl + "WS080302", // チュートリアル画面で選択された作品を受け取り、クラス計算ロジックを通して、所属クラスを取得し、ユーザの属するクラスをテーブルに更新する
    "getMyListStatus": window.apiUrl + "WS100101", // 作品が気になるやマイリストに登録されているかを参照し、登録状況を返却する。
    "getFavoriteTagStatus": window.apiUrl + "WS100117", // タグが配信お知らせ登録されているかを参照し、登録状況を返却する。

    "registFavorite": window.apiUrl + "WS100302", // 気になるへの作品の登録、削除を行う。
    "registMyList": window.apiUrl + "WS100303", // マイリストへの作品の登録、削除を行う。
    "registFavoriteTag": window.apiUrl + "WS100314", // 配信お知らせへの作品の登録、削除を行う。
    "getShareList": window.apiUrl + "WS100104", // 公開リストの一覧及びそのリストに登録されている作品の件数、作品が指定された場合はその作品が各公開リストに登録されているかを取得する。

    "registShareList": window.apiUrl + "WS100305", // 公開リストの追加・更新を行う。
    "registWorkToShareList": window.apiUrl + "WS100306", // 公開リストへの作品の登録を行う。
    "editShareList": window.apiUrl + "WS100321", // 指定された公開リストの登録作品の編集を行う。

    "getAlreadyPartList": window.apiUrl + "WS100107", // 話が視聴済みか否かを判定する。
    "getWatchingPart": window.apiUrl + "WS100108", // 視聴中の話の情報を返却する。

    "point": window.apiUrl + "WS100110", // SUIDを基に、docomoサーバーからユーザーのポイント情報を取得し、JSON形式で返却する。
    "memberContinuationDuration": window.apiUrl + "WS100111", // SUIDを基に、ユーザーの会員継続日数を取得し、JSON形式で返却する。
    "dAccount": window.apiUrl + "WS100113", // SUIDを基に、APL基盤からユーザーのdアカウント情報を取得し、JSON形式で返却する。
    "getTopPageDispInfo": window.apiUrl + "WS100123", // 下記①～③を実施する。①SUIDを基に、docomoサーバーからユーザーのポイント情報を取得する。②SUIDを基に、APL基盤からマスクされたdアカウントを取得する。
    // ③LP基盤からステージ情報を取得する。LP基盤へのアクセスが24時間以内となる場合は前回取得したステージ情報を取得する。上記①～③をレスポンスに設定して返却する。

    "judgeCampaignEntry": window.apiUrl + "WS100124", // SUID、懸賞キャンペーンIDを基に、キャンペーンに応募済か、応募可能かを判定、json形式で返却する。。

    "getRegistDeliveryWorkList": window.apiUrl + "WS100115", // 配信お知らせ登録済みのタグに紐付く、登録後に公開開始した作品一覧を返却する。
    "getRegistFavoriteTagList": window.apiUrl + "WS100116", // 配信お知らせ登録済みのタグ一覧を返却する。

    "getMyList": window.apiUrl + "WS100118", // ユーザがマイリストに登録している作品の一覧を返却する。
    "getWorkFromShareList": window.apiUrl + "WS100120", // ユーザのSUIDと指定された公開リストIDに紐づく公開リスト作品一覧を取得し返却する。マイページでの編集用なので作品index公開期間外のものも取得する。
    "getPublicList": window.apiUrl + "WS100122", // 指定された公開リストIDに紐づく公開リスト作品一覧を取得し返却する。作品index公開期間外のものは取得しない。

    "kisekaeThemeList": window.apiUrl + "WS110101", // 公開中のきせかえテーマ一覧を取得し、JSON形式で返却する。
    "kisekaeGenreColorList": window.apiUrl + "WS110102", // きせかえのジャンル・カラー一覧を取得し、JSON形式で返却する。
    "registKisekaeTheme": window.apiUrl + "WS110103", // きせかえテーマの登録、削除を行う。

    "getProductSalesInfo": window.apiUrl + "WS300101", // 引数で指定された作品の物販用商品情報を返却する。

    "getExistsNewCampaign": window.apiUrl + "WS400102" // 事前公開開始日時または応募開始日時からn日以内で終了していない懸賞キャンペーン・集約キャンペーンの存在有無を返戻する。
};
window.COMMON.RESTAPI_SUGOTOKU_ENDPOINT = {
    "getSugotokuTvProgram": window.apiSugotokuUrl + "WS800101", // 指定された番組表一覧を返却する。
    "getSugotokuAuthResult": window.apiSugotokuUrl + "WS800303", // スゴ得認証結果を受け取る。
    "getSugotokuRankingWorkList": window.apiSugotokuUrl + "WS800102", // 指定されたランキングの作品一覧を返却する。
    "getSugotokuWatchingPart": window.apiSugotokuUrl + "WS800104" // 視聴中の話の情報を返却する。未視聴の場合や、最後に見た話が視聴終了している場合は、01：準正常(話情報無し)を返戻。
};
$.extend(true, window.COMMON.RESTAPI_NEW_ENDPOINT, window.COMMON.RESTAPI_SUGOTOKU_ENDPOINT);

window.COMMON.RESTAPI_OLD_ENDPOINT = {
    "partInfo": window.apiOldUrl + "WS030101", // 有料作品個別ダイアログ情報
    "limitedPartInfo": window.apiOldUrl + "WS040101", // 無料作品個別ダイアログ情報
    "getWorkSerialUserInputInfo": window.apiOldUrl + "WS050101", // シリアル情報
    "getPurchasedState": window.apiOldUrl + "WS060101", // 個別課金情報
    "notice": window.apiOldUrl + "WS070101", // 指定された条件に対して一致する、お知らせ情報をJSON形式で返却する。
    "topics": window.apiOldUrl + "WS070102" // 指定された条件に対して一致する、トピックス情報をJSON形式で返却する。
};

window.COMMON.RESTAPI_DMKT_RECOMMEND_ENDPOINT = {
    "jsonpDmktRecommend": "https://d.dmkt-sp.jp/portal/recommend_jsonp/index.html?startIndex=1&maxResult=20&pageId=174&groupId=1&serviceId=17&sortKind=0",
    "jsonpDmktGoodsRecommend": "https://d.dmkt-sp.jp/portal/goods_rcmd_jsonp/index.html?startIndex=1&maxResult=20&serviceId=17&contentServiceId=17"
};
window.COMMON.RESTAPI_JSONP_ENDPOINT = {
    "jsonpDmktGetMaskCookie": "https://service.smt.docomo.ne.jp/cgi8/id/getmskchkck"
};
$.extend(true, window.COMMON.RESTAPI_JSONP_ENDPOINT, window.COMMON.RESTAPI_DMKT_RECOMMEND_ENDPOINT);

window.COMMON.RESTAPI_ENDPOINT = $.extend({}, window.COMMON.RESTAPI_NEW_ENDPOINT);
$.extend(true, window.COMMON.RESTAPI_ENDPOINT, window.COMMON.RESTAPI_OLD_ENDPOINT);
$.extend(true, window.COMMON.RESTAPI_ENDPOINT, window.COMMON.RESTAPI_JSONP_ENDPOINT);


window.COMMON.showToast = function (text) {
    alert(text);
}
/*
window.COMMON.showToast = function (text) {
    if (!toastQueue && typeof $.showToast === "function") {
        $.showToast(text);
        window.COMMON.showToast = $.showToast;
    } else if (toastQueue) {
        if (!toastQueue.length) {
            window.setTimeout(function () {
                $.getCss(window.COMMON.EXTERNAL_URL["modal.css"]);
                $.getScript(window.COMMON.EXTERNAL_URL["modal-general.js"]).done(function () {
                    $.showToast = $.showToast || window.jQuery.showToast;
                    while (toastQueue.length) {
                        var val = toastQueue.shift();
                        $.showToast(val);
                    }
                    window.COMMON.showToast = $.showToast;
                    toastQueue = undefined;
                }).fail(function () {
                    toastQueue = undefined;
                });
            }, 0);
        }
        if (toastQueue && typeof toastQueue.push === "function") {
            toastQueue.push(text);
        }
    }
};*/