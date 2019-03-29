import { helpers } from './ui-helpers';
import { btnUsersEvent } from './events/event-user-btn';
import { btnTasksEvent } from './events/event-task-btn';
import { http } from '../http';

class UI{
  renderPageOfAnswer(msg=null){
    helpers.clearMain();

    http.get();

    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderPageOfSendedQuest(msg=null){
    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderSupport(msg=null){
    helpers.clearMain();
    const theme = document.createElement('h2');
    theme.className = 'text-center';
    theme.textContent='Support';
    const line = document.createElement('hr');
    const formSupport = document.querySelector('form');
    formSupport.className = 'justify-content-center';
    const title = document.querySelector('input');
    title.className = 'form-control';
    title.type = 'text';
    title.placeholder = 'Title';
    const body = document.querySelector('input');
    body.className = 'form-control';
    body.type='textarea';
    body.placeholder = 'Body';
    const sendSupLetter = document.querySelector('input');
    formSupport.appendChild(title);
    formSupport.appendChild(body);
    formSupport.appendChild(sendSupLetter);
    formSupport.addEventListener('submit',btnUsersEvent);
    document.querySelector('#main').appendChild(theme);
    document.querySelector('#main').appendChild(line);
    document.querySelector('#main').appendChild(formSupport);

    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  settingPageForAccount(msg=null){
    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderMainStartPage(userData,msg=null){
    helpers.renderNav();
    helpers.clearMain();

    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderAllUsersPageForAdmin(msg=null){
    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderCalendarPageForUser(msg=null){
    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
  renderCalendarPageForAdmin(msg=null){
    if(msg){
      helpers.renderAlert(msg,'grey');
    }
  }
}

export const ui = new UI;
