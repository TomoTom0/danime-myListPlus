//----------------------
$(function () {
    console.log(3)
});

const getSyncStorage = (key = null) => new Promise(resolve => {
    chrome.storage.sync.get(key, resolve);
});

document.addEventListener("click", async function(e){
    const e_class=$(e.target).attr("class") || "";
    console.log(e_class)
    if (e_class.indexOf("btnCheck1")!=-1){
        /*a=await chrome.storage.sync.get({ lists: JSON.stringify({}) }, items => {
            console.log(1)
            return 2;
        })*/
        const listId=`list_${Date.now()}`
        console.log(listId)
        const list_a={ madeDate: Date.now(), name: "cache_a", exportIds: [], workIds: ["24410"], listId: listId };
        chrome.storage.sync.set({ lists: JSON.stringify({[listId]:list_a})})
    } else if (e_class.indexOf("btnCheck2")!=-1){
        chrome.storage.sync.set({ lists: JSON.stringify({})})
    }  else if (e_class.indexOf("btnCheck3")!=-1){
        const items = await getSyncStorage({ lists: JSON.stringify({}), sortListIndex:JSON.stringify({})});
        console.log(items)
        console.log(JSON.parse(items.lists))
    }
})