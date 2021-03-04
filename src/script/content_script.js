const GLOBAL_cache_prefix = "cache_";
const GLOBAL_listName_sep = "@@";

const colorSettingsDefault = { workIsColored: true }
const colorSettingsString = JSON.stringify(colorSettingsDefault)

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
        .toArray().join(" ");
    return [url_mode, modalClass].join(" ");
}
const obtainContainer = (url_mode) => {
    if (["viewCacheListDialog"].some(d => url_mode.indexOf(d) != -1)) {
        return $(`modal.viewCacheListDialog`);
    } else return $(".pageWrapper");
}

$(async function () {
    $("div.mypageHeader").attr({ style: "position:-webkit-sticky; position:sticky; top:10px; background:rgba(255,255,255,0.9); z-index:1000;" });

    await addInitialButton(null, null);
    await getSyncStorage({ expandMode: "", colorSettings: colorSettingsString }).then(async items => {
        const expandMode = items.expandMode;
        await expandPage(expandMode);
        const colorSettings = JSON.parse(items.colorSettings);
        if (colorSettings.workIsColored) await colorItemWork();
    })
    if (location.href.indexOf("://anime.dmkt-sp.jp/animestore/mpa_shr_pc?shareListId=") != -1) {
        $(".pageWrapper > div.headerSubTab > ul > li.current > a").attr({ href: "mpa_mylists_pc"}).css({cursor:"pointer", "pointer-events":"auto"});
    }
    await sortLists({initial:true});
    //await saveFavorites();
    await saveShareLists();
    await setSortLists();

    document.addEventListener("click", async function (e) {
        const url_mode = obtainUrlMode();
        const container = obtainContainer(url_mode);
        const IsEditMode = $("body").is(".editMode");
        if ($(e.target).is(".itemModule.mylist.openCacheList *")) {
            const cacheListId = $(e.target).parents("a:eq(0)").data("cachelistid").toString();
            await viewWorksOfCacheListModal(cacheListId);
        } else if ($(e.target).is(".btnOpenAddDeleteMyList")) {
            await addDeleteMyListModal(container);
        } else if ($(e.target).is(".btnOpenNewMyList")) {
            createMyListModal();
        } else if ($(e.target).is(".btnOperateFav")) {
            if ($(".itemModule.list.selected", container).length == 0) return;
            const workIdsTmp = $(".itemModule.list.selected", container).map((ind, obj) => $(obj).data("workid"));
            const workIds = (workIdsTmp.length > 0) ? workIdsTmp.toArray().map(d => d.toString()) :
                $(".itemModule.list.selected>input", container).map((ind, obj) => $(obj).val().toString()).toArray();
            const operateStatus = ($(e.target).is(".Add")) ? 1 : 2;
            const cycleNum = parseInt(workIds.length / 50) + 1;
            for (const cycle of [...Array(cycleNum).keys()]) {
                const workIdsSplited = workIds.slice(cycle * 50, (cycle + 1) * 50); // 一度の上限が50くらい?
                const res = await _registFavoriteWorkOrTag(workIdsSplited, operateStatus);
                //console.log(res);
            }
            if (["viewFav"].some(d => url_mode.indexOf(d) != -1)) location.reload();
            //toggleEdit(container, false);
            if ($(e.target).is("modal.otherMenuDialog *")) $("modal.otherMenuDialog").remove();
            //await saveFavorites();
            // 告知modal: 気になるリストに追加/削除されました。
        } else if ($(e.target).is(".btnNewMyList")) {
            const newMyListName = $("#newMyListName").val();
            await createNewList(newMyListName);
            await remakeaddDeleteMyListModal();
            $(`modal.createMyListDialog`).remove();
            // 告知modal: 新しいマイリストが作成されました。
        } else if ($(e.target).is(".editFooter .btnCopyList")) {
            await copyList($(e.target).is(".aboutCache"));
            toggleEdit(container, false);
            // 告知modal: ……作品が含まれる「……」が作成されました。
            if (!$(e.target).is(".aboutCache")) location.reload();
        } else if ($(e.target).is(".editFooter .btnDeleteCacheList")) {
            const selectedCacheLists = $(".contentsWrapper .itemWrapper .itemModule.mylist.selected>input.cacheListId");
            if (selectedCacheLists.length == 0) return;
            const selectedCacheIds = selectedCacheLists.map((ind, obj) => $(obj).val()).toArray();
            await deleteCacheList(selectedCacheIds);
            toggleEdit(container, false);
            await showCacheList();
        } else if ($(e.target).is(".btnOtherMenu")) {
            const IsViewList = $(e.target).is(".aboutViewList");
            const workIsSelected = $(".itemModule.list.selected>input", container).length > 0;
            otherMenuModal({ IsViewList, workIsSelected });
        } else if ($(e.target).is(".btnExpandPage")) {
            // expand items
            await expandPage($(e.target).attr("class"));
        } else if ($(e.target).is(".btnDecideList")) {
            // expand items
            await setSortLists();
            toggleEdit(container, false);
        } else if ($(e.target).is("modal.modalDialogChEx *")) {
            const modal = $(e.target).parents("modal");
            if ($(e.target).is(".closeBtn *, .closeBtn")) {
                if (IsEditMode) toggleEdit(container, false);
                modal.remove();
            } else if ($(e.target).is(".btnAddMyList, .btnDeleteMyList")) {
                const workIdsTmp = $(".itemModule.list.selected", container).map((ind, obj) => $(obj).data("workid"));
                const workIds = (workIdsTmp.length > 0) ? workIdsTmp.toArray().map(d => d.toString()) :
                    $(".itemModule.list.selected>input", container).map((ind, obj) => $(obj).val()).toArray();
                const sharelistIds = $(".sharelistId.on", modal).map((ind, obj) => $(obj).data("sharelistid").toString()).toArray();
                const cachelistIds = $(".cachelistId.on", modal).map((ind, obj) => $(obj).data("cachelistid").toString()).toArray();
                if ($(e.target).is(".btnAddMyList")) await addWorkToLists(workIds, { cache: cachelistIds, share: sharelistIds });
                else await deleteWorkFromLists(workIds, { cache: cachelistIds, share: sharelistIds });
                $("modal.addDeleteMyListDialog").remove();
                // 告知modal: ……作品が追加されました。作品数が上限に達していたので、自動的に「……」が作成されました。
                //toggleEdit(container, false);
                if (["viewList"].some(d => url_mode.indexOf(d) != -1)) await showCacheList();
                if (["viewCacheListDialog"].some(d => url_mode.indexOf(d) != -1)) {
                    const cacshListIdNow = $("modal.viewCacheListDialog").data("cachelistid").toString();
                    if (cachelistIds.indexOf(cacshListIdNow) != -1) {
                        await remakeWorksOfCacheListModal({ delete: workIds });
                    }
                }
                console.log("done");
            } else if ($(e.target).is($(".btnEdit *,.btnEditCancel *, .btnCancel"))) {
                // toggle Edit mode for new Module
                const IsEdit = $(e.target).is(".btnEdit *");
                toggleEdit($(e.target).parents(".formContainerIn"), IsEdit);
                const selectedWorks = $(".formContainerIn .itemModule.list.selected", modal);
                $(".btnDelete span", modal).html(selectedWorks.length);
                await triggerDrag({ IsEdit, mode: "viewCacheListDialog" });
            } else if (IsEditMode && $(e.target).is(".btnSelectToggle *, .btnSelectToggle")) {
                const toggleArea = $(e.target).parents(".btnSelectToggle");
                toggleArea.toggleClass("checked");
                $(".itemModule.list", $(e.target).parents(".formContainerIn")).map((ind, obj) => {
                    if (toggleArea.is(".checked")) $(obj).addClass("selected").removeClass("notSelected");
                    else $(obj).removeClass("selected").addClass("notSelected");
                });
                const selectedWorks = $(".formContainerIn .itemModule.list.selected", modal);
                $(".btnDelete span", modal).html(selectedWorks.length);
            } else if (IsEditMode && $(e.target).is(".itemModule *")) { // list, mylist 両方?
                const itemModule = $(e.target).parents(".itemModule");
                $(itemModule).toggleClass("selected").toggleClass("notSelected");
                const selectedWorks = $(".formContainerIn .itemModule.list.selected", modal);
                $(".btnDelete span", modal).html(selectedWorks.length);
            } else if (IsEditMode && $(e.target).is(".editFooter *")) {
                const cacheListId = modal.data("cachelistid").toString();
                if ($(e.target).is(".btnDelete, .btnDelete *")) {
                    const selectedWorks = $(".formContainerIn .itemModule.list.selected", modal);
                    if (selectedWorks.length == 0) return;
                    const selectedWorkIds = selectedWorks.map((ind, obj) => $(obj).data("workid").toString()).toArray();
                    await deleteWorkFromLists(selectedWorkIds, { cache: [cacheListId] });
                    // 告知modal: 「……」から……作品が削除されました。
                    toggleEdit(modal, false);
                    await remakeWorksOfCacheListModal({ delete: selectedWorkIds })
                    await showCacheList();
                } else if ($(e.target).is(".btnDecideCacheList")) {
                    let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(d => JSON.parse(d.lists));
                    const newName = GLOBAL_cache_prefix + $("#editMyListName").val();
                    lists[cacheListId].name = newName;
                    const sortIndexs = $("modal.viewCacheListDialog .itemModule.list").map((ind, obj) => $(obj).data("sort-index")).toArray();
                    if (sortIndexs != [...Array(sortIndexs.length).keys()]) {
                        const workIdsTmp = lists[cacheListId].workIds;
                        lists[cacheListId].workIds = workIdsTmp.slice().sort((a, b) => sortIndexs[workIdsTmp.indexOf(a)] - sortIndexs[workIdsTmp.indexOf(b)]);
                    }
                    await setSyncStorage({ lists: JSON.stringify(lists) });
                    // 告知modal: ……から……へ名前が変更されました。
                    await remakeWorksOfCacheListModal({ changed: true });
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
                            .map(key => Object({ [key]: $(`.pageWrapper .itemModule.mylist.selected>input.${key}ListId`).map((ind, obj) => $(obj).val().toString()).toArray() }))),
                        "00": async () => Object({ cache: $("modal.viewCacheListDialog").data("cachelistid").toString(), share: [] }),
                        "01": async () => Object({ cache: $("modal.viewCacheListDialog").data("cachelistid").toString(), sahre: [] })
                    }
                    await exportList(await obtainExportIds[otherMenuPar](), format);
                    // 告知modal: ~をふくむ「…….json」がダウンロードされました。
                } else if ($(e.target).is(".btnImportCacheList")) {

                    const inputFiles = await $(".inputImportCacheList", $(e.target).parents(".generalModal")).prop("files");
                    if (inputFiles.length == 0) return;
                    const importTarget = $(".check_importToSelectedList", $(e.target).parents(".generalModal")).val();
                    const obtainImportIds = {
                        present: () => Object({ cache: $("modal.viewCacheListDialog").data("cachelistid").toString(), share: [] }),
                        selected: () => Object.assign(...["cache", "share"]
                            .map(key => Object({
                                [key]: $(`.pageWrapper .itemModule.mylist.selected>input.${key}ListId`)
                                    .map((ind, obj) => $(obj).val().toString()).toArray()
                            }))),
                        cache: () => Object({ new: "cache" }),
                        share: () => Object({ new: "share" })
                    };
                    const importIds = await obtainImportIds[importTarget]();
                    for (const ind of [...Array(inputFiles.length).keys()]) {
                        await importList(await inputFiles[ind].text(), importIds);
                    };
                    if (url_mode.indexOf("viewList") == -1) await remakeWorksOfCacheListModal();
                    toggleEdit(container, false);
                    otherMenuModal.remove();
                    await showCacheList();
                    // 告知modal: 「…….json」により[……]へ……作品がインポートされました。
                }
            }
        }
    })

    let beforeClass = "";
    const observer = new MutationObserver(async records => {
        for (const record of records) {
            if (record.attributeName == "class") {
                const attrVal = $(record.target).attr(record.attributeName);
                //$(".mypageHeader div.btnOpenAddMyListArea").css({ visibility: attrVal.indexOf("editMode") != -1 ? "visible" : "hidden" })
                const IsEdit = attrVal.indexOf("editMode") != -1 && beforeClass.indexOf("editMode") == -1;
                const WasEdit = attrVal.indexOf("editMode") == -1 && beforeClass.indexOf("editMode") != -1;
                if (IsEdit) await triggerDrag({ IsEdit: true, mode: "viewList" });
                else if (WasEdit) await triggerDrag({ IsEdit: false, mode: "viewList" });
                beforeClass = attrVal;
            }
            if (record.type == "childList") {
                $("html").css({ "overflow-y": $("body modal").length > 0 ? "hidden" : "" });
            }
        }
    });
    const config = { attributes: true, childList: true };
    observer.observe($("body")[0], config);
})

const triggerDrag = async (args = { IsEdit, mode }) => {
    const mode_dic = {
        viewList: { class: "mylist", wrapper: ".pageWrapper",
            remakeFunc: async () => await sortLists({initial:true}) },
        viewCacheListDialog: { class: "list", wrapper: "modal.viewCacheListDialog",
            remakeFunc: async () => await remakeWorksOfCacheListModal({ reset: true }) }
    }
    if (Object.keys(mode_dic).indexOf(args.mode) == -1) return;
    if (args.IsEdit) await dragItemEditMode($(mode_dic[args.mode].wrapper));
    else await mode_dic[args.mode].remakeFunc();
}

// ----------------- edit List --------------------

async function copyList(IsCached) {
    const selectedLists = $(".pageWrapper .itemWrapper .itemModule.mylist.selected");
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
    const listName = $("h3 .ui-clamp", selectedLists[0]).text().replace(RegExp(`${GLOBAL_listName_sep}.*$`), "")
        + `${GLOBAL_listName_sep}${new Date().toLocaleDateString().match(/[\d\/]+/)}`;
    await autoSplitedList(listName, workIds, IsCached);
}

async function autoSplitedList(coreNameIn, workIds, IsCached = false) {
    const cycleNum = Math.floor(workIds.length / 50 + 1);
    const coreName = (IsCached ? GLOBAL_cache_prefix : "") + coreNameIn.replace(RegExp(`^${GLOBAL_cache_prefix}|${GLOBAL_listName_sep}.*$`, "g"), "");
    const dateNum = Date.now() - 0;
    if (IsCached) {
        const lists_res = await createNewList(coreName);
        let lists = lists_res.lists;
        lists[lists_res.listId].workIds.push(...workIds);
        await setSyncStorage({ lists: JSON.stringify(lists) });
    }
    else {
        const sharelistIds = await Promise.all([...Array(cycleNum).keys()].map(async cycle => {
            const listName = coreName.replace(RegExp(`${GLOBAL_listName_sep}.*$`), "").slice(0, 10) + GLOBAL_listName_sep + (dateNum + cycle).toString().slice(6, 20);
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

async function createNewList(listName = "") {
    if (RegExp(`^${GLOBAL_cache_prefix}`).test(listName)) {
        let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
        const listId = `${GLOBAL_cache_prefix}${Date.now()}`;
        const newList = { madeDate: Date.now(), name: listName, exportIds: [], workIds: [], listId: listId };
        lists[listId] = newList;
        await setSyncStorage({ lists: JSON.stringify(lists) });
        return { listId, lists };
    } else {
        return await _createShareList(listName, true, "").then(d => ({ listId: d.shareListId }));
    }
}

async function deleteCacheList(selectedCacheIds) {
    let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    selectedCacheIds.forEach(key => delete lists[key]);
    //console.log(lists)
    await setSyncStorage({ lists: JSON.stringify(lists) });
}

async function addWorkToLists(workIdsIn, listsDic) {
    const shareListIds = Array.from(new Set(listsDic.share));
    const cacheListIds = Array.from(new Set(listsDic.cache));
    if (shareListIds.length > 0) {
        const shareLists = await getSyncStorage({ shareLists: JSON.stringify({}) }).then(items => JSON.parse(items.shareLists));
        let shareAddInfos = Object.assign(...shareListIds.map(listId => ({ [listId]: { count: shareLists[listId].workIds.length, listId: listId } })));
        for (const workId of workIdsIn) {
            const shareListIdsTmp = await shareListIds
                .reduce(async (acc, cur) => {
                    const listId = cur;
                    if (shareLists[listId].workIds.indexOf(workId) != -1) return acc;
                    if (shareAddInfos[listId].count % 50 == 0) {
                        const listName = shareLists[listId].name.replace(RegExp(`${GLOBAL_listName_sep}.*$`), "").slice(0, 10)
                            + GLOBAL_listName_sep + (Date.now()).toString().slice(6, 20);
                        shareAddInfos[listId].listId = await createNewList(listName).then(d => d.listId);
                    }
                    shareAddInfos[listId].count += 1;
                    return acc.concat(shareAddInfos[listId].listId)
                }, []);

            if (shareListIdsTmp.length == 0) continue;
            await _editMyList(workId, shareListIdsTmp, []);
        };
        await saveShareLists(shareListIds);
    }
    if (cacheListIds.length > 0) {
        let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
        for (const cacheListId of cacheListIds) {
            if (!lists[cacheListId]) continue;
            lists[cacheListId].workIds = Array.from(new Set([...lists[cacheListId].workIds, ...workIdsIn]));
        }
        await setSyncStorage({ lists: JSON.stringify(lists) });
    }
}

async function deleteWorkFromLists(workIdsIn, listsDic) {
    const shareListIds = Array.from(new Set(listsDic.share));
    const cacheListIds = Array.from(new Set(listsDic.cache));
    if (shareListIds.length > 0) {
        const shareLists = await getSyncStorage({ shareLists: JSON.stringify({}) }).then(items => JSON.parse(items.shareLists));
        for (const workId of workIdsIn) {
            const shareListIdsTmp = Object.values(shareLists).filter(list => list.workIds.indexOf(workId) == -1).map(list => list.listId);
            if (shareListIdsTmp.length == 0) continue;
            await _editMyList(workId, [], shareListIdsTmp);
        };
        await saveShareLists(shareListIds);
    }
    if (cacheListIds.length > 0) {
        let lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
        for (const cacheListId of cacheListIds) {
            if (!lists[cacheListId]) continue;
            lists[cacheListId].workIds = lists[cacheListId].workIds.filter(workId => workIdsIn.indexOf(workId) == -1);
        }
        await setSyncStorage({ lists: JSON.stringify(lists) });
    }
}

// ------------------ import / export------------


async function exportList(listIds = { cache: [], share: [] }, formatIn = null) {
    const format = formatIn || "json";
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const shareLists = await getSyncStorage({ shareLists: JSON.stringify({}) }).then(items => JSON.parse(items.shareLists));
    const validLists = {
        cache: Object.assign(...Object.values(cacheLists).filter(list => listIds.cache.indexOf(list.listId) != -1)
            .map(list => ({
                [list.listId]: {
                    name: list.name.replace(RegExp(`^${GLOBAL_cache_prefix}|${GLOBAL_listName_sep}.*$`, "g"), ""),
                    workIds: list.workIds,
                    listId: list.listId
                }
            })), {}),
        share: Object.assign(...Object.values(shareLists).filter(list => listIds.share.indexOf(list.shareListId) != -1)
            .map(list => ({
                [list.listId]: {
                    name: list.name.replace(RegExp(`${GLOBAL_listName_sep}.*$`, "g"), ""),
                    workIds: list.workIds,
                    listId: list.listId
                }
            })), {})
    }

    const obtainContent = {
        json: lists => JSON.stringify(lists),
        csv: lists => "# format:csv\n" + Object.values(lists).map(list => list.workIds.join(",")).join("\n"),
        tsv: lists => "# format:tsv\n" + Object.values(lists).map(list => list.workIds.join("\t")).join("\n"),
        txt: lists => "# format:txt\n" + Object.values(lists).map(list => list.workIds.join("\n")).join("\n\n")
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
    const obtainJsonParse = (text) => {
        try { return JSON.parse(text); }
        catch { return null; }
    }
    const obtainParse = {
        csv: text => Object.assign(...split_data(text).filter(d => /^[^#]/.test(d))
            .map((line, ind) => Object({ ["csv" + ind]: { name: "", workIds: line.split(",") } }))),
        tsv: text => Object.assign(...split_data(text).filter(d => /^[^#]/.test(d))
            .map((line, ind) => Object({ ["tsv" + ind]: { name: "", workIds: line.split("\t") } })))
    }
    const jsonContent = obtainJsonParse(textIn);
    const format = (jsonContent) ? "" : textIn.match(/(?<=^#.*format:)[\S]+/)[0];
    const parsedContent = (format) ? obtainParse[format](textIn) : jsonContent;
    if (!parsedContent) return;
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const shareLists = await getSyncStorage({ shareLists: JSON.stringify({}) }).then(items => JSON.parse(items.shareLists));
    //const shareLists = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const validListIds = {
        cache: Object.values(cacheLists).filter(list => (listIds.cache || []).indexOf(list.listId) != -1)
            .map(list => list.listId),
        share: Object.values(shareLists).filter(list => (listIds.share || []).indexOf(list.listId) != -1)
            .map(list => list.listId)
    }
    for (const list of Object.values(parsedContent)) {
        if (!["workIds"].every(key => Object.keys(list).indexOf(key) != -1)) continue;
        const workIds = list.workIds.filter(workId => workId.match(/\d{5}/)) || [];
        if ([...validListIds.cache, ...validListIds.share].length > 0) {
            await addWorkToLists(workIds, validListIds);
            return;
        } else if (listIds.new && listIds.new == "cache") {
            await autoSplitedList(GLOBAL_cache_prefix + (list.name.replace(RegExp(`${GLOBAL_listName_sep}.*$`), "") || `list${GLOBAL_listName_sep}${new Date().toLocaleDateString()}`)
                .replace(RegExp(`^${GLOBAL_cache_prefix}`), ""),
                Array.from(new Set(workIds.map(workId => workId.toString()))), true);
        } else if (listIds.new == "share") {
            await autoSplitedList(`list${GLOBAL_listName_sep}${new Date().toLocaleDateString().match(/[\d\/]+/)}`,
                Array.from(new Set(workIds.map(workId => workId.toString()))), false);
        }
    }
}




// ------------------ initial --------------------

async function addInitialButton(url_modeIn = null, areaIn = null) {
    const area = areaIn || $(".pageWrapper");
    const url_mode = url_modeIn || obtainUrlMode();
    const editArea = $("div.editFooterIn", area);
    $(`a.btnChEx1`, editArea).remove();
    if (["viewCacheListDialog"].some(d => url_mode.indexOf(d) != -1)) {
        const btns = {
            addDelete: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOpenAddDeleteMyList" })
                .append("リストに追加/削除").css({ width: "19%" }),
            rename: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnDecideCacheList" })
                .append("名称/順番確定").css({ width: "15%" }),
            other: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOtherMenu aboutCacheList" })
                .append("その他").css({ width: "15%" }),
            delete: $("<a>", { href: "javascript:void(0)", class: "btnDelete", id:"sharelistDel" })
            .append("削除").css({ width: "13%", float: "left" })
        }
        Object.values(btns).map(btn => editArea.append(btn));
        $("a.btnCancel", editArea).css({ width: "13%" });
    } else if (["viewList"].some(d => url_mode.indexOf(d) != -1)) {
        const btns ={
            copy: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnCopyList" })
                .append("合成").css({ width: "10%" }),
        copyCache: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnCopyList aboutCache" })
            .append("合成(Cache)").css({ width: "13%" }),
        decide : $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnDecideList" })
            .append("順番決定").css({ width: "13%" }),
        other: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOtherMenu aboutViewList" })
            .append("その他").css({ width: "10%" }),
        delete: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnDeleteCacheList" })
            .append("削除").css({ width: "13%" })}

        Object.values(btns).forEach(btn=>editArea.append(btn));

        $("a.btnDelete", editArea).remove();
        $("a.btnCancel", editArea).css({ width: "13%" });
        await showCacheList();
    } else if (["viewFav"].some(d => url_mode.indexOf(d) != -1)) {
        const addBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOpenAddDeleteMyList" })
            .append("リストに追加/削除");
        const favBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOperateFav Delete" })
            .append("気になるから削除");
        editArea.append(addBtn).append(favBtn);
        $("a.btnDelete", editArea).css({ width: "13%", float: "left" });
        $("a.btnCancel", editArea).css({ width: "13%" });
    } else {
        const addBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOpenAddDeleteMyList" })
            .append("リストに追加/削除");
        const favBtn = $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOperateFav Add" })
            .append("気になるに追加");
        editArea.append(addBtn).append(favBtn);
        $("a.btnDelete", editArea).css({ width: "13%", float: "left" });
        $("a.btnCancel", editArea).css({ width: "13%" });
    }
    if (!["viewList", "editList", "Dialog"].some(d => url_mode.indexOf(d) != -1)) {
        //console.log(url_mode)
        const ul = $(".pageWrapper ul.onlyPcLayout");
        const pageCurrent = $("li.current", ul).text().match(/\d+/) - 0;
        const pageLength = $("li:last", ul).text().match(/\d+/) - 0;
        const btnDiv = $("<div>", { style: "float:left;font-size:12px;" })
            .append(`拡張表示する:`);
        const btnExpand = {
            All: $("<a>", { href: "javascript:void(0);", class: "btnExpandPage All" })
                .append(` 1-${pageLength}ページ `),
            Five: $("<a>", { href: "javascript:void(0);", class: "btnExpandPage Five" })
                .append(` ${pageCurrent}-${Math.min(pageCurrent + 4, pageLength)}ページ `),
            Reverse: $("<a>", { href: "javascript:void(0);", class: "btnExpandPage Reverse" })
                .append(` 戻す `)
        };

        Array.from([pageCurrent - 5, pageCurrent + 5])
            .filter(num => !(num >= pageLength || num < 1))
            .forEach((num, ind) => {
                if (num != 1) {
                    $(`li.cut:eq(${ind})`, ul).empty();
                    $(`li.cut:eq(${ind})`, ul)
                        .append($("<a>", { href: "javascript:void(0);", onclick: `pageLink(${num})` })
                            .append(num));
                }
            });

        $(".mypageHeader .btnExpandPage", area).remove();
        Object.values(btnExpand).forEach(btn => btnDiv.append(btn));
        $(".mypageHeader", area).append(btnDiv);
    }
}

async function showCacheList(args={container: null, IsPrepended : true}) {
    const container = args.container || $(".pageWrapper");
    $("div.openCacheList.itemModule.mylist").remove();
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
        if (args.IsPrepended) wrapper.prepend(itemHTML);
        else wrapper.append(itemHTML)
    })
}

async function sortLists(args={initial:false}){
    const sortListIndexes= await getSyncStorage({sortListIndex:JSON.stringify({})}).then(items=>JSON.parse(items.sortListIndex));
    const listDOMs=$(".pageWrapper .itemModule.mylist");
    inds=listDOMs.clone().map((ind,obj)=>sortListIndexes[$("input[type='hidden']", obj).val()] )
    const listClone=listDOMs.clone().slice().sort((a,b)=>{
        const indexes=[a,b].map(d=>$("input[type='hidden']", d).val())
            .map(d=> sortListIndexes[d] || 0);
        return indexes[0]-indexes[1];
    }).toArray();
    if (args.initial){
        listDOMs.each((ind,obj)=>{
            const idTmp=$("input[type='hidden']", obj).val();
            if (ind!=sortListIndexes[idTmp]) $(obj).replaceWith(listClone[ind]);
        });
        /*const wrapper=$(".pageWrapper .itemWrapper");
        wrapper.empty();
        wrapper.append(listClone.map(d=>$(d).prop("outerHTML")).join("\n") )*/
        return;
    }
    listDOMs.each((ind,obj)=>{
        const indexTmp=$(obj).data("sort-index");
        if ($(obj).data("sort-index")==null) $(obj).replaceWith(listClone[ind]);
        else if (indexTmp!=ind) $(obj).replaceWith(listClone[ind]);
    })
}

async function setSortLists(){
    const sortIndexes=Object.assign(...$(".pageWrapper .itemModule.mylist")
        .map((ind, obj)=> ({[$("input[type='hidden']", obj).val()]: ind}) ).toArray());
    await setSyncStorage({sortListIndex:JSON.stringify(sortIndexes)});
}

function toggleEdit(container, editMode) {
    // toggle Edit mode for new Module
    if (editMode) $("body").addClass("editMode");
    else $("body").removeClass("editMode");
    $(".itemModule", $(container)).map((ind, obj) => { // list, mylist 両方
        if (!editMode) { $(obj).removeClass("selected").removeClass("notSelected"); $(obj).removeClass("edit"); }
        else { $(obj).addClass("notSelected"); $(obj).removeClass("edit"); }
    });
}


async function expandPage(btnClass = "All") {
    const beforeExpandArea = $(".pageWrapper div.itemWrapper.clearfix .itemForExpand");
    if (beforeExpandArea.length > 0) beforeExpandArea.remove();
    const expandMode = ["All", "Five", "Reverse"].filter(d => btnClass.indexOf(d) != -1)[0];
    $(`.btnExpandPage`).css({ color: "" });
    if (!expandMode || expandMode == "Reverse") {
        const itemCount = $("div.itemWrapper.clearfix .itemModule.list").length;
        $(".pageWrapper div.mypageHeader div.btnSelectToggle.formContainer label span.count").text(itemCount);
        await setSyncStorage({ expandMode: "" });
        return;
    }

    const ul = $(".pageWrapper ul.onlyPcLayout");
    const pageCurrent = $("li.current", ul).text().match(/\d+/) - 0;
    const pageLength = $("li:last", ul).text().match(/\d+/) - 0;
    const urlTmp = location.href.replace(/(?<=\?.*)selectPage=\d+/, "");
    const sepTmp = [[/[\?&]$/, ""], [/\?/, "&"], [/.*/, "?"]].filter(d => d[0].test(urlTmp)).map(d => d[1])[0];
    const urlBase = urlTmp + sepTmp + "selectPage=";
    const obtainRange = {
        All: { length: pageLength - 1, first: 2 },
        Five: { length: Math.min(4, pageLength - pageCurrent), first: pageCurrent + 1 }
    }
    const pageRange = obtainRange[expandMode];
    if (!pageRange) return;

    const itemHTMLs = await Promise.all([...Array(pageRange.length).keys()].map(d => d + pageRange.first).map(async pageNum => {
        const content = await obtainStreamBody(`${urlBase}${pageNum}`);
        return $("div.itemWrapper.clearfix", content).html();
    }));
    $(`.btnExpandPage.${expandMode}`).css({ color: "orange" });
    $(".pageWrapper div.itemWrapper.clearfix").append($("<div>", { class: `itemForExpand ${expandMode}` }).append(itemHTMLs.join("\n")));
    const itemCount = $("div.itemWrapper.clearfix .itemModule.list").length;
    $(".pageWrapper div.mypageHeader div.btnSelectToggle.formContainer label span.count").text(itemCount);
    await setSyncStorage({ expandMode: expandMode });
}

async function colorItemWork(wrapperIn = null) {
    const wrapper = wrapperIn || $(".pageWrapper .itemWrapper");
    const itemModules = $(".itemModule.list", wrapper);
    if (itemModules.length == 0) return;

    const items = await getSyncStorage({ lists: JSON.stringify({}) });
    const workIdsTmp = $(".itemModule.list", wrapper).map((ind, obj) => $(obj).data("workid"));
    const workIds = (workIdsTmp.length > 0) ? workIdsTmp.toArray().map(d => d.toString()) :
        $(".itemModule.list>input", wrapper).map((ind, obj) => $(obj).val()).toArray();
    const favWorkIds = await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyListStatus + "?targetFlag=10&workIdList=" + workIds.join("_")).then(d => d.json())
        .then(d => d.data.statusList.filter(d => d.favoriteStatus == "1").map(d => d.workId))
    const shareWorkIds = await fetch(window.COMMON.RESTAPI_ENDPOINT.getMyList).then(d => d.json()).then(d => d.data.workList.map(d => d.workId))
    const ListColors = {
        "fav": { color: "yellow", workIds: favWorkIds },
        "cache": { color: "lightgreen", workIds: Object.values(JSON.parse(items.lists)).map(list => list.workIds).flat() },
        "share": { color: "lightblue", workIds: shareWorkIds }
    }
    itemModules.each((ind, obj) => {
        const workIdTmp = workIds[ind];
        const colors = Object.entries(ListColors).filter(kv => kv[1].workIds.indexOf(workIdTmp) != -1).map(kv => kv[1].color);
        if (colors && colors.length > 0) {
            $(obj).css({ background: `linear-gradient(-135deg, ${colors.join(",")}, 70%, white 100%)` })
        }
    })
}

async function saveShareLists(shareListIdsIn = null) {
    const shareListIds = shareListIdsIn || await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList)
        .then(d => d.json()).then(res => res.data.shareList.map(list => list.shareListId));
    const shareLists = await Promise.all(shareListIds
        .map(async listId => ({
            [listId]: await fetch(window.COMMON.RESTAPI_ENDPOINT.getWorkFromShareList + `?shareListId=${listId}`)
                .then(d => d.json())
                .then(d => ({ workIds: d.data.workList.map(work => work.workId), name: d.data.shareListName, listId: listId }))
        })))
        .then(dics => Object.assign(...dics));
    const shareListsOld = (shareListIdsIn) ? await setSyncStorage({ shareLists: JSON.stringify({}) }) : {};
    await setSyncStorage({ shareLists: JSON.stringify(Object.assign(shareListsOld, shareLists)) });
    return shareLists;
}

/* async function saveFavorites() {
    const urlFav = "https://anime.dmkt-sp.jp/animestore/mpa_fav_pc";
    const htmlContent=await obtainStreamBody(urlFav);
    const itemFirst=$("div.itemWrapper.clearfix .itemModule.list input", htmlContent);
    const ul=$("ul.onlyPcLayout", htmlContent);
    const pageLength=$(`li:last`, ul).text().match(/\d+/)-0;
    const urlBase=`${urlFav}?selectPage=`;
    const pageRange={first:2, length:pageLength-1};
    const itemHTMLs_tmp = await Promise.all([...Array(pageRange.length).keys()]
        .map(d => d + pageRange.first).map(async pageNum => {
            const content = await obtainStreamBody(`${urlBase}${pageNum}`);
            return $("div.itemWrapper.clearfix .itemModule.list input", content);
    }));
    const itemHTMLs=[itemFirst, ...itemHTMLs_tmp];
    //const favWorkIds=itemHTMLs.map(wrapper=>$(".itemModule.list input", wrapper).map((ind, obj)=>$(obj).val()).toArray()).flat();
    //const favWorkIds=itemHTMLs.map(wrapper=>$(wrapper).map((ind, obj)=>$(obj).val()).toArray()).flat();
    const favWorkIds=itemHTMLs.map(wrapper=>$(wrapper).map((ind, obj)=>$(obj).val()).toArray()).flat();
    await setSyncStorage({favWorkIds:favWorkIds});
}*/


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
    const optionsContentExport = [["json で", "json"], ["csv で", "csv"], ["tsv で", "tsv"]];
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
    const importFile = $("<input>", { type: "file", accept: ".csv,.json", class: "inputImportCacheList", mulitple: "" });
    const selectImport = $("<select>", { class: "check_importToSelectedList" });
    const optionContentImport = [["cache", "新しいCacheリストに"], ["share", "新しいマイリストに"]];
    const additionnalOptions = obtainVariable[argsStr].optionIm;
    [...optionContentImport, ...additionnalOptions].forEach(vt => {
        const option = $("<option>").val(vt[0]).text(vt[1]);
        selectImport.append(option);
    })
    divImport.append(headingImport).append(btnImport).append(textImport).append("<br>").append(importFile).append("<br>").append(selectImport);

    // Favorite
    const divFav = $("<li>", { style: "padding:10px;" });
    const favIsValid = !args.IsViewList && args.workIsSelected;
    if (favIsValid) {
        const favBtn = {
            add: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOperateFav Add" })
                .append("気になるに追加"),
            delete: $("<a>", { href: "javascript:void(0)", class: "btnChEx1 btnOperateFav Delete" })
                .append("気になるから削除")
        }
        divFav.append(favBtn.add).append(favBtn.delete);
    }

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
    $("ul", modalHTML).append(divExport).append(divImport).append(favIsValid ? divFav : "");
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
        <div class="contentWrapper">
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
                        <a href="javascript:void(0);" class="closeBtn btnCloseModal"><i class="icon iconArrowOrangeLeft"></i>マイリスト一覧へ</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </modal>`
    $("body").append(modalHTML);
    const modalGeneral = $(`#${modalId} .generalModal`);
    $("div.titleArea, div.mypageHeader", modalGeneral)
        .each((ind, obj) => $(obj).attr({ style: `position:-webkit-sticky;top:${$(obj).position().top}px; position:sticky; background:rgba(255,255,255,0.9); z-index:1000;` }));
    colorItemWork(modalGeneral);
    modalGeneral.append($(".editFooter").clone());
    addInitialButton("viewCacheListDialog", modalGeneral);
    $(`#${modalId} .modalOverlay`).height(Math.max(modalGeneral.height() + 250, window.innerHeight));
}

async function remakeWorksOfCacheListModal(args = {}) {
    const modal = $("modal.viewCacheListDialog");
    const cacheListId = args.cacheListId || modal.data("cachelistid").toString();

    const lists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const cacheList = lists[cacheListId];
    if (!cacheList) return;
    if (Array.isArray(args.delete)) {
        for (const workId of args.delete) {
            const moduleTmp = $(`.itemModule.list[data-workid='${workId}']`);
            if (moduleTmp.length > 0) moduleTmp.remove();
        }
        $("#myListName span.count").html(cacheList.workIds.length);
        return;
    } else if (args.changed) {
        // rename
        $("#myListName span.text").html(cacheList.name);
    } else if (args.reset) {
        // reset sort
        //const sortIndexs=$("modal.viewCacheListDialog .itemModule.list").map((ind,obj)=>$(obj).data("sort-index")).toArray();
        const itemsClone = $("modal.viewCacheListDialog .itemModule.list").slice()
            .sort((a, b) => $(a).data("sort-index") - $(b).data("sort-index"));
        $("modal.viewCacheListDialog .itemModule.list").each((ind, obj) => {
            const indexTmp = $(obj).data("sort-index");
            if (indexTmp != ind) $(obj).replaceWith(itemsClone[ind]);
        })
    } else {
        $(".itemWrapper", modal).empty();
        $(".itemWrapper", modal).append(await Promise.all(cacheList.workIds.map(async workId => await work2item(workId))).then(d => d.join("\n")));
        $("#myListName span.count").html(cacheList.workIds.length);
        colorItemWork(modal);
    }

}

const obtainList2HTML = (key, lists) =>
    (lists || []).map((list, ind) => {
        //const IsShare = (key == "share");
        /*const listId = (IsShare) ? list.shareListId : list.listId;
        const listName = (IsShare) ? list.shareListName : list.name;
        const listCount = (IsShare) ? list.count : list.workIds.length;*/
        const listId = list.listId;
        const listName = list.name;
        const listCount = list.workIds.length;
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

async function addDeleteMyListModal(container = $(".pageWrapper")) {
    const workIdsTmp = $(".itemModule.list.selected", container).map((ind, obj) => $(obj).data("workid"));
    const workIds = (workIdsTmp.length > 0) ? workIdsTmp : $(".itemModule.list.selected>input", container).map((ind, obj) => $(obj).val());
    if (workIds.length == 0) return;
    //const shareLists = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const shareLists = await getSyncStorage({ shareLists: JSON.stringify({}) }).then(items => JSON.parse(items.shareLists));

    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));


    // modalAddMyListInが必要
    const modalId = `DIALOG${Date.now()}`
    const modaladdDeleteMyList = `
    <modal id="${modalId}" class="modalDialog modalDialogChEx addDeleteMyListDialog" style="overflow-y:scroll;">
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
                            ${obtainList2HTML("cache", Object.values(cacheLists))}
                            ${obtainList2HTML("share", Object.values(shareLists))}
                        </form>
                        <div><a href="javascript:void(0);" class="btnArea btnOpenNewMyList">新しいマイリストを作成</a><i class="icon iconCircleAdd"></i></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="btnChEx1" style="vertical-align:middle;">
            <a href="javascript:void(0);" class="btnAddMyList">マイリストに<br>追加する(${workIds.length})</a>
        </div>
        <div class="btnChEx1" style="vertical-align:middle;">
            <span><a href="javascript:void(0);" class="btnDeleteMyList">マイリストから<br>削除する(${workIds.length})</a></span>
        </div>
    </div>
    </modal>`
    $("body").append(modaladdDeleteMyList);
    $(`#${modalId} .modalOverlay`).height(Math.max($(`#${modalId} .generalModal`).height(), window.innerHeight));
    return modalId;
}

async function remakeaddDeleteMyListModal() {
    //const shareLists = await fetch(window.COMMON.RESTAPI_ENDPOINT.getShareList).then(d => d.json()).then(res => res.data.shareList);
    const shareLists = await getSyncStorage({ shareLists: JSON.stringify({}) }).then(items => JSON.parse(items.shareLists));
    const cacheLists = await getSyncStorage({ lists: JSON.stringify({}) }).then(items => JSON.parse(items.lists));
    const modal = $(`modal.addDeleteMyListDialog`);
    const form = $("div.formContainerIn form", modal);
    form.empty();
    form.append(obtainList2HTML("cache", Object.values(cacheLists)))
        .append(obtainList2HTML("share", Object.values(shareLists)));
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

//--------- others -----------------
function split_data(data) {
    const split_sep = "__SPLIT__";
    return data.replace(/\r\n|\r|\n/g, split_sep).split(split_sep);
}
const getSyncStorage = (key = null) => new Promise(resolve => {
    chrome.storage.sync.get(key, resolve);
});

const setSyncStorage = (key = null) => new Promise(resolve => {
    chrome.storage.sync.set(key, resolve);
});

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
                return ((res.error) ? res.error.code : "unknown");
            }
        }).catch(errorMessage => {
            console.log(errorMessage);
        });
};

const _registFavoriteWorkOrTag = async function (idOrList, updateType) {
    const paramKeyFavorite = "workIdList";

    const endpointUrl = window.COMMON.RESTAPI_ENDPOINT.registFavorite;
    const paramKey = paramKeyFavorite;

    const params = {
        updateType: updateType, // 1:regist, 2:delete
        [paramKey]: (Array.isArray(idOrList) && idOrList.length) ? idOrList.join("_") : idOrList
    };

    return await _restPost(endpointUrl, params);
};

// -------------- for drag -------------
async function dragItemEditMode(containerIn = null) {
    setTransit();
    const container = containerIn || $("modal.viewCacheListDialog");
    const compY = $("modal").length == 0 ? 0 : $(".btnSubscript", container).offset().top - $(".btnSubscript", container).position().top;
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
    const contentRoot = $(".itemWrapper", container);
    const itemModule = $(".itemModule", contentRoot);
    const editFooter = $(".editFooter", contentRoot);
    const mybestHeader = $(".mypageHeader.mybest", container);
    itemModule.each((index, el) => {
        const $el = $(el);
        if (!$el.hasClass("edit")) {
            $el.attr("data-sort-index", index).addClass($("body").hasClass("selectAll") ? "selected" : "notSelected");
        }
    });
    itemModule.filter(":not(.edit)").addClass("edit");

    itemModule.filter(".mybest, .mylist").on(_.addLabel(_.addMouseEventName(_.start), ".editmode"), (e) => {
        let event1 = normalizeEvent(e);
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
        const NOANIME_PARAMS = { duration: 0 };
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
            return (el.offsetLeft || 0) - parseInt(el.style.left || 0, 10);
        };
        const getOffsetY = function (el) {
            return (el.offsetTop || 0) - parseInt(el.style.top || 0, 10);
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
            centerPointList = initPointList();
        });
        centerPointList = initPointList();

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
            //console.log(event)

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
            list.transitStop(true).transit({ x: mouseX + "px", y: mouseY + "px" }, NOANIME_PARAMS);
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
            const target = list2.reduce((acc, val, index) => {
                if (acc.length > 0) {
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
                        $el.data("pos", [offset.left, offset.top - compY]); // なぜかずれるので-540?
                    });
                    // 移動が必要な要素の座標を、要素入れ替え前に保存しておくここまで

                    // 要素を入れ替えるとドラッグ基準点がずれるので、予め入れ替えた先の座標を元にドラッグ基準点を調整
                    const diffX = getOffsetX(targetEl) - getOffsetX(listEl);
                    const diffY = getOffsetY(targetEl) - getOffsetY(listEl);
                    basePos[0] += diffX;
                    basePos[1] += diffY;
                    const moveX = event.pageX - basePos[0];
                    const moveY = event.pageY - basePos[1];
                    list.transitStop(true).transit({ x: moveX + "px", y: moveY + "px" }, NOANIME_PARAMS);
                    // 要素を入れ替えるとドラッグ基準点がずれるので、予め入れ替えた先の座標を元にドラッグ基準点を調整ここまで

                    // 要素入れ替え
                    $target[listIndex > targetIndex ? "before" : "after"](list);
                    list.data("index", targetIndex);
                    // 要素入れ替えここまで

                    // 要素入れ替えによって、移動が必要な要素の座標が一気にずれてしまうため、
                    // 保存しておいた座標に一時的に移動させてから、元に戻すアニメーションを行う
                    $tmp.each((i, el) => {
                        el.style.willChange = "transform";
                        const $el = $(el);
                        const beforePosTmp = $el.data("pos");
                        const moveXTmp = beforePosTmp[0] - getOffsetX(el);
                        const moveYTmp = beforePosTmp[1] - getOffsetY(el);
                        $el.removeData("pos");
                        $el.transitStop(true)
                            .transit({ x: moveXTmp + "px", y: moveYTmp + "px" }, NOANIME_PARAMS)
                            .transit({ x: 0, y: 0 }, {
                                duration: SWAP_ANIME_DURATION, complete: () => {
                                    //el.removeAttribute("style");
                                }
                            });
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
            list.transitStop(true).transit({ x: 0, y: 0, scale: 1 }, {
                duration: 300, complete: function () {
                    //listEl.removeAttribute("style");
                    list.removeClass("drag");
                }
            });
            $(window).off(".drag.editmode appenditem.mylist.editmode");
            list.removeData("isTouch");
        });
    })

}


// -------------- from common.js ----------------


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

function setTransit() {
    $html = $("html");
    // PCとスマホのホバー処理の追加
    var isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
    $html.addClass((isTouchDevice) ? "touchDevice" : "mouseDevice");
    window.COMMON.isTouchDevice = isTouchDevice;
    var isPointerEnable = window.navigator.pointerEnabled;
    var isMsPointerEnable = window.navigator.msPointerEnabled;
    window.COMMON.pointerEvent = {
        // スペースで区切られたイベント名に対してラベルを付加する
        addLabel: function (eventName, label) {
            var eventNames = eventName.split(" ");
            return $.map(eventNames, function (e) {
                return e + (label.indexOf(".") === 0 ? "" : ".") + label;
            }).join(" ");
        },
        // SurfaceのChromeでtouchとmouseの両方を傍受する必要あり
        addMouseEventName: function (eventName) {
            switch (eventName) {
                case "touchstart":
                    eventName += " mousedown";
                    break;
                case "touchmove":
                    eventName += " mousemove";
                    break;
                case "touchend":
                    eventName += " mouseup";
                    break;
                default:
                    break;
            }
            return eventName;
        },
        start: isPointerEnable ? "pointerdown" : isMsPointerEnable ? "MSPointerDown" : isTouchDevice ? "touchstart" : "mousedown",
        move: isPointerEnable ? "pointermove" : isMsPointerEnable ? "MSPointerMove" : isTouchDevice ? "touchmove" : "mousemove",
        end: isPointerEnable ? "pointerup" : isMsPointerEnable ? "MSPointerUp" : isTouchDevice ? "touchend" : "mouseup",
        cancel: isPointerEnable ? "pointercancel" : isMsPointerEnable ? "MSPointerCancel" : "touchcancel"
    };

    $.fn.transition = $.fn.transit = $.fn.animate;
    $.fn.transitionStop = $.fn.transitStop = $.fn.stop;
    var hooks = [["x", "left"], ["y", "top"]];
    $.each(hooks, function (index, hook) {
        $.fx.step[hook[0]] = function (fx) {
            $.cssHooks[hook[0]].set(fx.elem, fx.now + fx.unit);
        };
        $.cssHooks[hook[0]] = {
            get: function (elem, computed) {
                return $.css(elem, hook[1]);
            },
            set: function (elem, value) {
                elem.style[hook[1]] = value;
            }
        };
    });
}
