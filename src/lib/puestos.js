import puestos from './puestos.json';

export async function extractQRinfo(qrcode){
    if (qrcode.length != 21){
        return "false";
    }

    let PageType = qrcode.substring(0,2);
    let StateCode = qrcode.substring(2,4);
    let MunicipalityCode = qrcode.substring(4,7);
    let ZoneCode = qrcode.substring(7,9);
    let PlaceCode = qrcode.substring(9,11);
    let Table = qrcode.substring(11,14);
    let PageNumber = qrcode.substring(14,16);

    let StateName = puestos.departamentos[StateCode].nombre;
    let MunicipalityName = puestos.departamentos[StateCode].municipios[MunicipalityCode].nombre;
    let PlaceName = puestos.departamentos[StateCode].municipios[MunicipalityCode].zonas[ZoneCode].puestos[PlaceCode];


    let result =  {
        PageType: PageType,
        StateCode: StateCode,
        MunicipalityCode: MunicipalityCode,
        ZoneCode: ZoneCode,
        PlaceCode: PlaceCode,
        Table: Table,
        PageNumber: PageNumber,
        StateName: StateName,
        MunicipalityName: MunicipalityName,
        PlaceName: PlaceName,
    }

    console.log(result);
    return result;
}
