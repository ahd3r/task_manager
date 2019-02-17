import { helpers } from './ui-helpers';
import { btnUsersEvent } from './event-user-btn';
import { btnTasksEvent } from './event-task-btn';

class UI{
  renderSupport(infoUser){
    if(!document.querySelector('nav>.ava')){
      helpers.renderNav(infoUser);
    }
    helpers.clearMain();
  }
  settingPageForAccount(){}
  renderMainUserPage(){}
  renderMainAdminPage(){}
  renderAllUsersPageAdmin(){}
  renderCalendarPageForUser(){}
  renderCalendarPageForAdmin(){}
}

export const ui = new UI;
