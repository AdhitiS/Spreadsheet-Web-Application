const dialog = require('electron').remote.dialog;
const $ = require("jquery")
const fs = require("fs");
$(document).ready(function () {


    window.db = [];
    init();
    $(".grid .row .cell").on("click", function () {
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
        let address = getAddrFromRCid(rid, cid);
        
        // let col = String.fromCharCode(Number(cid) + 65);
        // let row = Number(rid) + 1
        // let address = col + row;
        $("#address").val(address);

        //console.log("cell with address", address, "was clicked");
        
        let cellObject = db[rid][cid];
        let isEmpty = cellObject.isEmpty;
        let formula = cellObject.formula;
        let val = cellObject.val;
        $("#formula").val(formula);
        // $(`.cell[rid=${rid}][cid=${cid}]`).text(!isEmpty ? val : "");
        
        //value change
        // let cellIdx = $(clickedCell).text();
        console.log("cell with index", address, "was clicked");
    });

    //************ Formula ************** */

    $("#formula").on("blur", function () {
        let formulaElem = $(this);
        if (formulaElem.val() == ""){
            return;
        }
        if(db[rid][cid].formula){
            deleteFormula(db[rid][cid].formula, rid, cid);
        }
        let formula =$("#formula").val();
        let address = $("#address").val();
        let { rid, cid } = getRCidFromAddress(address);
        setFormulaInDB(rid, cid, formula, address);
        let value = evaluateFormula(formula);
        // console.log(value);
        updateUI(value,rid,cid);
        
    })

     //Update UI -> Update db
    $(".grid .row .cell").on("blur", function () {
        let clickedCell = this;
        let { rid, cid } = getRCIDFromCell(clickedCell);
       
        if(db[rid][cid].val == $(clickedCell).text()){
            return;
        }

        if(db[rid][cid].formula){
            deleteFormula(db[rid][cid].formula, rid, cid);
        }
        let value = $(clickedCell).text(); 
        updateUI(value, rid, cid);
        
    });


     //************ Helper functions ************** */
   
    function setFormulaInDB(rid, cid, formula, address){
        db[rid][cid].formula = formula;
        let formulaArr = formula.split(" ");
     
        for(let i=0; i < formulaArr.length; i++)
        {
            let fComp = formulaArr[i];
            if(isGridCell(fComp)){
                // get yourself added
                let pObj = getRCidFromAddress(fComp);
                db[pObj.rid][pObj.cid].children.push(address);
                db[rid][cid].parent.push(fComp);
            }
        }

    }

    function evaluateFormula(formula){
        let formulaArr = formula.split(" ");
        // [(, A1, +, A2,)]

        for(let i=0 ;i < formulaArr.length; i++)
        {
            let fComp = formulaArr[i];
            if(isGridCell(fComp)){
                //replace logic
                // console.log(fComp);
                let { rid, cid } = getRCidFromAddress(fComp);
                let value = db[rid][cid].val;
                formula = formula.replace(fComp, value);
                // console.log(formula);

            }
        }
        return eval(formula);
    }

    function isGridCell(comp){
        let ascii = comp.charCodeAt(0);
        return (ascii >=65 && ascii <= 90);

    }

    function updateUI(value, rid, cid){
        $(`.cell[rid=${rid}][cid=${cid}]`).text(value);
        db[rid][cid].val = value;
        db[rid][cid].isEmpty = false;

        let childrens = db[rid][cid].children;
        for(let i = 0; i < childrens.length; i++)
        {
            let childAdd = children[i];
            let childRC = getRCidFromAddress(childAdd);
            let child = db[childRC.rid][childRC.cid];
            let nval = evaluateFormula(child.formula);
            updateUI(nval, childRC.rid, childRC.cid);
        }

    }

    function deleteFormula(formula, rid, cid){
        let formulaArr = formula.split(" ");
        let address = getAddrFromRCid(rid, cid);

     
        for(let i=0; i < formulaArr.length; i++)
        {
            let fComp = formulaArr[i];
            if(isGridCell(fComp)){
                // get yourself added
                let pObj = getRCidFromAddress(fComp);
                let pChildrenArr = db[pObj.rid][pObj.cid].children;
                let filteredPChildArr = pChildrenArr.filter(test);

                function test(elem){
                    return elem !== address;

                }
                db[pObj.rid][pObj.cid].children = filteredPChildArr;
                
            }
        }

    }

    function getAddrFromRCid(rid, cid){
        let col = String.fromCharCode(Number(cid) + 65);
        let row = Number(rid) + 1
        let address = col + row;
        return address;

    }

    function getRCidFromAddress(address){
        // db[rid][cid].formula = formula;

    }
   

    


    //************ New/Open/Save ************** */

    $("#new").on("click", init);
    $("#save").on("click", function () {
        // dialog box new file option
        let sfilepath = dialog.showSaveDialogSync();
        //console.log(sdg.filePath)
        let data = JSON.stringify(db);
        fs.writeFileSync(sfilepath,data);
    })
    $("#open").on("click", function () {
        //open dialogBox
        let fileArr = dialog.showOpenDialogSync();
        console.log("FileArr", fileArr);
        //Buffer content
        let bContent = fs.readFileSync(fileArr[0]);
        db = JSON.parse(bContent);
        console.log(db);
        //Show UI
        init();
        setUI(db);

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
            for(let j = 0; j < cols.length; j++){
                let cellObject = {
                    val: 0,
                    formula: "",
                    isEmpty: true,
                    children: [],
                    parent: [],
                }
                $(`.cell[rid=${i}][cid=${j}]`).text();
                colsArr.push(cellObject);
            }
           
            db.push(colsArr);
            //setUI(db);
        }
        
        console.log(db);
    }
    

    function setUI(db) {
        let Allrows = $(".grid .row");
        for(let i=0;i<Allrows.length;i++)
        {
            let cols = $(Allrows[i]).find(".cell");
            for(let j = 0; j < cols.length; j++){
                let val = db[i][j].val;
                let isEmpty = db[i][j].isEmpty;
                $(`.cell[rid=${i}][cid=${j}]`).text(!isEmpty ? val : "");
            }
            
        }
    }
})