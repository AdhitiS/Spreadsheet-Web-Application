const dialog = require('electron').remote.dialog;
const $ = require("jquery")
const fs = require("fs");
$(document).ready(function () {


    window.db = [];
    $(".grid .row .cell").on("click", function () {
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
        
        let col = String.fromCharCode(Number(cid) + 65);
        let row = Number(rid) + 1
        let address = col + row;
        $("#address").val(address);
        //console.log("cell with address", address, "was clicked");


        // let cellIdx = $(clickedCell).text();
        // console.log("cell with index", cellIdx, "was clicked");
    });

    $(".grid .row .cell").on("blur", function () {
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
        
        let col = String.fromCharCode(Number(cid) + 65);
        let row = Number(rid) + 1
        let address = col + row;
        db[rid][cid].val = $(this).text();
        
    });
    $("#new").on("click", init);
    $("#save").on("click", async function () {
        // dialog box new file option
        let sdg = await dialog.showSaveDialog();
        console.log(sdg.filePath)
        let data = JSON.stringify(db);
        fs.promises.writeFile(sdg.filePath,data);
    })

    function getRCIDFromCell(clickedCell) {
        let rid = $(clickedCell).attr("rid");
        let cid = $(clickedCell).attr("cid");
        return { rid: rid, cid: cid }
    }



    function init() {
        let Allrows = $(".grid .row");
        for(let i=0; i < Allrows.length; i++){
            let cols = $(Allrows[i]).find(".cell");
            let colsArr = [];
            for(let j=0; j < cols.length; j++){
                let cellObject = {
                    val: 0,
                    formula: ""
                }
                colsArr.push(cellObject);
            }
            db.push(colsArr);
        }
        console.log(db);
    }
    init();
})