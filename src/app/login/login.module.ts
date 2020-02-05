import { NgModule } from "@angular/core";

import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { LoginService } from "./login.service";
import { LoginState } from "./login.state";

@NgModule({
	declarations: [],
	providers: [LoginService],
	imports: [SharedModule, NgxsModule.forFeature([LoginState])],
})
export class LoginModule {}
