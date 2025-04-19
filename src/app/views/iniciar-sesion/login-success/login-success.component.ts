import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { LoggerService } from '../../../services/logger.service';
import { MessageService } from '../../../services/messages.services';
import { AppStateService } from '../../../services/app-state.service';
import { RoleService } from '../../../auth/roles/role.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login-success',
  imports: [],
  templateUrl: './login-success.component.html',
  styles: ``,
})
export class LoginSuccessComponent {
  private context = 'LoginSuccessComponent';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private logger: LoggerService,
    private message: MessageService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.loginService.loginSuccess(token);
        this.router.navigate(['/']);
      } else {
        this.authService.logout();
        this.message.alert('Usuario no registrado');
        this.router.navigate(['/login']);
      }
    });
  }
}
