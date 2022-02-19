import Puestos from './data/puestos.json';
import CamaraPartidos from './data/camara-partidos.json';
import CamaraCandidatos from './data/camara-candidatos.json';
import SenadoPartidos from './data/senado-partidos.json';
import SenadoCandidatos from './data/senado-candidatos.json';
import ConsultaCandidatos from './data/consulta-candidatos.json';

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
        StateName: Puestos.departamentos[StateCode].nombre,
        MunicipalityName: Puestos.departamentos[StateCode].municipios[MunicipalityCode].nombre,
        PlaceName: Puestos.departamentos[StateCode].municipios[MunicipalityCode].zonas[ZoneCode].puestos[PlaceCode],
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

export function camaraCircunscripciones(StateCode){
    return ["AFRODESCENDIENTES","INDIGENAS"].concat(Object.keys(CamaraPartidos[StateCode]));
}

export function camaraPartidos(StateCode,circunscripcion){
    if(circunscripcion=="AFRODESCENDIENTES" || circunscripcion=="INDIGENAS"){
        StateCode="00";
    }
    if (CamaraPartidos[StateCode][circunscripcion]){
        return CamaraPartidos[StateCode][circunscripcion];
    }
    return [];
}

export function camaraCandidatos(StateCode,circunscripcion,partido){
    if(circunscripcion=="AFRODESCENDIENTES" || circunscripcion=="INDIGENAS"){
        StateCode="00";
    }
    if (CamaraCandidatos[StateCode][partido]){
        return CamaraCandidatos[StateCode][partido];
    }
    return [];
}

export function senadoCircunscripciones(){
    return Object.keys(SenadoPartidos)
}

export function senadoPartidos(circunscripcion){
    if (SenadoPartidos[circunscripcion]){
        return SenadoPartidos[circunscripcion];
    }
    return [];
}

export function senadoCandidatos(partido){
    if (SenadoCandidatos[partido]){
        return SenadoCandidatos[partido];
    }
    return [];
}

export function consultaCandidatos(partido){
    if (ConsultaCandidatos[partido]){
        return ConsultaCandidatos[partido];
    }
    return [];
}
