

var $password = $("#password");
var $confirmPassword = $("#confirm_password");
var $username = $("#username");


//Hide hints
// $("form span").hide();


function isUsernameValid() {
    console.log($.isNumeric($username.val()));
return !$.isNumeric($username.val());
};

function isPasswordValid() {
  return $password.val().length > 7
};

function arePasswordsMatching() {
  return $password.val() === $confirmPassword.val()
}

function canSubmit() {
  return isPasswordValid() && arePasswordsMatching() && isUsernameValid();
}

function usernameEvent(){
  if(isUsernameValid()){
    $username.next().hide();
    $username.parent().removeClass('has-warning');
  } else {
    $username.next().show();
    $username.parent().addClass('has-warning');
  }
}

function passwordEvent(){
  if(isPasswordValid()){
     $password.next().hide();
     $password.parent().removeClass('has-warning');
  } else {
     $password.parent().addClass('has-warning');
     $password.next().show();
  }
}
//When event happens on password input

function confirmPasswordEvent() {
  if(arePasswordsMatching()) {
    $confirmPassword.next().hide();
    $confirmPassword.parent().removeClass('has-warning');
  } else if($password.val().length < 8) {
    $confirmPassword.next().hide();
    $confirmPassword.parent().removeClass('has-warning');
  } else {
      $confirmPassword.next().show();
      $confirmPassword.parent().addClass('has-warning');
  }
}

function enableSubmitEvent() {
  $("#submit").prop("disabled", !canSubmit());
}

$username.focus(usernameEvent).keyup(usernameEvent).keyup(enableSubmitEvent);

$password.focus(passwordEvent).keyup(passwordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

$confirmPassword.focus(confirmPasswordEvent).keyup(confirmPasswordEvent).keyup(enableSubmitEvent);

enableSubmitEvent();