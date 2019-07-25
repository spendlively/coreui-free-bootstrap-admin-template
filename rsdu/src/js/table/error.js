
export function showErrorModal(message){

  let modal = $('#loginErrorModal'),
    modalBody = modal.find('.modal-body')

  modalBody.html(message)
  modal.modal('show');
}
