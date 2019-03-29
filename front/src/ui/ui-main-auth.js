import { helpers } from './ui-helpers';
import { btnUsersEvent } from './events/event-user-btn';

class UI{
  renderResetPassPage(msg=null){
    // check token, which was pasted in url

    helpers.renderNavForUnsignedUser();
    helpers.clearMain();

    const main = document.querySelector('#main');
    const resetForm = document.createElement('form');
    resetForm.className='resetForm';
    const resetPassTitle = document.createElement('h2');
    resetPassTitle.className = 'text-center';
    resetPassTitle.textContent = 'Reset password';
    const newPassword = document.createElement('input');
    newPassword.setAttribute('type','password');
    newPassword.setAttribute('placehoder','New password');
    newPassword.className='form-control newpass';
    const confirmNewPassword = document.createElement('input');
    confirmNewPassword.setAttribute('type','password');
    confirmNewPassword.setAttribute('placehoder','Confirm new password');
    confirmNewPassword.className='form-control confnewpass';
    const resetBtn = document.createElement('input');
    resetBtn.setAttribute('type','submit');
    resetBtn.setAttribute('value','Reset');
    resetBtn.className = 'btn btn-primary';

    main.appendChild(resetPassTitle);
    resetForm.appendChild(newPassword);
    resetForm.appendChild(confirmNewPassword);
    resetForm.appendChild(resetBtn);
    main.appendChild(resetForm);

    main.querySelector('.resetForm').addEventListener('submit',btnUsersEvent.resetPass);

    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderFillEmailForResetPass(msg=null){
    helpers.renderNavForUnsignedUser();
    helpers.clearMain();

    const email = document.createElement('input');
    email.type='email';
    email.className = 'form-control';
    email.placeholder='Write an email for send you a letter';
    const sendBtn = document.createElement('input');
    sendBtn.type='submit';
    sendBtn.className = 'btn btn-primary';
    sendBtn.value='Send';
    const formForEmail = document.createElement('form');
    formForEmail.className='emailForm form-inline';
    formForEmail.appendChild(email);
    formForEmail.appendChild(sendBtn);
    formForEmail.addEventListener('submit',btnUsersEvent.sendLetterToEmail);
    document.querySelector('#main').appendChild(formForEmail);

    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderAuthPage(msg=null){
    helpers.renderNavForUnsignedUser();
    helpers.clearMain();

    const loginTitle = document.createElement('h2');
    logInForm.className='text-center';
    loginTitle.textContent='LogIn';
    const signupTitle = document.createElement('h2');
    signupTitle.classNamae = 'text-center';
    signupTitle.textContent = 'SignUp';
    const email = document.createElement('input');
    email.setAttribute('type','email');
    email.setAttribute('placeholder','Your valid email');
    email.className='form-control email';
    const username=document.createElement('input');
    username.setAttribute('type','text');
    username.setAttribute('placeholder','Username');
    username.className='form-control username';
    const password= document.createElement('input');
    password.setAttribute('type','password');
    password.setAttribute('placeholder','Password');
    password.className='form-control password';
    const confPassword= document.createElement('input');
    confPassword.setAttribute('type','password');
    confPassword.setAttribute('placeholder','Confirm password');
    confPassword.className='form-control confPassword';
    const loginBtn = document.createElement('input');
    loginBtn.setAttribute('type','submit');
    loginBtn.setAttribute('value','LogIn');
    loginBtn.className='btn btn-primary';
    const signupBtn = document.createElement('input');
    signupBtn.setAttribute('type','submit');
    signupBtn.setAttribute('value','SignUp');
    signupBtn.className='btn btn-primary';

    const logInForm = document.createElement('form');
    logInForm.className = 'login'
    logInForm.appendChild(loginTitle);
    logInForm.appendChild(email);
    logInForm.appendChild(password);
    logInForm.appendChild(loginBtn);
    const signUpForm = document.createElement('form');
    signUpForm.className = 'signup';
    signUpForm.appendChild(signupTitle);
    signUpForm.appendChild(username);
    signUpForm.appendChild(email);
    signUpForm.appendChild(password);
    signUpForm.appendChild(confPassword);
    signUpForm.appendChild(signupBtn);
    const main = document.querySelector('#main');
    main.appendChild(document.createElement('div')).className='container-fluid';
    main.querySelector('.container-fluid').appendChild(document.createElement('div')).className='row';
    main.querySelector('.row').appendChild(document.createElement('div')).className='col loginPlace';
    main.querySelector('.row').appendChild(document.createElement('div')).className='col signupPlace';
    main.querySelector('.loginPlace').appendChild(logInForm);
    main.querySelector('.signupPlace').appendChild(signUpForm);
    main.querySelector('.login').addEventListener('submit',btnUsersEvent.loginUser);
    main.querySelector('.signup').addEventListener('submit',btnUsersEvent.createUser);

    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
}

export const ui_auth = new UI;
