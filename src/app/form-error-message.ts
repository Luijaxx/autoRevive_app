export class ErrorMessage {
    constructor(
      public forControl: string,
      public forValidator: string,
      public text: string
    ) { }
  }
//Mensajes de errores de validación
export const FormErrorMessage = [
  new ErrorMessage('name', 'required', 'Name is required'),
  new ErrorMessage('name', 'minlength', 'Name must be at least 3 characters long'),
  new ErrorMessage('description', 'required', 'Description is required'),
  new ErrorMessage('imageUrl', 'required', 'Image URL is required'),
  new ErrorMessage('price', 'required', 'Price is required'),
  new ErrorMessage('price', 'pattern', 'Price only accepts numbers with two decimals'),
  new ErrorMessage('compatibility', 'required', 'Compatibility is required'),

  new ErrorMessage('priceRate', 'required', 'Price is required'),
  new ErrorMessage('serviceTime', 'required', 'Service time is required'),
  new ErrorMessage('priceRate', 'pattern', 'Price only accepts numbers with two decimals'),
  new ErrorMessage('warranty', 'required', 'Warranty is required'),
  new ErrorMessage('serviceTypeId', 'required', 'Service type is required'),
  new ErrorMessage('email', 'required', 'Email is required'),
  new ErrorMessage('password', 'required', 'Password is required'),
  new ErrorMessage('categoryId', 'required', 'Category is required'),
  new ErrorMessage('clientId', 'required', 'Client is required'),
  new ErrorMessage('description', 'required', 'Description is required'),
  new ErrorMessage('availableTimeSlots', 'required', 'AvailableTimeSlots is required'),

  new ErrorMessage('serviceId', 'required', 'Service is required'),

  new ErrorMessage('branchId', 'required', 'Branch selection is required'),
  new ErrorMessage('availability', 'required', 'Availability is required'),
  new ErrorMessage('date', 'required', 'date is required'),
  new ErrorMessage('startDate', 'required', 'Start date is required'),
  new ErrorMessage('endDate', 'required', 'End date is required'),
  new ErrorMessage('startTime', 'required', 'Start Time is required'),
  new ErrorMessage('endTime', 'required', 'End Time is required'),
  new ErrorMessage('phoneNumber', 'required', 'Phone Number is required'),
  new ErrorMessage('phoneNumber', 'numeric', 'Phone Number must contain only numbers'),

  new ErrorMessage('exactAddress', 'required', 'Address is required'),
  new ErrorMessage('users', 'required', 'Select user is required'),



];