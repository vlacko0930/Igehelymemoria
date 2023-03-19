const ExcelJS = require('exceljs');
const axios = require('axios');

module.exports = async function xlsxKeszites(igehelyek) {
    if(!Array.isArray(igehelyek)) {
        console.error("Az igehelyek nem tomb");
        return;
    }

    igehelyekSzovege = [];

    await Promise.all(igehelyek.map(async igehely => {
        const r = await axios.get(`https://szentiras.hu/api/ref/${igehely}/SZIT`)
        igehelyekSzovege.push(r.data.text)
    }))


    console.log(igehelyekSzovege)
    igehelyekSzovegeParonkent = [];

    igehelyekSzovege.forEach(szoveg => {
        var par = {};
        var i = szoveg.length/2;
        for(i;szoveg.charAt(i)!=' ';i++) {}
        par["1"] = szoveg.substring(0,i);
        par["2"] = szoveg.substring(i+1);
        igehelyekSzovegeParonkent.push(par);
    })

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Memoria');
    sheet.properties.defaultRowHeight=116;
    sheet.properties.defaultColWidth=29;
    for(var i = 1; i<=igehelyekSzovegeParonkent.length;i++) {
        const elso = sheet.getCell(`A${i}`);
        elso.alignment = {wrapText: true, horizontal: 'center', vertical: 'middle'}
        elso.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
        const masodik = sheet.getCell(`B${i}`);
        masodik.alignment = {wrapText: true, horizontal: 'center', vertical: 'middle'}
        masodik.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
        elso.value=igehelyekSzovegeParonkent[i-1]["1"];
        masodik.value=igehelyekSzovegeParonkent[i-1]["2"];
        sheet.getRow(i).height=116;
    }
    sheet.getColumn('A').width=42;
    sheet.getColumn('B').width=42;
    console.log(igehelyekSzovegeParonkent)
    return workbook;

}