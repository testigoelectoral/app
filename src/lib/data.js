import puestos from './dataPuestos.json';
import PartidosCamara from './dataPartidosCamara.json';
import CandidatosCamara from './dataCandidatosCamara.json';
import PartidosSenado from './dataPartidosSenado.json';
import CandidatosSenado from './dataCandidatosSenado.json';

export function puestoFromQR(qrcode){
    if (qrcode.length != 21){
        return {
            PageType: "~",
            StateCode: "~",
            MunicipalityCode: "~",
            ZoneCode: "~",
            PlaceCode: "~",
            Table: "~",
            PageNumber: "~",
            StateName: "~",
            MunicipalityName: "~",
            PlaceName: "~",
        };
    }

    let StateCode = qrcode.substring(2,4);
    let MunicipalityCode = qrcode.substring(4,7);
    let ZoneCode = qrcode.substring(7,9);
    let PlaceCode = qrcode.substring(9,11);

    return {
        PageType: qrcode.substring(0,2),
        StateCode: StateCode,
        MunicipalityCode: MunicipalityCode,
        ZoneCode: ZoneCode,
        PlaceCode: PlaceCode,
        Table: qrcode.substring(11,14),
        PageNumber: qrcode.substring(14,16),
        StateName: puestos.departamentos[StateCode].nombre,
        MunicipalityName: puestos.departamentos[StateCode].municipios[MunicipalityCode].nombre,
        PlaceName: puestos.departamentos[StateCode].municipios[MunicipalityCode].zonas[ZoneCode].puestos[PlaceCode],
    }
}

export function puestoFromImageInfo(imageinfo){
    qrcode = 
        String(imageinfo.TypeCode) + 
        String(imageinfo.StateCode).padStart(2, '0') +
        String(imageinfo.MunicipalityCode).padStart(3, '0') +
        String(imageinfo.ZoneCode).padStart(2, '0') +
        String(imageinfo.PlaceCode).padStart(2, '0') +
        String(imageinfo.Table).padStart(3, '0') +
        String(imageinfo.PageNumber).padStart(2, '0') +
        "00000";

    return puestoFromQR(qrcode)
}

export function partidosCamara(StateCode){
    if (PartidosCamara.departamentos[StateCode]){
        return PartidosCamara.departamentos[StateCode];
    }
    return [];
}

export function candidatosCamara(StateCode,partido){
    if (CandidatosCamara.departamentos[StateCode][partido]){
        return CandidatosCamara.departamentos[StateCode][partido];
    }
    return [];
}

export function partidosSenado(){
    return PartidosSenado.partidos;
}

export function candidatosSenado(partido){
    if (CandidatosSenado.partidos[partido]){
        return CandidatosSenado.partidos[partido];
    }
    return [];
}
