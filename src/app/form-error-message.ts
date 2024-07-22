export class ErrorMessage {
    constructor(
      public forControl: string,
      public forValidator: string,
      public text: string
    ) { }
  }
//Mensajes de errores de validación
export const FormErrorMessage = [
  new ErrorMessage('name', 'required', 'El Nombre es requerido'),
  new ErrorMessage('name', 'minlength', 'El nombre debe tener 3 carácteres mínimo'),
  new ErrorMessage('description', 'required', 'La descripción es requerida'),
  new ErrorMessage('imageUrl', 'required', 'La url de la imagen es requerida'),

  new ErrorMessage('priceRate', 'required', 'El precio es requerido'),
  new ErrorMessage('serviceTime', 'required', 'El precio es requerido'),
  new ErrorMessage('priceRate', 'pattern', 'El precio solo acepta números con dos decimales'),
  new ErrorMessage('warranty', 'required', 'warranty es requerido'),
  new ErrorMessage('serviceTypeId', 'required', 'Es requerido que seleccione un género'),
  new ErrorMessage('email', 'required', 'El email es requerido'),
  new ErrorMessage('password', 'required', 'Es password es requerido'),

  new ErrorMessage('branchId', 'required', 'Es requerido que seleccione un género'),
  new ErrorMessage('availability', 'required', 'La descripción es requerida'),
  new ErrorMessage('startDate', 'required', 'La descripción es requerida'),
  new ErrorMessage('endDate', 'required', 'La descripción es requerida'),


];