import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import { ApiService } from "../../Services/api/api.service";
import { InvitadoModelRespose } from "../../models/invitado.model-respose";
import { TraductorServicio } from '../../Services/traductor.service';
import { ConfirmacionCuadradoComponent } from "./confirmacion-cuadrado/confirmacion-cuadrado.component";

export abstract class Confirmacion {
  formGroup = new FormGroup({});
  isLoading = false;
  protected accessToken: string = '';

  protected constructor(private apiServ: ApiService, protected fb: FormBuilder) {
  }

  protected _invitacionConfimacion?: InvitadoModelRespose;

  get invitacionConfimacion() {
    return this._invitacionConfimacion;
    
  }

  get acompanantesList() {
    return Object.keys(this.formGroup.value).filter(value => value.includes("acompanante-"));
  }

  get cantAsistir() {
    return this.invitacionConfimacion?.cantidad_invitados ?? 0;
  }
  

  get mesaAsignada() {
    return this.invitacionConfimacion!.mesa_asignada
    
  }

  get ultFecha() {
    return this.invitacionConfimacion?.fecha_limite_confirmo ?? null;
  }

  validators(formControlName: string): any {
    return this.formGroup.get(formControlName)?.errors
  }

  protected  radioValue: string = '';

  // Método para obtener el estado del radio seleccionado
  isRadioSelected(): string {
    return this.radioValue;
  }

  saveConfirmacion() {
    let asistencia: boolean = true;
    if(this.radioValue === 'no'){
      asistencia = false;
    }
    this.isLoading = true;
    if (this.formGroup?.valid) {//Entrará cuando el invitado confirme asistencia y describa el nombre de sus acompañantes
      const values: any = {
        invitado_nombre: this.formGroup?.get("nombre")?.value,
        total_personas_conf: this.formGroup?.get("cant_asistir")?.value,
        mesa_asignada: this.formGroup?.get("mesa_asignada")?.value,
        invitado_id: this.invitacionConfimacion?.id,
        invitacion_id: this.invitacionConfimacion?.invitacion.id,
        confirmado: asistencia,
        fecha_confirmacion: new Date().getTime(),
      }
      console.log(this.formGroup.value)
      if (asistencia == true) {
        const nombreInvitadosList = this.acompanantesList.map(controlNames => (this.formGroup.get(controlNames)?.value as string).trim());
        const nombreInvitadosText = nombreInvitadosList.reduce((prev, current) => prev + current + ",", "") as string;
        values['acompanantes'] = nombreInvitadosText.substring(0, nombreInvitadosText.length - 1)
      }
      this.apiServ.confirmar(values).subscribe({
        next: response => {
          if (!isNaN(response)) {
            this._invitacionConfimacion = undefined;
            window.location.reload();
            this.loadConfirmacionInfo(this.accessToken);
            this.isLoading = false
          }
        },
        error: err => {
          console.error(err)
        }
      })
    }if (this.formGroup.valid == false){//Entrará cuando el invitado confirme asistencia y no especifique el nombre de sus acompañantes
      const values: any = {
        invitado_nombre: this.formGroup?.get("nombre")?.value,
        total_personas_conf: this.formGroup?.get("cant_asistir")?.value,
        mesa_asignada: this.formGroup?.get("mesa_asignada")?.value,
        invitado_id: this.invitacionConfimacion?.id,
        invitacion_id: this.invitacionConfimacion?.invitacion.id,
        confirmado: asistencia,
        fecha_confirmacion: new Date().getTime(),
      }
      console.log(this.formGroup.get('checkBAgregarNombres'))
      //if (this.formGroup.get('checkBAgregarNombres')?.value) {
        const nombreInvitadosText = 'No especificado ';
        values['acompanantes'] = nombreInvitadosText.substring(0, nombreInvitadosText.length - 1)
      //}
      this.apiServ.confirmar(values).subscribe({
        next: response => {
          if (!isNaN(response)) {
            this._invitacionConfimacion = undefined;
            window.location.reload();
            this.loadConfirmacionInfo(this.accessToken);
            this.isLoading = false
          }
        },
        error: err => {
          console.error(err)
        }
      })
    }else{
      console.log(this.formGroup)
      this.formGroup?.get("nombre")?.markAsTouched();
      this.formGroup?.get("cantidad_invitados")?.markAsTouched();
      this.isLoading = false
      console.log('errors', this.formGroup.errors, this.formGroup?.valid)
    }  
  }

  addAcompanante(posicion: number = 1) {
    console.log(this.invitacionConfimacion);
    if (posicion <= this.cantAsistir) {
      this.formGroup.addControl(`acompanante-${posicion}`, new FormControl(null));
    }
  }

  removeAcompanante() {
    console.log('menos invitados')
    const lastPosition = this.acompanantesList.length;
    const acompanante = `acompanante-${lastPosition}`;
    
    if (this.acompanantesList.length != 1) {
      // @ts-ignore
      this.formGroup.removeControl(acompanante);
    }
  }

  protected loadConfirmacionInfo(accessToken: string) {
    this.apiServ.getInvitadoYConfirmacion(accessToken)
      .subscribe({
        next: invitacion => {
          this._invitacionConfimacion = invitacion
          this.buildFormGroup();
        },
        error: err => {
          // TODO: como lanzar un erro aca we?
          console.error(err)
        }
      });
  }

  protected buildFormGroup() {
    const controls: any = {
      cant_asistir: [this.invitacionConfimacion?.cantidad_invitados, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.invitacionConfimacion?.cantidad_invitados as number)
      ]],
      mesa_asignada: [this.invitacionConfimacion?.mesa_asignada, [
        Validators.required,
        Validators.min(1),
        Validators.max(this.invitacionConfimacion?.mesa_asignada as any)
      ]],
      checkBAgregarNombres: [true],
    };

    

    this.formGroup = this.fb.group(controls);
    this.addAcompanante(1);
  }



}
