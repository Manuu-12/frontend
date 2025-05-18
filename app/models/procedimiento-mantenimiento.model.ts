import { NumberSymbol } from "@angular/common";
import { Procedimiento } from "./procedimiento.model";
import { Mantenimiento } from "./mantenimiento.model";

export class ProcedimientoMantenimiento {
    id?: number;
    procedimiento_id?: Procedimiento;
    mantenimiento_id?: Mantenimiento;
    estado?: string;
    creadoEn?: Date;
    actualizadoEn?: Date;
}
