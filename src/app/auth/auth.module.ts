import { NgModule } from "@angular/core";
import { NgxsModule } from "@ngxs/store";
import { SharedModule } from "../shared/shared.module";
import { AuthPinModule } from "./auth-pin/auth-pin.module";
import { AuthService } from "./auth.service";
import { AuthState } from "./auth.state";
import { AuthModal } from "./shared/auth.modal";

@NgModule({
	providers: [AuthService],
	declarations: [AuthModal],
	imports: [SharedModule, NgxsModule.forFeature([AuthState]), AuthPinModule],
	entryComponents: [AuthModal],
})
export class AuthModule {}
