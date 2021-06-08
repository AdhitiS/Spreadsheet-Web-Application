$(document).ready(function () {
    $(".grid .row .cell").on("click", function () {
        let clickedCell = this;
        let rid = $(clickedCell).attr("rid");
        let cid = $(clickedCell).attr("cid");
        let col = String.fromCharCode(Number(cid) + 65);
        let row = Number(rid) + 1
        let address = col + row;
        $("#address").val(address);
        console.log("cell with address", address, "was clicked");


        // let cellIdx = $(clickedCell).text();
        // console.log("cell with index", cellIdx, "was clicked");
    });
})